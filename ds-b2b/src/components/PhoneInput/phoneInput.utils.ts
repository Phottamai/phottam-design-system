import { isValidPhoneNumber as libIsValidPhoneNumber } from 'react-phone-number-input'

/** Re-export for shared phone utilities (prefer getPhoneValidationError in forms). */
export const isValidPhoneNumber = libIsValidPhoneNumber

export interface PhoneValidationOptions {
  required?: boolean
  requiredMessage?: string
  invalidMessage?: string
}

export const getPhoneValidationError = (
  value: string,
  {
    required = true,
    requiredMessage = 'Phone number is required.',
    invalidMessage = 'Please enter a valid phone number.'
  }: PhoneValidationOptions = {}
): string => {
  const trimmed = value?.trim() ?? ''
  if (!trimmed) {
    return required ? requiredMessage : ''
  }
  if (!libIsValidPhoneNumber(trimmed)) {
    return invalidMessage
  }
  return ''
}
