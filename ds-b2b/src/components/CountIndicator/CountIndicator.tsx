export interface CountIndicatorProps {
  currentLength?: number
  /** Maximum allowed characters (desktop app maps its INPUT_LIMITS keys to this). */
  maxLength: number
  className?: string
  /** Show amber/red warning when remaining characters are at or below this value. Default: 5 */
  warningAtRemaining?: number
  /** When true, render nothing until the warning threshold is reached. */
  onlyShowWhenWarning?: boolean
  /** Custom message when the character limit is reached. */
  atLimitMessage?: string
  /** When false, hides the current/max fraction (e.g. when shown elsewhere in the field). */
  showFraction?: boolean
}

export default function CountIndicator({
  currentLength = 0,
  maxLength,
  className = '',
  warningAtRemaining = 5,
  onlyShowWhenWarning = false,
  atLimitMessage,
  showFraction = true
}: CountIndicatorProps) {
  const remaining = maxLength - currentLength

  if (onlyShowWhenWarning && remaining > warningAtRemaining) {
    return null
  }

  let textClass = 'text-gray-400 dark:text-gray-500'
  if (remaining <= 0) {
    textClass = 'text-red-500 dark:text-red-400 font-semibold animate-pulse'
  } else if (remaining <= warningAtRemaining) {
    textClass = 'text-amber-500 dark:text-amber-400 font-medium'
  }

  const message =
    remaining <= 0
      ? (atLimitMessage ?? 'Character limit reached')
      : `${remaining} character${remaining === 1 ? '' : 's'} remaining`

  return (
    <div
      className={`mt-0.5 flex items-center justify-between text-[10px] transition-all duration-300 ${textClass} ${className}`}
    >
      <span className="min-w-0 truncate">{message}</span>
      {showFraction ? (
        <span className="font-mono text-[10px] opacity-85">
          {currentLength}/{maxLength}
        </span>
      ) : null}
    </div>
  )
}
