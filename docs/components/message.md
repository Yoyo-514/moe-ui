# Message 消息提示

用于全局展示轻量反馈信息，适合保存成功、复制失败、网络异常等短文本提示。Message 是命令式组件，默认挂载到 `document.body`，支持自动关闭、手动关闭和多条消息堆叠。

## 基础用法

<preview path="../examples/message/basic.vue" title="基础用法" description="支持直接传入文本，也可以通过 options.message 传入 VNode。"></preview>

## 不同状态

<preview path="../examples/message/type.vue" title="不同状态" description="支持 primary、success、warning、info、danger，error 会作为 danger 的别名。"></preview>

## 可关闭消息提示

<preview path="../examples/message/closable.vue" title="可关闭消息提示" description="showClose 为 true 时会展示关闭按钮。"></preview>

## Placement

<preview path="../examples/message/placement.vue" title="Placement" description="placement 支持 top 和 bottom。"></preview>

## 方法调用

<preview path="../examples/message/methods.vue" title="方法调用" description="调用 MoeMessage 会返回 handler，可通过 handler.close() 关闭当前消息，也可以通过 closeAll() 关闭全部消息。"></preview>

## 单独引用

<preview path="../examples/message/import.vue" title="单独引用" description="可以从 @moe-ui/components 或 moe-cute-ui 中单独引入 MoeMessage。"></preview>

## API

### Message 方法

```ts
import { MoeMessage } from 'moe-cute-ui'

MoeMessage('普通消息')
MoeMessage.success('成功消息')
MoeMessage.warning('警告消息')
MoeMessage.info('信息消息')
MoeMessage.danger('危险消息')
MoeMessage.error('错误消息')
```

### Message Options

| 名称      | 类型                                                                   | 默认值   | 说明                                       |
| --------- | ---------------------------------------------------------------------- | -------- | ------------------------------------------ |
| message   | `string \| VNode \| (() => VNode)`                                     | `''`     | 消息内容                                   |
| duration  | `number`                                                               | `3000`   | 自动关闭时间，单位 ms；为 `0` 时不自动关闭 |
| showClose | `boolean`                                                              | `false`  | 是否展示关闭按钮                           |
| offset    | `number`                                                               | `20`     | 第一条消息距离边缘的偏移                   |
| zIndex    | `number`                                                               | —        | 自定义层级，不传时使用内部 z-index 序列    |
| placement | `'top' \| 'bottom'`                                                    | `'top'`  | 消息出现位置                               |
| type      | `'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| 'error'` | `'info'` | 消息类型，`error` 会归一化为 `danger`      |
| onClose   | `() => void`                                                           | —        | 消息关闭时触发                             |

### Message Handler

调用 `MoeMessage` 会返回一个 handler：

```ts
const handler = MoeMessage({
  message: '不会自动关闭',
  duration: 0,
})

handler.close()
```

| 名称  | 类型         | 说明         |
| ----- | ------------ | ------------ |
| close | `() => void` | 关闭当前消息 |

### 全局方法

全量安装后，组件库会注册：

```ts
app.config.globalProperties.$message = MoeMessage
```

因此在 Vue 组件实例中可以使用：

```ts
this.$message('普通消息')
this.$message.success('成功消息')
this.$message.closeAll()
```

### 全部关闭

```ts
MoeMessage.closeAll()
```
