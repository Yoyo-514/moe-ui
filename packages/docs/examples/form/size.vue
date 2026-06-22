<template>
  <div>
    <div style="margin-bottom: 20px">
      <span style="margin-right: 8px">表单尺寸：</span>
      <moe-button-group size="small">
        <moe-button
          v-for="s in sizes"
          :key="s"
          :type="size === s ? 'primary' : 'default'"
          @click="size = s"
        >
          {{ s }}
        </moe-button>
      </moe-button-group>
    </div>
    <moe-form :model="model" label-width="auto" :size="size" style="max-width: 600px">
      <moe-form-item label="活动名称">
        <moe-input v-model="model.name" />
      </moe-form-item>
      <moe-form-item label="活动区域">
        <moe-select
          v-model="model.region"
          placeholder="请选择"
          :options="[
            { value: 'shanghai', label: '上海' },
            { value: 'beijing', label: '北京' },
          ]"
        />
      </moe-form-item>
      <moe-form-item label="即时配送">
        <moe-switch v-model="model.delivery" />
      </moe-form-item>
    </moe-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormSize } from '@moe-ui/components'

const sizes: FormSize[] = ['large', 'default', 'small']
const size = ref<FormSize>('default')
const model = reactive({
  name: '',
  region: '',
  delivery: false,
})
</script>
