// import button from './button.vue'
// import type { App, Plugin } from "vue"
// type SFCWithInstall<T> = T & Plugin
// const withInstall = <T>(comp: T) => {
//     (comp as SFCWithInstall<T>).install = (app: App)=>{
//         // 注册组件
//         app.component((comp as any).name, comp)
//     }
//     return comp as SFCWithInstall<T>
// }
// const Button = withInstall(button)

// export default Button



import { withInstall } from '@vic-ui/utils'
import Button from './button.vue'

export const ElButton = withInstall(Button)
export default ElButton

export * from './index'



// import { App } from 'vue'
// import TzDragTable from './index.vue'

// function install(app: App) {
//     if (TzDragTable.installed) return;
//     app.component(TzDragTable.name, TzDragTable)
// }

// TzDragTable.install = install;

// export { TzDragTable };

// export default {
//     install,
// }
