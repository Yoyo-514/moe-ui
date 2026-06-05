# Alert 提示

用于页面中展示静态反馈信息，适合承载成功、警告、消息和错误等轻量提示。Alert 默认占满父容器宽度，组件之间的间距建议由外部布局容器控制。

## 基础用法

<preview path="../examples/alert/basic.vue" title="基础用法" description="通过 title 展示一条基础提示。"></preview>

## 主题

<preview path="../examples/alert/theme.vue" title="主题" description="通过 type 控制语义主题，通过 effect 切换浅色或深色样式。"></preview>

## 自定义关闭按钮

<preview path="../examples/alert/custom-close.vue" title="自定义关闭按钮" description="支持默认关闭按钮、自定义关闭文字和不可关闭状态。"></preview>

## 使用图标

<preview path="../examples/alert/icon.vue" title="使用图标" description="showIcon 会根据 type 展示对应的语义图标。"></preview>

## 文字居中

<preview path="../examples/alert/center.vue" title="文字居中" description="center 可以让提示内容居中显示。"></preview>

## 文字描述

<preview path="../examples/alert/description.vue" title="文字描述" description="description 可展示更完整的反馈内容。"></preview>

## 带图标和描述

<preview path="../examples/alert/icon-description.vue" title="带图标和描述" description="图标和描述可以组合使用，用于更醒目的状态反馈。"></preview>

## Alert API

### Props

| 名称        | 类型                                           | 默认值    | 说明             |
| ----------- | ---------------------------------------------- | --------- | ---------------- |
| title       | `string`                                       | —         | 提示标题         |
| type        | `'success' \| 'warning' \| 'info' \| 'danger'` | `'info'`  | 提示类型         |
| description | `string`                                       | —         | 辅助说明文字     |
| closable    | `boolean`                                      | `true`    | 是否可以关闭     |
| closeText   | `string`                                       | —         | 自定义关闭文字   |
| showIcon    | `boolean`                                      | `false`   | 是否展示类型图标 |
| center      | `boolean`                                      | `false`   | 文字是否居中     |
| effect      | `'light' \| 'dark'`                            | `'light'` | 主题样式         |

### Emits

| 名称  | 参数                   | 说明           |
| ----- | ---------------------- | -------------- |
| close | `(event?: MouseEvent)` | 关闭提示时触发 |

### Slots

| 名称    | 说明               |
| ------- | ------------------ |
| default | 自定义辅助说明内容 |
| title   | 自定义标题内容     |
| icon    | 自定义图标内容     |

### Exposes

| 名称  | 类型                           | 说明     |
| ----- | ------------------------------ | -------- |
| open  | `() => void`                   | 打开提示 |
| close | `(event?: MouseEvent) => void` | 关闭提示 |
