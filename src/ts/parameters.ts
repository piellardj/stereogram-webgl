import "./page-interface-generated";


/* === IDs ============================================================ */
const controlId = {
    TILE_MODE_TABS: "tile-mode-tabs-id",
    TILE_NOISE_RESOLUTION: "tile-noise-resolution-range-id",
    TILE_NOISE_COLORED: "tile-noise-colored-checkbox-id",

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

function callRecomputeNoiseTileObservers(): void {
    callObservers(Parameters.recomputeNoiseTileObservers);
    callRedrawObservers();
}

enum ETileMode {
    TEXTURE = "texture",
    NOISE = "noise",
}

abstract class Parameters {
    public static readonly redrawObservers: Observer[] = [];
    public static readonly recomputeNoiseTileObservers: Observer[] = [];
    public static readonly imageDownloadObservers: Observer[] = [];

    public static get tileMode(): ETileMode {
        return Page.Tabs.getValues(controlId.TILE_MODE_TABS)[0] as ETileMode;
    }
    public static get noiseTileResolution(): number {
        return Page.Range.getValue(controlId.TILE_NOISE_RESOLUTION);
    }
    public static get noiseTileColored(): boolean {
        return Page.Checkbox.isChecked(controlId.TILE_NOISE_COLORED);
    }

    public static get depth(): number {
        return Page.Range.getValue(controlId.DEPTH_RANGE);
    }

    public static get showHeightmap(): boolean {
        return Page.Checkbox.isChecked(controlId.SHOW_HEIGHTMAP);
    }
}

function updateTileNoiseControlsVisibility(): void {
    const isTileNoiseMode = (Parameters.tileMode === ETileMode.NOISE);
    Page.Controls.setVisibility(controlId.TILE_NOISE_RESOLUTION, isTileNoiseMode);
    Page.Controls.setVisibility(controlId.TILE_NOISE_COLORED, isTileNoiseMode);
}

Page.Canvas.Observers.canvasResize.push(callRedrawObservers);
Page.Tabs.addObserver(controlId.TILE_MODE_TABS, () => {
    updateTileNoiseControlsVisibility();
    callRedrawObservers();
});
updateTileNoiseControlsVisibility();

Page.Range.addObserver(controlId.DEPTH_RANGE, callRedrawObservers);
Page.Checkbox.addObserver(controlId.SHOW_HEIGHTMAP, callRedrawObservers);

Page.Range.addObserver(controlId.TILE_NOISE_RESOLUTION, callRecomputeNoiseTileObservers);
Page.Checkbox.addObserver(controlId.TILE_NOISE_COLORED, callRecomputeNoiseTileObservers);

Page.FileControl.addDownloadObserver(controlId.IMAGE_DOWNLOAD, () => {
    callObservers(Parameters.imageDownloadObservers);
});

export {
    ETileMode,
    Parameters,
};
