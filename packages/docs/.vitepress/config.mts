import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Moe UI',
  description: '轻二次元风格的 Vue 3 组件库',
  base: '/moe-ui/',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '组件', link: '/components/button' },
    ],

    sidebar: {
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
          ],
        },
        {
          text: '表单组件',
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'Form 表单', link: '/components/form' },
          ],
        },
        {
          text: '反馈组件',
          items: [
            { text: 'Alert 提示', link: '/components/alert' },
            { text: 'Message 消息', link: '/components/message' },
            { text: 'Loading 加载', link: '/components/loading' },
          ],
        },
        {
          text: '浮层组件',
          items: [
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'Popconfirm 气泡确认框', link: '/components/popconfirm' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
})
