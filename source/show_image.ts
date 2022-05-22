let IMAGE;
let OVERLAY;

export function init() {
    IMAGE = document.getElementById("OriginalImage");
    IMAGE.onclick = close;

    OVERLAY = document.getElementById("Overlay");
    OVERLAY.onclick = close;
}

export function show(id) {
    IMAGE.src = "images/" + id + ".jpeg";
    IMAGE.classList.remove("hidden");
    OVERLAY.classList.remove("hidden");
}

function close() {
    IMAGE.classList.add("hidden");
    OVERLAY.classList.add("hidden");
}
