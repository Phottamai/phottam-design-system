import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AnchoredSelect, type AnchoredSelectOption } from './AnchoredSelect'

const roles: AnchoredSelectOption[] = [
  { value: 'photographer', label: 'Photographer' },
  { value: 'videographer', label: 'Videographer' },
  { value: 'editor', label: 'Editor' },
  { value: 'drone', label: 'Drone operator' },
  { value: 'assistant', label: 'Assistant' }
]

const meta = {
  title: 'Form/AnchoredSelect',
  component: AnchoredSelect,
  tags: ['autodocs'],
  args: { value: 'photographer', options: roles, onChange: fn(), ariaLabel: 'Crew role' },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    const [options, setOptions] = useState(args.options)
    return (
      <AnchoredSelect
        {...args}
        value={value}
        options={options}
        onCreateOption={(label) => setOptions((prev) => [...prev, { value: label, label }])}
        onChange={(next) => {
          setValue(next)
          args.onChange(next)
        }}
      />
    )
  }
} satisfies Meta<typeof AnchoredSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Placeholder: Story = { args: { value: '', placeholder: 'Select role' } }

export const Searchable: Story = { args: { searchable: true, searchPlaceholder: 'Search roles' } }

export const Creatable: Story = {
  args: { searchable: true, creatable: true, searchPlaceholder: 'Search or create role' }
}

export const Disabled: Story = { args: { disabled: true } }
