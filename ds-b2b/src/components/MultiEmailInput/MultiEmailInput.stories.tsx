import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import MultiEmailInput from './MultiEmailInput'

const meta = {
  title: 'Form/MultiEmailInput',
  component: MultiEmailInput,
  tags: ['autodocs'],
  args: { value: [], onChange: fn(), label: 'Guest emails' },
  decorators: [
    (Story) => (
      <div className="w-[min(28rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ],
  render: function Render(args) {
    const [emails, setEmails] = useState(args.value)
    return (
      <MultiEmailInput
        {...args}
        value={emails}
        onChange={(next) => {
          setEmails(next)
          args.onChange(next)
        }}
      />
    )
  }
} satisfies Meta<typeof MultiEmailInput>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const WithEmails: Story = {
  args: { value: ['priya@example.com', 'arjun@example.com'] }
}

export const Disabled: Story = {
  args: { disabled: true, value: ['priya@example.com'] }
}

export const LongEmails: Story = {
  args: {
    value: [
      'priya.raghavan.photography.bookings@verylongcompanydomain.example.com',
      'arjun@example.com'
    ]
  }
}
