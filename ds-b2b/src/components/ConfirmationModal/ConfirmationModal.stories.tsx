import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import ConfirmationModal from './ConfirmationModal'
import Button from '../Button'

const meta = {
  title: 'Overlays/ConfirmationModal',
  component: ConfirmationModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn(),
    title: 'Discard changes?',
    message: 'You have unsaved changes. They will be lost if you leave now.',
    confirmText: 'Discard'
  },
  argTypes: {
    type: { control: 'select', options: ['warning', 'danger', 'info', 'primary', 'memorybox'] }
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.isOpen)
    return (
      <div className="p-6">
        <Button text="Open confirmation" onClick={() => setOpen(true)} />
        <ConfirmationModal
          {...args}
          isOpen={open}
          onClose={() => {
            setOpen(false)
            args.onClose()
          }}
          onConfirm={() => {
            setOpen(false)
            args.onConfirm()
          }}
        />
      </div>
    )
  }
} satisfies Meta<typeof ConfirmationModal>

export default meta
type Story = StoryObj<typeof meta>

export const Warning: Story = { args: { type: 'warning' } }

export const Danger: Story = {
  args: {
    type: 'danger',
    title: 'Delete album?',
    message: 'This permanently removes the album and all its photos.',
    confirmText: 'Delete'
  }
}

export const Primary: Story = {
  args: {
    type: 'primary',
    title: 'Publish album?',
    message: 'Clients will be notified by email.',
    confirmText: 'Publish'
  }
}

export const MemoryBox: Story = {
  args: {
    type: 'memorybox',
    title: 'Move to Memory Box?',
    message: 'Originals will be archived.',
    confirmText: 'Move'
  }
}

export const Loading: Story = { args: { isLoading: true } }

export const Compact: Story = { args: { compact: true } }

export const LongButtonLabels: Story = {
  args: {
    type: 'danger',
    title: 'Remove crew member?',
    message: 'They lose access to every project they are assigned to.',
    cancelText: 'Keep crew member',
    confirmText: 'Remove from all projects'
  }
}
