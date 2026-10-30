import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IoGridOutline, IoListOutline, IoCalendarOutline } from 'react-icons/io5'
import SegmentedTabControl from './SegmentedTabControl'

const meta = {
  title: 'Navigation/SegmentedTabControl',
  component: SegmentedTabControl,
  tags: ['autodocs'],
  args: {
    tabs: [
      { key: 'grid', label: 'Grid', icon: <IoGridOutline /> },
      { key: 'list', label: 'List', icon: <IoListOutline /> },
      { key: 'calendar', label: 'Calendar', icon: <IoCalendarOutline /> }
    ],
    activeKey: 'grid',
    onChange: fn()
  },
  render: function Render(args) {
    const [active, setActive] = useState(args.activeKey)
    return (
      <SegmentedTabControl
        {...args}
        activeKey={active}
        onChange={(key) => {
          setActive(key)
          args.onChange(key)
        }}
      />
    )
  }
} satisfies Meta<typeof SegmentedTabControl>

export default meta
type Story = StoryObj<typeof meta>

export const WithIcons: Story = {}

export const LabelsOnly: Story = {
  args: {
    tabs: [
      { key: 'all', label: 'All' },
      { key: 'active', label: 'Active' },
      { key: 'archived', label: 'Archived' }
    ],
    activeKey: 'all'
  }
}

export const Disabled: Story = { args: { disabled: true } }

export const ManyTabs: Story = {
  args: {
    tabs: [
      { key: 'all', label: 'All projects' },
      { key: 'upcoming', label: 'Upcoming' },
      { key: 'in-progress', label: 'In progress' },
      { key: 'delivered', label: 'Delivered' },
      { key: 'archived', label: 'Archived' }
    ],
    activeKey: 'delivered'
  },
  decorators: [
    (Story) => (
      <div className="w-[min(40rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
}
