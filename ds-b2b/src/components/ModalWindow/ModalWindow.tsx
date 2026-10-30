import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IoCloseOutline } from 'react-icons/io5'

function overlayZIndexStyle(zIndexClass: string): React.CSSProperties | undefined {
  const match = /z-\[(\d+)\]/.exec(zIndexClass)
  if (!match) return undefined
  const zIndex = Number(match[1])
  return Number.isFinite(zIndex) ? { zIndex } : undefined
}

interface ModalWindowProps {
  isOpen: boolean
  onClose: () => void
  title: string | ReactNode
  subtitle?: string | ReactNode
  icon?: ReactNode
  children: ReactNode
  footer?: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | string
  showGradientHeader?: boolean
  colorScheme?: 'purple' | 'orange' | 'blue'
  /** Override modal body scroll/layout (default: flex-1 overflow-y-auto) */
  bodyClassName?: string
  /** Override outer panel surface (background, border, etc.) */
  panelClassName?: string
  /** Override header bar classes */
  headerClassName?: string
  /** Override footer bar classes */
  footerClassName?: string
  /** Shrink modal height to fit content instead of stretching toward max viewport height */
  fitContent?: boolean
  /** Extra padding around the modal on the backdrop overlay */
  backdropClassName?: string
  /** Inline width/max-width overrides for the panel (e.g. fit-content modals) */
  panelStyle?: React.CSSProperties
  /** Tighter header/footer padding and title size for smaller viewports */
  size?: 'default' | 'compact'
  /** Tailwind z-index class for the overlay (default z-[1200]) */
  zIndexClass?: string
  /** Render overlay in document.body to escape nested stacking contexts */
  portal?: boolean
  /** Toggle serif vs sans-serif font for the modal header title (default: true) */
  serifHeader?: boolean
  /** Small text rendered directly under the title inside the header */
  headerDescription?: ReactNode
  /** Optional content between the title block and close button (e.g. header meta) */
  headerTrailing?: ReactNode
  /** Let headerTrailing expand across remaining header space (for long client/project labels) */
  headerTrailingWide?: boolean
  /** Hide the top-right close (X) button — e.g. when footer Cancel is sufficient */
  hideCloseButton?: boolean
}

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-[773px]', // Exact Figma size for AddEventModal
  '3xl': 'max-w-[773px]', // Fallback
  '6xl': 'max-w-6xl'
}

