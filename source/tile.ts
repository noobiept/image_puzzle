import { ImageInfo } from "./types";

export interface TileArgs {
    imageInfo: ImageInfo;
    parent: createjs.Container;
    trueColumn: number;
    trueLine: number;
    onClick: (tile: Tile) => void;
}

export class Tile {
    currentColumn: number;
    currentLine: number;
    trueColumn: number;
    trueLine: number;

    private originalWidth: number;
    private originalHeight: number;
    private tileWidth: number;
    private tileHeight: number;
    private container: createjs.Container | null;
    private image: createjs.Bitmap;
    private parent: createjs.Container | null;
    private border: createjs.Shape | null;
    private isSelected: boolean;

    constructor({
        imageInfo,
        parent,
        trueColumn,
        trueLine,
        onClick,
    }: TileArgs) {
        this.trueColumn = trueColumn;
        this.trueLine = trueLine;
        this.currentColumn = trueColumn;
        this.currentLine = trueLine;

        // the tile image
        // image source in the format: images/id/id(column)(line).png
        // where column and line are numbers, for example 'images/mirana/mirana21.png' (second column first line)
        const image = new createjs.Bitmap(
            "images/" +
                imageInfo.id +
                "/" +
                (imageInfo.id + trueLine + trueColumn) +
                ".jpeg"
        );

        image.on("click", () => {
            onClick(this);
        });
        image.on("mouseover", this.mouseOver, this);
        image.on("mouseout", this.mouseOut, this);

        // the selected border
        const border = new createjs.Shape();
        border.visible = false;

        // container
        const container = new createjs.Container();

        container.x = trueColumn * imageInfo.tileWidth;
        container.y = trueLine * imageInfo.tileHeight;

        container.addChild(image);
        container.addChild(border);

        this.originalWidth = imageInfo.tileWidth;
        this.originalHeight = imageInfo.tileHeight;
        this.tileWidth = imageInfo.tileWidth;
        this.tileHeight = imageInfo.tileHeight;
        this.container = container;
        this.image = image;
        this.parent = parent;
        this.border = border;
        this.isSelected = false;

        parent.addChild(container);
    }

    /**
     * Move this tile to a different position.
     */
    moveTo(column: number, line: number) {
        this.currentColumn = column;
        this.currentLine = line;

        if (this.container) {
            this.container.x = column * this.tileWidth;
            this.container.y = line * this.tileHeight;
        }
    }

    /**
     * Check if this tile is in the correct position.
     */
    match() {
        if (
            this.currentColumn === this.trueColumn &&
            this.currentLine === this.trueLine
        ) {
            return true;
        }

        return false;
    }

    /**
     * Select this tile.
     */
    select() {
        this.setBorderColor("red");
        this.isSelected = true;
    }

    /**
     * Un-select this tile.
     */
    unSelect() {
        if (this.border) {
            this.border.visible = false;
        }
        this.isSelected = false;
    }

    /**
     * Highlight a tile (for example when helping the player solving the puzzle).
     */
    highlight() {
        this.setBorderColor("yellow");
    }

    /**
     * Show an effect when the mouse is over this element.
     */
    mouseOver() {
        if (this.isSelected) {
            this.setBorderColor("purple");
        } else {
            this.setBorderColor("blue");
        }
    }

    /**
     * Remove the mouse over effect.
     */
    mouseOut() {
        if (this.isSelected) {
            this.select();
        } else {
            this.unSelect();
        }
    }

    setBorderColor(color: string) {
        if (!this.border) {
            return;
        }

        const thickness = 3;
        const halfThickness = thickness / 2;

        this.border.visible = true;
        const g = this.border.graphics;

        g.clear();
        g.beginStroke(color);
        g.setStrokeStyle(thickness);
        g.drawRect(
            halfThickness,
            halfThickness,
            this.tileWidth - thickness,
            this.tileHeight - thickness
        );
        g.endStroke();
    }

    updateSize(scale: number) {
        this.tileWidth = this.originalWidth * scale;
        this.tileHeight = this.originalHeight * scale;

        this.image.scaleX = scale;
        this.image.scaleY = scale;

        if (this.container) {
            this.container.x = this.currentColumn * this.tileWidth;
            this.container.y = this.currentLine * this.tileHeight;
        }
    }

    /**
     * Remove this tile.
     */
    clear() {
        this.image.removeAllEventListeners();

        if (this.container) {
            this.parent?.removeChild(this.container);
        }
        this.parent = null;
        this.container = null;
        this.border = null;
    }
}
