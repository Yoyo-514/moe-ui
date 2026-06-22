# Notification 通知

用于展示全局通知提醒，适合承载标题、描述和可点击操作反馈。Notification 默认从页面右上角弹出，支持四角位置、类型状态、自动关闭、手动关闭和全局方法调用。

## 基础用法

<preview path="../examples/notification/basic.vue" title="基础用法" description="通过 MoeNotification 打开一条基础通知。"></preview>

## 不同类型的通知

<preview path="../examples/notification/type.vue" title="不同类型的通知" description="支持 primary、success、warning、info、danger，error 会作为 danger 的别名。"></preview>

## 自定义消息弹出的位置

<preview path="../examples/notification/position.vue" title="自定义消息弹出的位置" description="position 支持 top-right、top-left、bottom-right、bottom-left。"></preview>

## 有位置偏移的通知栏

<preview path="../examples/notification/offset.vue" title="有位置偏移的通知栏" description="offset 可以控制通知距离窗口边缘的距离。"></preview>

## 函数形式的 message

<preview path="../examples/notification/message-render-function.vue" title="函数形式的 message" description="message 支持传入返回 VNode 的函数。"></preview>

## 隐藏关闭按钮

<preview path="../examples/notification/close-hidden.vue" title="隐藏关闭按钮" description="showClose 为 false 时会隐藏关闭按钮。"></preview>

## 全局方法

<preview path="../examples/notification/method-global.vue" title="全局方法" description="全量安装后会在 app.config.globalProperties 上注册 $notification，可以在组件实例中通过 this.$notification 调用。"></preview>

## 单独引用

<preview path="../examples/notification/import.vue" title="单独引用" description="可以从 @moe-ui/components 或 moe-cute-ui 中单独引入 MoeNotification。"></preview>

## API

### Notification 方法

```ts
import { MoeNotification } from 'moe-cute-ui'

MoeNotification('普通通知')
MoeNotification.success({ title: '成功', message: '保存成功' })
MoeNotification.warning({ title: '警告', message: '请检查输入' })
MoeNotification.info({ title: '信息', message: '这是一条信息' })
MoeNotification.danger({ title: '危险', message: '操作失败' })
MoeNotification.error({ title: '错误', message: 'error 是 danger 的别名' })
```

### Notification Options

| 名称      | 类型                                                                   | 默认值        | 说明                                       |
| --------- | ---------------------------------------------------------------------- | ------------- | ------------------------------------------ |
| title     | `string`                                                               | `''`          | 通知标题                                   |
| message   | `string \| VNode \| (() => VNode)`                                     | `''`          | 通知内容                                   |
| type      | `'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| 'error'` | `'info'`      | 通知类型，`error` 会归一化为 `danger`      |
| icon      | `string \| Component`                                                  | 类型默认图标  | 自定义图标；传入空字符串可隐藏图标         |
| duration  | `number`                                                               | `4500`        | 自动关闭时间，单位 ms；为 `0` 时不自动关闭 |
| position  | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'`         | `'top-right'` | 通知弹出位置                               |
| showClose | `boolean`                                                              | `true`        | 是否展示关闭按钮                           |
| onClose   | `() => void`                                                           | —             | 通知关闭时触发                             |
| onClick   | `() => void`                                                           | —             | 点击通知主体时触发                         |
| offset    | `number`                                                               | `16`          | 第一条通知距离窗口边缘的偏移               |
| zIndex    | `number`                                                               | —             | 自定义层级，不传时使用内部 z-index 序列    |

### Notification Handler

调用 `MoeNotification` 会返回一个 handler：

```ts
const handler = MoeNotification({
  title: '提示',
  message: '不会自动关闭',
  duration: 0,
})

handler.close()
```

| 名称  | 类型         | 说明         |
| ----- | ------------ | ------------ |
| close | `() => void` | 关闭当前通知 |

### 全局方法

全量安装后，组件库会注册：

```ts
app.config.globalProperties.$notification = MoeNotification
```

因此在 Vue 组件实例中可以使用：

```ts
this.$notification({ title: '提示', message: '普通通知' })
this.$notification.success({ title: '成功', message: '保存成功' })
this.$notification.closeAll()
```

### 全部关闭

```ts
MoeNotification.closeAll()
```
