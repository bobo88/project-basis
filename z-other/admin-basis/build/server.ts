import { ServerOptions } from 'vite'

export const useDevServer = (env: Record<string, any>, mode: string) => {
    const isProd = env.VITE_NODE_ENV === 'production';
    if (isProd) return undefined;
    const option: ServerOptions = {
        host: '0.0.0.0',
        port: env.VITE_PORT,
        proxy: {},
    };

    const proxyConf = env.VITE_PROXY ? JSON.parse(env.VITE_PROXY) : {};

    Object.keys(proxyConf).forEach(key => {
        const proxy = {
            target: proxyConf[key],
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
        };
        option.proxy[key] = proxy;
    });

    return option;
}