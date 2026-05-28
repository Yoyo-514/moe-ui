import vue from '@vitejs/plugin-vue'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { sortBy } from 'lodash-es'
import { defineConfig, type Plugin, type UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { getPackageDirChunkName, pkgRoot } from './utils'

const componentsDir = resolve(pkgRoot, '../components')
const esDir = resolve(pkgRoot, 'dist/es')
const styleEntry = resolve(pkgRoot, 'dist/index.css')
const cssOptions = {
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler',
    },
  },
} as unknown as UserConfig['css']

function generateStyleEntry(): Plugin {
  return {
    name: 'moe-ui:generate-style-entry',
    apply: 'build',
    closeBundle() {
      if (!existsSync(esDir)) {
        throw new Error(`Cannot find generated style directory: ${esDir}`)
      }

      const cssFiles = sortBy(
        readdirSync(esDir).filter((file) => file.endsWith('.css')),
        (file) => (file === 'index.css' ? '' : file)
      )

      if (cssFiles.length === 0) {
        throw new Error(`Cannot find generated style files in: ${esDir}`)
      }

      const content = cssFiles
        .map((file) => `/* ${file} */\n${readFileSync(resolve(esDir, file), 'utf-8')}`)
        .join('\n\n')

      mkdirSync(dirname(styleEntry), { recursive: true })
      writeFileSync(styleEntry, content)
    },
  }
}

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
        resolve(pkgRoot, '../components/**/*.ts'),
        resolve(pkgRoot, '../components/**/*.vue'),
        resolve(pkgRoot, '../utils/**/*.ts'),
      ],
      exclude: [
        resolve(pkgRoot, '../components/**/*.test.ts'),
        resolve(pkgRoot, '../components/**/*.test.tsx'),
        resolve(pkgRoot, '../components/vitest.config.ts'),
      ],
    }),
    generateStyleEntry(),
  ],
  resolve: {
    alias: {
      '@moe-ui/components': resolve(pkgRoot, '../components/index.ts'),
      '@moe-ui/utils': resolve(pkgRoot, '../utils/index.ts'),
      '@moe-ui/theme': resolve(pkgRoot, '../theme'),
    },
  },
  css: cssOptions,
  build: {
    outDir: esDir,
    emptyOutDir: true,
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
        assetFileNames: '[name][extname]',
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
