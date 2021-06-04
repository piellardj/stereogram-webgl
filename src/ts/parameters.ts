import "./page-interface-generated";


/* === IDs ============================================================ */
const controlId = {
    TILE_MODE_TABS: "tile-mode-tabs-id",
    TILE_PRESET_SELECT: "tile-preset-select-id",
    TILE_NOISE_RESOLUTION: "tile-noise-resolution-range-id",
    TILE_NOISE_SQUARE: "tile-noise-square-checkbox-id",
    TILE_NOISE_COLORED: "tile-noise-colored-checkbox-id",
    SHOW_UV: "show-uv-checkbox-id",
    TILE_UPLOAD_BUTTON: "input-tile-upload-button",

    HEIGHTMAP_MODE_TABS: "heightmap-mode-tabs-id",
    HEIGHTMAP_PRESET_SELECT: "heightmap-preset-select-id",
    MODEL_PRESET_SELECT: "model-preset-select-id",
    DEPTH_RANGE: "depth-range-id",
    HEIGHTMAP_INVERT_CHECKBOX: "invert-heightmap-checkbox-id",
    SHOW_HEIGHTMAP: "show-heightmap-checkbox-id",
    HEIGHTMAP_UPLOAD_BUTTON: "input-heightmap-upload-button",

    SHOW_INDICATORS_CHECKBOX: "show-indicators-checkbox-id",
    IMAGE_DOWNLOAD: "image-download-id",
};

type Observer = () => unknown;
type ImageUploadObserver = (image: HTMLImageElement) => unknown;

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

enum EHeightmapMode {
    STILL = "still",
    MOVING = "moving",
}

abstract class Parameters {
    public static readonly tileUploadObservers: ImageUploadObserver[] = [];
    public static readonly redrawObservers: Observer[] = [];
    public static readonly recomputeNoiseTileObservers: Observer[] = [];

    public static readonly heightmapUploadObservers: ImageUploadObserver[] = [];

    public static readonly imageDownloadObservers: Observer[] = [];

    public static get tileMode(): ETileMode {
        return Page.Tabs.getValues(controlId.TILE_MODE_TABS)[0] as ETileMode;
    }
    public static get tilePreset(): string {
        return Page.Select.getValue(controlId.TILE_PRESET_SELECT);
    }
    public static get noiseTileResolution(): number {
        return Page.Range.getValue(controlId.TILE_NOISE_RESOLUTION);
    }
    public static get noiseTileSquare(): boolean {
        return Page.Checkbox.isChecked(controlId.TILE_NOISE_SQUARE);
    }
    public static get noiseTileColored(): boolean {
        return Page.Checkbox.isChecked(controlId.TILE_NOISE_COLORED);
    }
    public static get showUV(): boolean {
        return Page.Checkbox.isChecked(controlId.SHOW_UV);
    }

    public static get heightmapMode(): EHeightmapMode {
        return Page.Tabs.getValues(controlId.HEIGHTMAP_MODE_TABS)[0] as EHeightmapMode;
    }
    public static get heightmapPreset(): string {
        return Page.Select.getValue(controlId.HEIGHTMAP_PRESET_SELECT);
    }
    public static get modelId(): string {
        return Page.Select.getValue(controlId.MODEL_PRESET_SELECT);
    }
    public static get depth(): number {
        return Page.Range.getValue(controlId.DEPTH_RANGE);
    }
    public static get invertHeightmap(): boolean {
        return Page.Checkbox.isChecked(controlId.HEIGHTMAP_INVERT_CHECKBOX);
    }
    public static get showHeightmap(): boolean {
        return Page.Checkbox.isChecked(controlId.SHOW_HEIGHTMAP);
    }
}

