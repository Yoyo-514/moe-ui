import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig, type UserConfig } from 'vite'
import { pkgRoot } from './utils'

const cssOptions = {
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler',
    },
  },
} as unknown as UserConfig['css']

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@moe-ui/components': resolve(pkgRoot, '../components/index.ts'),
      '@moe-ui/utils': resolve(pkgRoot, '../utils/index.ts'),
      '@moe-ui/theme': resolve(pkgRoot, '../theme'),
    },
  },
  css: cssOptions,
  build: {
    outDir: resolve(pkgRoot, 'dist/umd'),
    emptyOutDir: true,
    cssCodeSplit: true,
    lib: {
      entry: resolve(pkgRoot, 'index.ts'),
      name: 'MoeUI',
      formats: ['umd'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue', '@iconify/vue', 'lodash-es', '@popperjs/core', 'async-validator'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@iconify/vue': 'IconifyVue',
          'lodash-es': '_',
          '@popperjs/core': 'Popper',
          'async-validator': 'AsyncValidator',
        },
      },
    },
  },
})
