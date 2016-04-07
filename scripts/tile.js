/*global createjs, Main*/
'use strict';

function Tile( imageInfo, parent, trueColumn, trueLine )
{
var _this = this;

this.trueColumn = trueColumn;
this.trueLine = trueLine;
this.currentColumn = trueColumn;
this.currentLine = trueLine;

    // the tile image
var image = new createjs.Bitmap( Main.getImage( imageInfo.id + trueColumn + trueLine ) );

image.on( 'click', function() { Main.selectTile( _this ); } );
image.on( 'mouseover', this.mouseOver, this );
image.on( 'mouseout', this.mouseOut, this );

    // the selected border
var border = new createjs.Shape();
border.visible = false;

    // container
var container = new createjs.Container();

container.x = trueColumn * imageInfo.tileWidth;
container.y = trueLine * imageInfo.tileHeight;

container.addChild( image );
container.addChild( border );

this.tileWidth = imageInfo.tileWidth;
this.tileHeight = imageInfo.tileHeight;
this.container = container;
this.image = image;
this.parent = parent;
this.border = border;
this.isSelected = false;

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
this.setBorderColor( 'red' );
this.isSelected = true;
};


/**
 * Un-select this tile.
 */
Tile.prototype.unSelect = function()
{
this.border.visible = false;
this.isSelected = false;
};


/**
 * Show an effect when the mouse is over this element.
 */
Tile.prototype.mouseOver = function()
{
if ( this.isSelected )
    {
    this.setBorderColor( 'purple' );
    }

else
    {
    this.setBorderColor( 'blue' );
    }
};


/**
 * Remove the mouse over effect.
 */
Tile.prototype.mouseOut = function()
{
if ( this.isSelected )
    {
    this.select();
    }

else
    {
    this.unSelect();
    }
};


Tile.prototype.setBorderColor = function( color )
{
var thickness = 3;
var halfThickness = thickness / 2;

this.border.visible = true;
var g = this.border.graphics;

g.beginStroke( color );
g.setStrokeStyle( thickness );
g.drawRect( halfThickness, halfThickness, this.tileWidth - thickness, this.tileHeight - thickness );
g.endStroke();
};


/**
 * Remove this tile.
 */
Tile.prototype.clear = function()
{
this.image.removeAllEventListeners();
this.parent.removeChild( this.container );
this.parent = null;
this.container = null;
this.border = null;
};
