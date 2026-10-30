import React, { useState } from 'react'
import { IoClose, IoMail } from 'react-icons/io5'
import Input from '../Input'
import Button from '../Button'

interface MultiEmailInputProps {
  value: string[]
  onChange: (emails: string[]) => void
  label?: string
  disabled?: boolean
  placeholder?: string
  addButtonText?: string
  children?: React.ReactNode
}

const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const GUEST_SELECT_BUTTON_LABEL = '+Select'

const MultiEmailInput: React.FC<MultiEmailInputProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  placeholder = 'Enter email id and invoke +Select button',
  addButtonText = GUEST_SELECT_BUTTON_LABEL,
  children
}) => {
  const [currentEmail, setCurrentEmail] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    const email = currentEmail.trim()
    if (!email) return

    if (!EMAIL_PATTERN.test(email.toLowerCase())) {
      setError('Invalid email address')
      return
    }

    if (value.includes(email)) {
      setError('Email already added')
      return
    }

    onChange([...value, email])
    setCurrentEmail('')
    setError('')
  }

  const handleRemove = (index: number) => {
    const next = [...value]
    next.splice(index, 1)
    onChange(next)
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {label ? (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      ) : null}

      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <Input
            name="email-input"
            type="email"
            value={currentEmail}
            onChange={(e) => {
              setCurrentEmail(e.target.value)
              if (error) setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
            disabled={disabled}
            placeholder={placeholder}
          />
          {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
          {children}
        </div>
        <div className="mt-0.5 shrink-0">
          <Button
            text={addButtonText}
            onClick={handleAdd}
            disabled={disabled || !currentEmail.trim()}
            nature="secondary"
            size="sm"
            width="small"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((email, index) => (
          <div
            key={`${email}-${index}`}
            className="flex min-w-0 max-w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <IoMail size={10} className="shrink-0" />
            <span className="min-w-0 truncate text-[11px] font-medium" title={email}>
              {email}
            </span>
            {!disabled ? (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-1 shrink-0 rounded-full p-0.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
              >
                <IoClose size={10} />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MultiEmailInput
