import type { ArgTypes, Meta, StoryContext, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import type { ButtonProps } from 'moe-ui'
import { MoeButton } from 'moe-ui'

type Story = StoryObj<typeof MoeButton> & { argTypes?: ArgTypes }

interface DefaultArgs extends ButtonProps {
  content: string
  onClick: () => void
}

const meta: Meta<typeof MoeButton> = {
  title: 'Components/Button',
  component: MoeButton,
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ['primary', 'success', 'warning', 'danger', 'info', ''],
      control: { type: 'select' },
    },
    size: {
      options: ['large', 'default', 'small', ''],
      control: { type: 'select' },
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    useThrottle: { control: 'boolean' },
    throttleDuration: { control: 'number' },
    autofocus: { control: 'boolean' },
    tag: {
      options: ['button', 'a', 'div'],
      control: { type: 'select' },
    },
    nativeType: {
      options: ['button', 'submit', 'reset', ''],
      control: { type: 'select' },
    },
    icon: { control: 'text' },
    loadingIcon: { control: 'text' },
    plain: { control: 'boolean' },
    round: { control: 'boolean' },
    circle: { control: 'boolean' },
  },
  args: { onClick: fn() },
}

export const Default: Story & { args: { content: string } } = {
  argTypes: { content: { control: 'text' } },
  args: { type: 'primary', content: 'Button' },
  render: (args: DefaultArgs) => ({
    components: { MoeButton },
    setup: () => ({ args }),
    template: '<moe-button v-bind="args">{{ args.content }}</moe-button>',
  }),
  play: async ({ args, step, canvas }: StoryContext<DefaultArgs>) => {
    await step('click button', async () => {
      await userEvent.click(canvas.getByRole('button'))
    })
    expect(args.onClick).toHaveBeenCalled()
  },
}

export const Types: Story = {
  render: () => ({
    components: { MoeButton },
    template: `
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <moe-button>Default</moe-button>
        <moe-button type="primary">Primary</moe-button>
        <moe-button type="success">Success</moe-button>
        <moe-button type="warning">Warning</moe-button>
        <moe-button type="danger">Danger</moe-button>
        <moe-button type="info">Info</moe-button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { MoeButton },
    template: `
      <div style="display: flex; gap: 10px; align-items: center;">
        <moe-button type="primary" size="large">Large</moe-button>
        <moe-button type="primary" size="default">Default</moe-button>
        <moe-button type="primary" size="small">Small</moe-button>
      </div>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { MoeButton },
    template: `
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <moe-button type="primary">Normal</moe-button>
        <moe-button type="primary" plain>Plain</moe-button>
        <moe-button type="primary" round>Round</moe-button>
        <moe-button type="primary" circle icon="mingcute:add-line" />
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { MoeButton },
    template: `
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <moe-button type="primary">Normal</moe-button>
        <moe-button type="primary" disabled>Disabled</moe-button>
        <moe-button type="primary" loading>Loading</moe-button>
      </div>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { MoeButton },
    template: `
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <moe-button type="primary" icon="mingcute:search-line">Search</moe-button>
        <moe-button type="success" icon="mingcute:check-line">Confirm</moe-button>
        <moe-button type="danger" icon="mingcute:delete-2-line">Delete</moe-button>
      </div>
    `,
  }),
}

export default meta
