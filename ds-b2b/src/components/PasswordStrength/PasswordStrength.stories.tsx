import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import PasswordStrength from './PasswordStrength'
import Input from '../Input'

const meta = {
  title: 'Form/PasswordStrength',
  component: PasswordStrength,
  tags: ['autodocs'],
  args: { password: 'abc', newPassword: 'abc' },
  decorators: [
    (Story) => (
      <div className="w-[min(20rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof PasswordStrength>

export default meta
type Story = StoryObj<typeof meta>

export const Weak: Story = {}

export const Medium: Story = { args: { password: 'Phottam1', newPassword: 'Phottam1' } }

export const Strong: Story = { args: { password: 'Phottam1!', newPassword: 'Phottam1!' } }

export const Interactive: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div>
        <Input
          type="password"
          label="New password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <PasswordStrength password={value} newPassword={value} />
      </div>
    )
  }
}
