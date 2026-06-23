<template>
  <moe-form :model="model" :rules="rules" :inline="true" label-width="auto">
    <moe-form-item label="活动名称" prop="name">
      <moe-input v-model="model.name" placeholder="活动名称" />
    </moe-form-item>
    <moe-form-item label="活动区域" prop="region">
      <moe-select
        v-model="model.region"
        placeholder="活动区域"
        :options="[
          { value: 'shanghai', label: '上海' },
          { value: 'beijing', label: '北京' },
        ]"
      />
    </moe-form-item>
    <moe-form-item>
      <moe-button type="primary" @click="onSubmit">查询</moe-button>
    </moe-form-item>
  </moe-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import { MoeMessage } from '@moe-ui/components'
import type { FormRules } from '@moe-ui/components'

const model = reactive({
  name: '',
  region: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
}

function onSubmit() {
  MoeMessage.success('查询成功')
}
</script>
