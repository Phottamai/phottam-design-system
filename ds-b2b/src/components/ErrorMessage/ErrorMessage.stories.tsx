import type { Meta, StoryObj } from '@storybook/react-vite'
import ErrorMessage from './ErrorMessage'

const meta = {
  title: 'Form/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
  args: { message: 'Please enter a valid email address.' }
} satisfies Meta<typeof ErrorMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
