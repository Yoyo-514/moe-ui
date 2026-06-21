# Switch 开关

用于在两种状态之间切换，常见于启用 / 禁用、开 / 关、配置项切换等场景。

## 基础用法

绑定 `v-model` 到一个布尔值即可使用。

<preview path="../examples/switch/basic.vue" title="基础用法" description="Switch 默认使用 boolean 作为绑定值。"></preview>

## 尺寸

通过 `size` 控制 Switch 尺寸，支持 `large`、`default` 和 `small`。

<preview path="../examples/switch/size.vue" title="尺寸" description="不同尺寸适用于不同密度的表单区域。"></preview>

## 文字描述

通过 `active-text` 和 `inactive-text` 展示开关状态文本；使用 `inline-prompt` 可以将文本显示在开关内部。

<preview path="../examples/switch/text.vue" title="文字描述" description="文本可以显示在外部，也可以显示在开关内部。"></preview>

## 显示自定义图标

通过 `active-icon` 和 `inactive-icon` 设置不同状态下的图标。

<preview path="../examples/switch/icon.vue" title="显示自定义图标" description="图标优先级高于 inline-prompt 文本。"></preview>

## 扩展的 value 类型

通过 `active-value` 和 `inactive-value` 可以绑定 `boolean` 之外的 `string` 或 `number` 类型。

<preview path="../examples/switch/value.vue" title="扩展的 value 类型" description="适合后端状态码、枚举值等场景。"></preview>

## 禁用状态

设置 `disabled` 后，Switch 不可切换。

<preview path="../examples/switch/disabled.vue" title="禁用状态" description="禁用状态下不会触发 change。"></preview>

## 加载状态

设置 `loading` 后，Switch 会显示加载图标并禁止切换。

<preview path="../examples/switch/loading.vue" title="加载状态" description="加载状态通常配合异步请求使用。"></preview>

## 阻止切换

设置 `before-change` 可以在切换前执行校验或异步确认。返回 `false` 或 Promise reject 时会阻止切换。

<preview path="../examples/switch/before-change.vue" title="阻止切换" description="before-change 由用户自行控制 loading 状态。"></preview>

## API

### Attributes

| 名称                    | 类型                                | 默认值      | 说明                                                |
| ----------------------- | ----------------------------------- | ----------- | --------------------------------------------------- |
| `model-value / v-model` | `boolean \| string \| number`       | `false`     | 绑定值，应该等于 `active-value` 或 `inactive-value` |
| `disabled`              | `boolean`                           | `false`     | 是否禁用                                            |
| `loading`               | `boolean`                           | `false`     | 是否加载中                                          |
| `size`                  | `'large' \| 'default' \| 'small'`   | `'default'` | 尺寸                                                |
| `width`                 | `string \| number`                  | —           | Switch 宽度                                         |
| `inline-prompt`         | `boolean`                           | `false`     | 是否在开关内部显示文字或图标                        |
| `active-icon`           | `string \| Component`               | —           | 开启状态图标，优先级高于 `active-text`              |
| `inactive-icon`         | `string \| Component`               | —           | 关闭状态图标，优先级高于 `inactive-text`            |
| `active-text`           | `string`                            | `''`        | 开启状态文字                                        |
| `inactive-text`         | `string`                            | `''`        | 关闭状态文字                                        |
| `active-value`          | `boolean \| string \| number`       | `true`      | 开启状态值                                          |
| `inactive-value`        | `boolean \| string \| number`       | `false`     | 关闭状态值                                          |
| `name`                  | `string`                            | `''`        | 原生 `name` 属性                                    |
| `before-change`         | `() => boolean \| Promise<boolean>` | —           | 切换前钩子，返回 `false` 或 reject 时阻止切换       |

### Events

| 名称     | 说明             | 类型                                           |
| -------- | ---------------- | ---------------------------------------------- |
| `change` | 绑定值变化时触发 | `(value: boolean \| string \| number) => void` |

### Exposes

| 名称    | 说明            | 类型         |
| ------- | --------------- | ------------ |
| `focus` | 手动聚焦 Switch | `() => void` |
