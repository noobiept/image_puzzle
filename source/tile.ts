import { ImageInfo } from "./types";

export interface TileArgs {
    imageInfo: ImageInfo;
    parent: createjs.Container;
    trueColumn: number;
    trueLine: number;
    onClick: (tile: Tile) => void;
}

export class Tile {
    private currentColumn: number;
    private currentLine: number;
    private trueColumn: number;
    private trueLine: number;
    private originalWidth: number;
    private originalHeight: number;
    private tileWidth: number;
    private tileHeight: number;
    private container: createjs.Container | null;
    private image: createjs.Bitmap;
    private parent: createjs.Container | null;
    private border: createjs.Shape | null;
    private isSelected = false;
    private isHighlighted = false;
    private isMouseOver = false;

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

        parent.addChild(container);
        this.updateBorderColor();
    }

    /**
     * @returns The current tile position.
     */
    getCurrentPosition() {
        return {
            column: this.currentColumn,
            line: this.currentLine,
        };
    }

    /**
     * @returns The true position of this tile (where its supposed to be to complete the image).
     */
    getTruePosition() {
        return {
            column: this.trueColumn,
            line: this.trueLine,
        };
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
        this.isSelected = true;
        this.updateBorderColor();
    }

    /**
     * Un-select this tile.
     */
    unSelect() {
        this.isSelected = false;
        this.updateBorderColor();
    }

    /**
     * Change the highlight value a tile (highlighting is used for example when helping the player solving the puzzle).
     */
    setHighlight(value: boolean) {
        this.isHighlighted = value;
        this.updateBorderColor();
    }

    /**
     * Update the border color based on the current state (selected/highlighted/mouseOver).
     */
    updateBorderColor() {
        let color;

        if (this.isHighlighted) {
            if (this.isSelected) {
                if (this.isMouseOver) {
                    color = "darkred";
                } else {
                    color = "red";
                }
            } else {
                if (this.isMouseOver) {
                    color = "#999900";
                } else {
                    color = "yellow";
                }
            }
        } else {
            if (this.isMouseOver) {
                if (this.isSelected) {
                    color = "darkred";
                } else {
                    color = "blue";
                }
            } else {
                if (this.isSelected) {
                    color = "red";
                }
            }
        }

        this.setBorderColor(color);
    }

    /**
     * Show an effect when the mouse is over this element.
     */
    mouseOver() {
        this.isMouseOver = true;
        this.updateBorderColor();
    }

    /**
     * Remove the mouse over effect.
     */
    mouseOut() {
        this.isMouseOver = false;
        this.updateBorderColor();
    }

    resetState() {
        this.isHighlighted = false;
        this.isSelected = false;
        this.isMouseOver = false;
        this.updateBorderColor();
    }

    /**
     * Change the border color.
     * If `color` is undefined then the border is hidden.
     */
    private setBorderColor(color?: string) {
        if (!this.border) {
            return;
        }
        // hide the border
        if (!color) {
            this.border.visible = false;
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
