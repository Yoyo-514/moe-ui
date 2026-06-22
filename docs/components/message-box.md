# MessageBox 消息弹框

用于模拟系统消息框，适合展示需要用户确认的操作、危险动作确认或简单输入。MessageBox 是命令式组件，默认挂载到 `document.body`。

## 消息提示

当只需要提示用户阅读一段信息，并等待用户确认时，可以使用 `MoeMessageBox.alert`。

<preview path="../examples/message-box/alert.vue" title="消息提示" description="用于只需要用户确认阅读的信息。"></preview>

## 确认消息

当操作需要用户确认或取消时，可以使用 `MoeMessageBox.confirm`。

<preview path="../examples/message-box/confirm.vue" title="确认消息" description="用于需要用户确认或取消的操作。"></preview>

## 提交内容

当需要收集简单文本输入时，可以使用 `MoeMessageBox.prompt`。`prompt` 支持 `inputValidator`、`inputPattern` 与 `inputErrorMessage`。

<preview path="../examples/message-box/prompt.vue" title="提交内容" description="用于收集简单文本输入，并支持 inputValidator 校验。"></preview>

## 使用 VNode

`message` 支持 `VNode` 或返回 `VNode` 的函数，用于渲染更灵活的内容。

<preview path="../examples/message-box/vnode.vue" title="使用 VNode" description="message 可以传入 VNode 或返回 VNode 的函数。"></preview>

## 使用带有事件处理函数的 VNode

如果内容中需要绑定事件，可以传入函数形式的 `message`，在函数中返回带事件的 VNode。

<preview path="../examples/message-box/vnode-event.vue" title="使用带有事件处理函数的 VNode" description="VNode 内容可以绑定 click 等事件。"></preview>

## 个性化

MessageBox 支持自定义按钮文本、按钮类型、按钮尺寸、圆角按钮以及居中布局。

<preview path="../examples/message-box/button-custom.vue" title="个性化" description="支持自定义按钮文本、类型、尺寸、圆角和居中布局。"></preview>

## 区分取消操作与关闭操作

默认情况下，关闭按钮、遮罩关闭和 ESC 关闭会按 `cancel` 处理。设置 `distinguishCancelAndClose` 后，可以区分 `cancel` 和 `close`。

<preview path="../examples/message-box/distinguish.vue" title="区分取消操作与关闭操作" description="设置 distinguishCancelAndClose 后可以区分 cancel 和 close。"></preview>

## 内容居中

设置 `center` 后，标题、内容和底部按钮会居中显示。该能力也可以和 `roundButton`、`buttonSize` 一起使用。

<preview path="../examples/message-box/button-custom.vue" title="内容居中" description="center 可以让弹框内容和按钮居中。"></preview>

## 自定义图标

`type` 会提供默认状态图标；如果需要完全自定义，可以传入 `icon` 和 `closeIcon`。

<preview path="../examples/message-box/icon-custom.vue" title="自定义图标" description="支持自定义状态图标和关闭图标。"></preview>

## 全局方法

全量安装后，组件库会注册 `$messageBox`、`$msgbox`、`$alert`、`$confirm` 和 `$prompt`。

<preview path="../examples/message-box/method-global.vue" title="全局方法" description="全量安装后可以通过组件实例全局方法调用。"></preview>

## 按需引入

<preview path="../examples/message-box/import.vue" title="按需引入" description="可以从 @moe-ui/components 或 moe-cute-ui 中单独引入 MoeMessageBox。"></preview>

## API

### 配置项

