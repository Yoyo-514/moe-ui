import { componentPreview, containerPreview } from '@vitepress-demo-preview/plugin'
import { defineConfig } from 'vitepress'
import { defineTeekConfig } from 'vitepress-theme-teek/config'

const teekConfig = defineTeekConfig({
  teekHome: false,
  vpHome: true,
  loading: false,
  sidebarTrigger: true,
  pageStyle: 'default',
  backTop: {
    enabled: true,
    content: 'progress',
  },
  articleUpdate: {
    enabled: false,
  },
  toComment: {
    enabled: false,
  },
  codeBlock: {
    enabled: true,
    collapseHeight: 640,
    overlay: true,
    overlayHeight: 360,
    langTextTransform: 'none',
  },
  themeEnhance: {
    enabled: true,
    position: 'top',
    layoutSwitch: {
      defaultDocMaxWidth: 92,
      defaultPageMaxWidth: 96,
      disableHelp: true,
      disableDocMaxWidthHelp: true,
      disablePageMaxWidthHelp: true,
    },
    themeColor: {
      defaultColorName: 'moe-sakura',
      defaultSpread: true,
      disableHelp: true,
      append: [
        {
          label: 'Moe Cute UI',
          tip: '柔和、清爽、轻二次元的专业组件库色板',
          options: [
            { label: '樱粉', value: 'moe-sakura', color: '#ff7eb6' },
            { label: '晴空', value: 'moe-sky', color: '#69b7ff' },
            { label: '藤紫', value: 'moe-violet', color: '#9b8cff' },
          ],
        },
      ],
    },
    spotlight: {
      defaultStyle: 'aside',
      defaultValue: true,
      disableHelp: true,
    },
  },
  footerInfo: {
    theme: {
      show: false,
    },
    copyright: {
      show: true,
      createYear: 2026,
      name: 'Moe Cute UI',
      suffix: 'Released under the ISC License.',
    },
  },
})

export default defineConfig({
  extends: teekConfig,
  title: 'Moe Cute UI',
  description: '轻二次元风格的 Vue 3 组件库',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' }],
  ],
  markdown: {
    config(md) {
      md.use(componentPreview, { clientOnly: true })
      md.use(containerPreview, { clientOnly: true })
    },
  },
  vite: {
    // define: {
    //   __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    // },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  themeConfig: {
    logo: '/favicon.ico',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/installation' },
      { text: '组件', link: '/components/button' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'ConfigProvider 全局配置', link: '/components/config-provider' },
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Icon 图标', link: '/components/icon' },
          ],
        },
        {
          text: '表单组件',
          collapsed: false,
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'Form 表单', link: '/components/form' },
          ],
        },
        {
          text: '反馈组件',
          collapsed: false,
          items: [
            { text: 'Alert 提示', link: '/components/alert' },
            { text: 'Message 消息', link: '/components/message' },
            { text: 'MessageBox 消息弹框', link: '/components/message-box' },
            { text: 'Loading 加载', link: '/components/loading' },
          ],
        },
        {
          text: '浮层组件',
          collapsed: false,
          items: [
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'Popconfirm 气泡确认框', link: '/components/popconfirm' },
            { text: 'Notification 通知', link: '/components/notification' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Yoyo-514/moe-ui' }],
  },
})
