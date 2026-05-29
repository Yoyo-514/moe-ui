# Button 按钮

常用操作按钮，支持类型、尺寸、加载态、禁用态、图标按钮、自定义渲染标签和按钮组。

## 基础用法

<preview path="../examples/button/basic.vue" title="基础用法" description="通过 type 控制按钮语义和视觉层级。"></preview>

## Plain 按钮

<preview path="../examples/button/plain.vue" title="Plain 按钮" description="适合弱强调操作，保留主题色但降低视觉重量。"></preview>

## 文字按钮

<preview path="../examples/button/text.vue" title="文字按钮" description="type 为 text 时适合链接型或弱操作入口。"></preview>

## 尺寸

<preview path="../examples/button/size.vue" title="尺寸" description="提供 large、default、small 三种常用尺寸。"></preview>

## 圆角与圆形

<preview path="../examples/button/shape.vue" title="圆角与圆形" description="round 适合胶囊按钮，circle 适合纯图标操作。"></preview>

## 加载与禁用

<preview path="../examples/button/state.vue" title="加载与禁用" description="loading 和 disabled 状态都会阻止点击事件。"></preview>

## 自定义加载图标

<preview path="../examples/button/loading-slot.vue" title="自定义加载图标" description="通过 loading 插槽可以完全自定义加载状态的图标内容。"></preview>

## 自定义标签

<preview path="../examples/button/tag.vue" title="自定义标签" description="通过 tag 可以将按钮渲染为 a、div 或自定义组件。"></preview>

## 按钮组

<preview path="../examples/button/group.vue" title="按钮组" description="ButtonGroup 可以统一控制内部按钮的 type、size 和 disabled。"></preview>

## Button API

### Props

| 名称             | 类型                                                                  | 默认值                    | 说明                                   |
| ---------------- | --------------------------------------------------------------------- | ------------------------- | -------------------------------------- |
| tag              | `string \| Component`                                                 | `'button'`                | 自定义渲染标签或组件                   |
| type             | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text'` | —                         | 按钮类型                               |
| size             | `'large' \| 'default' \| 'small'`                                     | —                         | 按钮尺寸                               |
| nativeType       | `'button' \| 'submit' \| 'reset'`                                     | `'button'`                | 原生按钮类型，仅 `tag="button"` 时生效 |
| disabled         | `boolean`                                                             | `false`                   | 是否禁用                               |
| loading          | `boolean`                                                             | `false`                   | 是否加载中                             |
| icon             | `string`                                                              | —                         | Iconify 图标名称                       |
| circle           | `boolean`                                                             | `false`                   | 是否圆形                               |
| plain            | `boolean`                                                             | `false`                   | 是否朴素按钮                           |
| round            | `boolean`                                                             | `false`                   | 是否圆角按钮                           |
| loadingIcon      | `string`                                                              | `'mingcute:loading-line'` | 自定义加载图标                         |
| autofocus        | `boolean`                                                             | `false`                   | 是否自动聚焦                           |
| useThrottle      | `boolean`                                                             | `true`                    | 是否节流点击事件                       |
| throttleDuration | `number`                                                              | `500`                     | 点击节流间隔，单位 ms                  |

### Emits

| 名称  | 参数                  | 说明           |
| ----- | --------------------- | -------------- |
| click | `(event: MouseEvent)` | 点击按钮时触发 |

### Slots

| 名称    | 说明                                              |
| ------- | ------------------------------------------------- |
| default | 按钮默认内容                                      |
| loading | 自定义加载状态内容，仅 `loading` 为 `true` 时展示 |

### Exposes

| 名称  | 类型                       | 说明           |
| ----- | -------------------------- | -------------- |
| ref   | `Ref<HTMLElement \| void>` | 按钮根元素引用 |
| focus | `() => void`               | 聚焦按钮       |
| blur  | `() => void`               | 取消按钮聚焦   |

## ButtonGroup API

### Props

| 名称     | 类型         | 默认值  | 说明                 |
| -------- | ------------ | ------- | -------------------- |
| type     | `ButtonType` | —       | 统一设置内部按钮类型 |
| size     | `ButtonSize` | —       | 统一设置内部按钮尺寸 |
| disabled | `boolean`    | `false` | 统一禁用内部按钮     |

### Slots

| 名称    | 说明                                 |
| ------- | ------------------------------------ |
| default | 按钮组内容，通常放置多个 `MoeButton` |
