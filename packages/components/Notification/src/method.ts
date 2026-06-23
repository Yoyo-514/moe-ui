import { createVNode, isVNode, nextTick, render, type App } from 'vue'

import { isPlainObject, isString } from 'lodash-es'

import { useZIndex } from '@moe-ui/hooks'

import {
  NOTIFICATION_DEFAULT_DURATION,
  NOTIFICATION_DEFAULT_OFFSET,
  NOTIFICATION_DEFAULT_POSITION,
  NOTIFICATION_DEFAULT_TYPE,
  NOTIFICATION_GAP,
  NOTIFICATION_HEIGHT,
} from './constants'
import NotificationConstructor from './Notification.vue'
import { notificationTypes } from './types'

import type {
  Notification,
  NotificationAliasType,
  NotificationContext,
  NotificationExposed,
  NotificationHandler,
  NotificationOptions,
  NotificationParams,
  NotificationPosition,
  NotificationProps,
  NotificationType,
} from './types'

interface InternalNotificationContext extends NotificationContext {
  container: HTMLDivElement
  baseOffset: number
  destroyTimer?: ReturnType<typeof setTimeout>
}

const instances: InternalNotificationContext[] = []
let seed = 0

const normalizeType = (type?: NotificationAliasType): NotificationType => {
  if (type === 'error') return 'danger'
  return type ?? NOTIFICATION_DEFAULT_TYPE
}

const normalizeOptions = (
  params?: NotificationParams,
  type?: NotificationAliasType
): NotificationOptions => {
  if (isString(params) || isVNode(params)) {
    return {
      message: params as NotificationOptions['message'],
      type: normalizeType(type),
    }
  }

  if (isPlainObject(params)) {
    const options = params as NotificationOptions
    return {
      ...options,
      type: normalizeType(type ?? options.type),
    }
  }

  return {
    type: normalizeType(type),
  }
}

const getInstancesByPosition = (position: NotificationPosition) =>
  instances.filter((item) => item.props.position === position)

const getNotificationElement = (context: InternalNotificationContext) =>
  context.container.firstElementChild as HTMLElement | null

const getNotificationHeight = (context: InternalNotificationContext) => {
  const element = getNotificationElement(context)

  return element?.offsetHeight || NOTIFICATION_HEIGHT
}

const getOffset = (position: NotificationPosition, baseOffset: number) =>
  getInstancesByPosition(position).reduce(
    (offset, item) =>
      Math.max(
        offset,
        (item.props.offset ?? item.baseOffset) + getNotificationHeight(item) + NOTIFICATION_GAP
      ),
    baseOffset
  )

const getExposed = (context: InternalNotificationContext) =>
  context.vm.exposed as NotificationExposed | undefined

const updateOffsets = async (position: NotificationPosition) => {
  await nextTick()
  let previousBottom = -NOTIFICATION_GAP

  getInstancesByPosition(position).forEach((item) => {
    const offset = Math.max(item.baseOffset, previousBottom + NOTIFICATION_GAP)

    item.props.offset = offset
    previousBottom = offset + getNotificationHeight(item)
  })
}

const removeNotification = (context: InternalNotificationContext) => {
  const index = instances.indexOf(context)
  if (index === -1) return

  if (context.destroyTimer) {
    clearTimeout(context.destroyTimer)
    context.destroyTimer = undefined
  }

  instances.splice(index, 1)
  render(null, context.container)
  context.container.remove()
  updateOffsets(context.props.position ?? NOTIFICATION_DEFAULT_POSITION)
}

const closeNotification = (context: InternalNotificationContext) => {
  getExposed(context)?.close()
  context.destroyTimer = setTimeout(() => removeNotification(context), 200)
}

const createNotification = (
  params?: NotificationParams,
  type?: NotificationAliasType
): NotificationHandler => {
  if (typeof document === 'undefined') {
    return {
      close: () => undefined,
    }
  }

  const options = normalizeOptions(params, type)
  const position = options.position ?? NOTIFICATION_DEFAULT_POSITION
  const baseOffset = options.offset ?? NOTIFICATION_DEFAULT_OFFSET
  const id = (options as NotificationOptions & { id?: string }).id ?? `moe-notification-${seed++}`
  const container = document.createElement('div')
  const { nextZIndex } = useZIndex(options.zIndex)

  const props: NotificationProps & {
    onDestroy: () => void
  } = {
    id,
    title: options.title,
    message: options.message,
    type: normalizeType(options.type),
    icon: options.icon,
    duration: options.duration ?? NOTIFICATION_DEFAULT_DURATION,
    position,
    showClose: options.showClose ?? true,
    onClose: options.onClose,
    onClick: options.onClick,
    offset: getOffset(position, baseOffset),
    zIndex: options.zIndex ?? nextZIndex(),
    onDestroy: () => undefined,
  }

  const vnode = createVNode(NotificationConstructor, props as unknown as Record<string, unknown>)
  const handler: NotificationHandler = {
    close: () => closeNotification(context),
  }
  const context = {} as InternalNotificationContext

  props.onDestroy = () => removeNotification(context)
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
    props: vnode.component.props as unknown as NotificationProps,
    handler,
    container,
    baseOffset,
  })

  document.body.appendChild(container)
  instances.push(context)

  return handler
}

const notification = createNotification as Notification

notificationTypes.forEach((type) => {
  notification[type] = (params?: NotificationParams) => createNotification(params, type)
})

notification.error = (params?: NotificationParams) => createNotification(params, 'error')

notification.closeAll = () => {
  ;[...instances].forEach((item) => closeNotification(item))
}

export const MoeNotification = Object.assign(notification, {
  install(app: App) {
    app.config.globalProperties.$notification = notification
  },
})

export { instances as notificationInstances }
