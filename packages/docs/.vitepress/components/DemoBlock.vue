<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  source: string
}>()
</script>

<template>
  <section class="demo-block">
    <div v-if="title || description" class="demo-block__header">
      <p v-if="title" class="demo-block__title">{{ title }}</p>
      <p v-if="description" class="demo-block__description">{{ description }}</p>
    </div>

    <div class="demo-block__preview">
      <slot></slot>
    </div>

    <details class="demo-block__code">
      <summary class="demo-block__summary">查看源码</summary>
      <pre class="demo-block__pre"><code>{{ source.trim() }}</code></pre>
    </details>
  </section>
</template>

<style scoped lang="scss">
.demo-block {
  overflow: hidden;
  margin: 16px 0 24px;
  border: 1px solid var(--moe-border-color-lighter);
  border-radius: var(--moe-border-radius-base);
  background: var(--moe-surface-color);
  box-shadow: var(--moe-shadow-soft);
}

.demo-block__header {
  padding: 16px 18px 0;
}

.demo-block__title {
  margin: 0;
  color: var(--moe-text-color-primary);
  font-size: var(--moe-font-size-base);
  font-weight: 600;
}

.demo-block__description {
  margin: 6px 0 0;
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
  line-height: 1.7;
}

.demo-block__preview {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 18px;
}

.demo-block__preview :deep(.moe-button + .moe-button),
.demo-block__preview :deep(.moe-button-group + .moe-button-group) {
  margin-left: 0;
}

.demo-block__code {
  border-top: 1px solid var(--moe-border-color-lighter);
  background: var(--moe-fill-color-extra-light);
}

.demo-block__summary {
  padding: 11px 18px;
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
  cursor: pointer;
  user-select: none;
}

.demo-block__summary:hover {
  color: var(--moe-color-primary-strong);
}

.demo-block__pre {
  overflow: auto;
  margin: 0;
  padding: 16px 18px 18px;
  border-top: 1px solid var(--moe-border-color-lighter);
  color: var(--moe-text-color-regular);
  font-size: var(--moe-font-size-small);
  line-height: 1.7;
  background: var(--moe-fill-color-lighter);
}
</style>
