# Popconfirm 气泡确认框

用于在用户执行敏感操作前进行二次确认。Popconfirm 基于 Tooltip 的浮层能力实现，适合删除、发布、重置等需要轻量确认的场景。

## 基础用法

<preview path="../examples/popconfirm/basic.vue" title="基础用法" description="通过 reference 插槽放置触发元素，点击后展示确认气泡。"></preview>

## 按钮文字和类型

<preview path="../examples/popconfirm/button-text.vue" title="按钮文字和类型" description="通过 confirmButtonText、cancelButtonText 和按钮类型 props 调整操作按钮。"></preview>

## 图标

<preview path="../examples/popconfirm/icon.vue" title="图标" description="可以自定义图标、图标颜色，也可以通过 hideIcon 隐藏图标。"></preview>

## 自定义宽度

<preview path="../examples/popconfirm/width.vue" title="自定义宽度" description="width 支持 number 和 string，组件不会额外限制最小宽度，尊重用户传入值。"></preview>

## 自定义操作区

<preview path="../examples/popconfirm/actions.vue" title="自定义操作区" description="通过 actions 插槽完全接管底部操作区，插槽会提供 confirm 和 cancel 方法。"></preview>

## 延迟关闭

<preview path="../examples/popconfirm/hide-after.vue" title="延迟关闭" description="通过 hideAfter 设置确认或取消后的延迟关闭时间。"></preview>

## Popconfirm API

### Props

| 名称              | 类型               | 默认值                     | 说明                                |
| ----------------- | ------------------ | -------------------------- | ----------------------------------- |
| title             | `string`           | `''`                       | 确认提示内容                        |
| confirmButtonText | `string`           | `'确认'`                   | 确认按钮文字                        |
| cancelButtonText  | `string`           | `'取消'`                   | 取消按钮文字                        |
| confirmButtonType | `ButtonType`       | `'primary'`                | 确认按钮类型                        |
| cancelButtonType  | `ButtonType`       | `'text'`                   | 取消按钮类型                        |
| icon              | `string`           | `'mingcute:question-line'` | 图标名称                            |
| iconColor         | `string`           | `var(--moe-color-warning)` | 图标颜色                            |
| hideIcon          | `boolean`          | `false`                    | 是否隐藏图标                        |
| hideAfter         | `number`           | `200`                      | 确认或取消后的延迟关闭时间，单位 ms |
| width             | `number \| string` | `'150px'`                  | 气泡内容宽度，数字会自动补 `px`     |

`ButtonType` 与 Button 组件保持一致：

```ts
type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
```

### Emits

| 名称    | 参数                  | 说明               |
| ------- | --------------------- | ------------------ |
| confirm | `(event: MouseEvent)` | 点击确认按钮时触发 |
| cancel  | `(event: MouseEvent)` | 点击取消按钮时触发 |

### Slots

| 名称      | 说明                                       |
| --------- | ------------------------------------------ |
| reference | 触发 Popconfirm 显示的 HTML 元素           |
| actions   | 自定义操作区，参数为 `{ confirm, cancel }` |