function updateTileNoiseControlsVisibility(): void {
    const isTileNoiseMode = (Parameters.tileMode === ETileMode.NOISE);
    Page.Controls.setVisibility(controlId.TILE_NOISE_RESOLUTION, isTileNoiseMode);
    Page.Controls.setVisibility(controlId.TILE_NOISE_COLORED, isTileNoiseMode);
    Page.Controls.setVisibility(controlId.TILE_NOISE_SQUARE, isTileNoiseMode);
    Page.Controls.setVisibility(controlId.TILE_PRESET_SELECT, !isTileNoiseMode);
    Page.Controls.setVisibility(controlId.TILE_UPLOAD_BUTTON, !isTileNoiseMode);

    const isMovingMode = (Parameters.heightmapMode === EHeightmapMode.MOVING);
    Page.Controls.setVisibility(controlId.HEIGHTMAP_PRESET_SELECT, !isMovingMode);
    Page.Controls.setVisibility(controlId.HEIGHTMAP_UPLOAD_BUTTON, !isMovingMode);
    Page.Controls.setVisibility(controlId.MODEL_PRESET_SELECT, isMovingMode);
}

Page.Canvas.Observers.canvasResize.push(callRedrawObservers);

Page.Tabs.addObserver(controlId.TILE_MODE_TABS, () => {
    updateTileNoiseControlsVisibility();
    callRedrawObservers();
});
Page.Tabs.addObserver(controlId.HEIGHTMAP_MODE_TABS, () => {
    updateTileNoiseControlsVisibility();
    callRedrawObservers();
});
updateTileNoiseControlsVisibility();

function imageUploadObserver(observers: ImageUploadObserver[]): (filesList: FileList) => unknown {
    return (filesList: FileList) => {
        if (filesList.length === 1) {
            const reader = new FileReader();
            reader.onload = () => {
                const image = new Image();
                image.addEventListener("load", () => {
                    for (const observer of observers) {
                        observer(image);
                    }
                    callRedrawObservers();
                });
                image.src = reader.result as string;
            };
            reader.readAsDataURL(filesList[0]);
        }
    };
}

Page.FileControl.addUploadObserver(controlId.TILE_UPLOAD_BUTTON, imageUploadObserver(Parameters.tileUploadObservers));
Page.FileControl.addUploadObserver(controlId.HEIGHTMAP_UPLOAD_BUTTON, imageUploadObserver(Parameters.heightmapUploadObservers));

Page.Tabs.addObserver(controlId.HEIGHTMAP_MODE_TABS, callRedrawObservers);
Page.Select.addObserver(controlId.HEIGHTMAP_PRESET_SELECT, callRedrawObservers);
Page.Range.addObserver(controlId.DEPTH_RANGE, callRedrawObservers);
Page.Checkbox.addObserver(controlId.HEIGHTMAP_INVERT_CHECKBOX, callRedrawObservers);
Page.Checkbox.addObserver(controlId.SHOW_HEIGHTMAP, callRedrawObservers);
Page.Checkbox.addObserver(controlId.SHOW_UV, callRedrawObservers);

Page.Range.addObserver(controlId.TILE_NOISE_RESOLUTION, callRecomputeNoiseTileObservers);
Page.Checkbox.addObserver(controlId.TILE_NOISE_SQUARE, callRecomputeNoiseTileObservers);
Page.Checkbox.addObserver(controlId.TILE_NOISE_COLORED, callRecomputeNoiseTileObservers);

Page.Select.addObserver(controlId.TILE_PRESET_SELECT, callRedrawObservers);

Page.FileControl.addDownloadObserver(controlId.IMAGE_DOWNLOAD, () => {
    callObservers(Parameters.imageDownloadObservers);
});

function updateIndicatorsVisibility(): void {
    Page.Canvas.setIndicatorsVisibility(Page.Checkbox.isChecked(controlId.SHOW_INDICATORS_CHECKBOX));
}
Page.Checkbox.addObserver(controlId.SHOW_INDICATORS_CHECKBOX, updateIndicatorsVisibility);
updateIndicatorsVisibility();

export {
    EHeightmapMode,
    ETileMode,
    Parameters,
};
