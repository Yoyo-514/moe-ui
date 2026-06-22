<script setup lang="ts">
import { ref } from 'vue'
import { en, zhCn } from 'moe-cute-ui'

const current = ref<'zh-cn' | 'en'>('zh-cn')
const localeMap = {
  'zh-cn': zhCn,
  en,
}
</script>

<template>
  <div class="config-provider-locale-demo">
    <moe-button-group size="small">
      <moe-button :type="current === 'zh-cn' ? 'primary' : 'default'" @click="current = 'zh-cn'">
        中文
      </moe-button>
      <moe-button :type="current === 'en' ? 'primary' : 'default'" @click="current = 'en'">
        English
      </moe-button>
    </moe-button-group>

    <moe-config-provider :locale="localeMap[current]">
      <moe-select style="margin-top: 16px; width: 220px" :options="[]" filterable />
      <moe-popconfirm title="Delete this item?">
        <template #reference>
          <moe-button style="margin-top: 16px">Popconfirm</moe-button>
        </template>
      </moe-popconfirm>
    </moe-config-provider>
  </div>
</template>
