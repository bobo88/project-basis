import './variable.scss'
import 'xe-utils'
import { VXETable, Column, Colgroup, Table, Footer, Header, Tooltip } from 'vxe-table'
import type { App } from 'vue'

VXETable.setup({
    size: 'mini',
    version: 0,
    zIndex: 99,
    table: {
        autoResize: true,
        stripe: true,
        border: true,
        showHeaderOverflow: true,
        scrollX: {
            gt: 40
        },
        scrollY: {
            oSize: 5,
            gt: 100
        },
    },
    icon: {
        TABLE_SORT_ASC: 'el-icon-caret-top',
        TABLE_SORT_DESC: 'el-icon-caret-bottom',
        TABLE_TREE_LOADED: 'el-icon-loading',
    }
});

export function useTable(app: App<Element>) {
    app.use(Column).use(Colgroup).use(Table).use(Tooltip).use(Footer).use(Header)
}