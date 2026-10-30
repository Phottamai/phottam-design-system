import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const FALLBACK_MENU_W = 200
const FALLBACK_MENU_H = 320
const MARGIN = 12

export type CardMenuPlacementVariant = 'trailing' | 'topRight'

export interface CardMenuFlip {
  flipH: boolean
  flipV: boolean
}

type UseCardMenuPlacementOptions = {
  panelRef?: RefObject<HTMLElement | null>
  verticalPlacement?: 'auto' | 'up' | 'down'
  /** For trailing/beside menus: which side of the trigger to prefer. */
  menuSide?: 'auto' | 'left' | 'right'
}

function getScrollableAncestors(element: HTMLElement): HTMLElement[] {
  const ancestors: HTMLElement[] = []
  let parent = element.parentElement

  while (parent) {
    const { overflowY, overflowX } = window.getComputedStyle(parent)
    const scrollableY =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      parent.scrollHeight > parent.clientHeight
    const scrollableX =
      (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') &&
      parent.scrollWidth > parent.clientWidth

    if (scrollableY || scrollableX) {
      ancestors.push(parent)
    }
    parent = parent.parentElement
  }

  return ancestors
}

function getScrollRoot(trigger: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = trigger.parentElement

  while (node) {
    const style = window.getComputedStyle(node)
    const scrollableY =
      (style.overflowY === 'auto' ||
        style.overflowY === 'scroll' ||
        style.overflowY === 'overlay') &&
      node.scrollHeight > node.clientHeight
    if (scrollableY) return node
    node = node.parentElement
  }

  return null
}

/** Bottom edge of stuck sticky headers (e.g. Manage Projects bar) in viewport coords. */
function getStickyTopInset(trigger: HTMLElement): number {
  let inset = MARGIN
  const scrollRoot = getScrollRoot(trigger)

  if (scrollRoot) {
    inset = Math.max(inset, scrollRoot.getBoundingClientRect().top + 4)
  }

  const searchRoot = scrollRoot ?? document.body
  const candidates = searchRoot.querySelectorAll('*')

  candidates.forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    const style = window.getComputedStyle(el)
    if (style.position !== 'sticky') return
    const top = parseFloat(style.top)
    if (!Number.isFinite(top) || top > 120) return
    const rect = el.getBoundingClientRect()
    if (rect.height < 1) return
    if (rect.top <= top + 2) {
      inset = Math.max(inset, rect.bottom + 4)
    }
  })

  return inset
}

/** Top edge of bottom obstructions (pagination, sticky footers) in viewport coords. */
function getBottomInset(trigger: HTMLElement, menuWidth: number, vh: number): number {
  let inset = vh - MARGIN
  const triggerRect = trigger.getBoundingClientRect()
  const searchRoot = getScrollRoot(trigger) ?? document.body
  const dropZoneLeft = triggerRect.left - menuWidth
  const dropZoneRight = triggerRect.right + menuWidth

  searchRoot.querySelectorAll('[data-listing-pagination]').forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    const rect = el.getBoundingClientRect()
    if (rect.height < 1) return
    if (rect.top <= triggerRect.bottom + 1) return
    if (rect.top >= inset) return
    inset = Math.min(inset, rect.top - 4)
  })

  searchRoot.querySelectorAll('*').forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    if (el.hasAttribute('data-listing-pagination')) return
    if (el.contains(trigger)) return

    const style = window.getComputedStyle(el)
    if (style.position !== 'sticky') return
    const bottom = parseFloat(style.bottom)
    if (!Number.isFinite(bottom) || bottom > 8) return

    const rect = el.getBoundingClientRect()
    if (rect.height < 20) return
    if (rect.bottom < vh - bottom - 4) return
    if (rect.top <= triggerRect.bottom + 1) return
    if (rect.top >= inset) return

    const horizontalOverlap = rect.left < dropZoneRight && rect.right > dropZoneLeft
    const wideFooter = rect.width >= Math.min(window.innerWidth * 0.45, 400)
    if (horizontalOverlap || wideFooter) {
      inset = Math.min(inset, rect.top - 4)
    }
  })

  return inset
}

function getCardGridRowIndex(trigger: HTMLElement): number | null {
  let node: HTMLElement | null = trigger

  while (node) {
    const parent = node.parentElement
    if (!parent) return null

    if (window.getComputedStyle(parent).display === 'grid') {
      const gridItem = node
      const itemTop = gridItem.offsetTop
      const rowTops = new Set<number>()

      for (const child of parent.children) {
        if (child instanceof HTMLElement) {
          rowTops.add(child.offsetTop)
        }
      }

      const sortedTops = [...rowTops].sort((a, b) => a - b)
      const rowIndex = sortedTops.findIndex((top) => Math.abs(top - itemTop) <= 8)
      return rowIndex >= 0 ? rowIndex : null
    }

    node = parent
  }

  return null
}

