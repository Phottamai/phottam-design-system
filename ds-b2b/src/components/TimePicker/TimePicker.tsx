import { useEffect, useRef, useState, type JSX } from 'react'
import { AnchoredDropdownPanel } from '../AnchoredDropdown'
import useClickOutside from '../../hooks/useClickOutside'
import { FONT_FRANK } from '../../tokens/typography'
import {
  TIME_PICKER_HOURS,
  TIME_PICKER_MERIDIEMS,
  TIME_PICKER_MINUTES,
  to12HourParts,
  to24HourFormat,
  type Meridiem
} from './timeUtils'

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  id?: string
  disabled?: boolean
  className?: string
  zIndex?: number
  size?: 'sm' | 'md'
}

interface TimePickerColumnSelectProps {
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  ariaLabel: string
  zIndex: number
}

const COLUMN_TRIGGER_CLASS =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 dark:border-gray-600 dark:bg-ph-dark dark:text-gray-100'

const COLUMN_OPTION_CLASS =
  'w-full px-3 py-2 text-left text-sm text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-ph-dark-lite'

function TimePickerColumnSelect({
  value,
  options,
  onChange,
  ariaLabel,
  zIndex
}: TimePickerColumnSelectProps): JSX.Element {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useClickOutside([triggerRef, panelRef], () => setOpen(false), {
    ignoreSelectors: '[data-time-picker-column-panel]'
  })

  return (
    <div className="relative min-w-0 flex-1">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={COLUMN_TRIGGER_CLASS}
        style={{ fontFamily: FONT_FRANK }}
      >
        {value}
      </button>

      <AnchoredDropdownPanel
        open={open}
        triggerRef={triggerRef}
        panelRef={panelRef}
        zIndex={zIndex}
        matchTriggerWidth
        maxHeight={160}
        panelOverflow="auto"
        className="rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-ph-dark-lite"
      >
        <div data-time-picker-column-panel className="flex flex-col">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className={COLUMN_OPTION_CLASS}
              style={{ fontFamily: FONT_FRANK }}
            >
              {option}
            </button>
          ))}
        </div>
      </AnchoredDropdownPanel>
    </div>
  )
}

const TimePicker = ({
  value,
  onChange,
  id,
  disabled = false,
  className = '',
  zIndex = 1320,
  size = 'sm'
}: TimePickerProps): JSX.Element => {
  const triggerRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [hour, setHour] = useState('09')
  const [minute, setMinute] = useState('00')
  const [meridiem, setMeridiem] = useState<Meridiem>('AM')

  useEffect(() => {
    const parts = to12HourParts(value)
    setHour(parts.hour)
    setMinute(parts.minute)
    setMeridiem(parts.meridiem)
  }, [value])

  useClickOutside([triggerRef, panelRef], () => setIsOpen(false), {
    ignoreSelectors:
      '[data-time-picker-panel], [data-time-picker-column-panel], [data-anchored-dropdown-panel]'
  })

  const handleConfirm = (): void => {
    onChange(to24HourFormat(hour, minute, meridiem))
    setIsOpen(false)
  }

  const columnZIndex = zIndex + 10
  const isSm = size === 'sm'

  return (
    <div className={`relative w-full ${className}`}>
      <input
        ref={triggerRef}
        id={id}
        readOnly
        disabled={disabled}
        value={`${hour}:${minute} ${meridiem}`}
        placeholder="Select time"
        onClick={() => {
          if (disabled) return
          setIsOpen((prev) => !prev)
        }}
        className={
          isSm
            ? 'w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-[#0f1015] dark:text-white dark:hover:border-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500'
            : 'w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-ph-dark dark:text-gray-100 dark:disabled:bg-gray-800 dark:disabled:text-gray-500'
        }
        style={isSm ? undefined : { fontFamily: FONT_FRANK }}
      />

      <AnchoredDropdownPanel
        open={isOpen}
        triggerRef={triggerRef}
        panelRef={panelRef}
        zIndex={zIndex}
        matchTriggerWidth={false}
        fallbackPanelWidth={320}
        className="max-w-[calc(100vw-24px)] rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-ph-dark-lite"
      >
        <div data-time-picker-panel className="space-y-4">
          <div className="flex items-center gap-2 text-center">
            <TimePickerColumnSelect
              value={hour}
              options={TIME_PICKER_HOURS}
              onChange={setHour}
              ariaLabel="Hour"
              zIndex={columnZIndex}
            />
            <span className="px-1 text-lg font-medium text-gray-500">:</span>
            <TimePickerColumnSelect
              value={minute}
              options={TIME_PICKER_MINUTES}
              onChange={setMinute}
              ariaLabel="Minute"
              zIndex={columnZIndex}
            />
            <TimePickerColumnSelect
              value={meridiem}
              options={TIME_PICKER_MERIDIEMS}
              onChange={(next) => setMeridiem(next as Meridiem)}
              ariaLabel="AM or PM"
              zIndex={columnZIndex}
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm font-semibold text-blue-600 hover:underline"
              style={{ fontFamily: FONT_FRANK }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-3 py-1 text-sm font-semibold text-blue-600 hover:underline"
              style={{ fontFamily: FONT_FRANK }}
            >
              OK
            </button>
          </div>
        </div>
      </AnchoredDropdownPanel>
    </div>
  )
}

export default TimePicker
