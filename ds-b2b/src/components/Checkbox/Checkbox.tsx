import React, { ChangeEvent, useId } from 'react'

interface CheckboxProps {
  id?: string
  name?: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  label?: string
  description?: string
  className?: string
  disabled?: boolean
  indeterminate?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'card' | 'switch'
  error?: boolean
  required?: boolean
}

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
}

/** Matches the label's line-height (text-xs/sm/base) so the box centres on the first text line. */
const rowHeightMap = {
  sm: 'h-4',
  md: 'h-5',
  lg: 'h-6'
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  description,
  className = '',
  disabled = false,
  indeterminate = false,
  size = 'md',
  variant = 'default',
  error = false,
  required = false
}) => {
  const generatedId = useId()
  const checkboxId = id || `checkbox-${name}-${generatedId}`

  const checkboxClasses = [
    sizeMap[size],
    'ph-checkbox rounded border-2 transition-all duration-200 ease-in-out',
    'focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
    error
      ? 'border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 focus:ring-red-500 dark:focus:ring-red-400'
      : 'border-gray-300 dark:border-ph-border-dark text-purple-600 dark:text-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400',
    checked || indeterminate
      ? error
        ? 'bg-red-600 dark:bg-red-500 border-red-600 dark:border-red-500'
        : 'bg-purple-600 dark:bg-purple-500 border-purple-600 dark:border-purple-500'
      : 'bg-white dark:bg-ph-dark',
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer hover:border-purple-400 dark:hover:border-purple-500',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const labelClasses = [
    'font-medium transition-colors duration-200',
    disabled
      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
      : 'text-gray-700 dark:text-gray-200 cursor-pointer',
    size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
  ]
    .filter(Boolean)
    .join(' ')

  const descriptionClasses = [
    'transition-colors duration-200',
    disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400',
    size === 'sm' ? 'text-xs' : 'text-sm'
  ]
    .filter(Boolean)
    .join(' ')

  const containerClasses = [
    'flex items-start gap-3',
    variant === 'card' &&
      'p-4 rounded-lg border border-gray-200 dark:border-ph-border-dark bg-white dark:bg-ph-dark-lite hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200'
  ]
    .filter(Boolean)
    .join(' ')

  // Handle indeterminate state
  React.useEffect(() => {
    const checkbox = document.getElementById(checkboxId) as HTMLInputElement
    if (checkbox) {
      checkbox.indeterminate = indeterminate
    }
  }, [indeterminate, checkboxId])

  if (variant === 'switch') {
    return (
      <label className="flex items-center cursor-pointer" htmlFor={checkboxId}>
        <div className="relative">
          <input
            type="checkbox"
            id={checkboxId}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="sr-only"
          />
          <div
            className={`
            w-10 h-6 rounded-full transition-colors duration-200 ease-in-out
            ${
              checked
                ? error
                  ? 'bg-red-600 dark:bg-red-500'
                  : 'bg-purple-600 dark:bg-purple-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }
            ${disabled ? 'opacity-50' : 'hover:opacity-80'}
          `}
          >
            <div
              className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md
              transform transition-transform duration-200 ease-in-out
              ${checked ? 'translate-x-4' : 'translate-x-0'}
            `}
            />
          </div>
        </div>
        {label && (
          <div className="ml-3">
            <span className={labelClasses}>
              {label}
              {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
            </span>
            {description && <p className={descriptionClasses}>{description}</p>}
          </div>
        )}
      </label>
    )
  }

  return (
    <div className={containerClasses}>
      <div className={`flex shrink-0 items-center ${rowHeightMap[size]}`}>
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={checkboxClasses}
          aria-describedby={description ? `${checkboxId}-description` : undefined}
        />
      </div>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label htmlFor={checkboxId} className={`block ${labelClasses}`}>
              {label}
              {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p id={`${checkboxId}-description`} className={`${descriptionClasses} mt-1`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Checkbox
