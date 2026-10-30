import type { Meta, StoryObj } from '@storybook/react-vite'
import EmptyState from './EmptyState'
import Button from '../Button'

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-[28rem] w-[min(32rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSubtext: Story = {
  args: { message: 'No projects yet', subtext: 'Create your first project to start uploading.' }
}

export const WithAction: Story = {
  args: {
    message: 'No clients yet',
    children: <Button text="Add Client" />
  }
}

export const FromError: Story = {
  args: { error: new Error('Could not load albums. Check your connection.') }
}
