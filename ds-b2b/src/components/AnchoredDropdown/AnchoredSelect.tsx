import { useRef, useState, useEffect, useMemo, type ReactNode, type JSX } from 'react'
import { IoChevronDownOutline } from 'react-icons/io5'
import { AnchoredDropdownPanel } from './AnchoredDropdownPanel'
import useClickOutside from '../../hooks/useClickOutside'

export type AnchoredSelectOption = {
  value: string
  label: string
}

export type AnchoredSelectProps = {
  value: string
  options: AnchoredSelectOption[]
  onChange: (value: string) => void
  disabled?: boolean
  ariaLabel?: string
  placeholder?: string
  searchable?: boolean
  creatable?: boolean
  onCreateOption?: (value: string) => void
  searchPlaceholder?: string
  triggerClassName?: string
  panelClassName?: string
  optionClassName?: string
  selectedOptionClassName?: string
  matchTriggerWidth?: boolean
  maxHeight?: number
  renderValue?: (option: AnchoredSelectOption | undefined) => ReactNode
  renderOption?: (option: AnchoredSelectOption, selected: boolean) => ReactNode
  className?: string
  zIndex?: number
  chevronClassName?: string
  variant?: 'dropdown' | 'corner' | 'trailing'
}

const DEFAULT_TRIGGER_CLASS =
  "flex min-w-[9rem] items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-left font-['Frank_Ruhl_Libre'] text-sm font-medium text-gray-900 transition-colors hover:border-purple-400 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:hover:border-gray-200 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-100 dark:disabled:bg-gray-800/40 dark:disabled:text-gray-400 dark:disabled:border-gray-600 dark:disabled:hover:border-gray-600"

const DEFAULT_PANEL_CLASS =
  'overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-[#0f1015]'

const DEFAULT_OPTION_CLASS =
  "flex w-full px-3 py-2 text-left font-['Frank_Ruhl_Libre'] text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-ph-dark-lite"

const DEFAULT_SELECTED_OPTION_CLASS =
  'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-200'

const DEFAULT_SEARCH_INPUT_CLASS =
  'h-8 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-700 outline-none focus:border-[#6829F3] focus:ring-1 focus:ring-inset focus:ring-[#6829F3] dark:border-gray-700 dark:bg-ph-dark dark:text-gray-200'

export function AnchoredSelect({
  value,
  options,
  onChange,
  disabled = false,
  ariaLabel = 'Select option',
  placeholder = 'Select',
  searchable = false,
  creatable = false,
  onCreateOption,
  searchPlaceholder = 'Search',
  triggerClassName = DEFAULT_TRIGGER_CLASS,
  panelClassName = DEFAULT_PANEL_CLASS,
  optionClassName = DEFAULT_OPTION_CLASS,
  selectedOptionClassName = DEFAULT_SELECTED_OPTION_CLASS,
  matchTriggerWidth = true,
  maxHeight = 280,
  renderValue,
  renderOption,
  className = 'relative inline-flex min-w-0',
  zIndex,
  chevronClassName = 'h-4 w-4',
  variant
}: AnchoredSelectProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((option) => option.value === value)
  const normalizedSearch = search.trim().toLowerCase()

  const filteredOptions = useMemo(() => {
    if (!searchable || !normalizedSearch) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalizedSearch) ||
        option.value.toLowerCase().includes(normalizedSearch)
    )
  }, [normalizedSearch, options, searchable])

  const canCreate =
    creatable &&
    normalizedSearch.length > 0 &&
    !options.some(
      (option) =>
        option.label.toLowerCase() === normalizedSearch ||
        option.value.toLowerCase() === normalizedSearch
    )

  useClickOutside([triggerRef, panelRef], () => {
    if (open) {
      setOpen(false)
    }
  })

  useEffect(() => {
    if (!open) {
      setSearch('')
      return
    }

    if (searchable) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus()
      })
    }
  }, [open, searchable])

  useEffect(() => {
    if (open && panelRef.current && !searchable) {
      const selectedEl = panelRef.current.querySelector('[aria-selected="true"]')
      if (selectedEl) {
        requestAnimationFrame(() => {
          selectedEl.scrollIntoView({ block: 'center' })
        })
      }
    }
  }, [open, searchable])

  const handleSelect = (nextValue: string): void => {
    setOpen(false)
    setSearch('')
    if (nextValue !== value) {
      onChange(nextValue)
    }
  }

  const handleCreate = (): void => {
    const trimmed = search.trim()
    if (!trimmed) return
    onCreateOption?.(trimmed)
    handleSelect(trimmed)
  }

  const displayValue = selectedOption?.label ?? (value.trim() || placeholder)

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          if (disabled) return
          setOpen((current) => !current)
        }}
        className={triggerClassName}
      >
        <span
          className={`min-w-0 truncate ${!selectedOption && !value.trim() ? 'text-gray-500 dark:text-gray-400' : ''}`}
        >
          {renderValue ? renderValue(selectedOption) : displayValue}
        </span>
        <IoChevronDownOutline
          className={`${chevronClassName} shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${disabled ? 'text-gray-400 dark:text-gray-500' : ''}`}
          aria-hidden
        />
      </button>
      <AnchoredDropdownPanel
        open={open}
        triggerRef={triggerRef}
        panelRef={panelRef}
        matchTriggerWidth={matchTriggerWidth}
        maxHeight={maxHeight}
        className={panelClassName}
        zIndex={zIndex}
        variant={variant}
      >
        {searchable ? (
          <div
            className="border-b border-gray-100 px-2 py-1.5 dark:border-gray-800"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className={DEFAULT_SEARCH_INPUT_CLASS}
              aria-label={searchPlaceholder}
            />
          </div>
        ) : null}
        <div role="listbox" aria-label={ariaLabel}>
          {filteredOptions.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(option.value)}
                className={`${optionClassName} ${selected ? selectedOptionClassName : ''}`}
              >
                {renderOption ? renderOption(option, selected) : option.label}
              </button>
            )
          })}
          {filteredOptions.length === 0 && !canCreate ? (
            <p className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">No results found</p>
          ) : null}
          {canCreate ? (
            <button
              type="button"
              onClick={handleCreate}
              className={`${optionClassName} border-t border-gray-100 font-semibold text-purple-700 dark:border-gray-800 dark:text-purple-300`}
            >
              {`Create "${search.trim()}"`}
            </button>
          ) : null}
        </div>
      </AnchoredDropdownPanel>
    </div>
  )
}
