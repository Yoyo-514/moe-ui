<template>
  <moe-form ref="formRef" :model="model" :rules="rules" label-width="auto" style="max-width: 600px">
    <moe-form-item label="密码" prop="pass">
      <moe-input v-model="model.pass" type="password" show-password />
    </moe-form-item>
    <moe-form-item label="确认密码" prop="checkPass">
      <moe-input v-model="model.checkPass" type="password" show-password />
    </moe-form-item>
    <moe-form-item label="年龄" prop="age">
      <moe-input v-model.number="model.age" />
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
  pass: '',
  checkPass: '',
  age: undefined as number | undefined,
})

const validatePass = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (model.checkPass !== '') {
      formRef.value?.validateField('checkPass')
    }
    callback()
  }
}

const validatePass2 = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== model.pass) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateAge = (_rule: unknown, value: number, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入年龄'))
  } else if (!Number.isInteger(value)) {
    callback(new Error('请输入数字'))
  } else if (value < 18) {
    callback(new Error('年龄必须大于 18'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  age: [{ validator: validateAge, trigger: 'blur' }],
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
