import React, { useState } from 'react'
import Button from '../Button'
import Input from '../Input'
import { IoFolderOpenOutline } from 'react-icons/io5'
import ModalWindow from '../ModalWindow'

interface TextInputModalProps {
  onSubmit: (text: string) => void
  title: string
  filedName: string
  setIsModalOpen: (isOpen: boolean) => void
  inputText: string
  setInputText: (collectionName: string) => void
  placeholder?: string
  maxLength?: number
  allowSpecialChars?: boolean
  validation?: (text: string) => string | null
  showToast?: (
    title: string,
    type: 'success' | 'error' | 'warning' | 'info',
    description: string
  ) => void
}

const TextInputModal: React.FC<TextInputModalProps> = ({
  onSubmit,
  title,
  filedName,
  setIsModalOpen,
  inputText,
  setInputText,
  placeholder,
  maxLength = 100,
  allowSpecialChars = false,
  validation,
  showToast
}) => {
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async (): Promise<void> => {
    setError('')

    let errorMessage = ''

    // Basic validation
    if (!inputText.trim()) {
      errorMessage = 'Name is mandatory'
      setError(errorMessage)
      return
    }

    // Length validation
    if (inputText.length > maxLength) {
      errorMessage = `${filedName} name must be ${maxLength} characters or less`
      setError(errorMessage)
      return
    }

    // Custom validation
    if (validation) {
      const validationError = validation(inputText.trim())
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setIsSubmitting(true)
    try {
      await onSubmit(inputText.trim())
    } catch {
      const errorMsg = 'An error occurred while saving. Please try again.'
      setError(errorMsg)
      if (showToast) {
        showToast('Error', 'error', errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = (): void => {
    setInputText('')
    setError('')
    setIsModalOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value

    // Clear error when user starts typing
    if (error) setError('')

    // Apply character filtering if needed
    const filteredValue = allowSpecialChars ? value : value.replace(/[^a-zA-Z0-9\s\-_]/g, '')

    setInputText(filteredValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  return (
    <ModalWindow
      isOpen={true}
      onClose={handleCancel}
      title={title || 'Add ' + filedName}
      subtitle={title ? `Add ${filedName}` : undefined}
      icon={<IoFolderOpenOutline className="text-white text-2xl" />}
      maxWidth="md"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button
            text="Cancel"
            nature="tertiary"
            width="small"
            size="lg"
            onClick={handleCancel}
            disabled={isSubmitting}
          />
          <Button
            text={isSubmitting ? 'Creating...' : 'Create'}
            nature="primary"
            width="small"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="text-input"
              className="block text-sm font-medium text-gray-700 dark:text-ph-dark-text"
            >
              {filedName} Name
              <span className="text-red-500 dark:text-red-400 ml-1">*</span>
            </label>
          </div>

          <Input
            id="text-input"
            type="text"
            name="textInput"
            placeholder={placeholder || `Enter ${filedName} Name`}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            error={error}
            maxLength={maxLength}
            required
            disabled={isSubmitting}
            autoFocus
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'input-error' : undefined}
          />
        </div>
      </div>
    </ModalWindow>
  )
}

export default TextInputModal
