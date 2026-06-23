<p align="center">
  <h1 align="center">Moe Cute UI</h1>
</p>

<p align="center">
  A cute, light and anime-inspired Vue 3 component library.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/moe-cute-ui">
    <img src="https://img.shields.io/npm/v/moe-cute-ui.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/moe-cute-ui">
    <img src="https://img.shields.io/npm/dm/moe-cute-ui.svg" alt="npm downloads" />
  </a>
  <a href="https://github.com/Velpro514/moe-ui/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/moe-cute-ui.svg" alt="license" />
  </a>
  <br />
</p>

- 🌸 Vue 3 + Composition API
- 🐾 Written in TypeScript
- 🎀 Cute and soft visual style
- 📦 Full import and on-demand import support
- 🧩 Components, hooks, styles and resolver built for library usage

## Getting Started

Install Moe Cute UI with your favorite package manager:

```bash
pnpm add moe-cute-ui
```

```bash
npm install moe-cute-ui
```

Import it in your Vue app:

```ts
import { createApp } from 'vue'
import MoeCuteUI from 'moe-cute-ui'
import 'moe-cute-ui/style.css'
import App from './App.vue'

createApp(App).use(MoeCuteUI).mount('#app')
```

Use components in templates:

```vue
<template>
  <moe-button type="primary">Moe Button</moe-button>
  <moe-alert title="Moe Cute UI is ready" type="success" show-icon />
</template>
```

## On-demand Import

Moe Cute UI provides a unified resolver for both `unplugin-vue-components` and `unplugin-auto-import`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { MoeUIResolver } from 'moe-cute-ui/resolver'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [MoeUIResolver()],
    }),
    Components({
      resolvers: [MoeUIResolver()],
    }),
  ],
})
```

## Components

Moe Cute UI currently includes:

- Basic: Button, Icon, Collapse, Alert
- Overlay: Tooltip, Popconfirm, Dropdown
- Feedback: Message, Notification, MessageBox, Loading
- Form: Input, Switch, Select, Form
- Config: ConfigProvider

## Development

```bash
pnpm install
pnpm docs:dev
pnpm test
pnpm build
pnpm pack:check
```

## License

MIT
