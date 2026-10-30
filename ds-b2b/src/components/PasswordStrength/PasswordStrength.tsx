import type { JSX } from 'react'
interface PasswordStrengthProps {
  password: string
  newPassword: string
}

export default function PasswordStrength({
  password,
  newPassword
}: PasswordStrengthProps): JSX.Element | null {
  const getPasswordStrength = () => {
    const criteria = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    }

    const match = Object.values(criteria).filter(Boolean).length

    return {
      criteria,
      strength: match === 4 ? 'Strong' : match === 3 ? 'Medium' : 'Weak'
    }
  }

  if (password === '') {
    return null
  }

  const { criteria, strength } = getPasswordStrength()
  const strengthTextClass =
    strength === 'Strong'
      ? 'text-green-600'
      : strength === 'Medium'
        ? 'text-orange-600'
        : 'text-red-600'
  const strengthBgClass =
    strength === 'Strong' ? 'bg-green-100' : strength === 'Medium' ? 'bg-orange-100' : 'bg-red-100'

  return (
    <div className="mt-2">
      <div className={`font-medium ${strengthTextClass}`}>Password strength: {strength}</div>
      <ul className={`mt-2 rounded-md p-4 text-sm ${strengthBgClass}`}>
        <h3 className="text-sm font-medium">Password Requirements :</h3>
        <li
          className={`flex items-center gap-2 ${criteria.length ? 'text-green-600' : 'text-gray-600'}`}
        >
          ✓ Minimum 8 characters
        </li>
        <li
          className={`flex items-center gap-2 ${criteria.uppercase ? 'text-green-600' : 'text-gray-600'}`}
        >
          ✓ At least one uppercase letter
        </li>
        <li
          className={`flex items-center gap-2 ${criteria.number ? 'text-green-600' : 'text-gray-600'}`}
        >
          ✓ At least one number
        </li>
        <li
          className={`flex items-center gap-2 ${criteria.special ? 'text-green-600' : 'text-gray-600'}`}
        >
          ✓ At least one special character
        </li>
      </ul>
    </div>
  )
}
