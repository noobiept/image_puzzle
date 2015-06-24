var G = {
        CANVAS: null,
        PRELOAD: null,
        STAGE: null,
        POSITIONS: [],
        SELECTED: null,
        IMAGES_INFO: [
            { id: 'beta_is_over', columns: 8, lines: 2, tileWidth: 169, tileHeight: 192 },
            { id: 'mirana', columns: 8, lines: 2, tileWidth: 200, tileHeight: 285 },
            { id: 'snow', columns: 8, lines: 2, tileWidth: 179, tileHeight: 359 }
        ],
        CURRENT_IMAGE_INFO: null
    };


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );
G.PRELOAD = new createjs.LoadQueue();

    // the 'id' is composed of the image id plus the column and line position
    // so 'mirana21' is the 'mirana' image, in the second column and first line
var manifest = [
        { id: 'mirana00', src: 'images/mirana/mirana_01.png' },
        { id: 'mirana10', src: 'images/mirana/mirana_02.png' },
        { id: 'mirana20', src: 'images/mirana/mirana_03.png' },
        { id: 'mirana30', src: 'images/mirana/mirana_04.png' },
        { id: 'mirana40', src: 'images/mirana/mirana_05.png' },
        { id: 'mirana50', src: 'images/mirana/mirana_06.png' },
        { id: 'mirana60', src: 'images/mirana/mirana_07.png' },
        { id: 'mirana70', src: 'images/mirana/mirana_08.png' },
        { id: 'mirana01', src: 'images/mirana/mirana_09.png' },
        { id: 'mirana11', src: 'images/mirana/mirana_10.png' },
        { id: 'mirana21', src: 'images/mirana/mirana_11.png' },
        { id: 'mirana31', src: 'images/mirana/mirana_12.png' },
        { id: 'mirana41', src: 'images/mirana/mirana_13.png' },
        { id: 'mirana51', src: 'images/mirana/mirana_14.png' },
        { id: 'mirana61', src: 'images/mirana/mirana_15.png' },
        { id: 'mirana71', src: 'images/mirana/mirana_16.png' },

        { id: 'beta_is_over00', src: 'images/beta_is_over/beta_is_over_01.png' },
        { id: 'beta_is_over10', src: 'images/beta_is_over/beta_is_over_02.png' },
        { id: 'beta_is_over20', src: 'images/beta_is_over/beta_is_over_03.png' },
        { id: 'beta_is_over30', src: 'images/beta_is_over/beta_is_over_04.png' },
        { id: 'beta_is_over40', src: 'images/beta_is_over/beta_is_over_05.png' },
        { id: 'beta_is_over50', src: 'images/beta_is_over/beta_is_over_06.png' },
        { id: 'beta_is_over60', src: 'images/beta_is_over/beta_is_over_07.png' },
        { id: 'beta_is_over70', src: 'images/beta_is_over/beta_is_over_08.png' },
        { id: 'beta_is_over01', src: 'images/beta_is_over/beta_is_over_09.png' },
        { id: 'beta_is_over11', src: 'images/beta_is_over/beta_is_over_10.png' },
        { id: 'beta_is_over21', src: 'images/beta_is_over/beta_is_over_11.png' },
        { id: 'beta_is_over31', src: 'images/beta_is_over/beta_is_over_12.png' },
        { id: 'beta_is_over41', src: 'images/beta_is_over/beta_is_over_13.png' },
        { id: 'beta_is_over51', src: 'images/beta_is_over/beta_is_over_14.png' },
        { id: 'beta_is_over61', src: 'images/beta_is_over/beta_is_over_15.png' },
        { id: 'beta_is_over71', src: 'images/beta_is_over/beta_is_over_16.png' },

        { id: 'snow00', src: 'images/snow/snow_01.png' },
        { id: 'snow10', src: 'images/snow/snow_02.png' },
        { id: 'snow20', src: 'images/snow/snow_03.png' },
        { id: 'snow30', src: 'images/snow/snow_04.png' },
        { id: 'snow40', src: 'images/snow/snow_05.png' },
        { id: 'snow50', src: 'images/snow/snow_06.png' },
        { id: 'snow60', src: 'images/snow/snow_07.png' },
        { id: 'snow70', src: 'images/snow/snow_08.png' },
        { id: 'snow01', src: 'images/snow/snow_09.png' },
        { id: 'snow11', src: 'images/snow/snow_10.png' },
        { id: 'snow21', src: 'images/snow/snow_11.png' },
        { id: 'snow31', src: 'images/snow/snow_12.png' },
        { id: 'snow41', src: 'images/snow/snow_13.png' },
        { id: 'snow51', src: 'images/snow/snow_14.png' },
        { id: 'snow61', src: 'images/snow/snow_15.png' },
        { id: 'snow71', src: 'images/snow/snow_16.png' }
    ];