function resolveCornerMenuFlipV(
  trigger: HTMLElement,
  triggerRect: DOMRect,
  scrollRoot: HTMLElement | null,
  estH: number,
  topInset: number,
  spaceBelow: number,
  verticalPlacement: 'auto' | 'up' | 'down'
): boolean {
  if (verticalPlacement === 'up') return true
  if (verticalPlacement === 'down') return false

  const upperBound = Math.max(
    scrollRoot ? scrollRoot.getBoundingClientRect().top + 4 : MARGIN,
    topInset
  )
  const spaceAboveTrigger = triggerRect.top - upperBound
  const canOpenUpFully = spaceAboveTrigger >= estH
  const wouldOverflowBottom = estH > spaceBelow
  const rowIndex = getCardGridRowIndex(trigger)

  if (rowIndex === 0) {
    return wouldOverflowBottom && canOpenUpFully
  }

  if (rowIndex != null) {
    return wouldOverflowBottom && canOpenUpFully
  }

  const nearTopOfScroll =
    scrollRoot != null ? scrollRoot.scrollTop <= 24 : triggerRect.top <= window.innerHeight * 0.55
  if (nearTopOfScroll) {
    return wouldOverflowBottom && canOpenUpFully
  }

  return wouldOverflowBottom && canOpenUpFully
}

function resolveTrailingMenuFlipV(
  triggerRect: DOMRect,
  estH: number,
  topInset: number,
  spaceBelowScroll: number,
  viewportHeight: number,
  verticalPlacement: 'auto' | 'up' | 'down'
): boolean {
  if (verticalPlacement === 'up') return true
  if (verticalPlacement === 'down') return false

  const spaceBelowViewport = viewportHeight - MARGIN - triggerRect.bottom
  const availableBelow = Math.min(spaceBelowScroll, spaceBelowViewport)
  const spaceAbove = triggerRect.top - topInset

  return availableBelow < estH && spaceAbove >= estH
}

/**
 * Viewport flip for inline card action menus (absolute on the ⋯ wrapper).
 * Uses measured menu size when available, accounts for sticky headers,
 * recalculates on open, resize, and scroll (CSS flip only — menu stays on the ⋯).
 */
export function useCardMenuPlacement(
  menuOpen: boolean,
  variant: CardMenuPlacementVariant,
  options: UseCardMenuPlacementOptions = {}
): { triggerRef: RefObject<HTMLElement | null>; flip: CardMenuFlip } {
  const { panelRef, verticalPlacement = 'auto', menuSide = 'auto' } = options
  const triggerRef = useRef<HTMLElement | null>(null)
  const [flip, setFlip] = useState<CardMenuFlip>({ flipH: false, flipV: false })
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const recalc = useCallback(() => {
    const el = triggerRef.current
    if (!el) return

    const r = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const menuW = panelRef?.current?.offsetWidth ?? FALLBACK_MENU_W
    const menuH = panelRef?.current?.offsetHeight ?? FALLBACK_MENU_H
    const estW = Math.min(Math.max(menuW, 80), vw - 2 * MARGIN)
    const estH = Math.max(menuH, 40)

    const topInset = getStickyTopInset(el)
    const bottomInset = getBottomInset(el, estW, vh)
    const scrollRoot = getScrollRoot(el)
    const effectiveBottom =
      scrollRoot != null
        ? Math.min(bottomInset, scrollRoot.getBoundingClientRect().bottom - 4)
        : bottomInset

    const spaceBelow = effectiveBottom - r.bottom
    const flipV =
      variant === 'topRight'
        ? resolveCornerMenuFlipV(el, r, scrollRoot, estH, topInset, spaceBelow, verticalPlacement)
        : resolveTrailingMenuFlipV(r, estH, topInset, spaceBelow, vh, verticalPlacement)

    if (variant === 'trailing') {
      const spaceRight = vw - MARGIN - r.right
      const spaceLeft = r.left - MARGIN
      const wouldOverflowRight = estW > spaceRight
      const canOpenLeft = estW <= spaceLeft
      let flipH = wouldOverflowRight && canOpenLeft

      if (menuSide === 'right') {
        flipH = false
      } else if (menuSide === 'left') {
        flipH = true
      }

      setFlip({ flipH, flipV })
    } else {
      const wouldClipLeft = r.right - estW < MARGIN
      const canUseLeftAlign = r.left + estW <= vw - MARGIN
      const flipH = wouldClipLeft && canUseLeftAlign
      setFlip({ flipH, flipV })
    }
  }, [variant, panelRef, verticalPlacement, menuSide])

  useLayoutEffect(() => {
    if (!menuOpen) return
    recalc()
    const raf = requestAnimationFrame(recalc)
    return () => cancelAnimationFrame(raf)
  }, [menuOpen, recalc])

  useEffect(() => {
    if (!menuOpen) {
      setFlip({ flipH: false, flipV: false })
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null
      return
    }

    const trigger = triggerRef.current
    const scrollTargets: (HTMLElement | Window)[] = [window]
    if (trigger) {
      scrollTargets.push(...getScrollableAncestors(trigger))
    }

    scrollTargets.forEach((target) => {
      target.addEventListener('scroll', recalc, { passive: true })
    })
    window.addEventListener('resize', recalc)

    const panel = panelRef?.current
    if (panel && typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current = new ResizeObserver(() => recalc())
      resizeObserverRef.current.observe(panel)
    }

    return (): void => {
      scrollTargets.forEach((target) => {
        target.removeEventListener('scroll', recalc)
      })
      window.removeEventListener('resize', recalc)
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null
    }
  }, [menuOpen, recalc, panelRef])

  return { triggerRef, flip }
}
