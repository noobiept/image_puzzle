function Tile( imageInfo, container, trueColumn, trueLine )
{
var _this = this;

this.trueColumn = trueColumn;
this.trueLine = trueLine;
this.currentColumn = trueColumn;
this.currentLine = trueLine;

var image = new createjs.Bitmap( Main.getImage( imageInfo.id + trueColumn + trueLine ) );

image.x = trueColumn * imageInfo.tileWidth;
image.y = trueLine * imageInfo.tileHeight;

image.on( 'click', function() { Main.selectTile( _this ) } );

this.tileWidth = imageInfo.tileWidth;
this.tileHeight = imageInfo.tileHeight;
this.image = image;
this.container = container;

container.addChild( image );
}


Tile.prototype.moveTo = function( column, line )
{
this.currentColumn = column;
this.currentLine = line;

this.image.x = column * this.tileWidth;
this.image.y = line * this.tileHeight;
};


Tile.prototype.match = function()
{
if ( this.currentColumn === this.trueColumn &&
     this.currentLine === this.trueLine )
    {
    return true;
    }

return false;
};


Tile.prototype.clear = function()
{
this.container.removeChild( this.image );
this.container = null;
this.image = null;
};
