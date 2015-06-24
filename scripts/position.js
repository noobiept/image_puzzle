(function(window)
{
function Position( imageInfo, trueColumn, trueLine )
{
var _this = this;

this.trueColumn = trueColumn;
this.trueLine = trueLine;
this.currentColumn = trueColumn;
this.currentLine = trueLine;

var image = new createjs.Bitmap( G.PRELOAD.getResult( imageInfo.id + trueColumn + trueLine ) );

image.x = trueColumn * imageInfo.tileWidth;
image.y = trueLine * imageInfo.tileHeight;

image.on( 'click', function() { selectPosition( _this ) } );

this.tileWidth = imageInfo.tileWidth;
this.tileHeight = imageInfo.tileHeight;
this.image = image;

G.STAGE.addChild( image );
}


Position.prototype.moveTo = function( column, line )
{
this.currentColumn = column;
this.currentLine = line;

this.image.x = column * this.tileWidth;
this.image.y = line * this.tileHeight;
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


Position.prototype.clear = function()
{
G.STAGE.removeChild( this.image );
};


window.Position = Position;

}(window));