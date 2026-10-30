import React, { useId } from 'react'
import Tooltip from '../Tooltip'

interface ButtonProps {
  text?: string
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  form?: string
  isLoading?: boolean
  disabled?: boolean
  width?: 'full' | 'half' | 'small' | 'auto'
  customClass?: string
  children?: React.ReactNode
  icon?: React.ReactNode
  nature?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  showTooltip?: boolean
  tooltipContent?: string
  tooltipPlacement?:
    'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
}

const sizeMap: Record<NonNullable<ButtonProps['width']>, string> = {
  full: 'w-full',
  half: 'w-1/2',
  small: 'w-auto min-w-[60px]',
  auto: 'w-auto'
}

const buttonSizeMap: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'py-1 px-2 text-xs',
  md: 'py-1.5 px-3 text-sm',
  lg: 'py-2 px-4 text-sm'
}

const getNatureClasses = (
  nature: NonNullable<ButtonProps['nature']>,
  variant: NonNullable<ButtonProps['variant']>
) => {
  const baseClasses = 'font-medium transition-all duration-200 ease-in-out focus:outline-none'

  if (variant === 'outline') {
    switch (nature) {
      case 'primary':
        return `${baseClasses} border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 bg-transparent hover:bg-purple-55 dark:hover:bg-purple-900/20`
      case 'secondary':
        return `${baseClasses} border border-gray-200 dark:border-ph-border-dark text-gray-700 dark:text-ph-dark-text bg-transparent hover:bg-gray-100 dark:hover:bg-ph-dark-lite`
      case 'tertiary':
        return `${baseClasses} border border-gray-200 dark:border-ph-border-dark text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-100 dark:hover:bg-ph-dark-lite`
      case 'danger':
        return `${baseClasses} border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20`
      case 'success':
        return `${baseClasses} border-2 border-green-500 dark:border-green-400 text-green-600 dark:text-green-400 bg-transparent hover:bg-green-50 dark:hover:bg-green-900/20`
      case 'warning':
        return `${baseClasses} border-2 border-yellow-500 dark:border-yellow-400 text-yellow-600 dark:text-yellow-500 bg-transparent hover:bg-yellow-55 dark:hover:bg-yellow-900/20`
      default:
        return `${baseClasses} ph-button-secondary`
    }
  }

  if (variant === 'ghost') {
    switch (nature) {
      case 'primary':
        return `${baseClasses} text-purple-600 dark:text-purple-400 bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20`
      case 'secondary':
        return `${baseClasses} text-gray-700 dark:text-ph-dark-text bg-transparent hover:bg-gray-50 dark:hover:bg-ph-dark-lite`
      case 'tertiary':
        return `${baseClasses} text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-ph-dark-lite`
      case 'danger':
        return `${baseClasses} text-red-600 dark:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20`
      case 'success':
        return `${baseClasses} text-green-600 dark:text-green-400 bg-transparent hover:bg-green-50 dark:hover:bg-green-900/20`
      case 'warning':
        return `${baseClasses} text-yellow-600 dark:text-yellow-500 bg-transparent hover:bg-yellow-50 dark:hover:bg-yellow-900/20`
      default:
        return `${baseClasses} ph-button-tertiary`
    }
  }

  // Default variant (solid)
  switch (nature) {
    case 'primary':
      return `${baseClasses} text-white phottam-theme`
    case 'secondary':
      return `${baseClasses} border border-[#EBE1FF] dark:border-ph-border-dark text-[#7F3CFF] dark:text-purple-400 rounded-lg bg-white dark:bg-ph-dark-lite px-4 py-2 transition-all duration-200 hover:opacity-80 dark:hover:bg-ph-dark`
    case 'tertiary':
      return `${baseClasses} border border-gray-300 dark:border-gray-600 bg-white dark:bg-ph-dark-lite text-gray-700 dark:text-gray-200 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-ph-dark transition-all duration-200`
    case 'danger':
      return `${baseClasses} bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white`
    case 'success':
      return `${baseClasses} bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white`
    case 'warning':
      return `${baseClasses} bg-yellow-600 dark:bg-yellow-500 hover:bg-yellow-700 dark:hover:bg-yellow-600 text-white`
    default:
      return `${baseClasses} text-white phottam-theme`
  }
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  form,
  isLoading = false,
  disabled = false,
  width = 'auto',
  customClass,
  children,
  icon,
  nature = 'primary',
  size = 'md',
  variant = 'default',
  showTooltip = false,
  tooltipContent = '',
  tooltipPlacement = 'top'
}) => {
  const tooltipId = useId().replace(/:/g, '')
  const isButtonDisabled = isLoading || disabled
  // Build classes with enhanced dark mode support
  const baseClasses = [
    'font-plus-jakarta rounded-lg transition-all duration-200 ease-in-out',
    'flex max-w-full items-center justify-center gap-1.5',
    'transform hover:scale-[1.02] active:scale-[0.98]',
    'disabled:transform-none disabled:hover:scale-100',
    'focus:outline-none'
  ]

  const stateClasses = [
    isButtonDisabled
      ? 'opacity-60 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer hover:shadow-sm dark:hover:shadow-gray-900/20'
  ]

  const classes = [
    ...baseClasses,
    ...stateClasses,
    getNatureClasses(nature, variant),
    buttonSizeMap[size],
    sizeMap[width],
    customClass || ''
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isButtonDisabled) {
      e.preventDefault()
      return
    }
    onClick?.(e)
  }

  // Enhanced loading spinner with theme awareness
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`
        w-4 h-4 border-2 rounded-full animate-spin
        ${
          nature === 'primary' ||
          nature === 'danger' ||
          nature === 'success' ||
          nature === 'warning'
            ? 'border-white border-t-transparent'
            : 'border-current border-t-transparent opacity-60'
        }
      `}
      ></div>
      <span>Loading...</span>
    </div>
  )

  const buttonElement = (
    <button
      type={type}
      form={form}
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={classes}
      aria-disabled={isButtonDisabled}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="min-w-0 truncate">{children || text}</span>
        </>
      )}
    </button>
  )

  if (showTooltip && tooltipContent) {
    return (
      <Tooltip
        id={tooltipId}
        content={tooltipContent}
        place={tooltipPlacement}
        size="sm"
        className="!max-w-[280px] !text-center !leading-snug"
        wrapperClassName={`inline-flex ${isButtonDisabled ? 'cursor-not-allowed' : ''}`}
      >
        {buttonElement}
      </Tooltip>
    )
  }

  return buttonElement
}

export default Button
