import { ImagesInformation } from "./types";

let IMAGES_LEFT_UI: HTMLElement;
let TILES_CORRECT_UI: HTMLElement;

export interface GameMenuInitArgs {
    onHelp: () => void;
    onSkip: () => void;
    onShowOriginal: () => void;
}

/**
 * Initialize the menu elements.
 */
export function init({ onHelp, onSkip, onShowOriginal }: GameMenuInitArgs) {
    const help = document.getElementById("Help")!;
    help.onclick = onHelp;
    $(help).button();

    const original = document.getElementById("ShowOriginal")!;
    original.onclick = onShowOriginal;
    $(original).button();

    const skip = document.getElementById("Skip")!;
    skip.onclick = onSkip;
    $(skip).button();

    IMAGES_LEFT_UI = document.getElementById("ImagesLeft")!;
    TILES_CORRECT_UI = document.getElementById("TilesCorrect")!;

    const container = document.getElementById("GameMenu")!;
    container.classList.remove("hidden");
}

/**
 * Update the game menu UI with the current image and total images available.
 */
export function updateImagesLeft({ total, left }: ImagesInformation) {
    IMAGES_LEFT_UI.innerHTML = "Image: " + (total - left) + "/" + total;
}

/**
 * Update the UI with the number of correct tiles (placed in the correct place).
 */
export function updateCorrectTiles(correct: number, total: number) {
    TILES_CORRECT_UI.innerHTML = "Tiles: " + correct + "/" + total;
}
