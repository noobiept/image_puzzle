export interface ImageInfo {
    id: string;
    columns: number;
    lines: number;
    tileWidth: number;
    tileHeight: number;
}

export interface ImagesInformation {
    total: number;
    left: number;
}

export interface TilePosition {
    column: number;
    line: number;
}
