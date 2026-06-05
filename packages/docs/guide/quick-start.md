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

如果你希望快速开始，可以在入口文件中完整引入组件库和样式。

```ts
import { createApp } from 'vue'
import MoeCuteUI from 'moe-cute-ui'
import 'moe-cute-ui/style.css'
import App from './App.vue'

const app = createApp(App)

app.use(MoeCuteUI)
app.mount('#app')
```

之后就可以在模板中直接使用组件：

```vue
<template>
  <moe-button type="primary">开始使用</moe-button>
  <moe-alert title="欢迎使用 Moe Cute UI" type="success" show-icon />
</template>
```

## 手动引入组件

如果只想使用部分组件，也可以从主包中手动引入组件。

```vue
<script setup lang="ts">
import { MoeAlert, MoeButton } from 'moe-cute-ui'
import 'moe-cute-ui/style.css'
</script>

<template>
  <moe-button type="primary">按钮</moe-button>
  <moe-alert title="这是一条提示" type="info" show-icon />
</template>
```

::: tip 提示
当前阶段推荐优先使用完整样式入口 `moe-cute-ui/style.css`。组件级按需样式入口已经输出到 `moe-cute-ui/theme/*.css`，后续会继续补充自动按需引入 resolver。
:::

## 按需样式入口

如果你需要手动控制样式体积，可以只引入对应组件样式：

```ts
import { MoeButton } from 'moe-cute-ui'
import 'moe-cute-ui/theme/Button.css'
```

Alert 示例：

```ts
import { MoeAlert } from 'moe-cute-ui'
import 'moe-cute-ui/theme/Alert.css'
```

如果组件依赖基础主题变量，建议同时引入：

```ts
import 'moe-cute-ui/theme/index.css'
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
