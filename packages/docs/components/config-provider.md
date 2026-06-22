# ConfigProvider 全局配置

ConfigProvider 用于向后代组件提供全局配置。

## 基础用法

::: demo 配置默认尺寸和弹层层级
examples/config-provider/basic.vue
:::

## API

### Props

| 属性名    | 说明              | 类型                              | 默认值      |
| --------- | ----------------- | --------------------------------- | ----------- |
| namespace | 组件 CSS 命名前缀 | `string`                          | `moe`       |
| size      | 全局组件尺寸      | `'large' \| 'default' \| 'small'` | `undefined` |
| zIndex    | 全局弹层初始层级  | `number`                          | `undefined` |

::: tip 提示
当前版本先提供配置上下文，组件会在后续版本逐步接入全局配置。
:::
