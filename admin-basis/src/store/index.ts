import type { App } from 'vue'
import { createPinia } from 'pinia'

const store = createPinia();

export function useStore(app: App<Element>) {
    app.use(store)
}

export { store }