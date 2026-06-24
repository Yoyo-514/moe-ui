import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

const root = resolve(__dirname, '..')

export default defineConfig({
  root: __dirname,
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@moe-ui/components': resolve(root, 'packages/components/index.ts'),
      '@moe-ui/hooks': resolve(root, 'packages/hooks/index.ts'),
      '@moe-ui/locale': resolve(root, 'packages/locale/index.ts'),
      '@moe-ui/theme': resolve(root, 'packages/theme'),
      '@moe-ui/utils': resolve(root, 'packages/utils/index.ts'),
    },
  },
  define: {
    PROD: JSON.stringify(false),
    DEV: JSON.stringify(false),
    TEST: JSON.stringify(true),
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
