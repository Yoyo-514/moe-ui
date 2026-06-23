import { withInstall } from '@moe-ui/utils'

import Form from './src/Form.vue'
import FormItem from './src/FormItem.vue'

export const MoeForm = withInstall(Form)
export const MoeFormItem = withInstall(FormItem)

export * from './src/types'
