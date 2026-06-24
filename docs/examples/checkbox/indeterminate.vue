<template>
  <div class="checkbox-demo-column">
    <moe-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAll">
      全选
    </moe-checkbox>
    <moe-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <moe-checkbox v-for="city in cities" :key="city" :value="city">
        {{ city }}
      </moe-checkbox>
    </moe-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const cities = ['上海', '北京', '广州', '深圳']
const checkedCities = ref(['上海', '北京'])
const checkAll = ref(false)
const isIndeterminate = computed(
  () => checkedCities.value.length > 0 && checkedCities.value.length < cities.length
)

function handleCheckAll(value: string | number | boolean | (string | number | boolean)[]) {
  const checked = Boolean(value)
  checkedCities.value = checked ? [...cities] : []
}

function handleCheckedCitiesChange(value: (string | number | boolean)[]) {
  checkAll.value = value.length === cities.length
}
</script>

<style scoped>
.checkbox-demo-column {
  display: grid;
  gap: 12px;
}
</style>
