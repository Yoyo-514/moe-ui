<template>
  <moe-form :model="model" label-width="auto" style="max-width: 600px">
    <moe-form-item label="活动名称">
      <moe-input v-model="model.name" />
    </moe-form-item>
    <moe-form-item label="活动类型">
      <moe-radio-group v-model="model.type">
        <moe-radio value="online">线上活动</moe-radio>
        <moe-radio value="offline">线下活动</moe-radio>
      </moe-radio-group>
    </moe-form-item>
    <moe-form-item label="活动区域">
      <moe-select
        v-model="model.region"
        placeholder="请选择活动区域"
        :options="[
          { value: 'shanghai', label: '上海' },
          { value: 'beijing', label: '北京' },
        ]"
      />
    </moe-form-item>
    <moe-form-item label="特殊资源">
      <moe-checkbox-group v-model="model.resource">
        <moe-checkbox value="venue">场地支持</moe-checkbox>
        <moe-checkbox value="branding">品牌曝光</moe-checkbox>
      </moe-checkbox-group>
    </moe-form-item>
    <moe-form-item label="即时配送">
      <moe-switch v-model="model.delivery" />
    </moe-form-item>
    <moe-form-item label="活动描述">
      <moe-input v-model="model.desc" type="textarea" />
    </moe-form-item>
    <moe-form-item>
      <div style="display: flex; gap: 12px">
        <moe-button type="primary" @click="onSubmit">提交</moe-button>
        <moe-button @click="onCancel">取消</moe-button>
      </div>
    </moe-form-item>
  </moe-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import { MoeMessage } from '@moe-ui/components'

const model = reactive({
  name: '',
  type: 'online',
  region: '',
  resource: [] as string[],
  delivery: false,
  desc: '',
})

function onSubmit() {
  MoeMessage.success('提交成功')
}

function onCancel() {
  MoeMessage.info('已取消')
}
</script>
