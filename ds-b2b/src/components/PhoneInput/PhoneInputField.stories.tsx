import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import PhoneInputField from './PhoneInputField'
import { getPhoneValidationError } from './phoneInput.utils'

const meta = {
  title: 'Form/PhoneInputField',
  component: PhoneInputField,
  tags: ['autodocs'],
  args: { value: '', onChange: fn() },
  decorators: [
    (Story) => (
      <div className="w-[min(20rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    const [touched, setTouched] = useState(false)
    const error = touched ? getPhoneValidationError(value) : ''
    return (
      <div>
        <PhoneInputField
          {...args}
          value={value}
          error={args.error || Boolean(error)}
          onBlur={() => setTouched(true)}
          onChange={(e) => {
            setValue(e.target.value)
            args.onChange(e)
          }}
        />
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    )
  }
} satisfies Meta<typeof PhoneInputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = { args: { value: '+919876543210' } }

export const Error: Story = { args: { error: true, value: '+91123' } }

export const Disabled: Story = { args: { disabled: true, value: '+919876543210' } }
