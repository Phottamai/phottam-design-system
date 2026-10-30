import React from 'react'
import { PiArrowLeftBold } from 'react-icons/pi'

export interface BreadcrumbItem {
  label: string
  onClick?: () => void
}

interface BreadcrumbsProps {
  title: string
  onBack: () => void
  /** @deprecated kept for backward compat — ignored when title is provided */
  items?: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ title, onBack }) => {
  return (
    <nav className="flex min-w-0 items-center gap-2.5" aria-label="Back navigation">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex shrink-0 items-center justify-center text-slate-500 hover:text-purple-600 transition-colors focus:outline-none dark:text-gray-400 dark:hover:text-purple-400"
      >
        <PiArrowLeftBold size={18} className="shrink-0" />
      </button>
      <span className="text-base font-semibold text-[#120037] dark:text-gray-100 select-none min-w-0 truncate">
        {title}
      </span>
    </nav>
  )
}
