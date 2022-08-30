declare global {
    interface html2canvas_sdk {
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