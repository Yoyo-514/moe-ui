# Tooltip 文字提示

用于在鼠标悬停或点击时展示轻量提示信息。Tooltip 是后续 Popconfirm、Dropdown 等浮层组件的基础能力。

## 基础用法

<preview path="../examples/tooltip/basic.vue" title="基础用法" description="通过 content 设置提示内容，默认 hover 触发。"></preview>

## 不同位置

<preview path="../examples/tooltip/placement.vue" title="不同位置" description="通过 placement 设置提示出现的位置，示例按 Popper 常见方位环绕展示。"></preview>

## 触发方式

<preview path="../examples/tooltip/trigger.vue" title="触发方式" description="支持 hover 和 click 两种常规触发方式。"></preview>

## 主题

<preview path="../examples/tooltip/effect.vue" title="主题" description="通过 effect 设置深色或浅色主题。"></preview>

## 自定义内容

<preview path="../examples/tooltip/slot-content.vue" title="自定义内容" description="通过 content 插槽自定义提示内容。"></preview>

## 受控显示

<preview path="../examples/tooltip/controlled.vue" title="受控显示" description="通过 v-model:visible 控制 Tooltip 显隐。"></preview>

## 禁用状态

<preview path="../examples/tooltip/disabled.vue" title="禁用状态" description="disabled 为 true 时不会显示 Tooltip。"></preview>

## Tooltip API

### Props

| 名称                      | 类型                                 | 默认值     | 说明                                                                    |
| ------------------------- | ------------------------------------ | ---------- | ----------------------------------------------------------------------- |
| content                   | `string`                             | `''`       | 提示内容                                                                |
| placement                 | `Placement`                          | `'bottom'` | 出现位置                                                                |
| trigger                   | `TooltipTrigger \| TooltipTrigger[]` | `'hover'`  | 触发方式                                                                |
| disabled                  | `boolean`                            | `false`    | 是否禁用                                                                |
| visible / v-model:visible | `boolean`                            | —          | 组件可见性                                                              |
| showAfter                 | `number`                             | `0`        | 延迟显示时间，单位 ms                                                   |
| hideAfter                 | `number`                             | `200`      | 延迟隐藏时间，单位 ms                                                   |
| offset                    | `number`                             | `12`       | 与触发元素的偏移距离                                                    |
| effect                    | `'dark' \| 'light'`                  | `'dark'`   | 主题样式                                                                |
| transition                | `string`                             | `'fade'`   | 过渡动画名称                                                            |
| popper-options            | `object`                             | `{}`       | popper.js 参数，请参考 [popper.js 文档](https://popper.js.org/docs/v2/) |

`TooltipTrigger` 类型：

```ts
type TooltipTrigger = 'hover' | 'click'
```

`Placement` 与 `Options` 来自 `@popperjs/core`，支持 `top`、`bottom-start`、`right-end` 等 Popper 方位和 Popper 配置，更多参数可参考 [popper.js 文档](https://popper.js.org/docs/v2/)。

### Emits

| 名称 | 参数 | 说明               |
| ---- | ---- | ------------------ |
| show | —    | Tooltip 显示时触发 |
| hide | —    | Tooltip 隐藏时触发 |

### Slots

| 名称    | 说明                |
| ------- | ------------------- |
| default | 触发 Tooltip 的内容 |
| content | 自定义 Tooltip 内容 |

### Exposes

| 名称 | 类型         | 说明         |
| ---- | ------------ | ------------ |
| show | `() => void` | 显示 Tooltip |
| hide | `() => void` | 隐藏 Tooltip |
