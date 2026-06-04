import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const libRoot = __dirname

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: resolve(libRoot, 'tsconfig.json'),
      outDirs: resolve(libRoot, 'dist'),
      entryRoot: libRoot,
      exclude: [resolve(libRoot, 'vite.config.ts')],
    }),
  ],
  build: {
    outDir: resolve(libRoot, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(libRoot, 'index.ts'),
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    rollupOptions: {
      external: ['vite', 'lodash-es', 'shelljs'],
    },
  },
})