G.PRELOAD.addEventListener( 'complete', start );
G.PRELOAD.loadManifest( manifest, true );
};


function start()
{
var random = Math.floor( Math.random() * (G.IMAGES_INFO.length - 1) );
var imageInfo = G.IMAGES_INFO[ random ];

G.CURRENT_IMAGE_INFO = imageInfo;

var columns = imageInfo.columns;
var lines = imageInfo.lines;

G.CANVAS.width = columns * imageInfo.tileWidth;
G.CANVAS.height = lines * imageInfo.tileHeight;


for (var column = 0 ; column < columns ; column++)
    {
    G.POSITIONS[ column ] = [];

    for (var line = 0 ; line < lines ; line++)
        {
        var position = new Position( imageInfo, column, line );

        G.POSITIONS[ column ].push( position );
        }
    }

shufflePositions();


createjs.Ticker.on( 'tick', tick );
}


function shufflePositions()
{
var lines = G.CURRENT_IMAGE_INFO.lines;
var columns = G.CURRENT_IMAGE_INFO.columns;
var positions = [];
var column, line;


for (column = 0 ; column < columns ; column++)
    {
    for (line = 0 ; line < lines ; line++)
        {
        positions.push({ column: column, line: line });
        }
    }


shuffle( positions );
var positionsIndex = 0;

for (column = 0 ; column < columns ; column++)
    {
    for (line = 0 ; line < lines ; line++)
        {
        var randomPosition = positions[ positionsIndex ];

        G.POSITIONS[ column ][ line ].moveTo( randomPosition.column, randomPosition.line );

        positionsIndex++;
        }
    }
}



function selectPosition( position )
{
if ( G.SELECTED === null )
    {
    G.SELECTED = position;
    }

else
    {
    if ( G.SELECTED == position )
        {
        G.SELECTED = null;
        }

    else
        {
        var selectedColumn = G.SELECTED.currentColumn;
        var selectedLine = G.SELECTED.currentLine;

        G.SELECTED.moveTo( position.currentColumn, position.currentLine );
        position.moveTo( selectedColumn, selectedLine );

        if ( isImageCorrect() )
            {
            G.STAGE.update();
            window.alert( 'you won!' );
            shufflePositions();
            }

        G.SELECTED = null;
        }
    }
}



function isImageCorrect()
{
var lines = G.CURRENT_IMAGE_INFO.lines;
var columns = G.CURRENT_IMAGE_INFO.columns;

for (var column = 0 ; column < columns ; column++)
    {
    for (var line = 0 ; line < lines ; line++)
        {
        var position = G.POSITIONS[ column ][ line ];

        if ( !position.match() )
            {
            return false;
            }
        }
    }

return true;
}


function shuffle( array )
{
var currentIndex = array.length;
var temporaryValue;
var randomIndex;

    // While there remain elements to shuffle...
while (0 !== currentIndex)
    {
        // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

        // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }

return array;
}



function tick()
{
G.STAGE.update();
}