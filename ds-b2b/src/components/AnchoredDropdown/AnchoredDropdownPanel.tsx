import { ReactNode, RefObject, useEffect, useRef, type MutableRefObject, type JSX } from 'react'
import { createPortal } from 'react-dom'
import { useAnchoredOverlayPosition, AnchoredOverlayVariant } from './useAnchoredOverlayPosition'

const DEFAULT_Z_INDEX = 1310

export type AnchoredDropdownPanelProps = {
  open: boolean
  triggerRef: RefObject<HTMLElement | null>
  panelRef?: RefObject<HTMLDivElement | null>
  children: ReactNode
  className?: string
  maxHeight?: number
  matchTriggerWidth?: boolean
  zIndex?: number
  variant?: AnchoredOverlayVariant
  panelOverflow?: 'auto' | 'hidden'
  /** Width hint before the panel is measured — keeps the first position calculation accurate. */
  fallbackPanelWidth?: number
}

export function AnchoredDropdownPanel({
  open,
  triggerRef,
  panelRef: externalPanelRef,
  children,
  className = '',
  maxHeight = 240,
  matchTriggerWidth = true,
  zIndex = DEFAULT_Z_INDEX,
  variant,
  panelOverflow = 'auto',
  fallbackPanelWidth
}: AnchoredDropdownPanelProps): JSX.Element | null {
  const internalPanelRef = useRef<HTMLDivElement | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const { position, isMeasured, recalculate } = useAnchoredOverlayPosition(
    open,
    triggerRef,
    internalPanelRef,
    {
      matchTriggerWidth,
      maxHeight,
      variant,
      fallbackPanelWidth
    }
  )

  useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null
    }
  }, [])

  const handlePanelRef = (node: HTMLDivElement | null): void => {
    internalPanelRef.current = node
    if (externalPanelRef) {
      ;(externalPanelRef as MutableRefObject<HTMLDivElement | null>).current = node
    }

    resizeObserverRef.current?.disconnect()
    resizeObserverRef.current = null

    if (node) {
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserverRef.current = new ResizeObserver(() => recalculate())
        resizeObserverRef.current.observe(node)
      }
      requestAnimationFrame(() => recalculate())
    }
  }

  if (!open || typeof document === 'undefined') {
    return null
  }

  const isVisible = isMeasured && position !== null

  return createPortal(
    <div
      ref={handlePanelRef}
      data-anchored-dropdown-panel=""
      className={className}
      style={{
        position: 'fixed',
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        width: matchTriggerWidth ? position?.width : undefined,
        maxWidth: 'calc(100vw - 24px)',
        zIndex,
        maxHeight,
        overflowY: panelOverflow,
        transform: position?.transform,
        visibility: isVisible ? 'visible' : 'hidden',
        pointerEvents: isVisible ? undefined : 'none'
      }}
    >
      {children}
    </div>,
    document.body
  )
}
