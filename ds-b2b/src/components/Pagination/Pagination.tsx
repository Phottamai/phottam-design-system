import type { JSX } from 'react'
import React from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import Tooltip from '../Tooltip'
import { buildPaginationSlots } from './paginationSlots'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPreviousPage: () => void
  onNextPage: () => void
  onPageSelect: (page: number) => void
  /** Word after the range count, e.g. "files" or "albums". */
  itemLabel?: string
  /** Single-row layout with tighter spacing (e.g. View Uploads). */
  compact?: boolean
  /** Compact controls and range on one row (e.g. Upload Summary side panel). */
  horizontal?: boolean
  /** When true, compact mode shows "1–N of N" even on a single page. */
  alwaysShowRange?: boolean
  /** Keeps pagination at the bottom of a flex listing column (default for standard layout). */
  pinToBottom?: boolean
  className?: string
}

function PageNumberButtons({
  currentPage,
  totalPages,
  onPageSelect,
  compact
}: {
  currentPage: number
  totalPages: number
  onPageSelect: (page: number) => void
  compact: boolean
}): JSX.Element {
  const slots = buildPaginationSlots(totalPages, currentPage)
  const buttonClass = compact
    ? 'h-6 min-w-[1.5rem] px-0.5 rounded-full text-[11px] font-semibold transition-all duration-200'
    : 'w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200'

  return (
    <div className="flex items-center gap-0.5">
      {slots.map((slot, index) =>
        slot === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className={`inline-flex items-center justify-center text-gray-400 dark:text-gray-500 ${
              compact ? 'h-6 min-w-[1rem] text-[10px]' : 'w-7 text-xs'
            }`}
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={slot}
            type="button"
            onClick={() => onPageSelect(slot)}
            className={`${buttonClass} ${
              currentPage === slot
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-purple-600 dark:bg-ph-dark-lite dark:text-ph-dark-text dark:hover:bg-ph-dark-lite dark:hover:text-purple-400'
            }`}
            aria-label={`Page ${slot + 1}`}
            aria-current={currentPage === slot ? 'page' : undefined}
          >
            {slot + 1}
          </button>
        )
      )}
    </div>
  )
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPreviousPage,
  onNextPage,
  onPageSelect,
  itemLabel = 'files',
  compact = false,
  horizontal = false,
  alwaysShowRange = false,
  pinToBottom = true,
  className = ''
}) => {
  const rootClassName = [
    pinToBottom && !compact && !horizontal ? 'mt-auto shrink-0' : '',
    className
  ]
    .filter(Boolean)
    .join(' ')
  const startIndex = currentPage * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  if (totalPages <= 1) {
    if (compact && alwaysShowRange && totalItems > 0) {
      return (
        <div
          data-listing-pagination
          className={`w-full py-1 text-left text-[11px] font-medium text-gray-600 dark:text-gray-400 ${rootClassName}`}
        >
          Showing {startIndex + 1}-{endIndex} of {totalItems} {itemLabel}
        </div>
      )
    }
    return null
  }

  const compactPageControls = (
    <>
      <Tooltip id="pagination-prev" content="Previous Page">
        <button
          type="button"
          onClick={onPreviousPage}
          disabled={currentPage === 0}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Previous page"
        >
          <IoChevronBackOutline size={16} />
        </button>
      </Tooltip>

      <PageNumberButtons
        currentPage={currentPage}
        totalPages={totalPages}
        onPageSelect={onPageSelect}
        compact
      />

      <Tooltip id="pagination-next" content="Next Page">
        <button
          type="button"
          onClick={onNextPage}
          disabled={currentPage === totalPages - 1}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Next page"
        >
          <IoChevronForwardOutline size={16} />
        </button>
      </Tooltip>
    </>
  )

  if (compact && horizontal) {
    return (
      <div
        data-listing-pagination
        className={`flex w-full items-center justify-between gap-2 py-1 text-[11px] text-gray-600 dark:text-gray-400 ${rootClassName}`}
      >
        <span className="min-w-0 shrink truncate font-medium text-[10px]">
          {startIndex + 1}-{endIndex} of {totalItems}
        </span>
        <div className="flex shrink-0 items-center gap-1">{compactPageControls}</div>
      </div>
    )
  }

  if (compact) {
    return (
      <div
        data-listing-pagination
        className={`flex w-full flex-col gap-1 py-1 text-[11px] text-gray-600 dark:text-gray-400 ${rootClassName}`}
      >
        <div className="flex items-center justify-center gap-1.5">{compactPageControls}</div>

        <span className="self-start font-medium">
          Showing {startIndex + 1}-{endIndex} of {totalItems} {itemLabel}, Page {currentPage + 1} of{' '}
          {totalPages}
        </span>
      </div>
    )
  }

  return (
    <div data-listing-pagination className={`flex w-full flex-col gap-2 py-3 ${rootClassName}`}>
      <div className="flex items-center justify-center gap-2">
        <Tooltip id="pagination-prev" content="Previous Page">
          <button
            type="button"
            onClick={onPreviousPage}
            disabled={currentPage === 0}
            className="text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Previous page"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>

        <PageNumberButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSelect={onPageSelect}
          compact={false}
        />

        <Tooltip id="pagination-next" content="Next Page">
          <button
            type="button"
            onClick={onNextPage}
            disabled={currentPage === totalPages - 1}
            className="text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Next page"
          >
            <IoChevronForwardOutline size={18} />
          </button>
        </Tooltip>
      </div>

      <div className="self-start text-left">
        <div className="text-[10px] text-gray-500 dark:text-gray-500">
          Showing {startIndex + 1}-{endIndex} of {totalItems} {itemLabel}, Page {currentPage + 1} of{' '}
          {totalPages}
        </div>
      </div>
    </div>
  )
}

export default PaginationControls
