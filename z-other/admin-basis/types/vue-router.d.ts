import { Component } from 'vue'
import { TzRouteRaw, RouteRecordName, NavigationGuardWithThis } from 'vue-router'
declare global {
    interface TzRouteRaw extends TzRouteRaw {
        path: string,
        redirect?: string,
        name?: string | RouteRecordName,
        component?: Component,
        children?: TzRouteRaw[],
        alias?: string | string[],
        beforeEnter?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[],
        meta?: Record<string, any> & {
            icon?: string,
            title?: string,
            keepAlive?: boolean,
        },
        fullPath?: string,
        hidden?: boolean,
        noShowingChildren?: boolean
    }
}

export { }