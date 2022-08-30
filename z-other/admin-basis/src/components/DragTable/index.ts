import { App } from 'vue'
import TzDragTable from './index.vue'

function install(app: App) {
    if (TzDragTable.installed) return;
    app.component(TzDragTable.name, TzDragTable)
}

TzDragTable.install = install;

export { TzDragTable };

export default {
    install,
}

