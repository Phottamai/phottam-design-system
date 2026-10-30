import React, { ReactElement } from 'react'
import Tooltip from '../Tooltip'
import { IoInformationCircleOutline } from 'react-icons/io5'

interface LabelProps {
  text: string
  htmlFor: string
  helpText?: string | ReactElement
  required?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'floating' | 'inline'
  showAdd?: boolean
  onAdd?: () => void
  addText?: string
}

const sizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}

const Label: React.FC<LabelProps> = ({
  text,
  htmlFor,
  helpText,
  required = false,
  className = '',
  size = 'md',
  variant = 'default',
  showAdd = false,
  onAdd,
  addText = 'Add New'
}) => {
  const baseClasses = [
    'font-medium transition-colors duration-200',
    'theme-text-primary',
    sizeMap[size]
  ]

  const variantClasses = {
    default: 'block mb-1',
    floating: 'absolute -top-2 left-2 px-1 bg-white dark:bg-ph-dark-lite z-10',
    inline: 'inline-block mr-2'
  }

  const labelClasses = [...baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(' ')

  const containerClasses = variant === 'inline' ? 'flex items-center' : 'flex flex-col'

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <label htmlFor={htmlFor} className={labelClasses}>
            {text}
            {required && (
              <span className="text-red-600 dark:text-red-400 ml-1" aria-label="Required field">
                *
              </span>
            )}
          </label>

          {helpText && (
            <Tooltip
              id={`label-help-${htmlFor}`}
              content={typeof helpText === 'string' ? helpText : ''}
              size="sm"
            >
              <div className="flex items-center">
                <IoInformationCircleOutline className="w-3 h-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors duration-200" />
              </div>
            </Tooltip>
          )}
        </div>

        {showAdd && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="shrink-0 whitespace-nowrap text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
          >
            + {addText}
          </button>
        )}
      </div>
    </div>
  )
}

export default Label
