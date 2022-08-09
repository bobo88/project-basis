declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;
declare type Recordable<T = any> = Record<string, T>;
type Writable<T> = {
    -readonly [P in keyof T]: T[P]
};

declare type Valueof<T> = T[keyof T]
declare interface Window {
    bridge: Record<string, any>
}

interface Screen { deviceXDPI?: number, deviceYDPI?: number }

interface Navigator {
    msSaveOrOpenBlob?: Blob,
    msSaveBlob?: Function
}