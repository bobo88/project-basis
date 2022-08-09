import 'virtual:svg-icons-register';
import { App } from 'vue'
import SvgIcon from './SvgIcon.vue'
import './fonts/iconfont.js'
import './style.css'

export default {
    install(app: App) {
        app.component('SvgIcon', SvgIcon)
    }
}