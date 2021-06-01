type LoadCallback = (success: boolean) => void;

interface ICachedSource {
    text: string;
    pending: boolean;
    failed: boolean;
    callbacks: LoadCallback[];
}

const cachedSources: { [id: string]: ICachedSource } = {};

/* Fetches asynchronously the shader source from server and stores it in cache. */
function loadSource(filename: string, callback: LoadCallback): void {
    function callAndClearCallbacks(cached: ICachedSource): void {
        for (const cachedCallback of cached.callbacks) {
            cachedCallback(!cached.failed);
        }

        cached.callbacks = [];
    }

    if (typeof cachedSources[filename] === "undefined") {
        cachedSources[filename] = {
            callbacks: [callback],
            failed: false,
            pending: true,
            text: null,
        };
        const cached = cachedSources[filename];

        let url = "./shaders/" + filename;
        if (typeof Page.version !== "undefined") {
            url += `?v=${Page.version}`;
        }
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                cached.pending = false;

                if (xhr.status === 200) {
                    cached.text = xhr.responseText;
                    cached.failed = false;
                } else {
                    console.error(`Cannot load '${filename}' shader source: ${xhr.statusText}`);
                    cached.failed = true;
                }

                callAndClearCallbacks(cached);
            }
        };
        xhr.onerror = () => {
            console.error(`Cannot load '${filename}' shader source: ${xhr.statusText}`);
            cached.pending = false;
            cached.failed = true;
            callAndClearCallbacks(cached);
        };

        xhr.send(null);
    } else {
        const cached = cachedSources[filename];

        if (cached.pending === true) {
            cached.callbacks.push(callback);
        } else {
            cached.callbacks = [callback];
            callAndClearCallbacks(cached);
        }
    }
}

function getSource(filename: string): string {
    return cachedSources[filename].text;
}

export {
    getSource,
    loadSource,
};
