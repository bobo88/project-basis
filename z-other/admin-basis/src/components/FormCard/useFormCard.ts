import { isProxy, isRef, reactive } from 'vue'
import { TzFormCard } from './types'

/**
 * 设置form只读或者可读
 *todo
 */
export const useFormReadonly = (formConf: Array<TzFormCard.Item>, disabled: boolean = true) => {
    formConf.forEach((item) => {
        try {
            if (item.attrs) {
                item.attrs.disabled = disabled;
            } else {
                item.attrs = reactive({ disabled: disabled})
            }
        } catch (err) {

        }
    })
};

/**
 * 表单配置成form表单对象
 */
export const useConfToForm = <T extends Object>(config: Array<TzFormCard.Item>, form = {} as T) => {
    config.forEach((item) => {
        if (item.prop) {
            if (item.prop instanceof Array) {
                item.prop.forEach((i) => {
                    form[i[0]] = item.value || '';
                });
            } else {
                form[item.prop] = item.value || '';
            }
        }
    });
    return form as T;
}



