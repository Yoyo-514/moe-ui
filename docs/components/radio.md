# Radio 单选框

在一组选项中选择一个结果，适用于互斥选项、枚举值和偏好设置等场景。

## 基础用法

单独使用时，`v-model` 绑定当前选中的值。

<preview path="../examples/radio/basic.vue" title="基础用法" description="Radio 的 value 与 v-model 相等时即为选中。"></preview>

## 禁用状态

设置 `disabled` 后，Radio 不可交互；也可以在 `RadioGroup` 上统一禁用。

<preview path="../examples/radio/disabled.vue" title="禁用状态" description="RadioGroup 的 disabled 会影响内部所有 Radio。"></preview>

## 单选框组

使用 `moe-radio-group` 管理一组互斥选项。

<preview path="../examples/radio/group.vue" title="单选框组" description="选中任意一项后，绑定值会更新为对应 value。"></preview>

## 尺寸

通过 `size` 控制尺寸，支持 `large`、`default` 和 `small`。

<preview path="../examples/radio/size.vue" title="尺寸" description="尺寸通常由 Form 或 RadioGroup 统一控制。"></preview>

## Radio API

### Radio Attributes

| 名称                    | 类型                              | 默认值  | 说明                                |
| ----------------------- | --------------------------------- | ------- | ----------------------------------- |
| `model-value / v-model` | `string \| number \| boolean`     | —       | 绑定值，单独使用时生效              |
| `label`                 | `string \| number`                | —       | 显示文本；未设置 `value` 时也作为值 |
| `value`                 | `string \| number \| boolean`     | —       | 单选框的值                          |
| `disabled`              | `boolean`                         | `false` | 是否禁用                            |
| `size`                  | `'large' \| 'default' \| 'small'` | —       | 尺寸                                |
| `name`                  | `string`                          | —       | 原生 `name` 属性                    |
| `id`                    | `string`                          | —       | 原生 `id` 属性                      |

### Radio Events

| 名称     | 说明             | 类型                                           |
| -------- | ---------------- | ---------------------------------------------- |
| `change` | 绑定值变化时触发 | `(value: string \| number \| boolean) => void` |

### Radio Slots

| 名称      | 说明       |
| --------- | ---------- |
| `default` | 自定义内容 |

### Radio Exposes

| 名称    | 说明           | 类型         |
| ------- | -------------- | ------------ |
| `focus` | 手动聚焦 Radio | `() => void` |

## RadioGroup API

### RadioGroup Attributes

| 名称                    | 类型                              | 默认值  | 说明         |
| ----------------------- | --------------------------------- | ------- | ------------ |
| `model-value / v-model` | `string \| number \| boolean`     | —       | 绑定值       |
| `disabled`              | `boolean`                         | `false` | 是否禁用整组 |
| `size`                  | `'large' \| 'default' \| 'small'` | —       | 统一尺寸     |
| `name`                  | `string`                          | —       | 子选项 name  |

### RadioGroup Events

| 名称     | 说明             | 类型                                           |
| -------- | ---------------- | ---------------------------------------------- |
| `change` | 绑定值变化时触发 | `(value: string \| number \| boolean) => void` |

### RadioGroup Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 选项内容 |
