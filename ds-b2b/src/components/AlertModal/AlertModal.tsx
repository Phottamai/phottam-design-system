import React, { useId } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { FiAlertTriangle, FiInfo, FiXCircle } from 'react-icons/fi'
import Button from '../Button'

type AlertType = 'info' | 'error' | 'warning'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  type?: AlertType
  title?: string
  description?: string
  actionLabel: string
  onAction?: () => void
  disableOverlayClose?: boolean
}

const typeStyles: Record<
  AlertType,
  {
    badgeBg: string
    badgeText: string
    icon: React.ReactNode
    buttonNature: 'primary' | 'danger' | 'warning'
  }
> = {
  info: {
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-600',
    icon: <FiInfo className="text-blue-600" size={24} />,
    buttonNature: 'primary'
  },
  error: {
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-600',
    icon: <FiXCircle className="text-red-600" size={24} />,
    buttonNature: 'danger'
  },
  warning: {
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-600',
    icon: <FiAlertTriangle className="text-yellow-600" size={24} />,
    buttonNature: 'warning'
  }
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  description,
  actionLabel,
  onAction,
  disableOverlayClose
}) => {
  const titleId = useId()
  const descriptionId = useId()

  if (!isOpen) return null

  const style = typeStyles[type]

  const handleAction = () => {
    if (onAction) {
      onAction()
    } else {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={() => {
          if (!disableOverlayClose) {
            onClose()
          }
        }}
      />

      <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-white shadow-2xl border border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close alert"
        >
          <IoCloseOutline size={22} />
        </button>

        <div className="px-6 py-8 flex flex-col items-center text-center space-y-3">
          <div className={`${style.badgeBg} ${style.badgeText} p-2.5 rounded-full`}>
            {style.icon}
          </div>

          {title && (
            <h2
              id={titleId}
              className="text-xl font-semibold text-gray-900 tracking-tight leading-snug"
            >
              {title}
            </h2>
          )}

          {description && (
            <p id={descriptionId} className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          )}

          <Button
            text={actionLabel}
            onClick={handleAction}
            nature={style.buttonNature}
            width="small"
            customClass="mt-1 min-w-[140px]"
          />
        </div>
      </div>
    </div>
  )
}

export default AlertModal
