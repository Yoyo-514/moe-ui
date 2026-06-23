import { createVNode, isVNode, nextTick, render, type App } from 'vue'

import { isPlainObject, isString } from 'lodash-es'

import { getStackOffset, useZIndex } from '@moe-ui/hooks'

import {
  MESSAGE_DEFAULT_DURATION,
  MESSAGE_DEFAULT_OFFSET,
  MESSAGE_DEFAULT_PLACEMENT,
  MESSAGE_DEFAULT_TYPE,
  MESSAGE_GAP,
  MESSAGE_HEIGHT,
} from './constants'
import MessageConstructor from './Message.vue'
import { messageTypes } from './types'

import type {
  Message,
  MessageAliasType,
  MessageContext,
  MessageExposed,
  MessageHandler,
  MessageOptions,
  MessageParams,
  MessageProps,
  MessageType,
} from './types'

interface InternalMessageContext extends MessageContext {
  container: HTMLDivElement
  baseOffset: number
  destroyTimer?: ReturnType<typeof setTimeout>
}

const instances: InternalMessageContext[] = []
let seed = 0

const normalizeType = (type?: MessageAliasType): MessageType => {
  if (type === 'error') return 'danger'
  return type ?? MESSAGE_DEFAULT_TYPE
}

const normalizeOptions = (params?: MessageParams, type?: MessageAliasType): MessageOptions => {
  if (isString(params) || isVNode(params)) {
    return {
      message: params as MessageOptions['message'],
      type: normalizeType(type),
    }
  }

  if (isPlainObject(params)) {
    const options = params as MessageOptions
    return {
      ...options,
      type: normalizeType(type ?? options.type),
    }
  }

  return {
    type: normalizeType(type),
  }
}

const getInstancesByPlacement = (placement: MessageProps['placement']) =>
  instances.filter((item) => item.props.placement === placement)

const getOffset = (placement: MessageProps['placement'], baseOffset: number) =>
  getStackOffset(baseOffset, getInstancesByPlacement(placement).length, MESSAGE_HEIGHT, MESSAGE_GAP)

const getExposed = (context: InternalMessageContext) =>
  context.vm.exposed as MessageExposed | undefined

const updateOffsets = async (placement: MessageProps['placement'], baseOffset: number) => {
  await nextTick()
  getInstancesByPlacement(placement).forEach((item, index) => {
    item.props.offset = getStackOffset(baseOffset, index, MESSAGE_HEIGHT, MESSAGE_GAP)
  })
}

const removeMessage = (context: InternalMessageContext) => {
  const index = instances.indexOf(context)
  if (index === -1) return

  if (context.destroyTimer) {
    clearTimeout(context.destroyTimer)
    context.destroyTimer = undefined
  }

  instances.splice(index, 1)
  render(null, context.container)
  context.container.remove()
  updateOffsets(context.props.placement, context.baseOffset)
}

const closeMessage = (context: InternalMessageContext) => {
  getExposed(context)?.close()
  context.destroyTimer = setTimeout(() => removeMessage(context), 200)
}

const createMessage = (params?: MessageParams, type?: MessageAliasType): MessageHandler => {
  if (typeof document === 'undefined') {
    return {
      close: () => undefined,
    }
  }

  const options = normalizeOptions(params, type)
  const placement = options.placement ?? MESSAGE_DEFAULT_PLACEMENT
  const baseOffset = options.offset ?? MESSAGE_DEFAULT_OFFSET
  const id = (options as MessageOptions & { id?: string }).id ?? `moe-message-${seed++}`
  const container = document.createElement('div')
  const { nextZIndex } = useZIndex(options.zIndex)

  const props: MessageProps & {
    onDestroy: () => void
  } = {
    id,
    message: options.message,
    duration: options.duration ?? MESSAGE_DEFAULT_DURATION,
    showClose: options.showClose ?? false,
    offset: getOffset(placement, baseOffset),
    zIndex: options.zIndex ?? nextZIndex(),
    placement,
    type: normalizeType(options.type),
    onClose: options.onClose,
    onDestroy: () => undefined,
  }

  const vnode = createVNode(MessageConstructor, props as unknown as Record<string, unknown>)
  const handler: MessageHandler = {
    close: () => closeMessage(context),
  }
  const context = {} as InternalMessageContext

  props.onDestroy = () => removeMessage(context)
  render(vnode, container)

  if (!vnode.component) {
    render(null, container)
    return {
      close: () => undefined,
    }
  }

  Object.assign(context, {
    id,
    vnode,
    vm: vnode.component,
    props: vnode.component.props as unknown as MessageProps,
    handler,
    container,
    baseOffset,
  })

  document.body.appendChild(container)
  instances.push(context)

  return handler
}

const message = createMessage as Message

messageTypes.forEach((type) => {
  message[type] = (params?: MessageParams) => createMessage(params, type)
})

message.error = (params?: MessageParams) => createMessage(params, 'error')

message.closeAll = () => {
  ;[...instances].forEach((item) => closeMessage(item))
}

export const MoeMessage = Object.assign(message, {
  install(app: App) {
    app.config.globalProperties.$message = message
  },
})

export { instances as messageInstances }
