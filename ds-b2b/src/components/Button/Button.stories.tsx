import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IoAddOutline, IoTrashOutline } from 'react-icons/io5'
import Button from './Button'

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { text: 'Button', onClick: fn() },
  argTypes: {
    nature: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'success', 'warning']
    },
    variant: { control: 'inline-radio', options: ['default', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    width: { control: 'inline-radio', options: ['auto', 'small', 'half', 'full'] }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { nature: 'primary' } }

export const Secondary: Story = { args: { nature: 'secondary' } }

export const Tertiary: Story = { args: { nature: 'tertiary' } }

export const Danger: Story = {
  args: { nature: 'danger', text: 'Delete', icon: <IoTrashOutline /> }
}

export const WithIcon: Story = { args: { text: 'Add Project', icon: <IoAddOutline /> } }

export const Loading: Story = { args: { isLoading: true } }

export const Disabled: Story = { args: { disabled: true } }

export const WithTooltip: Story = {
  args: { showTooltip: true, tooltipContent: 'Upgrade your plan to unlock this', disabled: true }
}

const natures = ['primary', 'secondary', 'tertiary', 'danger', 'success', 'warning'] as const
const variants = ['default', 'outline', 'ghost'] as const

export const Matrix: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          <span className="w-full text-xs text-gray-500 sm:w-16">{variant}</span>
          {natures.map((nature) => (
            <Button key={nature} {...args} nature={nature} variant={variant} text={nature} />
          ))}
        </div>
      ))}
    </div>
  )
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm" text="Small" />
      <Button {...args} size="md" text="Medium" />
      <Button {...args} size="lg" text="Large" />
    </div>
  )
}

export const LongLabelInNarrowContainer: Story = {
  args: { text: 'Download all originals for this project', icon: <IoAddOutline /> },
  render: (args) => (
    <div className="w-48 rounded-lg border border-dashed border-gray-300 p-2">
      <Button {...args} width="full" />
    </div>
  )
}
