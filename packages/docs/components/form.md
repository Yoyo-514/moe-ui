---
title: Form 表单
---

# Form 表单

表单包含输入框、选择器、开关等控件，用于收集、校验和提交数据。

## 典型表单

最基础的表单包括各种输入控件，比如 `input`、`select`、`switch` 等。

在每一个 `form` 组件中，你需要一个 `form-item` 字段作为输入项的容器，用于获取值与验证值。

<preview path="../examples/form/typical.vue" title="典型表单" description="包含输入框、选择器、开关等基础控件"></preview>

## 行内表单

当垂直方向空间受限且表单较简单时，可以在一行内放置表单。

设置 `inline` 属性可以让表单域变为行内的排列方式。

<preview path="../examples/form/inline.vue" title="行内表单" description="设置 inline 属性让表单项水平排列"></preview>

## 对齐方式

根据设计情况，来选择最佳的标签对齐方式。

通过设置 `label-position` 属性可以改变表单域标签的位置，可选值为 `top`、`left`、`right`。当设为 `top` 时标签会置于表单域的顶部。

<preview path="../examples/form/label-position.vue" title="对齐方式" description="通过 label-position 控制标签位置"></preview>

## 表单校验

Form 组件允许你验证用户的输入是否符合规范，来找到和纠正错误。

在 `form-item` 上设置 `prop` 属性，对应 `model` 的字段名，然后在 `rules` 中配置校验规则。`trigger` 支持 `blur` 和 `change` 两种触发方式。

<preview path="../examples/form/basic.vue" title="表单校验" description="通过 rules 设置校验规则"></preview>

## 自定义校验规则

这个例子展示了如何使用自定义验证规则来完成密码的二次验证和年龄验证。

<preview path="../examples/form/custom-validation.vue" title="自定义校验规则" description="使用 validator 自定义校验逻辑"></preview>

## 表单验证与提交

配合 `validate` 方法进行提交验证，使用 `MoeMessage` 给出操作反馈。

<preview path="../examples/form/validation.vue" title="验证与提交" description="校验通过后提交，失败时显示错误"></preview>

## 尺寸控制

表单中的所有子组件都继承了该表单的 `size` 属性。同样，`form-item` 也有一个 `size` 属性。

如果希望某个表单项或某个表单组件的尺寸不同于 Form 上的 `size` 属性，直接为这个表单项或表单组件设置自己的 `size` 属性即可。内部组件显式设置的 `size` 优先级高于 Form 的 `size`。

<preview path="../examples/form/size.vue" title="尺寸控制" description="通过 size 统一控制表单尺寸"></preview>

## 禁用状态

通过 `disabled` 属性可以禁用整个表单内的所有组件。内部组件显式设置的 `disabled` 优先级高于 Form 的 `disabled`，因此可以通过 `:disabled="false"` 让某个控件保持可用。

<preview path="../examples/form/disabled.vue" title="禁用表单" description="整体禁用表单"></preview>

## 无障碍

组件已内置基础无障碍设计。`form-item` 的 `label` 使用原生 `<label>` 渲染，推荐为表单控件设置 `id`，并通过 `form-item` 的 `for` 属性指向该 `id`，从而建立明确的标签关联。

## Form API

### Form Attributes

| 属性名                    | 说明                                                                 | 类型                              | 默认值      |
| ------------------------- | -------------------------------------------------------------------- | --------------------------------- | ----------- |
| model                     | 表单数据对象                                                         | `Record<string, any>`             | —           |
| rules                     | 表单验证规则                                                         | `FormRules`                       | —           |
| inline                    | 是否行内表单                                                         | `boolean`                         | `false`     |
| label-position            | 标签位置                                                             | `'left' \| 'right' \| 'top'`      | `'right'`   |
| label-width               | 标签宽度，例如 `'50px'` 或 `'auto'`。所有直接子 form-item 会继承该值 | `string \| number`                | `''`        |
| label-suffix              | 标签后缀                                                             | `string`                          | `''`        |
| hide-required-asterisk    | 是否隐藏必填字段的红色星号                                           | `boolean`                         | `false`     |
| require-asterisk-position | 星号位置                                                             | `'left' \| 'right'`               | `'left'`    |
| show-message              | 是否显示校验错误信息                                                 | `boolean`                         | `true`      |
| inline-message            | 是否以行内形式展示校验信息                                           | `boolean`                         | `false`     |
| size                      | 用于控制该表单内组件的尺寸。内部组件显式设置 `size` 时优先级更高     | `'large' \| 'default' \| 'small'` | `'default'` |
| disabled                  | 是否禁用该表单内的所有组件。内部组件显式设置 `disabled` 时优先级更高 | `boolean`                         | `false`     |
| scroll-to-error           | 当校验失败时，滚动到第一个错误表单项                                 | `boolean`                         | `false`     |

