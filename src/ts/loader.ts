import "./page-interface-generated";


const loadingObjects: { [id: string]: boolean } = {};

function registerLoadingObject(id: string): void {
    if (Object.keys(loadingObjects).length === 0) {
        Page.Canvas.showLoader(true);
    }
    loadingObjects[id] = false;
}

function registerLoadedObject(id: string): void {
    delete loadingObjects[id];

    if (Object.keys(loadingObjects).length === 0) {
        Page.Canvas.showLoader(false);
    }
}

export {
    registerLoadedObject,
    registerLoadingObject,
};

