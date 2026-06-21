# Loading 加载

用于在加载数据或执行异步操作时展示遮罩反馈，支持指令和服务两种调用方式。

## 区域加载

通过 `v-loading` 可以在局部容器上展示加载状态。

<preview path="../examples/loading/basic.vue" title="区域加载" description="Loading 会覆盖绑定指令的容器。"></preview>

## 自定义加载中组件内容

可以通过 `moe-loading-text`、`moe-loading-spinner`、`moe-loading-background` 和 `moe-loading-custom-class` 自定义加载文案、图标、背景和 class。

<preview path="../examples/loading/custom.vue" title="自定义加载中组件内容" description="指令支持自定义加载文案、图标、背景和 class。"></preview>

## 让加载组件铺满整个屏幕

作为指令使用时，全屏 Loading 需要使用 `fullscreen`，此时遮罩会挂载到 `body`；如果希望禁止页面滚动，可以配合 `lock`。作为服务使用时，Loading 默认就是全屏。

<preview path="../examples/loading/fullscreen.vue" title="让加载组件铺满整个屏幕" description="v-loading.fullscreen.lock 会创建全屏加载。"></preview>

## 以服务的方式来调用

通过 `MoeLoading.service()` 可以命令式创建 Loading，并通过返回实例的 `close()` 方法关闭。

<preview path="../examples/loading/service.vue" title="以服务的方式来调用" description="服务调用适合全屏加载或命令式流程。"></preview>

## API

### 指令

| 名称                       | 说明                          |
| -------------------------- | ----------------------------- |
| `v-loading`                | 是否显示 Loading              |
| `moe-loading-text`         | 加载文案                      |
| `moe-loading-spinner`      | 加载图标，传入 Iconify 图标名 |
| `moe-loading-background`   | 遮罩背景色                    |
| `moe-loading-custom-class` | 自定义遮罩 class              |

### Loading Service

```ts
import { MoeLoading } from 'moe-cute-ui'

const instance = MoeLoading.service({
  text: '加载中',
})

instance.close()
```

### Loading Options

| 名称        | 类型                         | 默认值                    | 说明                                    |
| ----------- | ---------------------------- | ------------------------- | --------------------------------------- |
| target      | `HTMLElement \| string`      | `document.body`           | 挂载目标                                |
| body        | `boolean`                    | `false`                   | 是否挂载到 body                         |
| fullscreen  | `boolean`                    | service 默认 `true`       | 是否全屏                                |
| lock        | `boolean`                    | `false`                   | 是否锁定 body 滚动                      |
| text        | `string \| VNode \| VNode[]` | `''`                      | 加载文案或自定义内容                    |
| spinner     | `string`                     | `'mingcute:loading-line'` | 加载图标，传入 Iconify 图标名           |
| background  | `string`                     | `''`                      | 遮罩背景色                              |
| customClass | `string`                     | `''`                      | 自定义遮罩 class                        |
| zIndex      | `number`                     | —                         | 自定义层级，不传时使用内部 z-index 序列 |

### Loading Instance

| 名称  | 类型         | 说明             |
| ----- | ------------ | ---------------- |
| close | `() => void` | 关闭当前 Loading |

全量安装时会注册 `$loading` 到 `app.config.globalProperties`，因此也可以在组件实例中使用：

```ts
this.$loading({ text: '加载中' })
```
