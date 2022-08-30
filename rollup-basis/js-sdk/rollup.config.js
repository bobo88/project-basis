'use strict';
import clear from 'rollup-plugin-clear';
import ts from "rollup-plugin-typescript2";
// import resolve from 'rollup-plugin-node-resolve';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default {
    input: 'src/main.ts',
    output: {
        globals: {
            'websocket': 'websocket',
            'jquery': '$',
            'stream': 'stream',
            // 'web-worker': 'web-worker',
        },
        file: 'dist/cloudgame_sdk.js',
        // rollup支持的打包文件的格式有amd, cjs, es\esm, iife, umd
        format: 'umd',
        name: 'cloudgame_sdk'
        // 当入口文件有export时，'umd'格式必须指定name
        // 这样，在通过<script>标签引入时，才能通过name访问到export的内容。
    },
    plugins: [
        clear({targets: ['dist/cloudgame_sdk.js']}), //清除dist目录
        uglify({
            compress:{
                drop_debugger: true,
                // drop_console: true,
                pure_funcs: [ 'console.log' ]
            }
        }),
        resolve({ extensions }),
        commonjs({
            include: 'node_modules/**',
        }),
        webWorkerLoader(),
        ts({
            useTsconfigDeclarationDir: true
        }),
    ],
    // 指出应将哪些模块视为外部模块
    // external: ["jmuxer"], 
    // external: ['jquery', 'websocket'],
};
