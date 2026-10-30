import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import Toast from './Toast'

const meta = {
  title: 'Overlays/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    message: 'Album published successfully',
    type: 'success',
    duration: 600000,
    onClose: fn()
  },
  argTypes: { type: { control: 'inline-radio', options: ['success', 'error', 'warning', 'info'] } },
  decorators: [
    (Story) => (
      <div className="w-[min(28rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {}

export const Error: Story = { args: { type: 'error', message: 'Upload failed. Please try again.' } }

export const Warning: Story = {
  args: { type: 'warning', message: 'You are almost out of storage.' }
}

export const Info: Story = { args: { type: 'info', message: 'A new version is available.' } }

export const AutoDismiss: Story = { args: { duration: 3000 } }
