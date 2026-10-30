import React from 'react'

interface ErrorMessageProps {
  message?: string
  className?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null

  return <p className={`mt-1 text-xs text-red-500 dark:text-red-400 ${className}`}>{message}</p>
}

export default ErrorMessage
