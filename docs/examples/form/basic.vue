<template>
  <moe-form ref="formRef" :model="model" :rules="rules" label-width="auto" style="max-width: 600px">
    <moe-form-item label="用户名" prop="name">
      <moe-input v-model="model.name" />
    </moe-form-item>
    <moe-form-item label="邮箱" prop="email">
      <moe-input v-model="model.email" />
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

const formRef = ref<FormInstance>()
const model = reactive({
  name: '',
  email: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'change' },
  ],
}

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
