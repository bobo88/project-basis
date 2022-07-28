'use strict';
import clear from 'rollup-plugin-clear';
import ts from "rollup-plugin-typescript2";
import resolve from 'rollup-plugin-node-resolve';
// import resolve from "@rollup/plugin-node-resolve";
import commonjs from 'rollup-plugin-commonjs'

export default {
    input: 'src/main.ts',
    // input: [
    //     'src/main.ts',
    //     'src/soft.ts'
    // ],
    output: {
        file: 'dist/cloudgame_sdk.js',
        // rollup支持的打包文件的格式有amd, cjs, es\esm, iife, umd
        format: 'umd',
        name: 'cloudgame_sdk'
        // 当入口文件有export时，'umd'格式必须指定name
        // 这样，在通过<script>标签引入时，才能通过name访问到export的内容。
        
        // dir: 'dist',
        // format: 'amd', //打包文件格式
    },
    plugins: [
        clear({targets: ['dist']}), //清除dist目录
        resolve(
            // {
            //     // 将自定义选项传递给解析插件
            //     customResolveOptions: {
            //     moduleDirectory: 'node_modules'
            //     }
            // }
        ),
        ts({
            useTsconfigDeclarationDir: true
        }),
        commonjs({
            include: 'node_modules/**'
        }),
    ],
    // 指出应将哪些模块视为外部模块
    // external: ["jmuxer"], 
};
