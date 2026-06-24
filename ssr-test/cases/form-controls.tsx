/* eslint-disable vue/one-component-per-file */
import { defineComponent, reactive } from 'vue'

import { MoeForm, MoeFormItem, MoeInput, MoeOption, MoeSelect, MoeSwitch } from '@moe-ui/components'

export default {
  name: 'form controls',
  expects: ['Name', 'Enabled'],
  component: defineComponent({
    setup() {
      const model = reactive({ name: 'moe', enabled: true, option: 'a' })

      return () => (
        <section class="ssr-form-case">
          <MoeForm model={model} labelSuffix=":">
            <MoeFormItem prop="name" label="Name">
              <MoeInput modelValue={model.name} />
            </MoeFormItem>
            <MoeFormItem prop="enabled" label="Enabled">
              <MoeSwitch modelValue={model.enabled} />
            </MoeFormItem>
            <MoeFormItem prop="option" label="Option">
              <MoeSelect modelValue={model.option} options={[{ value: 'a', label: 'A' }]}>
                <MoeOption value="b" label="B" />
              </MoeSelect>
            </MoeFormItem>
          </MoeForm>
        </section>
      )
    },
  }),
}
