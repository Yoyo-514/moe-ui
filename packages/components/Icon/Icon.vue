<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { omit } from 'lodash-es'
import { computed, ref } from 'vue'
import { SIZE_MAP } from './constants'
import type { IconEmits, IconProps } from './types'

defineOptions({
  name: 'MoeIcon',
  inheritAttrs: false,
})

const props = defineProps<IconProps>()
const emit = defineEmits<IconEmits>()

const isHovered = ref(false)

// Moe 扩展属性列表
const MOE_PROPS = [
  'type',
  'color',
  'spin',
  'size',
  'animation',
  'duration',
  'hoverIcon',
  'hoverColor',
  'hoverAnimation',
]

// 过滤掉 Moe 扩展属性，只传递 Iconify 原生属性
const filterProps = computed(() => omit(props, MOE_PROPS))

// 计算尺寸：优先使用 width/height，其次使用预设 size
const computedSize = computed(() => {
  if (props.width || props.height) return {}
  if (props.size) return { width: SIZE_MAP[props.size], height: SIZE_MAP[props.size] }
  return {}
})

// 当前显示的图标
const currentIcon = computed(() =>
  isHovered.value && props.hoverIcon ? props.hoverIcon : props.icon
)

// 转换 flip 属性：'both' -> 'horizontal,vertical'
const computedFlip = computed(() => {
  if (props.flip === 'both') return 'horizontal,vertical'
  return props.flip
})

// 合并传递给 Iconify 的 props
const iconifyProps = computed(() => ({
  ...filterProps.value,
  ...computedSize.value,
  icon: currentIcon.value,
  flip: computedFlip.value,
}))

// 动画类名
const animationClass = computed(() => {
  const anim = isHovered.value && props.hoverAnimation ? props.hoverAnimation : props.animation
  if (!isHovered.value && props.spin) return 'animation-spin'
  if (anim) return `animation-${anim}`
  return ''
})

// 自定义样式
const customStyles = computed(() => ({
  color: (isHovered.value && props.hoverColor ? props.hoverColor : props.color) ?? void 0,
  '--moe-icon-duration': props.duration ? `${props.duration}ms` : void 0,
}))

// 类名
const classes = computed(() => [
  { [`moe-icon--${props.type}`]: props.type },
  { [`moe-icon--${props.size}`]: props.size },
  animationClass.value,
])

// 事件处理
const handleClick = (e: MouseEvent) => emit('click', e)
const handleLoad = () => emit('load')
const handleError = () => emit('error', typeof props.icon === 'string' ? props.icon : 'unknown')
</script>

<template>
  <i
    class="moe-icon"
    :class="classes"
    :style="customStyles"
    v-bind="$attrs"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <Icon v-bind="iconifyProps" @load="handleLoad" @error="handleError" />
  </i>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
