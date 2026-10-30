import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IoMailOutline } from 'react-icons/io5'
import Input from './Input'

const meta = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Enter project name', onChange: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'filled', 'outlined', 'underlined'] },
    inputSize: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] }
  },
  decorators: [
    (Story) => (
      <div className="w-[min(20rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = { args: { label: 'Project name', required: true } }

export const WithHelpText: Story = {
  args: { label: 'Project name', helpText: 'Visible to your clients.' }
}

export const WithError: Story = {
  args: { label: 'Project name', defaultValue: '', error: 'Name is mandatory' }
}

export const WithLeftIcon: Story = {
  args: {
    label: 'Email',
    type: 'email',
    leftIcon: <IoMailOutline />,
    placeholder: 'name@studio.com'
  }
}

export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: 'Enter password' }
}

export const Clearable: Story = {
  args: { showClearButton: true, defaultValue: 'Wedding — Priya & Arjun' }
}

export const Loading: Story = { args: { loading: true } }

export const Disabled: Story = { args: { disabled: true, value: 'Read only' } }

export const Textarea: Story = {
  args: { label: 'Notes', type: 'textarea', rows: 4, placeholder: 'Add notes for the crew' }
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} variant="default" placeholder="default" />
      <Input {...args} variant="filled" placeholder="filled" />
      <Input {...args} variant="outlined" placeholder="outlined" />
      <Input {...args} variant="underlined" placeholder="underlined" />
    </div>
  )
}
