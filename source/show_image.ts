let IMAGE: HTMLImageElement;
let OVERLAY: HTMLElement;

export function init() {
    IMAGE = document.getElementById("OriginalImage") as HTMLImageElement;
    IMAGE.onclick = close;

    OVERLAY = document.getElementById("Overlay")!;
    OVERLAY.onclick = close;
}

export function show(id: string) {
    IMAGE.src = "images/" + id + ".jpeg";
    IMAGE.classList.remove("hidden");
    OVERLAY.classList.remove("hidden");
}

function close() {
    IMAGE.classList.add("hidden");
    OVERLAY.classList.add("hidden");
}
