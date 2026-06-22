# 快速开始

本节会帮助你在 Vue 3 项目中快速安装并使用 Moe Cute UI。

## 安装

使用你喜欢的包管理器安装：

::: code-group

```bash [pnpm]
pnpm add moe-cute-ui
```

```bash [npm]
npm install moe-cute-ui
```

```bash [yarn]
yarn add moe-cute-ui
```

:::

Moe Cute UI 需要 Vue 3：

```json
{
  "peerDependencies": {
    "vue": "^3.5.0"
  }
}
```

## 完整引入

如果你希望快速开始，可以在入口文件中完整引入组件库和全量样式。

```ts
import { createApp } from 'vue'
import MoeCuteUI from 'moe-cute-ui'
import 'moe-cute-ui/style.css'
import App from './App.vue'

createApp(App).use(MoeCuteUI).mount('#app')
```

之后就可以在模板中直接使用组件：

```vue
<template>
  <moe-button type="primary">开始使用</moe-button>
  <moe-alert title="欢迎使用 Moe Cute UI" type="success" show-icon />
</template>
```

## 手动按需引入

如果只想使用部分组件，可以从主包中导入组件，并手动导入对应组件样式。

```ts
import { createApp } from 'vue'
import { MoeAlert, MoeButton } from 'moe-cute-ui'
import 'moe-cute-ui/es/components/Alert/style/css'
import 'moe-cute-ui/es/components/Button/style/css'
import App from './App.vue'

const app = createApp(App)

app.use(MoeAlert)
app.use(MoeButton)
app.mount('#app')
```

函数式组件同样可以按需引入：

```ts
import { MoeMessage } from 'moe-cute-ui'
import 'moe-cute-ui/es/components/Message/style/css'

MoeMessage.success('保存成功')
```

::: tip 提示
`style/css` 会自动引入基础主题样式和对应组件样式，不需要再额外导入 `moe-cute-ui/style.css`。
:::

## 自动按需引入

自动按需引入需要配合 `unplugin-vue-components` 和 `unplugin-auto-import`。

::: code-group

```bash [pnpm]
pnpm add -D unplugin-vue-components unplugin-auto-import
```

```bash [npm]
npm install -D unplugin-vue-components unplugin-auto-import
```

```bash [yarn]
yarn add -D unplugin-vue-components unplugin-auto-import
```

:::

在 Vite 中配置 `MoeUIResolver`：

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

`Components` 会处理模板中的组件：

```vue
<template>
  <moe-button type="primary">按钮</moe-button>
</template>
```

`AutoImport` 会处理函数式 API：

```ts
MoeMessage.success('保存成功')
MoeNotification.info({ title: '提示', message: '内容' })
```

如果不希望自动引入样式，可以关闭 `importStyle`：

```ts
MoeUIResolver({ importStyle: false })
```

## Vite 示例

一个最小的 Vite + Vue 入口通常如下：

```ts
// src/main.ts
import { createApp } from 'vue'
import MoeCuteUI from 'moe-cute-ui'
import 'moe-cute-ui/style.css'
import App from './App.vue'

createApp(App).use(MoeCuteUI).mount('#app')
```

```vue
<!-- src/App.vue -->
<template>
  <main class="demo-page">
    <moe-alert title="Moe Cute UI 已就绪" type="success" show-icon />
    <moe-button type="primary">Primary Button</moe-button>
  </main>
</template>

<style scoped>
.demo-page {
  display: grid;
  gap: 16px;
  max-width: 640px;
  margin: 40px auto;
}
</style>
```

## TypeScript 支持

Moe Cute UI 构建时会输出类型声明，你可以直接导入组件类型：

```ts
import type { AlertInstance, ButtonInstance } from 'moe-cute-ui'
```

例如通过模板 ref 控制 Alert：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { AlertInstance } from 'moe-cute-ui'

const alertRef = ref<AlertInstance>()

const closeAlert = () => {
  alertRef.value?.close()
}
</script>

<template>
  <moe-alert ref="alertRef" title="可以通过实例关闭" />
  <moe-button @click="closeAlert">关闭 Alert</moe-button>
</template>
```

## 下一步

现在你可以继续阅读组件文档：

- [Button 按钮](/components/button)
- [Alert 提示](/components/alert)
- [Icon 图标](/components/icon)
- [Collapse 折叠面板](/components/collapse)
