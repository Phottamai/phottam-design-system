import { forwardRef, type JSX } from 'react'
import { IoSearchOutline, IoCloseCircle } from 'react-icons/io5'
import { RotatingSearchPlaceholder } from './RotatingSearchPlaceholder'
import { ROTATING_SEARCH_HINT_PREFIX } from './searchHints'
import { useRotatingSearchHintIndex } from '../../hooks/useRotatingSearchHintIndex'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onClear?: () => void
  /** Suffix phrases only; shown after `rotatingHintsPrefix` (spacer after “by” is handled in `RotatingSearchPlaceholder`). */
  rotatingHints?: readonly string[]
  /** Prepended to each suffix; defaults to app-wide rotating search prefix. */
  rotatingHintsPrefix?: string
  /** Static description for assistive tech when using rotating hints. */
  rotatingSearchAriaLabel?: string
  /** Tighter field for dense toolbars (e.g. View Uploads header). */
  compact?: boolean
}

const fieldShellDefault =
  'flex h-[42px] w-full max-w-md flex-1 items-center gap-2.5 rounded-xl border border-[#F6F6F6] bg-[#F7F7F7] px-3 shadow-sm focus-within:border-[#6829F3]/35 focus-within:outline-none focus-within:ring-1 focus-within:ring-inset focus-within:ring-[#6E22FF]/15 dark:border-gray-600 dark:bg-gray-800/60 dark:focus-within:border-purple-400/50 dark:focus-within:ring-purple-400/20'

const fieldShellCompact =
  'flex h-[34px] w-full max-w-md flex-1 items-center gap-2 rounded-lg border border-[#E9E9E9] bg-[#F7F7F7] px-2.5 shadow-sm focus-within:border-[#6829F3]/35 focus-within:outline-none focus-within:ring-1 focus-within:ring-inset focus-within:ring-[#6E22FF]/15 dark:border-gray-600 dark:bg-gray-800/60 dark:focus-within:border-purple-400/50 dark:focus-within:ring-purple-400/20'

const inputClass =
  "min-h-0 min-w-0 flex-1 border-0 bg-transparent px-0 py-0 font-['Frank_Ruhl_Libre'] text-xs leading-normal text-[#120037] shadow-none focus:outline-none focus:ring-0 dark:text-gray-300 placeholder:font-['Frank_Ruhl_Libre'] placeholder:text-gray-600 dark:placeholder:text-gray-300"

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Search...',
      className = '',
      onClear,
      rotatingHints,
      rotatingHintsPrefix = ROTATING_SEARCH_HINT_PREFIX,
      rotatingSearchAriaLabel,
      compact = false
    },
    ref
  ): JSX.Element => {
    const handleClear = (): void => {
      onChange('')
      onClear?.()
    }

    const hasValue = Boolean(value.trim())
    const hints = rotatingHints && rotatingHints.length > 0 ? rotatingHints : null
    const useRotator = Boolean(hints)
    const paused = hasValue
    const hintIndex = useRotatingSearchHintIndex(hints?.length ?? 0, paused)

    const showOverlay = useRotator && !hasValue
    const inputPlaceholder = showOverlay ? '' : placeholder

    return (
      <div
        className={`relative ${compact ? fieldShellCompact : fieldShellDefault} ${className}`.trim()}
      >
        <IoSearchOutline
          className={`pointer-events-none shrink-0 text-[#64748B] dark:text-gray-400 ${
            compact ? 'h-4 w-4' : 'h-[18px] w-[18px]'
          }`}
          aria-hidden
        />

        <div className="relative flex min-h-0 min-w-0 flex-1 items-center">
          {showOverlay && hints ? (
            <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
              <RotatingSearchPlaceholder
                prefix={rotatingHintsPrefix}
                suffixes={hints}
                activeIndex={hintIndex}
                visible
              />
            </div>
          ) : null}

          <input
            ref={ref}
            type="text"
            placeholder={inputPlaceholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={useRotator && rotatingSearchAriaLabel ? rotatingSearchAriaLabel : undefined}
            className={inputClass}
          />
        </div>

        {value ? (
          <button
            onClick={handleClear}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label="Clear search"
            type="button"
          >
            <IoCloseCircle className={compact ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
          </button>
        ) : null}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput
