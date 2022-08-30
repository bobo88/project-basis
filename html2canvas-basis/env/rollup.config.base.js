'use strict';
import clear from 'rollup-plugin-clear';
import ts from "rollup-plugin-typescript2";
import resolve from 'rollup-plugin-node-resolve';
// import resolve from "@rollup/plugin-node-resolve";
import commonjs from 'rollup-plugin-commonjs';
// import json from '@rollup/plugin-json';
import { uglify } from 'rollup-plugin-uglify';
// import builtins from 'rollup-plugin-node-builtins';

export default {
    input: 'src/main.ts',
    // input: [
    //     'src/main.ts',
    //     'src/soft.ts'
    // ],
    output: {
        globals: {
            'jquery': '$',
            'stream': 'stream',
        },
        file: 'dist/cloudgame_sdk.js',
        // rollup支持的打包文件的格式有amd, cjs, es\esm, iife, umd
        format: 'umd',
        name: 'cloudgame_sdk'
        // 当入口文件有export时，'umd'格式必须指定name
        // 这样，在通过<script>标签引入时，才能通过name访问到export的内容。
        
        // dir: 'dist',
        // format: 'amd', //打包文件格式
    },
    // output: [
    //     { file: 'dist/vue.min.js', format: 'umd', name },
    //     { file: 'dist/vue.common.min.js', format: 'cjs', name, exports: 'auto' },
    //     { file: 'dist/vue.esm.min.js', format: 'es', name, exports: 'default' }
    // ],
    plugins: [
        clear({targets: ['dist']}), //清除dist目录
        // uglify(),
        // json({
        //     // 默认情况下将解析所有JSON文件,
        //     // 但您可以专门包含/排除文件
        //     include: 'node_modules/**',
        //     exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
      
        //     // 对于 tree-shaking, 属性将声明为
        //     // 变量, 使用 `var` 或者 `const`
        //     preferConst: true, // 默认是 false
      
        //     // 为生成的默认导出指定缩进 —
        //     // 默认为 '\t'
        //     indent: '  ',
      
        //     // 忽略缩进并生成最小的代码
        //     compact: true, // 默认是 false
      
        //     // 为JSON对象的每个属性生成一个命名导出
        //     namedExports: true // 默认是 true
        // }),
        // builtins(),
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
            include: 'node_modules/**',
        }),
       
    ],
    // 指出应将哪些模块视为外部模块
    // external: ["jmuxer"], 
    external: ['jquery'],
};
