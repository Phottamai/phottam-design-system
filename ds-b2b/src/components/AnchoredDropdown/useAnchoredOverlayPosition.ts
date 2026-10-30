import { RefObject, useCallback, useLayoutEffect, useState } from 'react'

export type AnchoredOverlayVariant = 'dropdown' | 'corner' | 'trailing'

export type AnchoredOverlayPosition = {
  top: number
  left: number
  width: number
  transform?: string
}

type UseAnchoredOverlayPositionOptions = {
  variant?: AnchoredOverlayVariant
  matchTriggerWidth?: boolean
  maxHeight?: number
  gap?: number
  viewportPadding?: number
  /** Used before the panel is mounted/measured — avoids a 384px default that causes position jumps. */
  fallbackPanelWidth?: number
}

type UseAnchoredOverlayPositionResult = {
  position: AnchoredOverlayPosition | null
  isMeasured: boolean
  recalculate: () => void
}

export function useAnchoredOverlayPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  options: UseAnchoredOverlayPositionOptions = {}
): UseAnchoredOverlayPositionResult {
  const {
    variant = 'dropdown',
    matchTriggerWidth = variant === 'dropdown',
    maxHeight = 240,
    gap = 4,
    viewportPadding = 12,
    fallbackPanelWidth: fallbackPanelWidthOption
  } = options

  const [position, setPosition] = useState<AnchoredOverlayPosition | null>(null)
  const [isMeasured, setIsMeasured] = useState(false)

  const recalculate = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const panelEl = panelRef.current
    const panelHeight = panelEl?.offsetHeight ?? maxHeight
    const measuredPanelWidth = panelEl?.offsetWidth
    const defaultFallbackWidth =
      fallbackPanelWidthOption ??
      (variant === 'corner' ? 384 : matchTriggerWidth ? rect.width : 384)
    const panelWidth = measuredPanelWidth ?? defaultFallbackWidth
    const hasMeasuredPanel = !!panelEl && panelEl.offsetWidth > 0 && panelEl.offsetHeight > 0
    const vw = window.innerWidth
    const vh = window.innerHeight

    let top = 0
    let left = 0
    let width = matchTriggerWidth ? rect.width : panelWidth
    let transform: string | undefined

    const spaceBelow = vh - rect.bottom - viewportPadding
    const spaceAbove = rect.top - viewportPadding
    const openUpward = spaceBelow < Math.min(panelHeight, maxHeight) && spaceAbove > spaceBelow
    top = openUpward ? rect.top - panelHeight - gap : rect.bottom + gap

    if (variant === 'corner') {
      width = matchTriggerWidth ? rect.width : panelWidth
      left = rect.right
      transform = 'translateX(-100%)'
      // Anchor the panel's right edge to the trigger; keep the full width inside the viewport.
      left = Math.max(viewportPadding + width, Math.min(left, vw - viewportPadding))
    } else {
      width = matchTriggerWidth ? rect.width : panelWidth
      left = rect.left

      // Keep the full panel inside the viewport — flip left when opening to the right would clip.
      const effectiveWidth = matchTriggerWidth ? width : panelWidth
      if (left + effectiveWidth > vw - viewportPadding) {
        left = rect.right - effectiveWidth
      }
      left = Math.max(viewportPadding, Math.min(left, vw - viewportPadding - effectiveWidth))
    }

    top = Math.max(viewportPadding, Math.min(top, vh - viewportPadding - 48))

    setPosition({ top, left, width, transform })
    setIsMeasured(hasMeasuredPanel)
  }, [
    triggerRef,
    panelRef,
    variant,
    matchTriggerWidth,
    maxHeight,
    gap,
    viewportPadding,
    fallbackPanelWidthOption
  ])

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      setIsMeasured(false)
      return
    }

    recalculate()
    const raf = requestAnimationFrame(recalculate)

    window.addEventListener('resize', recalculate)
    window.addEventListener('scroll', recalculate, true)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', recalculate)
      window.removeEventListener('scroll', recalculate, true)
    }
  }, [open, recalculate])

  return { position, isMeasured, recalculate }
}
