/* eslint-disable vue/one-component-per-file */
import { defineComponent, reactive } from 'vue'

import {
  MoeCheckbox,
  MoeCheckboxGroup,
  MoeForm,
  MoeFormItem,
  MoeInput,
  MoeOption,
  MoeRadio,
  MoeRadioGroup,
  MoeSelect,
  MoeSwitch,
} from '@moe-ui/components'

export default {
  name: 'form controls',
  expects: ['Name', 'Enabled', 'Checkbox A', 'Radio A'],
  component: defineComponent({
    setup() {
      const model = reactive({ name: 'moe', enabled: true, option: 'a', checks: ['a'], radio: 'a' })

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
            <MoeFormItem prop="checks" label="Checks">
              <MoeCheckboxGroup modelValue={model.checks}>
                <MoeCheckbox value="a">Checkbox A</MoeCheckbox>
                <MoeCheckbox value="b">Checkbox B</MoeCheckbox>
              </MoeCheckboxGroup>
            </MoeFormItem>
            <MoeFormItem prop="radio" label="Radio">
              <MoeRadioGroup modelValue={model.radio}>
                <MoeRadio value="a">Radio A</MoeRadio>
                <MoeRadio value="b">Radio B</MoeRadio>
              </MoeRadioGroup>
            </MoeFormItem>
          </MoeForm>
        </section>
      )
    },
  }),
}