### Form Events

| 事件名   | 说明                   | 回调参数                                                  |
| -------- | ---------------------- | --------------------------------------------------------- |
| validate | 任一表单项被校验后触发 | `(prop: FormItemProp, isValid: boolean, message: string)` |

### Form Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |

### Form Exposes

| 方法名        | 说明                                                         | 类型                                                                                     |
| ------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| validate      | 对整个表单的内容进行验证。接收一个回调函数，或返回 `Promise` | `(callback?: FormValidateCallback) => Promise<boolean>`                                  |
| validateField | 验证具体的某个字段                                           | `(props?: Arrayable<FormItemProp>, callback?: FormValidateCallback) => Promise<boolean>` |
| resetFields   | 重置该表单项，将其值重置为初始值，并移除校验结果             | `(props?: Arrayable<FormItemProp>) => void`                                              |
| scrollToField | 滚动到指定的字段                                             | `(prop: FormItemProp) => void`                                                           |
| clearValidate | 清理某个字段的表单验证信息                                   | `(props?: Arrayable<FormItemProp>) => void`                                              |

## FormItem API

### FormItem Attributes

| 属性名          | 说明                                                                               | 类型                                         | 默认值  |
| --------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- | ------- |
| prop            | `model` 的键名。在使用了 `validate`、`resetFields` 的方法时，该属性是必填的        | `string \| string[]`                         | —       |
| label           | 标签文本                                                                           | `string`                                     | —       |
| label-position  | 标签位置，设置后覆盖 Form 的 `label-position`                                      | `'left' \| 'right' \| 'top' \| ''`           | `''`    |
| label-width     | 标签宽度。覆盖 Form 的 `label-width`                                               | `string \| number`                           | —       |
| required        | 是否为必填项，如不设置，则会根据校验规则确认                                       | `boolean`                                    | —       |
| rules           | 表单验证规则，详见下方 FormItem Rule                                               | `FormItemRule \| FormItemRule[]`             | —       |
| error           | 表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 error，并显示该错误信息 | `string`                                     | —       |
| show-message    | 是否显示校验错误信息                                                               | `boolean`                                    | `true`  |
| inline-message  | 是否以行内形式展示校验信息                                                         | `boolean`                                    | `false` |
| size            | 用于控制该表单域下组件的尺寸                                                       | `'large' \| 'default' \| 'small' \| ''`      | —       |
| for             | 等同于原生 label 的 `for` 属性                                                     | `string`                                     | —       |
| validate-status | formItem 校验的状态                                                                | `'' \| 'success' \| 'error' \| 'validating'` | —       |

### FormItem Rule

| 属性名  | 说明         | 类型                                              |
| ------- | ------------ | ------------------------------------------------- |
| trigger | 校验触发方式 | `'blur' \| 'change' \| Array<'blur' \| 'change'>` |

其余属性继承自 [async-validator RuleItem](https://github.com/yiminghe/async-validator#rules)。

### FormItem Slots

| 名称    | 说明                     | 参数                |
| ------- | ------------------------ | ------------------- |
| default | 表单控件内容             | —                   |
| label   | 标签位置的自定义内容     | `{ label: string }` |
| error   | 验证错误信息的自定义内容 | `{ error: string }` |

### FormItem Exposes

| 名称            | 说明                                                 | 类型                                                                                   |
| --------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| size            | 表单项尺寸                                           | `ComputedRef<FormSize>`                                                                |
| validateMessage | 校验消息                                             | `Ref<string>`                                                                          |
| validateState   | 校验状态                                             | `Ref<'' \| 'success' \| 'error' \| 'validating'>`                                      |
| validate        | 验证表单项                                           | `(trigger?: FormValidateTrigger, callback?: FormValidateCallback) => Promise<boolean>` |
| resetField      | 对该表单项进行重置，将其值重置为初始值并移除校验结果 | `() => void`                                                                           |
| clearValidate   | 移除该表单项的校验结果                               | `() => void`                                                                           |
