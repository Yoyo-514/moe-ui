/// <reference types="vitest" />

import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@moe-ui/components': resolve(__dirname, 'packages/components/index.ts'),
      '@moe-ui/hooks': resolve(__dirname, 'packages/hooks/index.ts'),
      '@moe-ui/test-utils': resolve(__dirname, 'packages/test-utils/index.ts'),
      '@moe-ui/theme': resolve(__dirname, 'packages/theme'),
      '@moe-ui/utils': resolve(__dirname, 'packages/utils/index.ts'),
    },
  },
  define: {
    PROD: JSON.stringify(false),
    DEV: JSON.stringify(false),
    TEST: JSON.stringify(true),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    coverage: {
      exclude: [
        '**/types.ts',
        '**/*.d.ts',
        '**/*.scss',
        '**/style/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
      ],
    },
  },
})
