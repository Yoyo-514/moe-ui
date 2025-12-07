import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite'

import { MoeIcon } from 'moe-ui'

type Story = StoryObj<typeof MoeIcon> & { argTypes?: ArgTypes }

const meta: Meta<typeof MoeIcon> = {
  title: 'Components/Icon',
  component: MoeIcon,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    type: {
      options: ['primary', 'success', 'warning', 'danger', 'info', ''],
      control: { type: 'select' },
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', ''],
      control: { type: 'select' },
    },
    color: { control: 'color' },
    spin: { control: 'boolean' },
    animation: {
      options: ['spin', 'spin-pulse', 'beat', 'fade', 'bounce', 'shake', 'ping', ''],
      control: { type: 'select' },
    },
    duration: { control: 'number' },
    flip: {
      options: ['horizontal', 'vertical', 'both', ''],
      control: { type: 'select' },
    },
    rotate: {
      options: [0, 90, 180, 270],
      control: { type: 'select' },
    },
    hoverIcon: { control: 'text' },
    hoverColor: { control: 'color' },
    hoverAnimation: {
      options: ['spin', 'spin-pulse', 'beat', 'fade', 'bounce', 'shake', 'ping', ''],
      control: { type: 'select' },
    },
  },
}

export const Default: Story = {
  args: { icon: 'mingcute:home-4-line', size: 'xl' },
}

export const Types: Story = {
  render: () => ({
    components: { MoeIcon },
    template: `
      <div style="display: flex; gap: 20px; font-size: 24px;">
        <moe-icon icon="mingcute:heart-fill" />
        <moe-icon icon="mingcute:heart-fill" type="primary" />
        <moe-icon icon="mingcute:heart-fill" type="success" />
        <moe-icon icon="mingcute:heart-fill" type="warning" />
        <moe-icon icon="mingcute:heart-fill" type="danger" />
        <moe-icon icon="mingcute:heart-fill" type="info" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { MoeIcon },
    template: `
      <div style="display: flex; gap: 20px; align-items: center;">
        <moe-icon icon="mingcute:star-fill" size="xs" type="warning" />
        <moe-icon icon="mingcute:star-fill" size="sm" type="warning" />
        <moe-icon icon="mingcute:star-fill" size="md" type="warning" />
        <moe-icon icon="mingcute:star-fill" size="lg" type="warning" />
        <moe-icon icon="mingcute:star-fill" size="xl" type="warning" />
        <moe-icon icon="mingcute:star-fill" size="2xl" type="warning" />
        <moe-icon icon="mingcute:star-fill" size="3xl" type="warning" />
        <moe-icon icon="mingcute:star-fill" size="4xl" type="warning" />
      </div>
    `,
  }),
}

export const Animations: Story = {
  render: () => ({
    components: { MoeIcon },
    template: `
      <div style="display: flex; gap: 30px; font-size: 32px;">
        <moe-icon icon="mingcute:loading-line" animation="spin" type="primary" />
        <moe-icon icon="mingcute:settings-2-line" animation="spin-pulse" type="primary" />
        <moe-icon icon="mingcute:heart-fill" animation="beat" type="danger" />
        <moe-icon icon="mingcute:notification-line" animation="fade" type="warning" />
        <moe-icon icon="mingcute:arrow-down-line" animation="bounce" type="success" />
        <moe-icon icon="mingcute:alarm-2-line" animation="shake" type="danger" />
        <moe-icon icon="mingcute:location-line" animation="ping" type="info" />
      </div>
    `,
  }),
}

export const Transforms: Story = {
  render: () => ({
    components: { MoeIcon },
    template: `
      <div style="display: flex; gap: 30px; font-size: 32px;">
        <moe-icon icon="mingcute:arrow-right-line" type="primary" />
        <moe-icon icon="mingcute:arrow-right-line" type="primary" flip="horizontal" />
        <moe-icon icon="mingcute:arrow-right-line" type="primary" flip="vertical" />
        <moe-icon icon="mingcute:arrow-right-line" type="primary" :rotate="90" />
        <moe-icon icon="mingcute:arrow-right-line" type="primary" :rotate="180" />
      </div>
    `,
  }),
}

export const HoverEffects: Story = {
  render: () => ({
    components: { MoeIcon },
    template: `
      <div style="display: flex; gap: 30px; font-size: 32px;">
        <moe-icon
          icon="mingcute:heart-line"
          hover-icon="mingcute:heart-fill"
          hover-color="#ff4757"
        />
        <moe-icon
          icon="mingcute:star-line"
          hover-icon="mingcute:star-fill"
          hover-color="#ffa502"
          hover-animation="beat"
        />
        <moe-icon
          icon="mingcute:thumb-up-line"
          hover-icon="mingcute:thumb-up-fill"
          type="primary"
          hover-animation="bounce"
        />
      </div>
    `,
  }),
}

export default meta
