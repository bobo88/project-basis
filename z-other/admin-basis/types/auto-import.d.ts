declare global {
    const $TzMessage: typeof import('tz-ui')['TzMessage']
    const $TzMsgBox: typeof import('tz-ui')['TzMessageBox']
    const $tzStore: typeof import('@/utils/storage')
    const $TzUt: typeof import('@/vhooks/useUt')['EnumUt']
    const dayjs: typeof import('dayjs')['default']
}

export { }