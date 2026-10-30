import React, { useCallback, useEffect, useRef } from 'react'
import { formatDateInputDisplay } from './dateUtils'
import { PiCalendarDots } from 'react-icons/pi'

interface DatePickerProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  name: string
  id?: string
  label?: string
  placeholder?: string
  className?: string
  disablePastDates?: boolean
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const DATE_INPUT_INDICATOR_CLASS = '[&::-webkit-calendar-picker-indicator]:hidden'

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  name,
  id,
  label,
  className,
  disablePastDates = false,
  disabled = false,
  required,
  size = 'md'
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const pickerOpenRef = useRef(false)
  const fieldId = id || name

  const today = new Date().toISOString().split('T')[0]

  const closePicker = useCallback((): void => {
    const input = inputRef.current as (HTMLInputElement & { hidePicker?: () => void }) | null
    if (!input) return
    pickerOpenRef.current = false
    if (typeof input.hidePicker === 'function') {
      try {
        input.hidePicker()
        return
      } catch {
        // fall through to blur
      }
    }
    input.blur()
  }, [])

  /** Matches AddFolderModal / AddEventModal — focus first so showPicker works in Electron. */
  const openDatePicker = useCallback((): void => {
    if (disabled) return
    const input = inputRef.current
    if (!input) return
    input.focus()
    try {
      input.showPicker?.()
      pickerOpenRef.current = true
    } catch {
      pickerOpenRef.current = false
    }
  }, [disabled])

  const handleActivatorClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation()

      if (pickerOpenRef.current) {
        closePicker()
        return
      }
      openDatePicker()
    },
    [closePicker, openDatePicker]
  )

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const syncClosed = (): void => {
      pickerOpenRef.current = false
    }

    input.addEventListener('cancel', syncClosed)
    input.addEventListener('change', syncClosed)
    return () => {
      input.removeEventListener('cancel', syncClosed)
      input.removeEventListener('change', syncClosed)
    }
  }, [])

  /** Format the value to yyyy-MM-dd for the native input */
  const inputValue = formatDateInputDisplay(value)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    pickerOpenRef.current = false
    const dateStr = e.target.value
    if (!dateStr) {
      onChange({
        target: { name, value: '' }
      } as React.ChangeEvent<HTMLInputElement>)
      return
    }
    onChange({
      target: { name, value: dateStr }
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className={className || ''}>
      {label ? (
        <label
          htmlFor={fieldId}
          onClick={handleActivatorClick}
          className={`mb-1 block ${
            size === 'sm'
              ? 'text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              : 'text-sm font-medium text-gray-700 dark:text-gray-300'
          } ${disabled ? '' : 'cursor-pointer'}`}
        >
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}
      <div
        className={`relative flex items-center ${disabled ? '' : 'cursor-pointer'}`}
        role="presentation"
      >
        <input
          ref={inputRef}
          id={fieldId}
          name={name}
          type="date"
          disabled={disabled}
          required={required}
          value={inputValue}
          onChange={handleDateChange}
          onClick={handleActivatorClick}
          min={disablePastDates ? today : undefined}
          className={[
            size === 'sm'
              ? 'theme-input w-full rounded-lg border px-2.5 py-1 text-xs h-8'
              : 'theme-input w-full rounded-lg border px-3 py-2 text-sm',
            'bg-white text-gray-900 dark:bg-ph-dark-lite dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/40',
            '[color-scheme:light] dark:[color-scheme:dark]',
            DATE_INPUT_INDICATOR_CLASS,
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          ].join(' ')}
        />
        <div className="pointer-events-none absolute right-3 z-0 text-gray-500">
          <PiCalendarDots size={18} />
        </div>
      </div>
    </div>
  )
}

export default DatePicker
