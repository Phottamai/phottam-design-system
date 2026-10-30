import type { Meta, StoryObj } from '@storybook/react-vite'
import ProgressBar from './ProgressBar'

const meta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { progress: 45 },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 100 } } },
  decorators: [
    (Story) => (
      <div className="w-[min(20rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Complete: Story = { args: { progress: 100 } }
