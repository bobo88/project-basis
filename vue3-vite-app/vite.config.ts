/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import legacy from "@vitejs/plugin-legacy";
// import Components from "unplugin-vue-components/vite";
// import { VantResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    // ...
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // exclude: ['**/**/**.css'],
    deps: {
      inline: []
    }
  },
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    // Components({
    //   resolvers: [VantResolver()],
    // }),
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
