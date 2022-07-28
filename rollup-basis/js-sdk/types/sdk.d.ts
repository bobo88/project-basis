declare global {
    interface CloudGameSdk {
        version: String,
        sdkInit: Function,
        [props: string]: any,
    }
}

export { }