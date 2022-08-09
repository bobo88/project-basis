import { App } from 'vue'
import TzFormCard from './index.vue'
import { useFormReadonly, useConfToForm } from './useFormCard'

function install(app: App) {
    if (TzFormCard.installed) return;
    app.component(TzFormCard.name, TzFormCard)
}

TzFormCard.install = install;

export { TzFormCard, useFormReadonly, useConfToForm }

export default {
    install
}