var G = {
        CANVAS: null,
        PRELOAD: null,
        STAGE: null,
        POSITIONS: [],
        SELECTED: null,
        IMAGES_PER_LINE: 4,
        IMAGES_PER_COLUMN: 4
    };


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );
G.PRELOAD = new createjs.LoadQueue();

var manifest = [
        { id: 'image1_0_0', src: 'images/image1/image1_01.png' },
        { id: 'image1_1_0', src: 'images/image1/image1_02.png' },
        { id: 'image1_2_0', src: 'images/image1/image1_03.png' },
        { id: 'image1_3_0', src: 'images/image1/image1_04.png' },
        { id: 'image1_0_1', src: 'images/image1/image1_05.png' },
        { id: 'image1_1_1', src: 'images/image1/image1_06.png' },
        { id: 'image1_2_1', src: 'images/image1/image1_07.png' },
        { id: 'image1_3_1', src: 'images/image1/image1_08.png' },
        { id: 'image1_0_2', src: 'images/image1/image1_09.png' },
        { id: 'image1_1_2', src: 'images/image1/image1_10.png' },
        { id: 'image1_2_2', src: 'images/image1/image1_11.png' },
        { id: 'image1_3_2', src: 'images/image1/image1_12.png' },
        { id: 'image1_0_3', src: 'images/image1/image1_13.png' },
        { id: 'image1_1_3', src: 'images/image1/image1_14.png' },
        { id: 'image1_2_3', src: 'images/image1/image1_15.png' },
        { id: 'image1_3_3', src: 'images/image1/image1_16.png' }
    ];

G.PRELOAD.addEventListener( 'complete', start );
G.PRELOAD.loadManifest( manifest, true );
};


function start()
{
var imagesPerLine = G.IMAGES_PER_LINE;
var imagesPerColumn = G.IMAGES_PER_COLUMN;

G.CANVAS.width = imagesPerColumn * Position.width;
G.CANVAS.height = imagesPerLine * Position.height;

for (var column = 0 ; column < imagesPerColumn ; column++)
    {
    G.POSITIONS[ column ] = [];

    for (var line = 0 ; line < imagesPerLine ; line++)
        {
        var position = new Position( column, line );

        G.POSITIONS[ column ].push( position );
        }
    }

shufflePositions();


createjs.Ticker.on( 'tick', tick );
}

function shufflePositions()
{
var imagesPerLine = G.IMAGES_PER_LINE;
var imagesPerColumn = G.IMAGES_PER_COLUMN;
var positions = [];

for (var column = 0 ; column < imagesPerColumn ; column++)
    {
    for (var line = 0 ; line < imagesPerLine ; line++)
        {
        positions.push({ column: column, line: line });
        }
    }


shuffle( positions );
var positionsIndex = 0;

for (var column = 0 ; column < imagesPerColumn ; column++)
    {
    for (var line = 0 ; line < imagesPerLine ; line++)
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
var imagesPerLine = G.IMAGES_PER_LINE;
var imagesPerColumn = G.IMAGES_PER_COLUMN;

for (var column = 0 ; column < imagesPerColumn ; column++)
    {
    for (var line = 0 ; line < imagesPerLine ; line++)
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