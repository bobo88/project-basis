import path from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import { useplugins, useDevServer, useBuild } from './build';
export default({ mode }: ConfigEnv) => {
    const env = loadEnv(mode, process.cwd());
    return defineConfig({
        base: env.VITE_PUBLIC_PATH,
        resolve: {
            extensions: ['.jsx', '.js', '.json', '.ts', '.tsx'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '~/': path.resolve(__dirname, 'src/'),
            }
        },
        optimzeDeps: {
            include: [
                'pinia',
                '@vueuse/core',
                'vue',
                'vue-router',
                'dayjs',
                'vxe-table/lib/locale/lang/zh-CN',
                'vxe-table/lib/locale/lang/en-US'
            ]
        },
        build: useBuild(),
        plugins: useplugins(env, mode),
        server: useDevServer(env, mode)
    })
}