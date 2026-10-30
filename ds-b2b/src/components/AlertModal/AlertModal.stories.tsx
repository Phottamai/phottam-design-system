import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import AlertModal from './AlertModal'
import Button from '../Button'

const meta = {
  title: 'Overlays/AlertModal',
  component: AlertModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    type: 'warning',
    title: 'Storage almost full',
    description: 'Clear space to keep uploading without interruptions.',
    actionLabel: 'Review storage'
  },
  argTypes: { type: { control: 'inline-radio', options: ['info', 'warning', 'error'] } },
  render: function Render(args) {
    const [open, setOpen] = useState(args.isOpen)
    return (
      <div className="p-6">
        <Button text="Open alert" onClick={() => setOpen(true)} />
        <AlertModal
          {...args}
          isOpen={open}
          onClose={() => {
            setOpen(false)
            args.onClose()
          }}
        />
      </div>
    )
  }
} satisfies Meta<typeof AlertModal>

export default meta
type Story = StoryObj<typeof meta>

export const Warning: Story = {}

export const Info: Story = {
  args: {
    type: 'info',
    title: 'Update available',
    description: 'Restart to install version 1.2.',
    actionLabel: 'Got it'
  }
}

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Upload failed',
    description: 'Check your connection and try again.',
    actionLabel: 'Retry'
  }
}
