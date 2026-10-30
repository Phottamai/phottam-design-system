import type { Meta, StoryObj } from '@storybook/react-vite'
import Loader from './Loader'

const meta = {
  title: 'Feedback/Loader',
  component: Loader,
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } }
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Loader size="sm" />
      <Loader size="md" />
      <Loader size="lg" />
    </div>
  )
}
