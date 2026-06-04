/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue() as PluginOption, vueJsx() as PluginOption],
  define: {
    PROD: JSON.stringify(false),
    DEV: JSON.stringify(false),
    TEST: JSON.stringify(true),
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
