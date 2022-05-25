import { ImageInfo } from "./types";

const IMAGES_INFO: ImageInfo[] = [
    {
        id: "beta_is_over",
        columns: 8,
        lines: 2,
        tileWidth: 169,
        tileHeight: 192,
    },
    { id: "mirana", columns: 8, lines: 2, tileWidth: 200, tileHeight: 285 },
    { id: "snow", columns: 8, lines: 2, tileWidth: 179, tileHeight: 359 },
    { id: "lina", columns: 4, lines: 4, tileWidth: 256, tileHeight: 144 },
    { id: "treant", columns: 7, lines: 4, tileWidth: 260, tileHeight: 256 },
    {
        id: "demoman_merasmus",
        columns: 5,
        lines: 5,
        tileWidth: 320,
        tileHeight: 338,
    },
    {
        id: "expiration_date",
        columns: 6,
        lines: 5,
        tileWidth: 320,
        tileHeight: 216,
    },
    {
        id: "gun_mettle",
        columns: 5,
        lines: 5,
        tileWidth: 512,
        tileHeight: 320,
    },
    {
        id: "pyroland_sunset",
        columns: 8,
        lines: 8,
        tileWidth: 320,
        tileHeight: 200,
    },
    {
        id: "bounty_hunter",
        columns: 7,
        lines: 8,
        tileWidth: 260,
        tileHeight: 128,
    },
    {
        id: "shadow_demon",
        columns: 7,
        lines: 4,
        tileWidth: 260,
        tileHeight: 256,
    },
    {
        id: "timbuk_tuesday",
        columns: 8,
        lines: 5,
        tileWidth: 250,
        tileHeight: 225,
    },
];
const IMAGES_LEFT: ImageInfo[] = []; // has the images info that haven't being played yet
let CURRENT_IMAGE_INFO: ImageInfo | null = null;

export function selectNextImage() {
    // if all the maps have already been played, then re-add all the images, and start again
    if (IMAGES_LEFT.length === 0) {
        for (let a = 0; a < IMAGES_INFO.length; a++) {
            IMAGES_LEFT.push(IMAGES_INFO[a]);
        }
    }

    // select a random image
    const random = Math.floor(Math.random() * IMAGES_LEFT.length);
    const imageInfo = IMAGES_LEFT.splice(random, 1)[0];

    CURRENT_IMAGE_INFO = imageInfo;

    return imageInfo;
}

export function getImagesInformation() {
    return {
        total: IMAGES_INFO.length,
        left: IMAGES_LEFT.length,
    };
}

export function clearCurrentImage() {
    CURRENT_IMAGE_INFO = null;
}

export function noImagesLeft() {
    return IMAGES_LEFT.length === 0;
}

/**
 * Get the total number of columns in the grid.
 */
export function getNumberOfColumns() {
    return CURRENT_IMAGE_INFO?.columns ?? 0;
}

export function getCurrentImageId() {
    return CURRENT_IMAGE_INFO?.id;
}

export function getCurrentImageDimensions() {
    const imageInfo = CURRENT_IMAGE_INFO;
    if (!imageInfo) {
        return;
    }

    const width = imageInfo.tileWidth * imageInfo.columns;
    const height = imageInfo.tileHeight * imageInfo.lines;

    return { width, height };
}
