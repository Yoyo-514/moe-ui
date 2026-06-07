import vue from '@vitejs/plugin-vue'
import { hooksPlugin as hooks } from '@moe-ui-private/vite-plugins'
import { resolve } from 'node:path'
import { defineConfig, type UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { getBuildDefine, getPackageDirChunkName, pkgRoot } from './utils'

const componentsDir = resolve(pkgRoot, '../components')
const esDir = resolve(pkgRoot, 'dist/es')
const esThemeDir = resolve(esDir, 'theme')
const themeDir = resolve(pkgRoot, 'dist/theme')

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
    dts({
      tsconfigPath: resolve(pkgRoot, 'tsconfig.build.json'),
      outDirs: resolve(pkgRoot, 'dist/types'),
      entryRoot: resolve(pkgRoot, '..'),
      include: [
        resolve(pkgRoot, 'index.ts'),
        resolve(pkgRoot, 'components.ts'),
        resolve(pkgRoot, 'style.d.ts'),
        resolve(pkgRoot, '../../env.d.ts'),
        resolve(pkgRoot, '../components/**/*.ts'),
        resolve(pkgRoot, '../components/**/*.vue'),
        resolve(pkgRoot, '../utils/**/*.ts'),
        resolve(pkgRoot, '../hooks/**/*.ts'),
      ],
      exclude: [
        resolve(pkgRoot, '../components/**/*.test.ts'),
        resolve(pkgRoot, '../components/**/*.test.tsx'),
        resolve(pkgRoot, '../components/vitest.config.ts'),
        resolve(pkgRoot, '../utils/**/__test__/**'),
        resolve(pkgRoot, '../utils/**/*.test.ts'),
        resolve(pkgRoot, '../hooks/**/__test__/**'),
        resolve(pkgRoot, '../hooks/**/*.test.ts'),
        resolve(pkgRoot, '../hooks/vite.config.ts'),
      ],
    }),
    hooks({
      rmFiles: [esDir, themeDir, './dist/types'],
      mvFiles: [{ from: esThemeDir, to: themeDir }],
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
    outDir: esDir,
    emptyOutDir: true,
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: resolve(pkgRoot, 'index.ts'),
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    rollupOptions: {
      external: ['vue', '@iconify/vue', 'lodash-es', '@popperjs/core', 'async-validator'],
      output: {
        entryFileNames: 'index.mjs',
        chunkFileNames: 'chunks/[name].mjs',
        assetFileNames(assetInfo) {
          const fileName = assetInfo.names[0] ?? '[name][extname]'

          if (fileName.endsWith('.css')) {
            return 'theme/[name][extname]'
          }

          return '[name][extname]'
        },
        manualChunks(id) {
          if (id.includes('/packages/hooks')) return 'hooks'
          if (id.includes('/packages/utils') || id.includes('plugin-vue:export-helper')) {
            return 'utils'
          }

          return getPackageDirChunkName(id, componentsDir)
        },
      },
    },
  },
})
