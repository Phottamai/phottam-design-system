import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import SearchInput from './SearchInput'

const meta = {
  title: 'Form/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  args: { value: '', onChange: fn(), placeholder: 'Search...' },
  decorators: [
    (Story) => (
      <div className="w-[min(24rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    return (
      <SearchInput
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next)
          args.onChange(next)
        }}
      />
    )
  }
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = { args: { value: 'Priya' } }

export const RotatingHints: Story = {
  args: {
    rotatingHints: ['client name', 'email', 'phone number'],
    rotatingSearchAriaLabel: 'Search clients by name, email, or phone number'
  }
}

export const Compact: Story = { args: { compact: true } }
