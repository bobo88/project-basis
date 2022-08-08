<script lang="tsx">
import {
    h,
    computed,
    ref,
    defineComponent,
    PropType,
    VNode,
    SetupContext,
    resolveComponent,
} from 'vue'
import { useAppStore } from '@/store/modules/app'
import { TzForm, TzFormItem } from 'tz-ui'

export default defineComponent({
    name: 'TzFormCard',
    inheritAttrs: false,
    props: {
        config: {
            type: Array as PropType<Array<TzFormCard.Item>>,
            default: () => [],
        },
        col: {
            type: [String, Number],
            default: '',
        }
    },
    emits: ['update:modelValue', 'update:label'],
    setup(props, ctx) {
        interface CtxAttrs extends SetupContext<('update:modelValue' | 'update:label')[]> {
            attrs: {
                model: Record<string, any>;
                class?: string;
            };
        }
        const { attrs, slots, expose } = ctx as CtxAttrs;
        const appStore = useAppStore();
        const ruleForm = attrs.model || {};
        const compRef = ref<Nullable<HTMLElement>>(null);

        // 生成form-item
        const renderFormItem = (item: TzFormCard.Item) => {
            if (item?.show?.() === false) {
                return;
            }
            const attr: Partial<TzFormCard.Item> = {
                label: item.label,
            };
            if (item.labelWidth) {
                attr.labelWidth = item.labelWidth
            }
            // 列布局，默认一列，有值则为列宽*col
            if (item.col) {
                attr.col = item.col;
            }
            if (item.rules) {
                attr.rules = item.rules;
            }

            // children 渲染
            if (item?.children?.length) {
                const childItems = item.children.reduce((prev, jItem) => {
                    if (jItem.show ? jItem.show() : true) {
                        prev.push(renderFormItem(jItem)!);
                    }
                    return prev;
                }, [] as VNode[])
                return h(TzFormItem, { labelWidth: '0px', ...attr }, () => childItems)
            }
            const cAttrs = item.attrs || {};
            // todo
        }
    }
})
</script>