import "./page-interface-generated";


/* === IDs ============================================================ */
const controlId = {
    IMAGE_DOWNLOAD: "image-download-id",
};

type Observer = () => unknown;

function callObservers(observers: Observer[]): void {
    for (const observer of observers) {
        observer();
    }
}

abstract class Parameters {
    public static imageDownloadObservers: Observer[] = [];
}

Page.FileControl.addDownloadObserver(controlId.IMAGE_DOWNLOAD, () => {
    callObservers(Parameters.imageDownloadObservers);
});

export {
    Parameters,
};
