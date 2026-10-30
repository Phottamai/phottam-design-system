import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { offset as floatingOffset, shift as floatingShift } from '@floating-ui/dom'

interface TooltipProps {
  id: string
  content?: string
  contentNode?: React.ReactNode
  children: React.ReactElement
  place?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
  delay?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
  className?: string
  wrapperClassName?: string
  wrapperStyle?: React.CSSProperties
  disabled?: boolean
  offset?: number
  float?: boolean
  /** Keep the requested `place` instead of flipping when near viewport edges */
  disableFlip?: boolean
  positionStrategy?: 'absolute' | 'fixed'
  classNameArrow?: string
  /** Stack tooltips above nested modals (replaces default z-[10050]). */
  layerZIndex?: number
}

const DEFAULT_TOOLTIP_Z_INDEX = 10050

const sizeClasses = {
  sm: '!text-[10px] !px-2 !py-1',
  md: '!text-xs !px-3 !py-1.5',
  lg: '!text-sm !px-4 !py-2'
}

const TOOLTIP_BG = '#FFFFFF'
const TOOLTIP_BORDER = '#E5E7EB'
const TOOLTIP_TEXT = '#131313'

const variantClasses = {
  dark: '!bg-[#FFFFFF] !text-[#131313] !border !border-[#E5E7EB]',
  light: '!bg-[#FFFFFF] !text-[#131313] !border !border-[#E5E7EB]'
}

const fontSizes = {
  sm: '10px',
  md: '0.75rem',
  lg: '0.875rem'
}

const Tooltip: React.FC<TooltipProps> = ({
  id,
  content,
  contentNode,
  children,
  place = 'top',
  delay = 100,
  size = 'md',
  variant = 'dark',
  className = '',
  wrapperClassName = '',
  wrapperStyle,
  disabled = false,
  offset = 10,
  float = false,
  disableFlip = false,
  positionStrategy = 'fixed',
  classNameArrow = '!bg-[#FFFFFF] !border-[#E5E7EB]',
  layerZIndex
}) => {
  // The tooltip portals into document.body, which only exists after mount (SSR-safe).
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const middlewares = disableFlip
    ? [floatingOffset(offset), floatingShift({ padding: 8 })]
    : undefined

  const tooltipZIndexClass = layerZIndex != null ? '' : `!z-[${DEFAULT_TOOLTIP_Z_INDEX}]`
  const tooltipSurfaceClass =
    `${variantClasses[variant]} ${sizeClasses[size]} !rounded-lg !shadow-lg ${tooltipZIndexClass} !pointer-events-none ${className}`.trim()

  if (disabled || (!content && !contentNode)) {
    return children
  }

  const trigger = (
    <span
      data-tooltip-id={id}
      data-tooltip-place={place}
      {...(content ? { 'data-tooltip-content': content } : {})}
      className={`inline-flex max-w-full pointer-events-auto ${wrapperStyle?.width ? '' : 'w-fit'} ${wrapperClassName}`.trim()}
      style={wrapperStyle}
    >
      {children}
    </span>
  )

  const tooltipStyle: React.CSSProperties = {
    fontSize: fontSizes[size],
    fontWeight: 500,
    maxWidth: 'min(300px, calc(100vw - 16px))',
    wordWrap: 'break-word',
    backgroundColor: TOOLTIP_BG,
    color: TOOLTIP_TEXT,
    border: `1px solid ${TOOLTIP_BORDER}`,
    // Full opacity when shown; let react-tooltip control hide/show lifecycle (avoids 0,0 flicker).
    ['--rt-opacity' as string]: '1',
    zIndex: layerZIndex ?? DEFAULT_TOOLTIP_Z_INDEX
  }

  const tooltip = contentNode ? (
    <ReactTooltip
      id={id}
      place={place}
      delayShow={delay}
      offset={offset}
      float={float}
      positionStrategy={positionStrategy}
      middlewares={middlewares}
      globalCloseEvents={{ scroll: true, resize: true }}
      openEvents={{ mouseenter: true, focus: true }}
      closeEvents={{ mouseleave: true, blur: true, click: true }}
      className={`${tooltipSurfaceClass} !font-normal`}
      classNameArrow={classNameArrow}
      style={tooltipStyle}
      noArrow={false}
      render={() => contentNode}
    />
  ) : (
    <ReactTooltip
      id={id}
      place={place}
      delayShow={delay}
      offset={offset}
      float={float}
      positionStrategy={positionStrategy}
      middlewares={middlewares}
      globalCloseEvents={{ scroll: true, resize: true }}
      openEvents={{ mouseenter: true, focus: true }}
      closeEvents={{ mouseleave: true, blur: true, click: true }}
      className={`${tooltipSurfaceClass} !font-medium`}
      classNameArrow={classNameArrow}
      style={tooltipStyle}
      noArrow={false}
    />
  )

  return (
    <>
      {trigger}
      {mounted ? ReactDOM.createPortal(tooltip, document.body) : null}
    </>
  )
}

export default Tooltip
