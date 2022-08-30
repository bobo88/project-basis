declare global {
    declare interface Number {
        plus(arg: number | string, acc?: number) : Number,
        minus(arg: number | string, acc?: number): Number,
        times(arg: number | string, acc?: number): Number,
        div(arg: number | string, acc?: number): Number,
        toFixedZero(acc?: number): string,
    }
}

export { }