<template>
  <moe-form ref="formRef" :model="model" :rules="rules" label-width="auto" style="max-width: 600px">
    <moe-form-item label="活动名称" prop="name">
      <moe-input v-model="model.name" />
    </moe-form-item>
    <moe-form-item label="活动区域" prop="region">
      <moe-select
        v-model="model.region"
        placeholder="请选择活动区域"
        :options="[
          { value: 'shanghai', label: '上海' },
          { value: 'beijing', label: '北京' },
        ]"
      />
    </moe-form-item>
    <moe-form-item label="即时配送" prop="delivery">
      <moe-switch v-model="model.delivery" />
    </moe-form-item>
    <moe-form-item label="活动描述" prop="desc">
      <moe-input v-model="model.desc" type="textarea" />
    </moe-form-item>
    <moe-form-item>
      <div style="display: flex; gap: 12px">
        <moe-button type="primary" @click="submitForm">提交</moe-button>
        <moe-button @click="resetForm">重置</moe-button>
      </div>
    </moe-form-item>
  </moe-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { MoeMessage } from '@moe-ui/components'
import type { FormInstance, FormRules } from '@moe-ui/components'

interface RuleForm {
  name: string
  region: string
  delivery: boolean
  desc: string
}

const formRef = ref<FormInstance>()
const model = reactive<RuleForm>({
  name: '',
  region: '',
  delivery: false,
  desc: '',
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' },
  ],
  region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
  desc: [{ required: true, message: '请填写活动描述', trigger: 'blur' }],
})

async function submitForm() {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (valid) {
    MoeMessage.success('提交成功')
  }
}

function resetForm() {
  formRef.value?.resetFields()
}
</script>
