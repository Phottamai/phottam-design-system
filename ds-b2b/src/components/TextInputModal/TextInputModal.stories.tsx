import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import TextInputModal from './TextInputModal'
import Button from '../Button'

const meta = {
  title: 'Overlays/TextInputModal',
  component: TextInputModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    title: '',
    filedName: 'Folder',
    onSubmit: fn(),
    setIsModalOpen: fn(),
    inputText: '',
    setInputText: fn(),
    maxLength: 30
  },
  render: function Render(args) {
    const [open, setOpen] = useState(true)
    const [text, setText] = useState(args.inputText)
    return (
      <div className="p-6">
        <Button text="Open" onClick={() => setOpen(true)} />
        {open ? (
          <TextInputModal
            {...args}
            inputText={text}
            setInputText={setText}
            setIsModalOpen={setOpen}
            onSubmit={async (value) => {
              args.onSubmit(value)
              setOpen(false)
            }}
          />
        ) : null}
      </div>
    )
  }
} satisfies Meta<typeof TextInputModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValidation: Story = {
  args: {
    validation: (text) => (text.toLowerCase() === 'raw' ? '"RAW" is a reserved folder name' : null)
  }
}
