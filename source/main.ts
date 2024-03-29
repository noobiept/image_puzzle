import { shuffle } from "@drk4/utilities";
import { debounce } from "lodash-es";
import * as GameMenu from "./game_menu";
import {
    clearCurrentImage,
    getCurrentImageDimensions,
    getCurrentImageId,
    getImagesInformation,
    getNumberOfColumns,
    noImagesLeft,
    selectNextImage,
} from "./images";
import * as ShowImage from "./show_image";
import { Tile } from "./tile";
import { TilePosition } from "./types";

window.onload = function () {
    init();

    const loading = document.getElementById("InitialLoading")!;
    loading.remove();
};

window.onresize = debounce(resize, 100);

let CANVAS: HTMLCanvasElement;
let STAGE: createjs.Stage;

const TILES: Tile[] = []; // has all the tile objects
let SELECTED: Tile | null = null; // has the currently selected tile object
let HIGHLIGHTED_TILES: Tile[] = []; // list of all the tiles that are highlighted (will be either empty or have 2 tiles)

function init() {
    CANVAS = document.querySelector("#MainCanvas")!;
    STAGE = new createjs.Stage(CANVAS);
    STAGE.enableMouseOver(20);

    createjs.Ticker.on("tick", tick);

    GameMenu.init({
        onHelp: helpPlayer,
        onSkip: start,
        onShowOriginal: showOriginalImage,
    });
    ShowImage.init();
    start();
}

/**
 * Open a dialog with the original image, for help solving the puzzle.
 */
function showOriginalImage() {
    const id = getCurrentImageId();

    if (id) {
        ShowImage.show(id);
    }
}

/**
 * Start a random image (off the ones that haven't being played yet).
 */
function start() {
    clear();

    const imageInfo = selectNextImage();
    const columns = imageInfo.columns;
    const lines = imageInfo.lines;

    // add all the image tiles
    const length = columns * lines;

    for (let a = 0; a < length; a++) {
        const trueLine = Math.floor(a / columns);
        const trueColumn = a - trueLine * columns;
        const tile = new Tile({
            imageInfo,
            parent: STAGE,
            trueColumn,
            trueLine,
            onClick: selectTile,
        });

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
function selectTile(tile: Tile) {
    if (SELECTED === null) {
        setSelectedTile(tile);
    } else {
        // switch their position
        if (SELECTED !== tile) {
            const { column: selectedColumn, line: selectedLine } =
                SELECTED.getCurrentPosition();
            const { column: currentColumn, line: currentLine } =
                tile.getCurrentPosition();

            const columns = getNumberOfColumns();

            TILES[currentLine * columns + currentColumn] = SELECTED;
            TILES[selectedLine * columns + selectedColumn] = tile;

            SELECTED.moveTo(currentColumn, currentLine);
            tile.moveTo(selectedColumn, selectedLine);

            // un-selected all selected and highlighted tiles
            clearAllHighlightedTiles();

            SELECTED.resetState();
            tile.resetState();

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
function getTile({ line, column }: TilePosition) {
    const columns = getNumberOfColumns();

    return TILES[line * columns + column];
}

/**
 * Highlight a correct move.
 */
function helpPlayer() {
    // get an invalid placed tile
    let helpTile = null;

    // create a random list of indexes
    const indexes = [];
    for (let a = 0; a < TILES.length; a++) {
        indexes.push(a);
    }
    shuffle(indexes);

    // loop randomly the tiles array
    for (let a = 0; a < indexes.length; a++) {
        const index = indexes[a];
        const tile = TILES[index];

        if (!tile.match()) {
            helpTile = tile;
            break;
        }
    }

    // highlight the tile and where its supposed to go
    if (helpTile !== null) {
        const match = getTile(helpTile.getTruePosition());
        if (match) {
            highlightTiles(helpTile, match);
        }
    }
}

function highlightTiles(...tiles: Tile[]) {
    tiles.forEach((tile) => tile.setHighlight(true));
    HIGHLIGHTED_TILES = tiles;
}

function clearAllHighlightedTiles() {
    HIGHLIGHTED_TILES.forEach((tile) => tile.setHighlight(false));
    HIGHLIGHTED_TILES.length = 0;
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
    const menu = document.getElementById("GameMenu")!;
    const margin = 20;
    const availableWidth = document.body.clientWidth - margin;
    const availableHeight =
        document.body.clientHeight - menu.clientHeight - margin;

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
