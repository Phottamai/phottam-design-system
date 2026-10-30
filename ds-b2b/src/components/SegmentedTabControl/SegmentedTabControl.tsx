import React, { useRef, type JSX } from 'react'
import { useScrollActiveIntoView } from '../../hooks/useScrollActiveIntoView'

export interface SegmentedTabOption {
  key: string
  label: string
  icon?: React.ReactNode
  ariaLabel?: string
}

interface SegmentedTabControlProps {
  tabs: SegmentedTabOption[]
  activeKey: string
  onChange: (key: string) => void
  disabled?: boolean
  className?: string
}

const activeSegmentClass =
  'bg-purple-50/50 text-[#7F3CFF] border-[#7F3CFF] z-10 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800'
const inactiveSegmentClass =
  'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-ph-dark dark:text-gray-300 dark:border-gray-800'

export default function SegmentedTabControl({
  tabs,
  activeKey,
  onChange,
  disabled = false,
  className = ''
}: SegmentedTabControlProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  useScrollActiveIntoView(containerRef, activeKey)

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={`flex max-w-full items-center overflow-x-auto scrollbar-none ${disabled ? 'pointer-events-none opacity-60' : ''} ${className}`}
    >
      {tabs.map((tab, index) => {
        const isActive = activeKey === tab.key
        const isFirst = index === 0
        const isLast = index === tabs.length - 1
        const radiusClass = isFirst ? 'rounded-l-lg' : isLast ? 'rounded-r-lg' : ''
        const overlapClass = isFirst ? '' : '-ml-px'

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={tab.ariaLabel ?? tab.label}
            disabled={disabled}
            onClick={() => onChange(tab.key)}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap border px-4 h-[38px] text-[12px] font-bold transition-all duration-150 ${overlapClass} ${radiusClass} ${
              isActive ? activeSegmentClass : inactiveSegmentClass
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
