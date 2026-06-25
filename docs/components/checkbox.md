# Checkbox 多选框

在一组备选项中进行多选，适用于开关项、偏好选择、批量筛选等场景。

## 基础用法

单独使用时，`v-model` 默认绑定布尔值。

<preview path="../examples/checkbox/basic.vue" title="基础用法" description="Checkbox 单独使用时可作为布尔开关。"></preview>

## 禁用状态

设置 `disabled` 后，Checkbox 不可交互。

<preview path="../examples/checkbox/disabled.vue" title="禁用状态" description="禁用状态会阻止选中状态变化。"></preview>

## 多选框组

使用 `moe-checkbox-group` 管理一组多选项，`v-model` 绑定数组。

<preview path="../examples/checkbox/group.vue" title="多选框组" description="选中值会以数组形式同步。"></preview>

## Indeterminate 状态

设置 `indeterminate` 可以展示半选状态，常用于全选场景。

<preview path="../examples/checkbox/indeterminate.vue" title="Indeterminate 状态" description="半选状态只负责展示，具体选择逻辑由业务控制。"></preview>

## 限制选择数量

`CheckboxGroup` 支持通过 `min` 和 `max` 限制最少和最多可选数量。

<preview path="../examples/checkbox/min-max.vue" title="限制选择数量" description="达到数量边界时，对应选项会被禁用。"></preview>

## 尺寸

通过 `size` 控制尺寸，支持 `large`、`default` 和 `small`。

<preview path="../examples/checkbox/size.vue" title="尺寸" description="尺寸通常由 Form 或 CheckboxGroup 统一控制。"></preview>

## 带有边框

设置 `border` 可以为 Checkbox 添加边框。

<preview path="../examples/checkbox/border.vue" title="带有边框" description="边框样式适合更强调选项边界的场景。"></preview>

## Checkbox API

### Checkbox Attributes

| 名称                    | 类型                                   | 默认值  | 说明                                    |
| ----------------------- | -------------------------------------- | ------- | --------------------------------------- |
| `model-value / v-model` | `boolean \| string \| number \| array` | —       | 绑定值，单独使用时支持布尔或数组模式    |
| `value`                 | `string \| number \| boolean`          | —       | 选中时使用的值                          |
| `label`                 | `string \| number`                     | —       | 显示文本；未设置 `value` 时也作为选中值 |
| `true-value`            | `string \| number \| boolean`          | `true`  | 单独使用时的选中值                      |
| `false-value`           | `string \| number \| boolean`          | `false` | 单独使用时的未选中值                    |
| `disabled`              | `boolean`                              | —       | 是否禁用                                |
| `border`                | `boolean`                              | `false` | 是否显示边框                            |
| `size`                  | `'large' \| 'default' \| 'small'`      | —       | 尺寸                                    |
| `name`                  | `string`                               | —       | 原生 `name` 属性                        |
| `checked`               | `boolean`                              | `false` | 是否默认选中                            |
| `indeterminate`         | `boolean`                              | `false` | 是否显示半选状态，只负责样式控制        |
| `validate-event`        | `boolean`                              | `true`  | 绑定值变化时是否触发表单校验            |
| `tabindex`              | `string \| number`                     | —       | 原生 `tabindex` 属性                    |
| `id`                    | `string`                               | —       | 原生 `id` 属性                          |
| `aria-controls`         | `string`                               | —       | 原生 `aria-controls` 属性               |

### Checkbox Events

| 名称     | 说明             | 类型                                  |
| -------- | ---------------- | ------------------------------------- |
| `change` | 绑定值变化时触发 | `(value: CheckboxModelValue) => void` |

### Checkbox Slots

| 名称      | 说明       |
| --------- | ---------- |
| `default` | 自定义内容 |

## CheckboxGroup API

### CheckboxGroup Attributes

| 名称                    | 类型                              | 默认值 | 说明                         |
| ----------------------- | --------------------------------- | ------ | ---------------------------- |
| `model-value / v-model` | `(string \| number \| boolean)[]` | `[]`   | 绑定值                       |
| `disabled`              | `boolean`                         | —      | 是否禁用整组                 |
| `size`                  | `'large' \| 'default' \| 'small'` | —      | 统一尺寸                     |
| `min`                   | `number`                          | —      | 最少选择数量                 |
| `max`                   | `number`                          | —      | 最多选择数量                 |
| `validate-event`        | `boolean`                         | `true` | 绑定值变化时是否触发表单校验 |

### CheckboxGroup Events

| 名称     | 说明             | 类型                                               |
| -------- | ---------------- | -------------------------------------------------- |
| `change` | 绑定值变化时触发 | `(value: (string \| number \| boolean)[]) => void` |

### CheckboxGroup Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 选项内容 |
