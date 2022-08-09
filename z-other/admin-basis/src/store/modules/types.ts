/**
 * Enum 布局类型
 */
export enum DEVIDE_TYPE {
    /**pc端布局 */
    PC = 'pc',
    /**移动端布局 */
    MOBILE = 'mobile'
}

export interface tagviewStore {
    cacheViews: string[],
    tagViews: TzRouteRaw[]
}

export interface Sidebar extends Record<string, any> {
    opened?: boolean,
    withoutAnimation?: boolean,
    isClickHamburger?: boolean
}

export interface SearchCompStore {
    path: string,
    value: number
}

export interface AppStore {
    sidebar: Sidebar,
    device: DEVIDE_TYPE,
    innerWidth: number,
    innerHeight: number,
    searchCompHeight: SearchCompStore
}