// 命名没有明确规定，TS会自动寻找.d.ts文件
declare module '*.vue' {
    import type { DefineComponent } from "vue";
    const component:DefineComponent<{},{},any>
}
