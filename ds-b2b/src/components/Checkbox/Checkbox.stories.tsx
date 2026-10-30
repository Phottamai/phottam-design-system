import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import Checkbox from './Checkbox'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { checked: false, onChange: fn(), label: 'Send reminder to client', id: 'checkbox' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['default', 'card', 'switch'] }
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked)
          args.onChange(e)
        }}
      />
    )
  }
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { args: { checked: true } }

export const WithDescription: Story = {
  args: { description: 'An email is sent 24 hours before the event.' }
}

export const Indeterminate: Story = { args: { indeterminate: true, label: 'Select all' } }

export const Card: Story = {
  args: { variant: 'card', description: 'Clients can download originals.' }
}

export const Switch: Story = { args: { variant: 'switch', label: 'Watermark photos' } }

export const Error: Story = { args: { error: true, required: true, label: 'Accept terms' } }

export const Disabled: Story = { args: { disabled: true } }
