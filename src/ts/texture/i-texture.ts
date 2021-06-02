interface ITexture {
    id: WebGLTexture;
    width: number;
    height: number;
}

interface IAsyncTexture extends ITexture{
    loaded: boolean;
}

export {
    IAsyncTexture,
    ITexture,
};
