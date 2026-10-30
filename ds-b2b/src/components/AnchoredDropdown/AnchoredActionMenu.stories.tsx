import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  IoCopyOutline,
  IoPencilOutline,
  IoShareSocialOutline,
  IoTrashOutline
} from 'react-icons/io5'
import { AnchoredActionMenu, AnchoredActionMenuItem } from './AnchoredActionMenu'
import {
  listingCardMenuButtonClass,
  listingCardMenuDeleteRowClass,
  listingCardMenuIconClass
} from '../../tokens/menuStyles'

const meta = {
  title: 'Overlays/AnchoredActionMenu',
  component: AnchoredActionMenu,
  tags: ['autodocs'],
  args: {
    open: false,
    onOpenChange: fn(),
    buttonClassName: listingCardMenuButtonClass,
    children: null
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['corner', 'trailing', 'dropdown'] },
    trailingPlacement: { control: 'inline-radio', options: ['beside', 'under'] }
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open)
    const onSelect = fn()
    return (
      <div className="flex h-64 w-[min(20rem,calc(100vw_-_2rem))] items-start justify-end rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-ph-dark-lite">
        <AnchoredActionMenu
          {...args}
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            args.onOpenChange(next)
          }}
          deleteItem={
            <AnchoredActionMenuItem
              icon={<IoTrashOutline className="h-3.5 w-3.5 shrink-0" />}
              label="Delete"
              onClick={onSelect}
              className={listingCardMenuDeleteRowClass}
            />
          }
        >
          <AnchoredActionMenuItem
            icon={<IoPencilOutline className={listingCardMenuIconClass} />}
            label="Edit"
            onClick={onSelect}
          />
          <AnchoredActionMenuItem
            icon={<IoCopyOutline className={listingCardMenuIconClass} />}
            label="Duplicate"
            onClick={onSelect}
          />
          <AnchoredActionMenuItem
            icon={<IoShareSocialOutline className={listingCardMenuIconClass} />}
            label="Share (Pro plan)"
            onClick={onSelect}
            disabled
          />
        </AnchoredActionMenu>
      </div>
    )
  }
} satisfies Meta<typeof AnchoredActionMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Corner: Story = {}

export const Open: Story = { args: { open: true } }

export const Portaled: Story = { args: { portaled: true } }

export const NoTooltip: Story = { args: { tooltipContent: false } }
