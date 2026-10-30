import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import TimePicker from './TimePicker'

const meta = {
  title: 'Form/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  args: { value: '09:30', onChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  decorators: [
    (Story) => (
      <div className="w-[min(14rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    return (
      <div className="flex flex-col gap-2">
        <TimePicker
          {...args}
          value={value}
          onChange={(next) => {
            setValue(next)
            args.onChange(next)
          }}
        />
        <span className="text-xs text-gray-500">24h value: {value}</span>
      </div>
    )
  }
} satisfies Meta<typeof TimePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {}

export const Medium: Story = { args: { size: 'md' } }

export const Evening: Story = { args: { value: '18:45' } }

export const Disabled: Story = { args: { disabled: true } }
