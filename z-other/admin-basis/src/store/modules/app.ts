import { defineStore } from 'pinia'
import { store } from '..'
import { AppStore, DEVIDE_TYPE, SearchCompStore, Sidebar } from './types'

export const useAppStore = defineStore({
    id: 'tz-app',
    state: (): AppStore => ({
        siderbar: {
            opened: true,
            withoutAnimation: false,
            isClickHamburger: false,
        },
        device: DEVIDE_TYPE.PC,
        innerWidth: 0,
        innerHeight: 0,
        searchCompHeight: {
            path: '',
            value: 0
        },
    }),
    getters: {
        getSidebarStatus(): boolean {
            return !!this.siderbar?.opened;
        },
        getDevice(): DEVIDE_TYPE {
            return this.device;
        },
    },
    actions: {
        async toggleSideBar (sidebar: Nullable<Sidebar>) {
            const { withoutAnimation } = sidebar || {};
            this.siderbar.opened = !this.siderbar.opened;
            this.sidebar.withoutAnimation = withoutAnimation || false;
        },

        closeSideBar(sidebar?: Nullable<Sidebar>) {
            const { withoutAnimation} = sidebar || {};
            this.sidebar.opened = false;
            this.sidebar.withoutAnimation = withoutAnimation || false;
        },

        toggleDevice(device: DEVIDE_TYPE) {
            this.device = device;
        },

        setInnerWH({ innerWidth, innerHeight }: Record<string, number>) {
            this.innerWidth = innerWidth;
            this.innerHeight = innerHeight;
        },
        // 设置搜索form的高度，控制table
        setSearchCompHeight(searchStore: SearchCompStore) {
            this.searchCompHeight[searchStore.path] = searchStore.value;
        }
    },
});

export function useAppStoreHook() {
    return useAppStore(store)
}