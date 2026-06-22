import type { Theme } from 'vitepress'
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import Teek from 'vitepress-theme-teek'
import MoeCuteUI from 'moe-cute-ui'
import '@vitepress-demo-preview/component/dist/style.css'
import 'vitepress-theme-teek/index.css'
import 'moe-cute-ui/style.css'
import './style.css'

export default {
  extends: Teek,
  enhanceApp({ app }) {
    app.use(MoeCuteUI)
    app.component('DemoPreview', ElementPlusContainer)
  },
} satisfies Theme
