import vue from '@vitejs/plugin-vue'
import { hooksPlugin as hooks } from '@moe-ui-private/vite-plugins'
import { resolve } from 'node:path'
import { defineConfig, type UserConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'
import { getBuildDefine, pkgRoot } from './utils'
import terser from '@rollup/plugin-terser'

const styleEntry = resolve(pkgRoot, 'dist/index.css')
const umdStyleEntry = resolve(pkgRoot, 'dist/umd/index.css')

const cssOptions = {
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler',
    },
  },
} as unknown as UserConfig['css']

export default defineConfig({
  plugins: [
    vue(),
    compression({
      include: /\.(?:js|css)$/,
      threshold: 1024,
      algorithms: ['gzip', 'brotliCompress'],
      deleteOriginalAssets: false,
      skipIfLargerOrEqual: true,
    }),
    hooks({
      rmFiles: ['./dist/umd', styleEntry],
      cpFiles: [{ from: umdStyleEntry, to: styleEntry }],
    }),
    terser({
      compress: {
        drop_console: ['log'],
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@moe-ui/components': resolve(pkgRoot, '../components/index.ts'),
      '@moe-ui/utils': resolve(pkgRoot, '../utils/index.ts'),
      '@moe-ui/hooks': resolve(pkgRoot, '../hooks/index.ts'),
      '@moe-ui/theme': resolve(pkgRoot, '../theme'),
    },
  },
  define: getBuildDefine(),
  css: cssOptions,
  build: {
    outDir: resolve(pkgRoot, 'dist/umd'),
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(pkgRoot, 'index.ts'),
      name: 'MoeUI',
      formats: ['umd'],
      fileName: () => 'index.js',
      cssFileName: 'index',
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
