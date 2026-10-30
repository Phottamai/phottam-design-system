import React from 'react'
import { createPortal } from 'react-dom'
import {
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
  IoArchiveOutline
} from 'react-icons/io5'
import Button from '../Button'

function overlayZIndexStyle(zIndexClass: string): React.CSSProperties | undefined {
  const match = /z-\[(\d+)\]/.exec(zIndexClass)
  if (!match) return undefined
  const zIndex = Number(match[1])
  return Number.isFinite(zIndex) ? { zIndex } : undefined
}

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info' | 'primary' | 'memorybox'
  isLoading?: boolean
  confirmDisabled?: boolean
  confirmIcon?: React.ReactNode
  cancelButtonNature?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'success' | 'warning'
  confirmButtonNature?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'success' | 'warning'
  /** Smaller title/message spacing for compact delete flows */
  compact?: boolean
  /** Smaller message text only (e.g. logout confirmation) */
  smallMessage?: boolean
  /** Override default message typography */
  messageClassName?: string
  /** Tailwind z-index class for the overlay (default z-[1300]) */
  zIndexClass?: string
  /** Render overlay in document.body to escape nested stacking contexts */
  portal?: boolean
  /** Tailwind max-width class for the dialog panel (default max-w-[390px]) */
  panelMaxWidthClass?: string
  /** Extra panel classes (e.g. fixed height) */
  panelClassName?: string
  /** Inner content wrapper classes */
  contentClassName?: string
  /** Wrapper classes around {children} */
  childrenClassName?: string
  children?: React.ReactNode
  /** When true, clicking the backdrop does not call onClose */
  disableOverlayClose?: boolean
  /** When true, the confirm button is not rendered */
  hideConfirmButton?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  cancelButtonNature = 'tertiary',
  confirmButtonNature,
  type = 'warning',
  isLoading = false,
  confirmDisabled = false,
  confirmIcon,
  compact = false,
  smallMessage = false,
  messageClassName,
  zIndexClass = 'z-[1300]',
  portal = false,
  panelMaxWidthClass = 'max-w-[390px]',
  panelClassName = '',
  contentClassName = '',
  childrenClassName = '',
  children,
  disableOverlayClose = false,
  hideConfirmButton = false
}) => {
  if (!isOpen) return null

  const typeStyles = {
    warning: {
      icon: IoWarningOutline,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      accentColor: 'from-amber-500/20 to-yellow-500/20',
      buttonNature: 'warning' as const
    },
    danger: {
      icon: IoCloseOutline,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      accentColor: 'from-red-500/20 to-rose-500/20',
      buttonNature: 'danger' as const
    },
    info: {
      icon: IoCheckmarkCircleOutline,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      accentColor: 'from-red-500/20 to-rose-500/20',
      buttonNature: 'danger' as const
    },
    primary: {
      icon: IoInformationCircleOutline,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      accentColor: 'from-purple-500/20 to-indigo-500/20',
      buttonNature: 'primary' as const
    },
    memorybox: {
      icon: IoArchiveOutline,
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      accentColor: 'from-purple-500/20 to-indigo-500/20',
      buttonNature: 'primary' as const
    }
  }

  const style = typeStyles[type]
  const Icon = style.icon

  const overlay = (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn`}
      style={overlayZIndexStyle(zIndexClass)}
      onClick={disableOverlayClose ? undefined : onClose}
    >
      <div
        className={`relative bg-white dark:bg-[#0a0b10] rounded-2xl shadow-2xl ${panelMaxWidthClass} w-full mx-4 overflow-hidden animate-scaleIn border border-gray-200 dark:border-gray-800 ${panelClassName}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent gradient top bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.accentColor}`}
        />

        {/* Content */}
        <div className={`${compact ? 'p-4' : 'p-5'} ${contentClassName}`.trim()}>
          {/* Icon */}
          <div className={`flex shrink-0 justify-center ${compact ? 'mb-2.5' : 'mb-3.5'}`}>
            <div
              className={`${style.iconBg} ${style.iconColor} ${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-full flex items-center justify-center animate-pulse-subtle`}
            >
              <Icon className={compact ? 'text-lg' : 'text-xl'} />
            </div>
          </div>

          {/* Title */}
          {title ? (
            <h3
              className={`shrink-0 ${compact ? 'text-base' : 'text-[17px]'} font-semibold text-center text-gray-900 dark:text-gray-100 ${compact ? 'mb-1' : 'mb-1.5'}`}
            >
              {title}
            </h3>
          ) : null}

          {/* Message */}
          <p
            className={
              messageClassName ??
              `shrink-0 text-center text-gray-500 dark:text-gray-400 font-normal ${
                compact || smallMessage
                  ? `text-[11px] leading-snug ${title ? 'mb-4' : 'mb-3'}`
                  : `text-[13px] leading-normal ${title ? 'mb-5' : 'mb-4'}`
              }`
            }
          >
            {message}
          </p>

          {children ? <div className={childrenClassName || undefined}>{children}</div> : null}

          {/* Actions */}
          {/* Equal halves when both fit; each button takes a full row when the dialog is too narrow. */}
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              text={cancelText}
              onClick={onClose}
              nature={cancelButtonNature}
              size="md"
              disabled={isLoading}
              customClass={hideConfirmButton ? 'w-full' : 'min-w-0 flex-[1_1_9rem]'}
            />
            {!hideConfirmButton ? (
              <Button
                text={confirmText}
                onClick={onConfirm}
                nature={confirmButtonNature ?? style.buttonNature}
                size="md"
                isLoading={isLoading}
                disabled={isLoading || confirmDisabled}
                icon={confirmIcon}
                customClass="min-w-0 flex-[1_1_9rem]"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )

  if (portal && typeof document !== 'undefined') {
    return createPortal(overlay, document.body)
  }

  return overlay
}

export default ConfirmationModal
