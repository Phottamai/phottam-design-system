import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import Pagination from './Pagination'

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    currentPage: 0,
    totalPages: 12,
    totalItems: 287,
    itemsPerPage: 24,
    itemLabel: 'albums',
    onPreviousPage: fn(),
    onNextPage: fn(),
    onPageSelect: fn()
  },
  decorators: [
    (Story) => (
      <div className="w-[min(32rem,calc(100vw_-_2rem))]">
        <Story />
      </div>
    )
  ],
  render: function Render(args) {
    const [page, setPage] = useState(args.currentPage)
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPreviousPage={() => {
          setPage((p) => Math.max(0, p - 1))
          args.onPreviousPage()
        }}
        onNextPage={() => {
          setPage((p) => Math.min(args.totalPages - 1, p + 1))
          args.onNextPage()
        }}
        onPageSelect={(next) => {
          setPage(next)
          args.onPageSelect(next)
        }}
      />
    )
  }
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FewPages: Story = { args: { totalPages: 4, totalItems: 90 } }

export const Compact: Story = { args: { compact: true, itemLabel: 'files' } }

export const CompactHorizontal: Story = { args: { compact: true, horizontal: true } }

export const SinglePageWithRange: Story = {
  args: { totalPages: 1, totalItems: 8, compact: true, alwaysShowRange: true }
}
