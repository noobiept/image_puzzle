/*global $, Main, ShowImage*/
'use strict';

var GameMenu;
(function(GameMenu) {


var IMAGES_LEFT_UI;
var TILES_CORRECT_UI;


/**
 * Initialize the menu elements.
 */
GameMenu.init = function()
{
var help = document.getElementById( 'Help' );
help.onclick = Main.helpPlayer;
$( help ).button();

var original = document.getElementById( 'ShowOriginal' );
original.onclick = showOriginalImage;
$( original ).button();

var skip = document.getElementById( 'Skip' );
skip.onclick = Main.start;
$( skip ).button();

var donate = document.getElementById( 'Donate' );
donate.onclick = function()
    {
    window.open( 'http://nbpt.eu/donate/', '_blank' );
    };
$( donate ).button();

IMAGES_LEFT_UI = document.getElementById( 'ImagesLeft' );
TILES_CORRECT_UI = document.getElementById( 'TilesCorrect' );
};


/**
 * Open a dialog with the original image, for help solving the puzzle.
 */
function showOriginalImage()
{
ShowImage.show( Main.getCurrentImageId() );
}


/**
 * Update the game menu UI with the current image and total images available.
 */
GameMenu.updateImagesLeft = function( totalAvailable, totalLeft )
{
IMAGES_LEFT_UI.innerHTML = 'Image: ' + (totalAvailable - totalLeft) + '/' + totalAvailable;
};


/**
 * Update the UI with the number of correct tiles (placed in the correct place).
 */
GameMenu.updateCorrectTiles = function( correct, total )
{
TILES_CORRECT_UI.innerHTML = 'Tiles: ' + correct + '/' + total;
};


})(GameMenu || (GameMenu = {}));