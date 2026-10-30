import type { Meta, StoryObj } from '@storybook/react-vite'
import Tooltip from './Tooltip'
import Button from '../Button'

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    id: 'story-tooltip',
    content: 'Download all originals as a ZIP',
    place: 'top',
    children: <Button text="Hover me" nature="secondary" />
  },
  argTypes: {
    place: {
      control: 'select',
      options: [
        'top',
        'right',
        'bottom',
        'left',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end'
      ]
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }
  }
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = { args: { id: 'story-tooltip-sm', size: 'sm' } }

export const RichContent: Story = {
  args: {
    id: 'story-tooltip-rich',
    content: undefined,
    contentNode: (
      <div className="max-w-[220px] space-y-1">
        <p className="font-semibold">Selection album</p>
        <p className="text-gray-500">Clients pick favourites; you get a ready-to-edit list.</p>
      </div>
    )
  }
}

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-10">
      {(['top', 'right', 'bottom', 'left'] as const).map((place) => (
        <Tooltip
          key={place}
          id={`story-tooltip-${place}`}
          content={`Placed ${place}`}
          place={place}
        >
          <Button text={place} nature="tertiary" />
        </Tooltip>
      ))}
    </div>
  )
}

export const LongContent: Story = {
  args: {
    id: 'story-tooltip-long',
    content:
      'Originals are stored in Memory Box for 90 days after delivery. Download them before then or extend storage from Billing.'
  }
}
