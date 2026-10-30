import React, { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import * as FlagIcons from 'country-flag-icons/react/3x2'
import CountrySelectDropdown from './CountrySelectDropdown'

const Flags = FlagIcons

interface PhoneInputFieldProps {
  value: string
  onChange: (e: { target: { name: string; value: string } }) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  name?: string
  disabled?: boolean
  placeholder?: string
  className?: string
  error?: boolean
  id?: string
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  onBlur,
  name = 'phone',
  disabled = false,
  placeholder = 'Enter phone number',
  className = '',
  error = false,
  id = 'phone'
}) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleChange = (phoneNumber: string = '') => {
    setInputValue(phoneNumber)
    onChange({
      target: {
        name: name || 'phone',
        value: phoneNumber
      }
    })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e)
    }
  }

  return (
    <div className={`phone-input-wrapper ${error ? 'phone-input-error' : ''} ${className}`}>
      <PhoneInput
        international
        flags={Flags}
        defaultCountry="IN"
        countrySelectComponent={CountrySelectDropdown}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        id={id}
        name={name}
        className="phone-input-field"
      />
    </div>
  )
}

export default PhoneInputField
