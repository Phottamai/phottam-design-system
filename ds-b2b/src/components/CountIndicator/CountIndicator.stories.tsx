import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import CountIndicator from './CountIndicator'
import Input from '../Input'

const meta = {
  title: 'Form/CountIndicator',
  component: CountIndicator,
  tags: ['autodocs'],
  args: { currentLength: 12, maxLength: 25 },
  decorators: [
    (Story) => (
      <div className="w-[min(18rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof CountIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Warning: Story = { args: { currentLength: 22 } }

export const AtLimit: Story = { args: { currentLength: 25 } }

export const WithInput: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('')
    return (
      <div>
        <Input
          placeholder="Client name"
          value={value}
          maxLength={args.maxLength}
          onChange={(e) => setValue(e.target.value)}
        />
        <CountIndicator {...args} currentLength={value.length} />
      </div>
    )
  }
}
