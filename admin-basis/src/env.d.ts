/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
    import { DefineComponent, HTMLAttributes } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'vue' {
    interface plugin {
        install?(app: AppendMode, options?: any): void;
    }
    interface App<HostElement = any> {
        [INSTALLED_KEY]?: boolean;
        use(plugin: plugin, ...options: any[]): this
    }
}

export interface GlobalComponents {
    Component: (props: {  is: Component | string }) => void
}

interface ImportMetaEnv {
    /* 应用标题 */
    readonly VITE_APP_TITLE: string
    /* 是否固定header */
    readonly VITE_APP_FIXED_HEADER: boolean
    /* 隐藏菜单 */
    readonly VITE_APP_HIDDEN_SIDE_BAR: boolean
    /* 显示左上角logo */
    readonly VITE_APP_SHOW_LOGO: boolean
    /* 编译环境 */
    readonly VITE_NODE_ENV: string
    readonly VITE_PORT: number
    readonly VITE_PROXY: Record<string, string>
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}