const ModalWindow: React.FC<ModalWindowProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'md',
  size = 'default',
  bodyClassName = 'flex-1 overflow-y-auto',
  panelClassName,
  headerClassName,
  footerClassName,
  fitContent = false,
  backdropClassName,
  panelStyle,
  zIndexClass = 'z-[1200]',
  portal = false,
  serifHeader = true,
  headerDescription,
  headerTrailing,
  headerTrailingWide = false,
  hideCloseButton = false,
  // Keep these props for backward compatibility but no longer used visually
  showGradientHeader: _showGradientHeader = true,
  colorScheme: _colorScheme = 'purple'
}) => {
  // Suppress unused variable warnings
  void _showGradientHeader
  void _colorScheme

  // Handle keyboard events
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  if (!isOpen) {
    return null
  }

  const isCompact = size === 'compact'
  // Tighter gutters below the sm breakpoint; desktop padding is unchanged.
  const headerPad = isCompact ? 'px-4 py-3 sm:px-5' : 'px-4 py-3 sm:px-6 sm:py-4'
  const footerPad = isCompact ? 'px-4 py-3 sm:px-5' : 'px-4 py-3 sm:px-6 sm:py-4'
  const titleClass = isCompact
    ? 'text-base font-bold text-gray-900 dark:text-gray-100 truncate leading-tight'
    : 'text-lg font-bold text-gray-900 dark:text-gray-100 truncate leading-tight'
  const closeBtnClass = isCompact ? 'h-7 w-7' : 'h-8 w-8'
  const hasHeaderDescription = headerDescription != null && headerDescription !== false
  const isCustomTitle = typeof title !== 'string'
  const headerAlignClass = hasHeaderDescription || isCustomTitle ? 'items-start' : 'items-center'

  const renderTitle = (extraClassName = '') => {
    if (typeof title === 'string') {
      return (
        <p
          className={`${titleClass} ${extraClassName}`.trim()}
          style={
            serifHeader
              ? { fontFamily: "'Frank Ruhl Libre', 'Frank_Ruhl_Libre', serif" }
              : undefined
          }
          title={title}
        >
          {title}
        </p>
      )
    }

    return <div className={`min-w-0 ${extraClassName}`.trim()}>{title}</div>
  }

  const overlay = (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn ${
        backdropClassName ?? 'p-4'
      }`}
      style={overlayZIndexStyle(zIndexClass)}
      onClick={handleBackdropClick}
    >
      <div
        style={panelStyle}
        onClick={(e) => e.stopPropagation()}
        className={`relative rounded-2xl shadow-2xl flex flex-col animate-scaleIn ${
          fitContent ? 'h-auto max-h-full w-auto' : 'w-full max-h-[90vh] overflow-hidden'
        } ${
          panelClassName ??
          'bg-white dark:bg-[#0a0b10] border border-gray-200 dark:border-gray-800 overflow-hidden'
        } ${maxWidthClasses[maxWidth] || maxWidth}`}
      >
        {/* Modal Header */}
        <div
          className={`flex justify-between ${headerAlignClass} ${headerPad} ${
            headerClassName ??
            'border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0b10]'
          }`}
        >
          <div className={`min-w-0 ${headerTrailingWide ? 'shrink-0' : 'flex-1'}`}>
            {hasHeaderDescription ? (
              <div
                className={`grid min-w-0 ${
                  icon
                    ? isCompact
                      ? 'grid-cols-[auto_minmax(0,1fr)] gap-x-2'
                      : 'grid-cols-[auto_minmax(0,1fr)] gap-x-3'
                    : 'grid-cols-1'
                } gap-y-1`}
              >
                {icon ? (
                  <div className="col-start-1 row-start-1 flex h-7 items-center self-center">
                    {icon}
                  </div>
                ) : null}
                <div
                  className={`min-w-0 ${icon ? 'col-start-2 row-start-1' : 'col-start-1 row-start-1'} flex h-7 items-center`}
                >
                  {subtitle && (
                    <h2
                      className="text-xs font-semibold text-[#7F3CFF] uppercase tracking-wider mb-0.5 truncate"
                      title={typeof subtitle === 'string' ? subtitle : undefined}
                    >
                      {subtitle}
                    </h2>
                  )}
                  {renderTitle('mb-0')}
                </div>
                <div
                  className={`min-w-0 overflow-visible pb-px leading-normal ${
                    icon ? 'col-start-2 row-start-2' : 'col-start-1 row-start-2'
                  }`}
                >
                  {headerDescription}
                </div>
              </div>
            ) : (
              <div
                className={`flex min-w-0 items-center overflow-hidden ${isCompact ? 'gap-2' : 'gap-3'}`}
              >
                {icon ? <div className="flex shrink-0 items-center self-center">{icon}</div> : null}
                <div className="min-w-0 flex-1 overflow-hidden">
                  {subtitle && (
                    <h2
                      className="text-xs font-semibold text-[#7F3CFF] uppercase tracking-wider mb-0.5 truncate"
                      title={typeof subtitle === 'string' ? subtitle : undefined}
                    >
                      {subtitle}
                    </h2>
                  )}
                  {renderTitle()}
                </div>
              </div>
            )}
          </div>
          {headerTrailing ? (
            <div
              className={
                headerTrailingWide
                  ? 'min-w-0 flex-1 px-3'
                  : `min-w-0 shrink-0 ${hideCloseButton ? 'ml-3' : 'mx-2 max-w-[min(280px,40%)]'}`
              }
            >
              {headerTrailing}
            </div>
          ) : null}
          {!hideCloseButton ? (
            <button
              onClick={handleCloseClick}
              className={`${closeBtnClass} ml-2 flex shrink-0 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${
                hasHeaderDescription || isCustomTitle ? 'mt-0.5' : ''
              }`}
            >
              <IoCloseOutline className={isCompact ? 'text-lg' : 'text-xl'} />
            </button>
          ) : null}
        </div>

        {/* Modal Content */}
        <div className={bodyClassName}>{children}</div>

        {/* Action Buttons Footer */}
        {footer && (
          <div
            className={`${footerPad} ${
              footerClassName ??
              'border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0b10]'
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  if (portal && typeof document !== 'undefined') {
    return createPortal(overlay, document.body)
  }

  return overlay
}

export default ModalWindow
