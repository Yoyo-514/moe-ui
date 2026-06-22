# Dropdown 下拉菜单

用于将一组操作收纳到浮层菜单中，适合页面工具栏、卡片操作区、用户头像菜单等场景。Dropdown 基于 Tooltip 的浮层能力实现，菜单项支持图标、分割线、禁用态和业务命令回传。

## 基础用法

<preview path="../examples/dropdown/basic.vue" title="基础用法" description="通过 dropdown 插槽声明菜单内容，点击菜单项后触发 command 事件。"></preview>

## 位置

<preview path="../examples/dropdown/placement.vue" title="位置" description="通过 placement 设置菜单出现位置，支持 Popper 常见方位。"></preview>

## 触发对象

<preview path="../examples/dropdown/trigger-custom.vue" title="触发对象" description="普通模式以默认插槽内容作为触发对象；split-button 模式下，下拉菜单会对准右侧箭头按钮。"></preview>

## 触发方式

<preview path="../examples/dropdown/trigger-mode.vue" title="触发方式" description="默认 hover 触发，也可以通过 trigger 设置为 click。"></preview>

## 菜单隐藏方式

<preview path="../examples/dropdown/hide-on-click.vue" title="菜单隐藏方式" description="hideOnClick 可以控制点击菜单项后是否自动关闭菜单。"></preview>

## 指令事件

<preview path="../examples/dropdown/command.vue" title="指令事件" description="点击菜单项会触发 command 事件，command 支持 string、number 和 object。"></preview>

## 下拉方法

<preview path="../examples/dropdown/methods.vue" title="下拉方法" description="通过组件实例暴露的 open 和 close 方法可以主动控制菜单显隐。"></preview>

## 尺寸

<preview path="../examples/dropdown/size.vue" title="尺寸" description="size 会影响 split-button 的按钮尺寸，也会同步影响菜单项尺寸。"></preview>

## API

### Dropdown Props

| 名称                      | 类型                                 | 默认值                | 说明                                                |
| ------------------------- | ------------------------------------ | --------------------- | --------------------------------------------------- |
| type                      | `ButtonType`                         | —                     | split-button 模式下按钮类型，与 Button 组件保持一致 |
| size                      | `ButtonSize`                         | —                     | split-button 模式下按钮尺寸，同时会影响菜单项尺寸   |
| splitButton               | `boolean`                            | `false`               | 是否展示为分裂按钮                                  |
| disabled                  | `boolean`                            | `false`               | 是否禁用整个 Dropdown                               |
| trigger                   | `TooltipTrigger \| TooltipTrigger[]` | `'hover'`             | 触发方式，支持 `hover`、`click`                     |
| placement                 | `Placement`                          | `'bottom'`            | 菜单出现位置，基于 Popper 方位                      |
| hideOnClick               | `boolean`                            | `true`                | 点击菜单项后是否自动关闭                            |
| showAfter                 | `number`                             | `150`                 | 延迟显示时间，单位 ms                               |
| hideAfter                 | `number`                             | `150`                 | 延迟隐藏时间，单位 ms                               |
| effect                    | `'dark' \| 'light'`                  | `'light'`             | 浮层主题                                            |
| visible / v-model:visible | `boolean`                            | —                     | 组件可见性                                          |
| transition                | `string`                             | `'moe-dropdown-fade'` | 过渡动画名称                                        |
| items                     | `DropdownItemProps[]`                | `[]`                  | 简单菜单项配置；复杂内容推荐使用 `dropdown` 插槽    |

`ButtonType`、`ButtonSize` 与 Button 组件保持一致。

`Placement` 与 `TooltipTrigger` 继承自 Tooltip / Popper 能力，`Placement` 支持 `top`、`bottom-start`、`right-end` 等 Popper 方位。

### DropdownItemProps

| 名称     | 类型                         | 默认值  | 说明                           |
| -------- | ---------------------------- | ------- | ------------------------------ |
| command  | `string \| number \| object` | —       | 点击菜单项时回传的业务命令     |
| icon     | `string \| Component`        | —       | 菜单项图标                     |
| disabled | `boolean`                    | `false` | 是否禁用菜单项                 |
| divided  | `boolean`                    | `false` | 是否在当前菜单项上方展示分割线 |

当 `command` 为 `object` 时，组件不会将对象直接渲染为文本，避免出现 `[object Object]`。此时应通过默认插槽提供展示文案，`command` 只作为业务 payload 原样回传。

```vue
<moe-dropdown-item :command="{ action: 'archive', id: 1 }">
  归档项目
</moe-dropdown-item>
```

### Dropdown Emits

| 名称           | 参数                       | 说明                                    |
| -------------- | -------------------------- | --------------------------------------- |
| update:visible | `(value: boolean)`         | 可见状态变化时触发，可配合 v-model 使用 |
| command        | `(value: DropdownCommand)` | 点击非禁用菜单项时触发                  |
| click          | `(event: MouseEvent)`      | split-button 模式下点击主按钮时触发     |

### Dropdown Slots

| 名称     | 说明                                              |
| -------- | ------------------------------------------------- |
| default  | 触发 Dropdown 的内容；split-button 下为主按钮文案 |
| dropdown | 自定义下拉菜单内容，通常放置 DropdownMenu         |

### Dropdown Exposes

| 名称  | 类型         | 说明         |
| ----- | ------------ | ------------ |
| open  | `() => void` | 打开下拉菜单 |
| close | `() => void` | 关闭下拉菜单 |

### DropdownMenu Slots

| 名称    | 说明                            |
| ------- | ------------------------------- |
| default | 菜单内容，通常放置 DropdownItem |

### DropdownItem Props

| 名称     | 类型                         | 默认值  | 说明                           |
| -------- | ---------------------------- | ------- | ------------------------------ |
| command  | `string \| number \| object` | —       | 点击菜单项时回传的业务命令     |
| icon     | `string \| Component`        | —       | 菜单项图标                     |
| disabled | `boolean`                    | `false` | 是否禁用菜单项                 |
| divided  | `boolean`                    | `false` | 是否在当前菜单项上方展示分割线 |

### DropdownItem Slots

| 名称    | 说明             |
| ------- | ---------------- |
| default | 菜单项显示内容   |
| icon    | 自定义菜单项图标 |
