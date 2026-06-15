# Input 输入框

用于输入单行文本或多行文本，是后续 Form、Select、MessageBox 等表单体系的基础组件。

## 基础用法

<preview path="../examples/input/basic.vue" title="基础用法" description="通过 v-model 绑定输入值。"></preview>

## 禁用状态

<preview path="../examples/input/disabled.vue" title="禁用状态" description="支持 disabled 和 readonly。"></preview>

## 可清空

<preview path="../examples/input/clearable.vue" title="可清空" description="clearable 支持普通输入框和文本域。"></preview>

## 密码框

<preview path="../examples/input/password.vue" title="密码框" description="type 为 password 且 showPassword 为 true 时，可以切换密码显示状态。"></preview>

## 带图标的输入框

<preview path="../examples/input/icon.vue" title="带图标的输入框" description="支持 prefixIcon / suffixIcon，也支持 prefix / suffix 插槽。"></preview>

## 文本域

<preview path="../examples/input/textarea.vue" title="文本域" description="type 为 textarea 时渲染文本域。"></preview>

## 自适应文本域

<preview path="../examples/input/autosize.vue" title="自适应文本域" description="autosize 支持根据内容自动调整文本域高度，也可以限制 minRows 和 maxRows。"></preview>

## 字数限制

<preview path="../examples/input/maxlength.vue" title="字数限制" description="showWordLimit 配合 maxlength 展示当前字数。"></preview>

## 复合型输入框

<preview path="../examples/input/slots.vue" title="复合型输入框" description="普通 input 支持 prepend 和 append 插槽。"></preview>

## 不同尺寸

<preview path="../examples/input/size.vue" title="不同尺寸" description="支持 small、default、large 三种尺寸。"></preview>

## API

### Input Props

| 名称          | 类型                                                | 默认值       | 说明                                                         |
| ------------- | --------------------------------------------------- | ------------ | ------------------------------------------------------------ |
| modelValue    | `string \| number`                                  | `''`         | 绑定值                                                       |
| type          | `string`                                            | `'text'`     | 原生 input type；为 `textarea` 时渲染文本域                  |
| placeholder   | `string`                                            | `''`         | 占位文本                                                     |
| disabled      | `boolean`                                           | `false`      | 是否禁用                                                     |
| readonly      | `boolean`                                           | `false`      | 是否只读                                                     |
| clearable     | `boolean`                                           | `false`      | 是否可清空，普通 input 和 textarea 均支持                    |
| showPassword  | `boolean`                                           | `false`      | 是否展示密码切换按钮，仅普通 input 且 `type="password"` 生效 |
| showWordLimit | `boolean`                                           | `false`      | 是否展示字数统计，需要配合 `maxlength` 使用                  |
| maxlength     | `number \| string`                                  | —            | 原生 maxlength                                               |
| minlength     | `number \| string`                                  | —            | 原生 minlength                                               |
| autocomplete  | `string`                                            | `'off'`      | 原生 autocomplete                                            |
| name          | `string`                                            | —            | 原生 name                                                    |
| form          | `string`                                            | —            | 原生 form，用于关联外部表单                                  |
| size          | `'small' \| 'default' \| 'large'`                   | `'default'`  | 输入框尺寸                                                   |
| prefixIcon    | `string \| Component`                               | —            | 前缀图标，仅普通 input 生效                                  |
| suffixIcon    | `string \| Component`                               | —            | 后缀图标，仅普通 input 生效                                  |
| autofocus     | `boolean`                                           | `false`      | 原生 autofocus                                               |
| tabindex      | `string \| number`                                  | —            | 原生 tabindex                                                |
| rows          | `number \| string`                                  | `2`          | textarea 行数，仅 textarea 生效                              |
| resize        | `'none' \| 'both' \| 'horizontal' \| 'vertical'`    | `'vertical'` | textarea resize，仅 textarea 生效                            |
| autosize      | `boolean \| { minRows?: number; maxRows?: number }` | `false`      | textarea 自动高度，仅 textarea 生效                          |

### Input Events

| 名称              | 类型                          | 说明                                |
| ----------------- | ----------------------------- | ----------------------------------- |
| update:modelValue | `(value: string) => void`     | 输入值更新时触发                    |
| input             | `(value: string) => void`     | 输入时触发                          |
| change            | `(value: string) => void`     | change 时触发                       |
| focus             | `(event: FocusEvent) => void` | 聚焦时触发                          |
| blur              | `(event: FocusEvent) => void` | 失焦时触发                          |
| clear             | `() => void`                  | 点击清空按钮或调用 clear 方法时触发 |

### Input Slots

| 名称    | 说明                                           |
| ------- | ---------------------------------------------- |
| prefix  | 前缀内容，仅普通 input 生效，优先于 prefixIcon |
| suffix  | 后缀内容，仅普通 input 生效，优先于 suffixIcon |
| prepend | 前置复合内容，仅普通 input 生效                |
| append  | 后置复合内容，仅普通 input 生效                |

### Input Exposes

| 名称     | 类型                                                        | 说明             |
| -------- | ----------------------------------------------------------- | ---------------- |
| inputRef | `Ref<HTMLInputElement \| HTMLTextAreaElement \| undefined>` | 原生输入元素引用 |
| focus    | `() => Promise<void>`                                       | 聚焦输入元素     |
| blur     | `() => void`                                                | 让输入元素失焦   |
| select   | `() => void`                                                | 选中文本         |
| clear    | `() => void`                                                | 清空输入值       |
