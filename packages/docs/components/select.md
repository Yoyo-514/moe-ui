# Select 选择器

当选项过多时，使用下拉菜单展示并选择内容。Moe Select 第一版聚焦单选场景，支持数据源、清空、筛选、加载和基础键盘交互。

## 基础用法

`v-model` 的值为当前被选中的选项 `value`。

<preview path="../examples/select/basic.vue" title="基础用法" description="通过 options 传入选项数据。"></preview>

## 有禁用选项

在选项数据中设置 `disabled: true` 可以禁用某个选项。

<preview path="../examples/select/option-disabled.vue" title="有禁用选项" description="禁用选项不可被选择。"></preview>

## 禁用状态

设置 `disabled` 后，选择器不可交互。

<preview path="../examples/select/disabled.vue" title="禁用状态" description="禁用状态下不会展开下拉。"></preview>

## 可清空单选

设置 `clearable` 后，有值时可以通过清空按钮清除当前选择。

<preview path="../examples/select/clearable.vue" title="可清空单选" description="点击清空按钮会触发 clear 和 change。"></preview>

## 可筛选

设置 `filterable` 后，可以输入关键字筛选选项。

<preview path="../examples/select/filterable.vue" title="可筛选" description="默认根据 label 进行不区分大小写的包含匹配。"></preview>

## 加载中

设置 `loading` 后，下拉中会展示加载文案。

<preview path="../examples/select/loading.vue" title="加载中" description="loading 状态常用于异步加载选项。"></preview>

## 自定义选项字段

通过 `props` 可以配置选项对象中的 `value`、`label` 和 `disabled` 字段名。

<preview path="../examples/select/props.vue" title="自定义选项字段" description="适配后端返回的不同字段结构。"></preview>

## API

### Select Attributes

| 名称                    | 类型                                               | 默认值                                                     | 说明                   |
| ----------------------- | -------------------------------------------------- | ---------------------------------------------------------- | ---------------------- |
| `model-value / v-model` | `string \| number \| boolean \| object`            | —                                                          | 绑定值                 |
| `options`               | `SelectOption[]`                                   | `[]`                                                       | 选项数据               |
| `props`                 | `SelectPropsConfig`                                | `{ value: 'value', label: 'label', disabled: 'disabled' }` | 自定义选项字段         |
| `disabled`              | `boolean`                                          | `false`                                                    | 是否禁用               |
| `value-key`             | `string`                                           | `'value'`                                                  | value 为对象时的唯一键 |
| `size`                  | `'large' \| 'default' \| 'small'`                  | `'default'`                                                | 输入框尺寸             |
| `clearable`             | `boolean`                                          | `false`                                                    | 是否可清空             |
| `filterable`            | `boolean`                                          | `false`                                                    | 是否可筛选             |
| `filter-method`         | `(query: string, option: SelectOption) => boolean` | —                                                          | 自定义筛选方法         |
| `loading`               | `boolean`                                          | `false`                                                    | 是否加载中             |
| `loading-text`          | `string`                                           | `'加载中'`                                                 | 加载中文案             |
| `no-match-text`         | `string`                                           | `'无匹配数据'`                                             | 搜索无匹配时的文案     |
| `no-data-text`          | `string`                                           | `'暂无数据'`                                               | 无选项时的文案         |
| `placeholder`           | `string`                                           | `'请选择'`                                                 | 占位文本               |
| `name`                  | `string`                                           | —                                                          | 原生 name 属性         |
| `empty-values`          | `SelectModelValue[]`                               | `['', undefined, null]`                                    | 判定为空值的集合       |
| `value-on-clear`        | `SelectModelValue`                                 | `''`                                                       | 点击清空后的值         |

### Select Events

| 名称             | 说明                  | 类型                                |
| ---------------- | --------------------- | ----------------------------------- |
| `change`         | 选中值变化时触发      | `(value: SelectModelValue) => void` |
| `visible-change` | 下拉显示 / 隐藏时触发 | `(visible: boolean) => void`        |
| `clear`          | 点击清空时触发        | `() => void`                        |
| `focus`          | 输入框聚焦时触发      | `(event: FocusEvent) => void`       |
| `blur`           | 输入框失焦时触发      | `(event: FocusEvent) => void`       |

### Select Exposes

| 名称            | 说明             | 类型                  |
| --------------- | ---------------- | --------------------- |
| `focus`         | 聚焦输入框       | `() => void`          |
| `blur`          | 失焦并关闭下拉   | `() => void`          |
| `selectedLabel` | 当前选中项 label | `ComputedRef<string>` |

### Option Attributes

| 名称       | 类型                                    | 默认值     | 说明         |
| ---------- | --------------------------------------- | ---------- | ------------ |
| `value`    | `string \| number \| boolean \| object` | —          | 选项值       |
| `label`    | `string \| number`                      | 同 `value` | 选项显示文本 |
| `disabled` | `boolean`                               | `false`    | 是否禁用     |
