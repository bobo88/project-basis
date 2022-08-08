export const useBuild = () => {
    return {
        target: 'es2015',
        outDir: 'dist',
        cssTarget: 'chrome63',
        brotliSize: false,
        chunkSizeWarningLimit: 2000,
        sourcemap: false,
        rollupOptions: {
            outpout: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        const arr = id.toString().split('node_modules/');
                        const chunkName = arr[arr.length - 1].split('/')[0];
                        switch (chunkName) {
                            case '@vue':
                            case '@vueuse':
                                return 'chunk-libs';
                            case 'tz-ui':
                                return 'chunk-tzui';
                            case 'vxe-table':
                            case 'xe-utils':
                                return 'chunk-table';
                            default:
                                return 'vendor'; 
                        }
                    }
                }
            },
        },
    };
};