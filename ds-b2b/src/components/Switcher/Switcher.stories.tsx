import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import Switcher from './Switcher'

const meta = {
  title: 'Navigation/Switcher',
  component: Switcher,
  tags: ['autodocs'],
  args: { tabs: ['Grid', 'List'], activeTab: 0, onTabChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium'] } },
  render: function Render(args) {
    const [active, setActive] = useState(args.activeTab)
    return (
      <Switcher
        {...args}
        activeTab={active}
        onTabChange={(index) => {
          setActive(index)
          args.onTabChange(index)
        }}
      />
    )
  }
} satisfies Meta<typeof Switcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = { args: { size: 'small' } }

export const ThreeTabs: Story = { args: { tabs: ['Monthly', 'Quarterly', 'Yearly'] } }

export const Disabled: Story = { args: { disabled: true } }

export const ManyTabs: Story = {
  args: {
    tabs: ['Overview', 'Functions', 'Albums', 'Crew', 'Invoices', 'Expenses', 'Activity'],
    activeTab: 5
  },
  decorators: [
    (Story) => (
      <div className="w-[min(36rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
}
