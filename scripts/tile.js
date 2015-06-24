function Tile( imageInfo, parent, trueColumn, trueLine )
{
var _this = this;

this.trueColumn = trueColumn;
this.trueLine = trueLine;
this.currentColumn = trueColumn;
this.currentLine = trueLine;

    // the tile image
var image = new createjs.Bitmap( Main.getImage( imageInfo.id + trueColumn + trueLine ) );

image.on( 'click', function() { Main.selectTile( _this ) } );


    // the selected border
var border = new createjs.Shape();

border.visible = false;

var thickness = 4;
var halfThickness = thickness / 2;

var g = border.graphics;

g.beginStroke( 'red' );
g.setStrokeStyle( thickness );
g.drawRect( halfThickness, halfThickness, imageInfo.tileWidth - thickness, imageInfo.tileHeight - thickness );
g.endStroke();


    // container
var container = new createjs.Container();

container.x = trueColumn * imageInfo.tileWidth;
container.y = trueLine * imageInfo.tileHeight;

container.addChild( image );
container.addChild( border );


this.tileWidth = imageInfo.tileWidth;
this.tileHeight = imageInfo.tileHeight;
this.container = container;
this.parent = parent;
this.border = border;

parent.addChild( container );
}


/**
 * Move this tile to a different position.
 */
Tile.prototype.moveTo = function( column, line )
{
this.currentColumn = column;
this.currentLine = line;

this.container.x = column * this.tileWidth;
this.container.y = line * this.tileHeight;
};


/**
 * Check if this tile is in the correct position.
 */
Tile.prototype.match = function()
{
if ( this.currentColumn === this.trueColumn &&
     this.currentLine === this.trueLine )
    {
    return true;
    }

return false;
};


/**
 * Select this tile.
 */
Tile.prototype.select = function()
{
this.border.visible = true;
};


/**
 * Un-select this tile.
 */
Tile.prototype.unSelect = function()
{
this.border.visible = false;
};


/**
 * Remove this tile.
 */
Tile.prototype.clear = function()
{
this.parent.removeChild( this.container );
this.parent = null;
this.container = null;
this.border = null;
};
