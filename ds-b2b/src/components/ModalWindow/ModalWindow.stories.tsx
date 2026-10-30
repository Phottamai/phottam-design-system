import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IoCalendarOutline } from 'react-icons/io5'
import ModalWindow from './ModalWindow'
import Button from '../Button'
import Input from '../Input'

const meta = {
  title: 'Overlays/ModalWindow',
  component: ModalWindow,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    title: 'Create Project',
    maxWidth: 'md',
    children: null
  },
  argTypes: {
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', '6xl'] },
    size: { control: 'inline-radio', options: ['default', 'compact'] }
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.isOpen)
    const close = (): void => {
      setOpen(false)
      args.onClose()
    }
    return (
      <div className="p-6">
        <Button text="Open modal" onClick={() => setOpen(true)} />
        <ModalWindow
          {...args}
          isOpen={open}
          onClose={close}
          footer={
            args.footer ?? (
              <div className="flex justify-end gap-3">
                <Button text="Cancel" nature="tertiary" onClick={close} />
                <Button text="Create" onClick={close} />
              </div>
            )
          }
        >
          {args.children ?? (
            <div className="space-y-4 p-6">
              <Input label="Project name" placeholder="Wedding — Priya & Arjun" required />
              <Input label="Notes" type="textarea" placeholder="Anything the crew should know" />
            </div>
          )}
        </ModalWindow>
      </div>
    )
  }
} satisfies Meta<typeof ModalWindow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSubtitleAndIcon: Story = {
  args: {
    subtitle: 'New event',
    icon: (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
        <IoCalendarOutline className="text-lg" />
      </div>
    )
  }
}

export const WithHeaderDescription: Story = {
  args: {
    headerDescription: (
      <p className="text-xs text-gray-500">Projects group functions, albums and invoices.</p>
    )
  }
}

export const Compact: Story = { args: { size: 'compact', serifHeader: false } }

export const Large: Story = { args: { maxWidth: 'xl' } }

export const NoCloseButton: Story = { args: { hideCloseButton: true } }
