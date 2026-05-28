<script setup>
import Basic from '../examples/icon/basic.vue'
import basicSource from '../examples/icon/basic.vue?raw'
import Type from '../examples/icon/type.vue'
import typeSource from '../examples/icon/type.vue?raw'
import Size from '../examples/icon/size.vue'
import sizeSource from '../examples/icon/size.vue?raw'
import Color from '../examples/icon/color.vue'
import colorSource from '../examples/icon/color.vue?raw'
</script>

# Icon 图标

基于 Iconify 的图标组件，提供 Moe UI 风格的类型颜色、尺寸和基础事件封装。

## 基础用法

<DemoBlock title="基础用法" description="传入 Iconify 图标名称即可渲染图标。" :source="basicSource">
  <Basic />
</DemoBlock>

## 类型颜色

<DemoBlock title="类型颜色" description="通过 type 使用组件库内置语义色。" :source="typeSource">
  <Type />
</DemoBlock>

## 尺寸

<DemoBlock title="尺寸" description="内置 xs 到 4xl 的常用图标尺寸。" :source="sizeSource">
  <Size />
</DemoBlock>

## 自定义颜色

<DemoBlock title="自定义颜色" description="color 可覆盖图标颜色，适合局部强调。" :source="colorSource">
  <Color />
</DemoBlock>

## API

### Props

| 名称           | 类型                                                                          | 默认值  | 说明                        |
| -------------- | ----------------------------------------------------------------------------- | ------- | --------------------------- |
| icon           | `IconifyIcon \| string`                                                       | —       | 图标名称或 Iconify 图标对象 |
| type           | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'`                   | —       | 主题类型颜色                |
| color          | `string`                                                                      | —       | 自定义颜色                  |
| size           | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'`             | —       | 预设尺寸                    |
| width          | `string \| number`                                                            | —       | 自定义宽度，优先级高于 size |
| height         | `string \| number`                                                            | —       | 自定义高度，优先级高于 size |
| flip           | `'horizontal' \| 'vertical' \| 'both'`                                        | —       | 翻转方向                    |
| rotate         | `number`                                                                      | —       | 旋转角度                    |
| spin           | `boolean`                                                                     | `false` | 是否使用旋转动画            |
| animation      | `'spin' \| 'spin-pulse' \| 'beat' \| 'fade' \| 'bounce' \| 'shake' \| 'ping'` | —       | 内置动画                    |
| duration       | `number`                                                                      | —       | 动画持续时间，单位 ms       |
| hoverIcon      | `string`                                                                      | —       | hover 时切换的图标          |
| hoverColor     | `string`                                                                      | —       | hover 时的颜色              |
| hoverAnimation | `IconProps['animation']`                                                      | —       | hover 时的动画              |

### Emits

| 名称  | 参数                  | 说明               |
| ----- | --------------------- | ------------------ |
| click | `(event: MouseEvent)` | 点击图标时触发     |
| load  | `()`                  | 图标加载成功时触发 |
| error | `(iconName: string)`  | 图标加载失败时触发 |
