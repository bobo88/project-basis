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
            if (Array.isArray(item.prop)) {
                attr.prop = item.prop.find((i) => i.length === 1)?.[0]
            } else {
                attr.prop = item.prop;
            }

            const cSlots = () => {
                // 驼峰转换
                const component = (item.component || '')
                    .replace(/-(\w)/g, (__, b) => b.toUpperCase())
                    .replace(/^(\w){1}/, (__, b) => b.toUpperCase());
                if (item.render) {
                    return item.render(attrs.model)
                }
                if( item.slot) {
                    return slots[item.slot]?.(ruleForm)
                }

                if(component === '') {
                    return (
                        <span class="text-ellipsis">
                            {attrs.model[item.prop as string]}
                        </span>
                    );
                }

                let compElseAttr = {} as any;
                if (Array.isArray(item.prop)) {
                    item.prop.forEach((i) => {
                        if (i.length === 1) {
                            compElseAttr.modelValue = attrs.model[i[0]];
                            compElseAttr['onUpdate:modelValue'] = (value: any) => {
                                attrs.model[i[0]] = value;
                            };
                        } else if (i.length === 2) {
                            compElseAttr[i[1]] = attrs.model[i[0]];
                            compElseAttr[`onUpdate:${i[1]}`] = (value: any) => {
                                attrs.model[i[0]] = value
                            };
                        }
                    });
                } else {
                    compElseAttr = {
                        modelValue: attrs.model[item.prop],
                        'onUpdate:modelValue': (value: any) => {
                            attrs.model[item.props as string] = value;
                        }
                    }
                }
                return h(resolveComponent(component), {
                    ...cAttrs,
                    ...compElseAttr
                });
            };

            return h(resolveComponent('TzFormItem'), { ...attr }, cSlots)
            // todo
        };

        const colNum = computed(() => {
            const w = appStore.innerWidth;
            let col = 0;
            if (w < 500) {
                col = 1;
            } else if (w < 900) {
                col = 2;
            } else if (w < 1300) {
                col = 3;
            } else {
                col = 4;
            }
            return col;
        });

        const methods = {};
        [
            'validate',
            'validateField',
            'scrollToField',
            'resetFields',
            'clearValidate',
        ].forEach((key) => {
            methods[key] = (...rest: any[]) => compRef.value?.[key](...rest)
        });
        expose({...methods});

        return () => 
            h (
                TzForm,
                {
                    labelWidth: '110px',
                    ...attrs,
                    class: `card-form tz-col-${props.col || colNum.value} ${
                        attrs.class || ''
                    }`,
                    ref: compRef,
                },
                props.config.length
                    ? () =>
                        props.config.map((item) => {
                            return renderFormItem(item)
                        })
                    : slots.default && slots.default()
            )
    }
});
</script>
<style lang="scss">
    
</style>