import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Breadcrumbs } from './Breadcrumbs'

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: { title: 'Wedding — Priya & Arjun', onBack: fn() }
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongTitle: Story = {
  args: { title: 'Destination wedding — Priya Raghavan & Arjun Menon, Udaipur (3 days)' },
  decorators: [
    (Story) => (
      <div className="w-[min(24rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
}
