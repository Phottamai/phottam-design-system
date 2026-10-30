import { useRef, type JSX } from 'react'
import { useScrollActiveIntoView } from '../../hooks/useScrollActiveIntoView'

interface SwitcherProps {
  size?: 'small' | 'medium'
  tabs: string[]
  activeTab: number
  onTabChange: (index: number) => void
  disabled?: boolean
}

export function Switcher({
  size = 'medium',
  tabs,
  activeTab,
  onTabChange,
  disabled
}: SwitcherProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  useScrollActiveIntoView(containerRef, activeTab)

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={`inline-flex max-w-full overflow-x-auto scrollbar-none rounded-lg bg-gray-100 p-0.5 dark:bg-slate-800/80 transition-opacity duration-200 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === idx
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onTabChange(idx)}
            className={`shrink-0 whitespace-nowrap rounded-md font-medium transition-all duration-200 select-none ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm dark:bg-ph-dark dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            } ${size === 'small' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}`}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

export default Switcher
