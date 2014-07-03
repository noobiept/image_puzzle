(function(window)
{
function Position( trueColumn, trueLine )
{
var _this = this;

this.trueColumn = trueColumn;
this.trueLine = trueLine;
this.currentColumn = trueColumn;
this.currentLine = trueLine;

var image = new createjs.Bitmap( G.PRELOAD.getResult( 'image1_' + trueColumn + '_' + trueLine ) );

image.x = trueColumn * Position.width;
image.y = trueLine * Position.height;

image.on( 'click', function() { selectPosition( _this ) } );

this.image = image;

G.STAGE.addChild( image );
}

Position.width = 250;
Position.height = 126;


Position.prototype.moveTo = function( column, line )
{
this.currentColumn = column;
this.currentLine = line;

this.image.x = column * Position.width;
this.image.y = line * Position.height;
};


Position.prototype.match = function()
{
if ( this.currentColumn === this.trueColumn &&
     this.currentLine === this.trueLine )
    {
    return true;
    }

return false;
};



window.Position = Position;

}(window));