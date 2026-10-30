import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type JSX
} from 'react'
import { createPortal } from 'react-dom'
import { IoEllipsisHorizontal } from 'react-icons/io5'
import { useCardMenuPlacement, type CardMenuFlip } from './useCardMenuPlacement'
import Tooltip from '../Tooltip'
import {
  listingCardMenuButtonOpenClass,
  listingCardMenuPanelClass,
  listingCardMenuRowClass
} from '../../tokens/menuStyles'
import type { AnchoredOverlayVariant } from './useAnchoredOverlayPosition'

const DEFAULT_PANEL_CLASS = listingCardMenuPanelClass

const ActionMenuCloseContext = createContext<(() => void) | null>(null)

export function useAnchoredActionMenuClose(): () => void {
  const close = useContext(ActionMenuCloseContext)
  return close ?? (() => undefined)
}

export type TrailingMenuPlacement = 'beside' | 'under'

export type AnchoredActionMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: AnchoredOverlayVariant
  /** Inline trailing menus only: beside ⋯ (listing cards) or below ⋯ (footer ml-auto cards). */
  trailingPlacement?: TrailingMenuPlacement
  children: ReactNode
  deleteItem?: ReactNode
  ariaLabel?: string
  buttonClassName?: string
  wrapperClassName?: string
  panelClassName?: string
  triggerRef?: RefObject<HTMLButtonElement | null>
  onWrapperClick?: (e: React.MouseEvent) => void
  showDefaultTrigger?: boolean
  /** Render menu in a portal so it is not clipped by overflow scroll containers. */
  portaled?: boolean
  /** Portal target; defaults to document.body. Use the fullscreen overlay root when menus must sit above it. */
  portalContainer?: HTMLElement | null
  /** z-index for portaled menu panels (default 1310). Raise above fullscreen overlays when needed. */
  portalZIndex?: number
  /** Preferred vertical direction for dropdown placement ('auto' | 'up' | 'down'). */
  verticalPlacement?: 'auto' | 'up' | 'down'
  /** For trailing/beside menus: preferred side of the trigger ('auto' | 'left' | 'right'). */
  menuSide?: 'auto' | 'left' | 'right'
  /** Override the default horizontal ⋯ trigger icon. */
  triggerIcon?: ReactNode
  /** Tooltip text when hovering over trigger button (default: "More Actions"). Set to null or false to disable. */
  tooltipContent?: string | null | false
  /** Placement for the tooltip. Defaults to "top". */
  tooltipPlace?: 'top' | 'bottom' | 'left' | 'right'
  /** Optional custom tooltip id. */
  tooltipId?: string
  /** Extra classes on the trigger while open. Pass `false` to disable. */
  openTriggerClassName?: string | false
}

function getTrailingPanelPositionClass(
  flip: { flipH: boolean; flipV: boolean },
  placement: TrailingMenuPlacement
): string {
  if (placement === 'under') {
    return `${flip.flipH ? 'right-0' : 'left-0'} ${flip.flipV ? 'bottom-full mb-1' : 'top-full mt-1'}`
  }
  return `${flip.flipH ? 'right-full mr-0' : 'left-full ml-0'} ${flip.flipV ? 'bottom-full mb-px' : 'top-full mt-px'}`
}

function getCornerPanelPositionClass(flip: { flipH: boolean; flipV: boolean }): string {
  return `${flip.flipH ? 'left-0' : 'right-0'} ${flip.flipV ? 'bottom-full mb-1' : 'top-full mt-1'}`
}

const PORTAL_Z_INDEX = 1310
const PORTAL_GAP = 4
const PORTAL_MARGIN = 12

function getPortaledPanelStyle(
  triggerRect: DOMRect,
  panelSize: { width: number; height: number },
  flip: CardMenuFlip,
  variant: AnchoredOverlayVariant,
  trailingPlacement: TrailingMenuPlacement,
  portalZIndex: number
): CSSProperties {
  const { width: panelWidth, height: panelHeight } = panelSize
  let left = triggerRect.left
  let top = triggerRect.bottom + PORTAL_GAP

  if (variant === 'trailing') {
    if (trailingPlacement === 'under') {
      left = flip.flipH ? triggerRect.right - panelWidth : triggerRect.left
      top = flip.flipV
        ? triggerRect.top - panelHeight - PORTAL_GAP
        : triggerRect.bottom + PORTAL_GAP
    } else {
      left = flip.flipH
        ? triggerRect.left - panelWidth - PORTAL_GAP
        : triggerRect.right + PORTAL_GAP
      top = flip.flipV ? triggerRect.bottom - panelHeight : triggerRect.top
    }
  } else {
    left = flip.flipH ? triggerRect.left : triggerRect.right - panelWidth
    top = flip.flipV ? triggerRect.top - panelHeight - PORTAL_GAP : triggerRect.bottom + PORTAL_GAP
  }

  const vw = window.innerWidth
  const vh = window.innerHeight
  left = Math.max(PORTAL_MARGIN, Math.min(left, vw - panelWidth - PORTAL_MARGIN))
  top = Math.max(PORTAL_MARGIN, Math.min(top, vh - panelHeight - PORTAL_MARGIN))

  return {
    position: 'fixed',
    top,
    left,
    zIndex: portalZIndex
  }
}

