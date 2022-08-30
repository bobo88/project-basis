import path from 'path';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import viteCompression from 'vite-plugin-compression'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'

export const useplugins = (env: Record<string, string>, mode: string) => {
    const isProd = env.VITE_NODE_ENV === 'production';
    const plugins = [
        vue({
            reactivityTransform: true,
        }),
        vueJsx(),
        AutoImport({
            imports: [
                {
                    '@/utils/storage': [
                        ['*', '$tzStore']
                    ],
                    'tz-ui': [
                        ['TzMessage', '$TzMessage'],
                        ['TzMessageBox', '$TzMsgBox'],
                    ],
                    '@/vhooks/useUt': [
                        ['EnumUt', '$TzUt'],
                    ],
                    dayjs: [
                        ['default', 'dayjs']
                    ],
                },
            ],
            dts: 'types/auto-import.d.ts',
            eslintrc: {
                enabled: true,
            },
        }),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/icon/svg')],
            symbolId: 'tz-icon-[dir]-[name]',
        }),
        // style 按需导入
        createStyleImportPlugin({
            resolves: [
                // VxeTableResolve(),
            ]
        }),

        legacy({
            targets: ['Chrome 63'],
            modernPolyfills: [
                'es.promise.finally',
                'es.array.at',
                'es.array.flat',
                'es.global-this',
                'es/string/at',
                'es/map',
                'es/set',
            ],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        }),
    ];

    if (isProd) {
        // compression 压缩
        plugins.push(viteCompression());
    }
    if (mode === 'report') {
        plugins.push(visualizer({ filename: 'report.html' }));
    }

    return plugins;
};
