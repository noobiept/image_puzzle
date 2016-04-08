/*global $, createjs, Tile, ShowImage*/
'use strict';

window.onload = function()
{
Main.init();
};


var Main;
(function(Main) {


var CANVAS = null;
var STAGE = null;

var TILES = [];     // has all the tile objects
var SELECTED = null;    // has the currently selected tile object

var IMAGES_LEFT = [];   // has the images info that haven't being played yet
var IMAGES_INFO = [
        { id: 'beta_is_over', columns: 8, lines: 2, tileWidth: 169, tileHeight: 192 },
        { id: 'mirana', columns: 8, lines: 2, tileWidth: 200, tileHeight: 285 },
        { id: 'snow', columns: 8, lines: 2, tileWidth: 179, tileHeight: 359 },
        { id: 'lina', columns: 4, lines: 4, tileWidth: 256, tileHeight: 144 },
        { id: 'treant', columns: 7, lines: 4, tileWidth: 260, tileHeight: 256 }
    ];
var CURRENT_IMAGE_INFO = null;


Main.init = function()
{
CANVAS = document.querySelector( '#MainCanvas' );
STAGE = new createjs.Stage( CANVAS );
STAGE.enableMouseOver( 20 );

createjs.Ticker.on( 'tick', tick );

initMenu();
ShowImage.init();
start();
};


/**
 * Initialize the menu elements.
 */
function initMenu()
{
var help = document.getElementById( 'Help' );
help.onclick = helpPlayer;
$( help ).removeClass( 'hidden' ).button();

var original = document.getElementById( 'ShowOriginal' );
original.onclick = showOriginalImage;
$( original ).removeClass( 'hidden' ).button();

var skip = document.getElementById( 'Skip' );
skip.onclick = skipImage;
$( skip ).removeClass( 'hidden' ).button();

var donate = document.getElementById( 'Donate' );
donate.onclick = function()
    {
    window.open( 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UQ6ZF2JKUC626', '_blank' );
    };
$( donate ).removeClass( 'hidden' ).button();
}


/**
 * Start a random image (off the ones that haven't being played yet).
 */
function start()
{
clear();
var a;

    // if all the maps have already been played, then re-add all the images, and start again
if ( IMAGES_LEFT.length === 0 )
    {
    for (a = 0 ; a < IMAGES_INFO.length ; a++)
        {
        IMAGES_LEFT.push( IMAGES_INFO[ a ] );
        }
    }

    // select a random image
var random = Math.floor( Math.random() * IMAGES_LEFT.length );
var imageInfo = IMAGES_LEFT.splice( random, 1 )[ 0 ];

CURRENT_IMAGE_INFO = imageInfo;

var columns = imageInfo.columns;
var lines = imageInfo.lines;

    // update the canvas dimensions to fit the image
CANVAS.width = columns * imageInfo.tileWidth;
CANVAS.height = lines * imageInfo.tileHeight;

    // add all the image tiles
var length = columns * lines;

for (a = 0 ; a < length ; a++)
    {
    var line = parseInt( a / columns, 10 );
    var column = a - line * columns;
    var tile = new Tile( imageInfo, STAGE, column, line );

    TILES.push( tile );
    }

    // shuffle the tiles
shuffleTiles();
}


/**
 * Reset the game state, and remove the current image elements.
 */
function clear()
{
SELECTED = null;
CURRENT_IMAGE_INFO = null;

if ( TILES.length > 0 )
    {
    for (var a = 0 ; a < TILES.length ; a++)
        {
        TILES[ a ].clear();
        }

    TILES.length = 0;
    }
}


/**
 * Shuffle the tile's position.
 */
function shuffleTiles()
{
shuffle( TILES );

var columns = getNumberOfColumns();

for (var a = 0 ; a < TILES.length ; a++)
    {
    var line = parseInt( a / columns, 10 );
    var column = a - line * columns;
    var tile = TILES[ a ];
    tile.moveTo( column, line );
    }
}


/**
 * Select a tile. If there was a tile previously selected, then we switch their positions.
 */
Main.selectTile = function( tile )
{
if ( SELECTED === null )
    {
    selectTile( tile );
    }

else
    {
        // switch their position
    if ( SELECTED !== tile )
        {
        var selectedColumn = SELECTED.currentColumn;
        var selectedLine = SELECTED.currentLine;

        TILES[ tile.currentLine * getNumberOfColumns() + tile.currentColumn ] = SELECTED;
        TILES[ selectedLine * getNumberOfColumns() + selectedColumn ] = tile;

        SELECTED.moveTo( tile.currentColumn, tile.currentLine );
        tile.moveTo( selectedColumn, selectedLine );


        if ( isImageCorrect() )
            {
            unSelectSelectedTile();
            STAGE.update();

            var message = 'Correct!';

            if ( IMAGES_LEFT.length === 0 )
                {
                message += "\nYou've been through all the images.\nRestarting...";
                }

            $( '#WinMessage' ).text( message ).dialog({
                    modal: true,
                    close: function( event, ui ) {
                        start();
                    },
                    buttons: {
                        ok: function() {
                            $( this ).dialog( 'close' );
                        }
                    }
                });
            return;
            }
        }

    unSelectSelectedTile();
    }
};


/**
 * Select a tile.
 */
function selectTile( tile )
{
SELECTED = tile;
SELECTED.select();
}


/**
 * Un-select a tile.
 */
function unSelectSelectedTile()
{
if ( SELECTED )
    {
    SELECTED.unSelect();
    SELECTED = null;
    }
}


/**
 * Check if the image is correctly positioned (if the puzzle is solved).
 */
function isImageCorrect()
{
for (var a = 0 ; a < TILES.length ; a++)
    {
    var tile = TILES[ a ];

    if ( !tile.match() )
        {
        return false;
        }
    }

return true;
}


/**
 * Shuffle an array.
 */
function shuffle( array )
{
var currentIndex = array.length;
var temporaryValue;
var randomIndex;

    // while there remain elements to shuffle
while( currentIndex !== 0 )
    {
        // pick a remaining element...
    randomIndex = Math.floor( Math.random() * currentIndex );
    currentIndex -= 1;

        // And swap it with the current element.
    temporaryValue = array[ currentIndex ];
    array[ currentIndex ] = array[ randomIndex ];
    array[ randomIndex ] = temporaryValue;
    }

return array;
}


/**
 * Highlight a correct move.
 */
function helpPlayer()
{
    // get an invalid placed tile
var helpTile = null;

for (var a = 0 ; a < TILES.length ; a++)
    {
    var tile = TILES[ a ];

    if ( !tile.match() )
        {
        helpTile = tile;
        break;
        }
    }

    // highlight the tile and where its supposed to go
if ( helpTile !== null )
    {
    helpTile.highlight();
    getTile( helpTile.trueColumn, helpTile.trueLine ).highlight();
    }
}


/**
 * Skip the current image.
 */
function skipImage()
{
start();
}


/**
 * Open a dialog with the original image, for help solving the puzzle.
 */
function showOriginalImage()
{
ShowImage.show( CURRENT_IMAGE_INFO.id );
}


/**
 * Get the total number of columns in the grid.
 */
function getNumberOfColumns()
{
return CURRENT_IMAGE_INFO.columns;
}


/**
 * Get the total number of lines in the grid.
 */
function getNumberOfLines()
{
return CURRENT_IMAGE_INFO.lines;
}


/**
 * Get a tile given the current position.
 */
function getTile( column, line )
{
return TILES[ line * getNumberOfColumns() + column ];
}


/**
 * Function that gets called at every tick/update.
 */
function tick()
{
STAGE.update();
}


})(Main || (Main = {}));
