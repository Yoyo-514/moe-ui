<template>
  <moe-form :model="model" label-width="auto" disabled style="max-width: 600px">
    <moe-form-item label="活动名称">
      <moe-input v-model="model.name" />
    </moe-form-item>
    <moe-form-item label="即时配送">
      <moe-switch v-model="model.delivery" />
    </moe-form-item>
    <moe-form-item label="活动区域">
      <moe-select
        v-model="model.region"
        :options="[
          { value: 'shanghai', label: '上海' },
          { value: 'beijing', label: '北京' },
        ]"
      />
    </moe-form-item>
  </moe-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  name: '不可编辑',
  delivery: true,
  region: 'shanghai',
})
</script>
