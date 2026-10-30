import React, { forwardRef, InputHTMLAttributes, useId, useState } from 'react'
import { IoCloseCircle, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helpText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined' | 'underlined'
  inputSize?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  showClearButton?: boolean
  onClear?: () => void
  showPasswordToggle?: boolean
  rows?: number
  /** Keep error border styling but render the message elsewhere (e.g. grid row below). */
  hideErrorMessage?: boolean
}

const sizeMap = {
  xs: 'px-2.5 py-1 text-xs h-8',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      fullWidth = true,
      loading = false,
      className = '',
      disabled,
      required,
      onClick,
      id,
      showClearButton = false,
      onClear,
      value,
      onChange,
      // Kept for API compatibility; password fields always show the toggle.
      showPasswordToggle: _showPasswordToggle = false,
      type,
      rows = 3,
      hideErrorMessage = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value || '')
    const [showPassword, setShowPassword] = useState(false)
    // useId keeps the generated id stable across renders and between server and client.
    const generatedId = useId()
    const inputId = id || `input-${generatedId}`

    const currentValue = value !== undefined ? value : internalValue
    const showClear = showClearButton && currentValue && !disabled && !loading
    const isPasswordField = type === 'password'
    const showPasswordIcon = isPasswordField

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue('')
      }
      onClear?.()
    }

    const getVariantClasses = () => {
      const baseClasses = 'transition-all duration-200 ease-in-out focus:outline-none'

      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-gray-100 dark:bg-ph-dark border-0 rounded-lg
          focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400`

        case 'outlined':
          return `${baseClasses} bg-white dark:bg-[#0f1015] border rounded-lg
          ${
            error
              ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400'
              : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500'
          } focus:ring-2 hover:border-gray-400 dark:hover:border-gray-700`

        case 'underlined':
          return `${baseClasses} bg-transparent border-0 border-b-2 rounded-none px-0
          ${
            error
              ? 'border-red-500 dark:border-red-400 focus:border-red-600 dark:focus:border-red-300'
              : 'border-gray-300 dark:border-ph-border-dark focus:border-purple-500 dark:focus:border-purple-400'
          }`

        default:
          return `${baseClasses} theme-input
          ${error ? 'theme-input-error' : ''}`
      }
    }

    const inputClasses = [
      getVariantClasses(),
      sizeMap[inputSize],
      fullWidth ? 'w-full' : 'w-auto',
      leftIcon ? 'pl-10' : '',
      rightIcon || loading || showClear || showPasswordIcon ? 'pr-10' : '',
      disabled ? 'opacity-60 cursor-not-allowed' : '',
      'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border',
      isPasswordField ? '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden' : '',
      className
    ]
      .filter(Boolean)
      .join(' ')

    const containerClasses = ['relative', fullWidth ? 'w-full' : 'w-auto'].filter(Boolean).join(' ')

    return (
      <div className={fullWidth ? 'w-full' : 'w-auto'}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium theme-text-primary mb-2">
            {label}
            {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className={containerClasses}>
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="text-gray-400 dark:text-gray-500">{leftIcon}</div>
            </div>
          )}

          {/* Input or Textarea */}
          {type === 'textarea' ? (
            <textarea
              ref={ref as any}
              id={inputId}
              disabled={disabled || loading}
              required={required}
              className={`${inputClasses} resize-none`}
              value={currentValue}
              onChange={handleChange as any}
              onClick={onClick as any}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
              }
              rows={rows}
              {...(props as any)}
            />
          ) : (
            <input
              ref={ref}
              id={inputId}
              type={isPasswordField && showPassword ? 'text' : type}
              disabled={disabled || loading}
              required={required}
              className={inputClasses}
              value={currentValue}
              onChange={handleChange}
              onClick={onClick}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
              }
              {...props}
            />
          )}

          {/* Right Side: Password Toggle, Clear Button, Right Icon, or Loading */}
          {(showPasswordIcon || showClear || rightIcon || loading) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {loading ? (
                <div className="w-4 h-4 border-2 border-purple-500 dark:border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              ) : showPasswordIcon ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pointer-events-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="w-5 h-5" />
                  ) : (
                    <IoEyeOutline className="w-5 h-5" />
                  )}
                </button>
              ) : showClear ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="pointer-events-auto flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm"
                  aria-label="Clear input"
                >
                  <IoCloseCircle className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              ) : (
                <>{rightIcon}</>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && !hideErrorMessage ? (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red-500 dark:text-red-400">
            {error}
          </p>
        ) : null}

        {/* Help Text */}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="mt-1 text-sm theme-text-muted">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
