import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      outDirs: 'dist',
      include: ['index.ts', 'use-*/index.ts'],
      exclude: ['dist/**', 'node_modules/**', '__test__/**', '**/*.test.ts', 'vite.config.ts'],
    }),
  ],
  build: {
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'hooks',
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    rollupOptions: {
      external: ['vue', 'lodash-es'],
      output: {
        entryFileNames: '[name].mjs',
        preserveModules: true,
        preserveModulesRoot: __dirname,
      },
    },
  },
})
