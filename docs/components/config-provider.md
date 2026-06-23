# ConfigProvider 全局配置

ConfigProvider 用于向后代组件提供全局配置，例如组件尺寸、弹层层级和组件内置文案语言。

## 基础用法

<preview path="../examples/config-provider/basic.vue" title="基础用法" description="配置默认尺寸和弹层层级"></preview>

## 国际化

通过 `locale` 属性可以切换组件库内部默认文案，例如 Select 的占位、空状态，以及 Popconfirm / MessageBox 的按钮文案。

<preview path="../examples/config-provider/locale.vue" title="国际化" description="通过 locale 切换组件内置文案"></preview>

## API

### Props

| 属性名    | 说明                 | 类型                              | 默认值      |
| --------- | -------------------- | --------------------------------- | ----------- |
| namespace | 组件 CSS 命名前缀    | `string`                          | `moe`       |
| size      | 全局组件尺寸         | `'large' \| 'default' \| 'small'` | `undefined` |
| zIndex    | 全局弹层初始层级     | `number`                          | `undefined` |
| locale    | 组件库内置文案语言包 | `Language`                        | `zhCn`      |

### Locale

当前内置语言包：

```ts
import { en, zhCn } from 'moe-cute-ui'
```

使用方式：

```vue
<script setup lang="ts">
import { en } from 'moe-cute-ui'
</script>

<template>
  <moe-config-provider :locale="en">
    <moe-select />
  </moe-config-provider>
</template>
```