| 名称                      | 类型                                                                 | 默认值                  | 说明                                              |
| ------------------------- | -------------------------------------------------------------------- | ----------------------- | ------------------------------------------------- |
| title                     | `string`                                                             | `''`                    | 标题                                              |
| message                   | `string \| VNode \| (() => VNode)`                                   | `''`                    | 内容                                              |
| type                      | `'' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger'`    | `''`                    | 消息类型，用于默认图标和状态 class                |
| icon                      | `string \| Component`                                                | —                       | 自定义图标，优先级高于 type 默认图标              |
| closeIcon                 | `string \| Component`                                                | `'mingcute:close-line'` | 自定义关闭图标                                    |
| modal                     | `boolean`                                                            | `true`                  | 是否显示遮罩层                                    |
| modalClass                | `string`                                                             | `''`                    | 自定义遮罩层 class                                |
| callback                  | `Function`                                                           | `null`                  | 关闭回调；如果不想使用 Promise，可以使用 callback |
| showClose                 | `boolean`                                                            | `true`                  | 是否显示右上角关闭按钮                            |
| beforeClose               | `Function`                                                           | `null`                  | 关闭前回调，调用 done 后才真正关闭                |
| distinguishCancelAndClose | `boolean`                                                            | `false`                 | 是否区分取消和关闭动作                            |
| showCancelButton          | `boolean`                                                            | `false`                 | 是否显示取消按钮；confirm / prompt 中默认为 true  |
| showConfirmButton         | `boolean`                                                            | `true`                  | 是否显示确认按钮                                  |
| cancelButtonText          | `string`                                                             | `'取消'`                | 取消按钮文本                                      |
| confirmButtonText         | `string`                                                             | `'确认'`                | 确认按钮文本                                      |
| cancelButtonType          | `ButtonType \| ''`                                                   | `''`                    | 取消按钮类型                                      |
| confirmButtonType         | `ButtonType \| ''`                                                   | `'primary'`             | 确认按钮类型                                      |
| closeOnClickModal         | `boolean`                                                            | `true`                  | 点击遮罩层是否关闭                                |
| closeOnPressEscape        | `boolean`                                                            | `true`                  | 按下 ESC 是否关闭                                 |
| closeOnHashChange         | `boolean`                                                            | `true`                  | hashchange 时是否关闭                             |
| showInput                 | `boolean`                                                            | `false`                 | 是否展示输入框；prompt 中默认为 true              |
| inputPlaceholder          | `string`                                                             | `''`                    | 输入框 placeholder                                |
| inputType                 | `string`                                                             | `'text'`                | 输入框 type，支持 textarea                        |
| inputValue                | `string`                                                             | `''`                    | 输入框初始值                                      |
| inputValidator            | `(value: string) => boolean \| string \| Promise<boolean \| string>` | —                       | 输入校验函数                                      |
| inputPattern              | `RegExp`                                                             | —                       | 输入正则校验                                      |
| inputErrorMessage         | `string`                                                             | `'输入内容不合法'`      | 输入校验失败时的错误提示                          |
| center                    | `boolean`                                                            | `false`                 | 是否居中布局内容和按钮                            |
| roundButton               | `boolean`                                                            | `false`                 | 是否使用圆角按钮                                  |
| buttonSize                | `'small' \| 'default' \| 'large'`                                    | `'default'`             | 按钮尺寸                                          |
| customClass               | `string`                                                             | `''`                    | 自定义弹框 class                                  |
| customStyle               | `CSSProperties`                                                      | `{}`                    | 自定义弹框 style                                  |
| autofocus                 | `boolean`                                                            | `true`                  | 打开后是否自动聚焦输入框                          |
| lockScroll                | `boolean`                                                            | `true`                  | 打开遮罩弹框时是否锁定 body 滚动                  |
| zIndex                    | `number`                                                             | —                       | 自定义层级，不传时使用内部 z-index 序列           |

### 方法

```ts
import { MoeMessageBox } from 'moe-cute-ui'

MoeMessageBox(options)
MoeMessageBox.alert(message, title?, options?)
MoeMessageBox.confirm(message, title?, options?)
MoeMessageBox.prompt(message, title?, options?)
MoeMessageBox.closeAll()
```

### Promise 行为

```ts
MoeMessageBox.confirm('确定删除吗？')
  .then((action) => {
    // action === 'confirm'
  })
  .catch((action) => {
    // action === 'cancel' | 'close'
  })
```

`prompt` 确认后返回：

```ts
{
  action: 'confirm',
  value: string,
}
```

### beforeClose

```ts
MoeMessageBox.confirm('确定提交吗？', '提示', {
  beforeClose(action, instance, done) {
    if (action === 'confirm') {
      // 异步完成后再关闭
      done()
      return
    }

    done()
  },
})
```
