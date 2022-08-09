import { App } from 'vue';
import enterFocus from './enterFocus';
export default {
    install (app: App<Element>) {
        // 自定义指令
        // Object.keys(directives).forEach((key) => {
        //     app.directive(key, directives[key]);
        // })
        app.directive('enterfocus', enterFocus)
    }
}