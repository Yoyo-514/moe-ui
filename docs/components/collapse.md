# Collapse 折叠面板

用于将内容区域折叠或展开，适合承载说明文本、设置项或结构化信息。

## 基础用法

<preview path="../examples/collapse/basic.vue" title="基础用法" description="通过 v-model 控制当前展开项，非手风琴模式下支持同时展开多个面板。"></preview>

## 手风琴模式

<preview path="../examples/collapse/accordion.vue" title="手风琴模式" description="accordion 模式下每次只会展开一个面板。"></preview>

## 禁用状态

<preview path="../examples/collapse/disabled.vue" title="禁用状态" description="disabled 的面板不会响应点击和键盘操作。"></preview>

## 自定义标题

<preview path="../examples/collapse/slot-title.vue" title="自定义标题" description="通过 title 插槽可以自定义面板标题内容。"></preview>

## Collapse API

### Props

| 名称      | 类型      | 默认值  | 说明           |
| --------- | --------- | ------- | -------------- |
| accordion | `boolean` | `false` | 是否手风琴模式 |

### Model

| 名称    | 类型                                          | 说明       |
| ------- | --------------------------------------------- | ---------- |
| v-model | `string \| number \| Array<string \| number>` | 当前展开项 |

### Emits

展开状态变化时会触发以下事件，事件参数类型均为 `string | number | Array<string | number>`。

| 名称              | 说明               |
| ----------------- | ------------------ |
| update:modelValue | 用于同步 v-model   |
| change            | 展开状态变化后触发 |

### Slots

| 名称    | 说明              |
| ------- | ----------------- |
| default | CollapseItem 列表 |

## CollapseItem API

### Props

| 名称     | 类型               | 默认值  | 说明     |
| -------- | ------------------ | ------- | -------- |
| name     | `string \| number` | —       | 唯一标识 |
| title    | `string`           | —       | 面板标题 |
| disabled | `boolean`          | `false` | 是否禁用 |

### Slots

| 名称    | 说明       |
| ------- | ---------- |
| title   | 自定义标题 |
| default | 面板内容   |
