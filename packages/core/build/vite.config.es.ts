import vue from '@vitejs/plugin-vue'
import { hooksPlugin as hooks } from '@moe-ui-private/vite-plugins'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { getBuildDefine, pkgRoot } from './utils'

const componentsDir = resolve(pkgRoot, '../components')
const esDir = resolve(pkgRoot, 'dist/es')

function normalizeDtsContent(content: string) {
  return content.replace(/(['"]\.\.\/(?:components|hooks|locale)\/index)\.ts(['"])/g, '$1$2')
}

const componentChunkGroupMap: Record<string, string> = {
  ButtonGroup: 'Button',
  CollapseItem: 'Collapse',
  DropdownItem: 'Dropdown',
  DropdownMenu: 'Dropdown',
  Option: 'Select',
}

const componentEntries = Object.fromEntries(
  [
    ...readFileSync(resolve(componentsDir, 'index.ts'), 'utf-8').matchAll(
      /export \* from '\.\/(.+)'/g
    ),
  ]
    .map(([, name]) => name)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => [`components/${name}/index`, resolve(componentsDir, name, 'index.ts')])
)

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: resolve(pkgRoot, 'tsconfig.build.json'),
      outDirs: resolve(pkgRoot, 'dist/types'),
      entryRoot: resolve(pkgRoot, '..'),
      include: [
        resolve(pkgRoot, 'index.ts'),
        resolve(pkgRoot, 'component.ts'),
        resolve(pkgRoot, 'defaults.ts'),
        resolve(pkgRoot, 'make-installer.ts'),
        resolve(pkgRoot, 'resolver.ts'),
        resolve(pkgRoot, 'style.d.ts'),
        resolve(pkgRoot, '../../env.d.ts'),
        resolve(pkgRoot, '../components/**/*.ts'),
        resolve(pkgRoot, '../components/**/*.vue'),
        resolve(pkgRoot, '../utils/**/*.ts'),
        resolve(pkgRoot, '../hooks/**/*.ts'),
        resolve(pkgRoot, '../locale/**/*.ts'),
        resolve(pkgRoot, '../constants/**/*.ts'),
      ],
      exclude: [
        resolve(pkgRoot, '../components/**/*.test.ts'),
        resolve(pkgRoot, '../components/**/*.test.tsx'),
        resolve(pkgRoot, '../utils/**/__test__/**'),
        resolve(pkgRoot, '../utils/**/*.test.ts'),
        resolve(pkgRoot, '../hooks/**/__test__/**'),
        resolve(pkgRoot, '../hooks/**/*.test.ts'),
        resolve(pkgRoot, '../hooks/vite.config.ts'),
      ],
      beforeWriteFile(filePath, content) {
        return {
          filePath,
          content: normalizeDtsContent(content),
        }
      },
    }),
    hooks({
      rmFiles: [esDir, './dist/types'],
    }),
  ],
  resolve: {
    alias: {
      '@moe-ui/components': resolve(pkgRoot, '../components/index.ts'),
      '@moe-ui/constants': resolve(pkgRoot, '../constants/index.ts'),
      '@moe-ui/utils': resolve(pkgRoot, '../utils/index.ts'),
      '@moe-ui/hooks': resolve(pkgRoot, '../hooks/index.ts'),
      '@moe-ui/locale': resolve(pkgRoot, '../locale/index.ts'),
      '@moe-ui/theme': resolve(pkgRoot, '../theme'),
    },
  },
  define: getBuildDefine(),
  build: {
    outDir: esDir,
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: {
        index: resolve(pkgRoot, 'index.ts'),
        resolver: resolve(pkgRoot, 'resolver.ts'),
        ...componentEntries,
      },
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      external: ['vue', '@iconify/vue', 'lodash-es', '@popperjs/core', 'async-validator'],
      output: {
        entryFileNames: '[name].mjs',
        chunkFileNames(chunkInfo) {
          const name = chunkInfo.name

          if (/^[A-Z]/.test(name)) {
            return `components/${componentChunkGroupMap[name] ?? name}/src/${name}.mjs`
          }

          return 'shared/[name].mjs'
        },
        assetFileNames: '[name][extname]',
      },
    },
  },
})
