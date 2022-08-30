import { App, Plugin } from 'vue'
export * from '@/components/DragTable'
export * from '@/components/TzTable'
export * from '@/components/SearchForm'
export * from '@/components/FormCard'
export * from '@/components/TzStatus'

const modules = import.meta.globEager('./*/index.ts')
const install = (app: App) => {
    for (const path in modules) {
        modules[path].default.install?.(app);
    }
};
export default { install } as Plugin
