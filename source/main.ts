import { shuffle } from "@drk4/utilities";
import * as GameMenu from "./game_menu";
import {
    clearCurrentImage,
    getCurrentImageDimensions,
    getImagesInformation,
    getNumberOfColumns,
    noImagesLeft,
    selectNextImage,
} from "./images";
import * as ShowImage from "./show_image";
import { Tile } from "./tile";

window.onload = function () {
    init();
};

window.onresize = function () {
    resize();
};

let CANVAS: HTMLCanvasElement;
let STAGE: createjs.Stage;

const TILES: Tile[] = []; // has all the tile objects
let SELECTED: Tile | null = null; // has the currently selected tile object

function init() {
    CANVAS = document.querySelector("#MainCanvas")!;
    STAGE = new createjs.Stage(CANVAS);
    STAGE.enableMouseOver(20);

    createjs.Ticker.on("tick", tick);

    GameMenu.init();
    ShowImage.init();
    start();
}

/**
 * Start a random image (off the ones that haven't being played yet).
 */
export function start() {
    clear();

    const imageInfo = selectNextImage();
    const columns = imageInfo.columns;
    const lines = imageInfo.lines;

    // add all the image tiles
    const length = columns * lines;

    for (let a = 0; a < length; a++) {
        const line = Math.floor(a / columns);
        const column = a - line * columns;
        const tile = new Tile(imageInfo, STAGE, column, line);

        TILES.push(tile);
    }

    // shuffle the tiles
    shuffleTiles();

    GameMenu.updateImagesLeft(getImagesInformation());
    calculateCorrectTiles();
    resize();
}

/**
 * Reset the game state, and remove the current image elements.
 */
function clear() {
    SELECTED = null;
    clearCurrentImage();

    if (TILES.length > 0) {
        for (let a = 0; a < TILES.length; a++) {
            TILES[a].clear();
        }

        TILES.length = 0;
    }
}

/**
 * Shuffle the tile's position.
 */
function shuffleTiles() {
    shuffle(TILES);

    const columns = getNumberOfColumns();

    for (let a = 0; a < TILES.length; a++) {
        const line = Math.floor(a / columns);
        const column = a - line * columns;
        const tile = TILES[a];
        tile.moveTo(column, line);
    }
}

/**
 * Select a tile. If there was a tile previously selected, then we switch their positions.
 */
export function selectTile(tile: Tile) {
    if (SELECTED === null) {
        setSelectedTile(tile);
    } else {
        // switch their position
        if (SELECTED !== tile) {
            const selectedColumn = SELECTED.currentColumn;
            const selectedLine = SELECTED.currentLine;

            const columns = getNumberOfColumns();

            TILES[tile.currentLine * columns + tile.currentColumn] = SELECTED;
            TILES[selectedLine * columns + selectedColumn] = tile;

            SELECTED.moveTo(tile.currentColumn, tile.currentLine);
            tile.moveTo(selectedColumn, selectedLine);

            const correct = calculateCorrectTiles();

            if (isImageCorrect(correct)) {
                unSelectSelectedTile();
                STAGE.update();

                let message = "Correct!";

                if (noImagesLeft()) {
                    message +=
                        "\nYou've been through all the images.\nRestarting...";
                }

                $("#WinMessage")
                    .text(message)
                    .dialog({
                        modal: true,
                        close: function () {
                            start();
                        },
                        buttons: {
                            ok: function () {
                                $(this).dialog("close");
                            },
                        },
                    });
                return;
            }
        }

        unSelectSelectedTile();
    }
}

/**
 * Select a tile.
 */
function setSelectedTile(tile: Tile) {
    SELECTED = tile;
    SELECTED.select();
}

/**
 * Un-select a tile.
 */
function unSelectSelectedTile() {
    if (SELECTED) {
        SELECTED.unSelect();
        SELECTED = null;
    }
}

/**
 * Check if the image is correctly positioned (if the puzzle is solved).
 */
function isImageCorrect(correct: number) {
    return correct === TILES.length;
}

/**
 * Get a tile given the current position.
 */
function getTile(column: number, line: number) {
    const columns = getNumberOfColumns();

    return TILES[line * columns + column];
}

/**
 * Highlight a correct move.
 */
export function helpPlayer() {
    // get an invalid placed tile
    let helpTile = null;

    for (let a = 0; a < TILES.length; a++) {
        const tile = TILES[a];

        if (!tile.match()) {
            helpTile = tile;
            break;
        }
    }

    // highlight the tile and where its supposed to go
    if (helpTile !== null) {
        helpTile.highlight();
        getTile(helpTile.trueColumn, helpTile.trueLine)?.highlight();
    }
}

/**
 * Calculate the number of correct tiles (that are placed in the correct position).
 */
function calculateCorrectTiles() {
    let correct = 0;

    for (let a = 0; a < TILES.length; a++) {
        const tile = TILES[a];

        if (tile.match()) {
            correct++;
        }
    }

    GameMenu.updateCorrectTiles(correct, TILES.length);

    return correct;
}

/**
 * Resize the game to fit in the available window's width/height.
 */
function resize() {
    const availableWidth = $(window).outerWidth(true)!;
    const availableHeight =
        $(window).outerHeight(true)! - $("#GameMenu").outerHeight(true)!;

    const imageDimensions = getCurrentImageDimensions();
    if (!imageDimensions) {
        return;
    }
    const { width: imageWidth, height: imageHeight } = imageDimensions;

    // determine which scale to use
    // we'll want to use the same scale value for x and y (to keep the image aspect ratio)
    const scaleX = availableWidth / imageWidth;
    const scaleY = availableHeight / imageHeight;

    let scale = scaleX;
    if (scaleY < scaleX) {
        scale = scaleY;
    }

    CANVAS.width = imageWidth * scale;
    CANVAS.height = imageHeight * scale;

    for (let a = 0; a < TILES.length; a++) {
        TILES[a].updateSize(scale);
    }
}

/**
 * Function that gets called at every tick/update.
 */
function tick() {
    STAGE.update();
}
