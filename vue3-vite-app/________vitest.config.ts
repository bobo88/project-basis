import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
    globals: true,
    transformMode: {
        web: [/\.[jt]sx$/]
    },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    deps: {
      inline: []
    }
  }
})

// export default {}
