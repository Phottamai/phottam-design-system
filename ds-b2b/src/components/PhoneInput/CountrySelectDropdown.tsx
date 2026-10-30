import React, { useState, useRef, useEffect, useMemo, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { getCountryCallingCode, Country } from 'react-phone-number-input'
import { IoChevronDownOutline, IoSearchOutline, IoCheckmarkOutline } from 'react-icons/io5'

const MENU_PORTAL_Z_INDEX = 10050
const MENU_WIDTH = 288
const PREFERRED_MAX_HEIGHT = 256

export interface CountryOption {
  value: string | undefined
  label: string
  divider?: boolean
}

export interface CountrySelectDropdownProps {
  value?: string
  onChange: (value: string | undefined) => void
  options: CountryOption[]
  iconComponent: React.ComponentType<{
    country?: string
    label?: string
    aspectRatio?: number
  }>
  disabled?: boolean
  readOnly?: boolean
  className?: string
  name?: string
  'aria-label'?: string
  onFocus?: () => void
  onBlur?: () => void
}

const getCallingCode = (countryCode?: string): string => {
  if (!countryCode || countryCode === 'ZZ') return ''
  try {
    return getCountryCallingCode(countryCode as Country)
  } catch {
    return ''
  }
}

export const CountrySelectDropdown: React.FC<CountrySelectDropdownProps> = ({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled = false,
  readOnly = false,
  className = '',
  'aria-label': ariaLabel = 'Country'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
    width: number
    maxHeight: number
    opensUpward?: boolean
  } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value && !opt.divider),
    [options, value]
  )

  const updateMenuPosition = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom - 12
    const spaceAbove = rect.top - 12

    const opensUpward = spaceBelow < PREFERRED_MAX_HEIGHT && spaceAbove > spaceBelow
    const availableSpace = opensUpward ? spaceAbove : spaceBelow
    const maxHeight = Math.max(140, Math.min(PREFERRED_MAX_HEIGHT, availableSpace))

    let left = rect.left
    const viewportWidth = window.innerWidth
    // Shrink below the preferred width on narrow windows so the menu keeps a 12px gutter.
    const menuWidth = Math.min(MENU_WIDTH, viewportWidth - 24)
    if (left + menuWidth > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - menuWidth - 12)
    } else {
      left = Math.max(12, left)
    }

    setMenuPosition({
      top: opensUpward ? rect.top - 6 : rect.bottom + 6,
      left,
      width: menuWidth,
      maxHeight,
      opensUpward
    })
  }, [])

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPosition(null)
      return
    }

    updateMenuPosition()
    const raf = requestAnimationFrame(updateMenuPosition)
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [isOpen, updateMenuPosition])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target)
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target)

      if (isOutsideContainer && isOutsideMenu) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return options.filter((opt) => !opt.divider)

    const cleanQuery = query.startsWith('+') ? query.slice(1) : query

    return options.filter((option) => {
      if (option.divider) return false
      const labelMatch = option.label.toLowerCase().includes(query)
      const codeMatch = option.value ? option.value.toLowerCase().includes(query) : false
      const callingCode = getCallingCode(option.value)
      const callingCodeMatch = callingCode ? callingCode.includes(cleanQuery) : false
      return labelMatch || codeMatch || callingCodeMatch
    })
  }, [options, searchQuery])

  const handleToggle = () => {
    if (disabled || readOnly) return
    setIsOpen((prev) => !prev)
    setSearchQuery('')
  }

  const handleSelect = (countryValue: string | undefined) => {
    onChange(countryValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  const menuPortal =
    isOpen &&
    menuPosition &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={menuRef}
        className="fixed flex flex-col rounded-lg border border-[#DBD3EA] dark:border-ph-border-dark bg-white dark:bg-ph-dark shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        style={{
          position: 'fixed',
          top: menuPosition.top,
          left: menuPosition.left,
          width: menuPosition.width,
          maxHeight: menuPosition.maxHeight,
          zIndex: MENU_PORTAL_Z_INDEX,
          ...(menuPosition.opensUpward ? { transform: 'translateY(-100%)' } : {})
        }}
      >
        <div className="p-2 border-b border-gray-100 dark:border-ph-border-dark bg-gray-50/70 dark:bg-ph-dark-lite/40 flex-shrink-0">
          <div className="relative flex items-center">
            <IoSearchOutline className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or code..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-md border border-[#DBD3EA] dark:border-ph-border-dark bg-white dark:bg-ph-dark text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-1 scrollbar-thin">
          {filteredOptions.length === 0 ? (
            <div className="py-5 text-center text-xs text-gray-400 dark:text-gray-500">
              No country found
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value
              const callingCode = getCallingCode(option.value)

              return (
                <button
                  key={option.value || 'ZZ'}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-md transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-ph-dark-lite text-purple-700 dark:text-purple-400 font-medium'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-ph-dark-lite/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-5 h-3.5 flex-shrink-0 flex items-center justify-center">
                      {Icon && (
                        <Icon country={option.value} label={option.label} aspectRatio={1.5} />
                      )}
                    </div>
                    <span className="truncate">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {callingCode ? (
                      <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                        +{callingCode}
                      </span>
                    ) : null}
                    {isSelected ? (
                      <IoCheckmarkOutline className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    ) : null}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>,
      document.body
    )

  return (
    <div ref={containerRef} className={`relative flex items-center h-full ${className}`}>
      <button
        type="button"
        disabled={disabled || readOnly}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-2.5 h-full rounded-l-lg hover:bg-gray-50 dark:hover:bg-ph-dark-lite/60 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex items-center justify-center w-5 h-3.5 flex-shrink-0">
          {Icon && (
            <Icon country={value} label={selectedOption?.label || 'Country'} aspectRatio={1.5} />
          )}
        </div>
        <IoChevronDownOutline
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-purple-600' : ''
          }`}
        />
      </button>

      {menuPortal}
    </div>
  )
}

export default CountrySelectDropdown
