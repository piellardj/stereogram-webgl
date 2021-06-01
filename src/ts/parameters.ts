import "./page-interface-generated";


/* === IDs ============================================================ */
const controlId = {
    DEPTH_RANGE: "depth-range-id",
    SHOW_HEIGHTMAP: "show-heightmap-checkbox-id",

    IMAGE_DOWNLOAD: "image-download-id",
};

type Observer = () => unknown;

function callObservers(observers: Observer[]): void {
    for (const observer of observers) {
        observer();
    }
}

function callRedrawObservers(): void {
    callObservers(Parameters.redrawObservers);
}

abstract class Parameters {
    public static readonly redrawObservers: Observer[] = [];
    public static readonly imageDownloadObservers: Observer[] = [];

    public static get depth(): number {
        return Page.Range.getValue(controlId.DEPTH_RANGE);
    }

    public static get showHeightmap(): boolean {
        return Page.Checkbox.isChecked(controlId.SHOW_HEIGHTMAP);
    }
}

Page.Canvas.Observers.canvasResize.push(callRedrawObservers);
Page.Range.addObserver(controlId.DEPTH_RANGE, callRedrawObservers);
Page.Checkbox.addObserver(controlId.SHOW_HEIGHTMAP, callRedrawObservers);

Page.FileControl.addDownloadObserver(controlId.IMAGE_DOWNLOAD, () => {
    callObservers(Parameters.imageDownloadObservers);
});

export {
    Parameters,
};
