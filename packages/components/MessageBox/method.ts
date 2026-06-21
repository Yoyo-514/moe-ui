import { createVNode, isVNode, render, type App } from 'vue'
import { isPlainObject, isString } from 'lodash-es'
import { useZIndex } from '@moe-ui/hooks'
import MessageBoxConstructor from './MessageBox.vue'
import {
  MESSAGE_BOX_CLOSE_ICON,
  MESSAGE_BOX_DEFAULT_OPTIONS,
  MESSAGE_BOX_DEFAULT_Z_INDEX,
} from './constants'
import type {
  MessageBox,
  MessageBoxAction,
  MessageBoxContext,
  MessageBoxData,
  MessageBoxOptions,
  MessageBoxParams,
  MessageBoxProps,
} from './types'

const instances: MessageBoxContext[] = []
let seed = 0

const normalizeOptions = (params?: MessageBoxParams): MessageBoxOptions => {
  if (isString(params) || isVNode(params) || typeof params === 'function') {
    return {
      message: params as MessageBoxOptions['message'],
    }
  }

  if (isPlainObject(params)) return params as MessageBoxOptions

  return {}
}

const normalizeShortcutOptions = (
  message: MessageBoxOptions['message'],
  titleOrOptions?: string | MessageBoxOptions,
  options?: MessageBoxOptions
): MessageBoxOptions => {
  if (isPlainObject(titleOrOptions)) {
    return {
      ...(titleOrOptions as MessageBoxOptions),
      message,
    }
  }

  return {
    ...options,
    title: typeof titleOrOptions === 'string' ? titleOrOptions : options?.title,
    message,
  }
}

const getExposed = (context: MessageBoxContext) =>
  context.vm.exposed as unknown as { close: () => void } | undefined

const removeMessageBox = (context: MessageBoxContext) => {
  const index = instances.indexOf(context)
  if (index !== -1) instances.splice(index, 1)

  render(null, context.container)
  context.container.remove()
}

const callCallback = (options: MessageBoxOptions, action: MessageBoxAction, value: string) => {
  if (!options.callback) return

  if (options.showInput) {
    ;(options.callback as (value: string, action: MessageBoxAction) => void)(value, action)
    return
  }

  ;(options.callback as (action: MessageBoxAction) => void)(action)
}

const createMessageBox = (params?: MessageBoxParams): Promise<MessageBoxData> => {
  if (typeof document === 'undefined') {
    return Promise.reject('close')
  }

  const options = normalizeOptions(params)
  const id = (options as MessageBoxOptions & { id?: string }).id ?? `moe-message-box-${seed++}`
  const container = document.createElement('div')
  document.body.appendChild(container)
  const { nextZIndex } = useZIndex(options.zIndex ?? MESSAGE_BOX_DEFAULT_Z_INDEX)

  let context = {} as MessageBoxContext

  const promise = new Promise<MessageBoxData>((resolve, reject) => {
    const props: MessageBoxProps & {
      onAction: (action: MessageBoxAction, value: string) => void
      onDestroy: () => void
    } = {
      ...MESSAGE_BOX_DEFAULT_OPTIONS,
      ...options,
      id,
      closeIcon: options.closeIcon ?? MESSAGE_BOX_CLOSE_ICON,
      customStyle: options.customStyle ?? {},
      zIndex: options.zIndex ?? nextZIndex(),
      onAction: (action, value) => {
        callCallback(options, action, value)

        if (action === 'confirm') {
          resolve(options.showInput ? { action, value } : action)
          return
        }

        reject(action)
      },
      onDestroy: () => removeMessageBox(context),
    }

    const vnode = createVNode(MessageBoxConstructor, props as unknown as Record<string, unknown>)
    render(vnode, container)

    if (!vnode.component) {
      render(null, container)
      container.remove()
      reject('close')
      return
    }

    context = {
      id,
      vnode,
      vm: vnode.component,
      props: vnode.component.props as unknown as MessageBoxProps,
      container,
    }

    instances.push(context)
  })

  return promise
}

const messageBox = createMessageBox as MessageBox

messageBox.alert = (
  message,
  titleOrOptions?: string | MessageBoxOptions,
  options?: MessageBoxOptions
) =>
  createMessageBox({
    ...normalizeShortcutOptions(message, titleOrOptions, options),
    showCancelButton: false,
    showConfirmButton: true,
  })

messageBox.confirm = (
  message,
  titleOrOptions?: string | MessageBoxOptions,
  options?: MessageBoxOptions
) =>
  createMessageBox({
    ...normalizeShortcutOptions(message, titleOrOptions, options),
    showCancelButton: true,
    showConfirmButton: true,
  })

messageBox.prompt = (
  message,
  titleOrOptions?: string | MessageBoxOptions,
  options?: MessageBoxOptions
) =>
  createMessageBox({
    ...normalizeShortcutOptions(message, titleOrOptions, options),
    showInput: true,
    showCancelButton: true,
    showConfirmButton: true,
  })

messageBox.closeAll = () => {
  ;[...instances].forEach((item) => getExposed(item)?.close())
}

export const MoeMessageBox = Object.assign(messageBox, {
  install(app: App) {
    app.config.globalProperties.$messageBox = messageBox
    app.config.globalProperties.$msgbox = messageBox
    app.config.globalProperties.$alert = messageBox.alert
    app.config.globalProperties.$confirm = messageBox.confirm
    app.config.globalProperties.$prompt = messageBox.prompt
  },
})

export { instances as messageBoxInstances }
