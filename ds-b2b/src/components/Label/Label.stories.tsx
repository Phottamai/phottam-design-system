import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import Label from './Label'

const meta = {
  title: 'Form/Label',
  component: Label,
  tags: ['autodocs'],
  args: { text: 'Client name', htmlFor: 'client-name' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['default', 'floating', 'inline'] }
  },
  decorators: [
    (Story) => (
      <div className="w-[min(18rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = { args: { required: true } }

export const WithHelpText: Story = {
  args: { helpText: 'The name shown on invoices and albums.' }
}

export const WithAddAction: Story = {
  args: { text: 'Client', showAdd: true, onAdd: fn(), addText: 'Add Client' }
}

export const LongTextWithAdd: Story = {
  args: {
    text: 'Primary point of contact for on-site coordination',
    required: true,
    helpText: 'Shown to the crew on the day.',
    showAdd: true,
    onAdd: fn(),
    addText: 'Add Contact'
  }
}
