<template>
  <div>
    <div style="margin-bottom: 20px">
      <span style="margin-right: 8px">标签位置：</span>
      <moe-button-group size="small">
        <moe-button
          v-for="pos in positions"
          :key="pos"
          :type="labelPosition === pos ? 'primary' : 'default'"
          @click="labelPosition = pos"
        >
          {{ pos }}
        </moe-button>
      </moe-button-group>
    </div>
    <moe-form
      :model="model"
      :label-position="labelPosition"
      label-width="80px"
      style="max-width: 600px"
    >
      <moe-form-item label="名称">
        <moe-input v-model="model.name" />
      </moe-form-item>
      <moe-form-item label="活动区域">
        <moe-input v-model="model.region" />
      </moe-form-item>
      <moe-form-item label="活动形式">
        <moe-input v-model="model.type" />
      </moe-form-item>
    </moe-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormLabelPosition } from '@moe-ui/components'

const positions: FormLabelPosition[] = ['left', 'right', 'top']
const labelPosition = ref<FormLabelPosition>('right')
const model = reactive({
  name: '',
  region: '',
  type: '',
})
</script>
