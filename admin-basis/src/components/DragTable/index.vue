<template>
    <div class="tz-drag-table">
        <div class="tz-table-menu">
            <tz-popover placement="bottom-end" :width="poperWidth" trigger="click">
                <template #reference>
                    <tz-button plain class="btn-setting" icon="el-icon-dingzhi">
                        列定制
                    </tz-button>
                </template>
                <template v-for="item in tCols">
                    <tz-checkbox
                        v-if="item.show && !item.fixed"
                        :key="item.prop"
                        v-model="item.visible"
                        class="tz-check-box"
                        @change="changeCheckBox(item)"
                    >
                        {{ item.label }}
                    </tz-checkbox>
                </template>
            </tz-popover>
        </div>
        <tz-table
            ref="dragTableRef"
            v-bind="{ dragType: 'col', ...$attrs }"
            :cols="tCols"
            :adaptive="true"
            @resizable-change="handldeResizableChange"
        >
            <template v-for="key in Object.keys($slots)" #[key]="scope">
                <slot :row="scope.row" :index="scope.$index" :name="key" />
            </template>
        </tz-table>
    </div>
</template>

<script lang="ts">
import { computed, ref, nextTick, defineComponent, PropType, watch } from 'vue'
import TzTable from '@/components/TzTable/index.vue'
import { useRoute } from 'vue-router'
import { useTzDb } from '@/plugins'

export default {
    name: 'TzDragTable',
    components: {
        TzTable,
    },
    inheritAttrs: false,
    props: {
        poperWidth: {
            type: Number,
            default: 210,
        },
        cols: {
            type: Array as PropType<TzTable.Col[]>,
            default: () => [],
        },
        cached: {
            type: Boolean,
            default: true,
        }
    },
    setup(props) {
        const  route = useRoute();

        type TableType = Nullable<InstanceType<typeof TzTable>>;
        const dragTableRef = ref<TableType>(null);
        const tableEl = computed(() => dragTableRef.value?.tableEl);
        const tCols = ref<Array<TzTable.Col>>([]);
        const path = `${route.path}?ut=${route.query.ut}`;
        const tzDb = useTzDb();

        const cacheColMap = {};
        const getDbCols = async () => {
            try {
                const res = await tzDb.tableCol.where({ path: { '=': path }}).find();
                res.forEach((col) => {
                    cacheColMap[col.prop] = col;
                });
            } catch (error) {
                console.log(error)
            }
            return cacheColMap
        };

        const intiCols = async () => {
            await getDbCols();
            tCols.value = props.cols.map((col) => {
                // 判断是否有缓存数据
                const cacheCol = cacheColMap[col.prop];
                if (cacheCol) {
                    col.show = cacheCol.show ?? true; // ?? 空值运算符 （ES2020引入）
                    col.visible = cacheCol.visible ?? true;
                    col.width = cacheCol.width;
                    col.id = cacheCol.id;
                } else {
                    col.visible = col.visible ?? true;
                    // 如果数据库里面没有就保存
                    const { show, visible, width, prop, label } = col;
                    const _col = {
                        show,
                        visible,
                        width,
                        prop,
                        label,
                        path,
                    } as TzTable.Col;
                    cacheColMap[col.prop] = _col;
                    tzDb.isOpen && 
                        tzDb.tableCol.insert(_col).then((id) => {
                            cacheColMap[col.prop].id = id;
                        })
                }
                return col;
            });
        };
        intiCols();

        watch(
            () => props.cols,
            () => {
                intiCols();
            }
        );

        const changeCheckBox = (col) => {
            let { id, show, visible, width, prop, label } = col;
            const _col = { show, visible, width, prop, label, path } as TzTable.Col;
            id = id || cacheColMap[prop].id;
            // 有id就更新，没有就插入
            if (id) {
                _col.id = id;
                tzDb.tableCol.update(_col);
            } else {
                tzDb.tableCol.insert(_col).then((id) => {
                    cacheColMap[col.prop].id = id;
                });
            }
            nextTick(() => {
                tableEl.value?.refreshColumn();
            });
        };

        const handldeResizableChange = ({ column, cell }) => {
            const { field } = column;
            const cacheCol = cacheColMap[field];
            cacheCol.width = cell.offsetWidth;
            if (cacheCol.id) {
                tzDb.tableCol.update(cacheCol);
                return;
            }
            tzDb.tableCol.insert(cacheCol)
        };

        return {
            tCols,
            dragTableRef,
            tableEl,
            changeCheckBox,
            handldeResizableChange,
        };
    },
};
</script>

<style lang="scss" scoped>
    // .....
</style>
