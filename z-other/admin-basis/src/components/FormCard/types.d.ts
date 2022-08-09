/// <reference types="vue" />

import { ComputedRef } from "vue";

declare module TzFormCard {
    interface rule extends Record<string, any> {
        required: boolean,
        message?: string | ComputedRef,
        trigger: 'blur' | 'change',
        validator?: (rule: string, value: string, callback: Function) => any
    }

    interface Attr extends Record<string, unknown> {
        disabled: boolean,
        maxLength: number,
        fetchSuggestions: (arg: any, cb: (arg: any) => any) => any
    }

    interface Item {
        label: string,
        component?: string,
        value?: string | number | boolean,
        prop: string | Array<Record<string, any>>,
        attrs?: Partial<Attr>,
        show?(): boolean,
        labelWidth?: number | string,
        col?: number,
        children?: Array<ITzFormItem>,
        slot?: string,
        render?(model: Record<string, any>): JSX.Element,
        rules?: Array<rule>
    }
}