function MenuPanelContent({
  children,
  deleteItem,
  onClose
}: {
  children: ReactNode
  deleteItem?: ReactNode
  onClose: () => void
}): JSX.Element {
  return (
    <ActionMenuCloseContext.Provider value={onClose}>
      <div className="divide-y divide-gray-300/80 dark:divide-gray-600">{children}</div>
      {deleteItem ? (
        <div className="border-t border-gray-400/50 dark:border-gray-500">{deleteItem}</div>
      ) : null}
    </ActionMenuCloseContext.Provider>
  )
}

export function AnchoredActionMenu({
  open,
  onOpenChange,
  variant = 'corner',
  trailingPlacement = 'beside',
  children,
  deleteItem,
  ariaLabel = 'More actions',
  buttonClassName = '',
  wrapperClassName = 'relative z-20 flex shrink-0',
  panelClassName = DEFAULT_PANEL_CLASS,
  triggerRef: externalTriggerRef,
  onWrapperClick,
  showDefaultTrigger = true,
  portaled = false,
  portalContainer = null,
  portalZIndex = PORTAL_Z_INDEX,
  verticalPlacement = 'auto',
  menuSide = 'auto',
  triggerIcon,
  tooltipContent,
  tooltipPlace = 'top',
  tooltipId,
  openTriggerClassName
}: AnchoredActionMenuProps): JSX.Element {
  const autoTooltipId = useId()
  const resolvedTooltipId = tooltipId ?? `action-menu-tooltip-${autoTooltipId.replace(/:/g, '')}`
  const shouldShowTooltip = tooltipContent !== null && tooltipContent !== false
  const resolvedTooltipText = typeof tooltipContent === 'string' ? tooltipContent : 'More Actions'

  const portalTarget =
    portaled && typeof document !== 'undefined' ? (portalContainer ?? document.body) : null
  const wrapperRef = useRef<HTMLDivElement>(null)
  const internalTriggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [portaledStyle, setPortaledStyle] = useState<CSSProperties | null>(null)

  const placementVariant = variant === 'trailing' ? 'trailing' : 'topRight'
  const { triggerRef: inlineTriggerRef, flip } = useCardMenuPlacement(open, placementVariant, {
    panelRef,
    verticalPlacement,
    menuSide: variant === 'trailing' ? menuSide : 'auto'
  })

  const recalcPortaledPosition = (): void => {
    const trigger =
      internalTriggerRef.current ?? externalTriggerRef?.current ?? inlineTriggerRef.current
    const panel = panelRef.current
    if (!trigger || !panel) return

    const triggerRect = trigger.getBoundingClientRect()
    setPortaledStyle(
      getPortaledPanelStyle(
        triggerRect,
        { width: panel.offsetWidth, height: panel.offsetHeight },
        flip,
        variant,
        trailingPlacement,
        portalZIndex
      )
    )
  }

  useLayoutEffect(() => {
    if (!open || !portaled) {
      setPortaledStyle(null)
      return
    }

    recalcPortaledPosition()
    const raf = requestAnimationFrame(recalcPortaledPosition)

    const onScrollOrResize = (): void => recalcPortaledPosition()
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
    }
  }, [open, portaled, flip.flipH, flip.flipV, variant, trailingPlacement, portalZIndex])

  const setOpen = (next: boolean): void => {
    onOpenChange(next)
  }

  useEffect(() => {
    if (!open) return

    const onDoc = (e: globalThis.MouseEvent) => {
      const target = e.target as Node
      if (
        wrapperRef.current?.contains(target) ||
        panelRef.current?.contains(target) ||
        externalTriggerRef?.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) return

    const getTrigger = (): HTMLElement | null =>
      internalTriggerRef.current ?? inlineTriggerRef.current ?? externalTriggerRef?.current ?? null

    const getHeaderBottom = (): number => {
      let bottom = 0
      const chrome = document.querySelector('[data-app-chrome-bar]')
      if (chrome instanceof HTMLElement) {
        bottom = Math.max(bottom, chrome.getBoundingClientRect().bottom)
      }
      document.querySelectorAll('.sticky').forEach((node) => {
        if (!(node instanceof HTMLElement)) return
        const style = window.getComputedStyle(node)
        if (style.position !== 'sticky') return
        const top = parseFloat(style.top)
        if (!Number.isFinite(top) || top > 120) return
        const rect = node.getBoundingClientRect()
        if (rect.height < 1) return
        if (rect.top <= top + 2) {
          bottom = Math.max(bottom, rect.bottom)
        }
      })
      return bottom
    }

    const closeIfTriggerHidden = (): void => {
      const el = getTrigger()
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = window.innerWidth
      if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) {
        setOpen(false)
        return
      }
      // Card completely under the header strip means its footer trigger sits
      // fully above the sticky header bottom, so dismiss the menu on the spot.
      if (r.bottom <= getHeaderBottom() + 2) {
        setOpen(false)
      }
    }

    let observer: IntersectionObserver | null = null
    const el = getTrigger()
    if (el && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0] && !entries[0].isIntersecting) {
            setOpen(false)
          }
        },
        { threshold: 0 }
      )
      observer.observe(el)
    }

    window.addEventListener('scroll', closeIfTriggerHidden, true)
    window.addEventListener('resize', closeIfTriggerHidden)
    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', closeIfTriggerHidden, true)
      window.removeEventListener('resize', closeIfTriggerHidden)
    }
  }, [open, onOpenChange])

  const assignTriggerRef = (node: HTMLButtonElement | null): void => {
    internalTriggerRef.current = node
    if (externalTriggerRef) {
      ;(externalTriggerRef as MutableRefObject<HTMLButtonElement | null>).current = node
    }
    ;(inlineTriggerRef as MutableRefObject<HTMLButtonElement | null>).current = node
  }

  const panelPositionClass =
    variant === 'trailing'
      ? getTrailingPanelPositionClass(flip, trailingPlacement)
      : getCornerPanelPositionClass(flip)

  const assignPanelRef = (node: HTMLDivElement | null): void => {
    panelRef.current = node
    if (node && open && portaled) {
      requestAnimationFrame(recalcPortaledPosition)
    }
  }

  const menuPanel = open ? (
    <div
      ref={assignPanelRef}
      className={`${panelClassName} ${portaled ? '' : `absolute z-[90] ${panelPositionClass}`}`}
      style={
        portaled
          ? {
              ...(portaledStyle ?? {
                position: 'fixed',
                visibility: 'hidden' as const,
                zIndex: portalZIndex
              })
            }
          : undefined
      }
      role="menu"
      data-card-menu
      onClick={(e) => e.stopPropagation()}
    >
      <MenuPanelContent deleteItem={deleteItem} onClose={() => setOpen(false)}>
        {children}
      </MenuPanelContent>
    </div>
  ) : null

  const defaultTriggerButton = (
    <button
      ref={assignTriggerRef}
      type="button"
      data-card-menu-button
      onClick={(e) => {
        e.stopPropagation()
        setOpen(!open)
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      aria-expanded={open}
      aria-label={ariaLabel}
      className={[
        buttonClassName,
        open &&
          (openTriggerClassName === false
            ? ''
            : (openTriggerClassName ?? listingCardMenuButtonOpenClass))
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {triggerIcon ?? <IoEllipsisHorizontal className="h-4 w-4 shrink-0" aria-hidden />}
    </button>
  )

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      onClick={(e) => {
        onWrapperClick?.(e)
        e.stopPropagation()
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      role="presentation"
    >
      {showDefaultTrigger ? (
        shouldShowTooltip ? (
          <Tooltip
            id={resolvedTooltipId}
            content={resolvedTooltipText}
            place={tooltipPlace}
            size="sm"
            disabled={open}
          >
            {defaultTriggerButton}
          </Tooltip>
        ) : (
          defaultTriggerButton
        )
      ) : null}
      {portaled && menuPanel && portalTarget ? createPortal(menuPanel, portalTarget) : menuPanel}
    </div>
  )
}

export function AnchoredActionMenuItem({
  icon,
  label,
  onClick,
  className,
  disabled = false,
  title
}: {
  icon: ReactNode
  label: ReactNode
  onClick: (e: React.MouseEvent) => void
  className?: string
  /** Shown but not actionable, e.g. a feature locked in the plan */
  disabled?: boolean
  title?: string
}): JSX.Element {
  const closeMenu = useAnchoredActionMenuClose()
  const rowClass = className ?? listingCardMenuRowClass

  const runAction = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    closeMenu()
    onClick(e)
  }

  return (
    <button
      type="button"
      role="menuitem"
      className={`${rowClass}${disabled ? ' cursor-not-allowed opacity-60' : ''}`}
      onMouseDown={disabled ? undefined : runAction}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      title={title}
    >
      {icon}
      {label}
    </button>
  )
}
