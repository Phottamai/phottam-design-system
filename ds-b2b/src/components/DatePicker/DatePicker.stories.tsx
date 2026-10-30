import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import DatePicker from './DatePicker'

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { name: 'eventDate', label: 'Event date', value: '', onChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [
    (Story) => (
      <div className="w-[min(18rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    return (
      <DatePicker
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          args.onChange(e)
        }}
      />
    )
  }
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = { args: { value: '2026-12-14' } }

export const Required: Story = { args: { required: true } }

export const DisablePastDates: Story = { args: { disablePastDates: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Disabled: Story = { args: { disabled: true, value: '2026-12-14' } }
