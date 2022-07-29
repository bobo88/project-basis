declare global {
    interface CloudGameSdk {
        version: String,
        sdkInit: Function,
        [props: string]: any,
    }

    interface ConfigType {
        // ws: any,
        [props: string]: any
    }
    
    interface ExtraDataType {
        [props: string]: any
    }
}

export { }