# 快速开始

本节会帮助你在 Vue 3 项目中快速使用 Moe Cute UI。安装方式请先阅读 [安装](/guide/installation)。

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

## 使用组件

Moe Cute UI 组件默认使用 `moe-` 前缀。完整引入后，你可以直接在模板中使用组件：

```vue
<template>
  <moe-button type="primary">保存</moe-button>
  <moe-alert title="操作成功" type="success" show-icon />
</template>
```

命令式组件可直接从包入口导入：

```ts
import { MoeMessage, MoeNotification } from 'moe-cute-ui'

MoeMessage.success('保存成功')
MoeNotification.info({ title: '提示', message: '内容' })
```

## 全局配置

如果需要统一组件尺寸或内置文案语言，可以使用 ConfigProvider：

```vue
<script setup lang="ts">
import { en } from 'moe-cute-ui'
</script>

<template>
  <moe-config-provider size="small" :locale="en">
    <moe-button type="primary">Small Button</moe-button>
    <moe-select />
  </moe-config-provider>
</template>
```

## 下一步

现在你可以继续阅读：

- [安装](/guide/installation)
- [Button 按钮](/components/button)
- [Alert 提示](/components/alert)
- [Icon 图标](/components/icon)
- [Form 表单](/components/form)
