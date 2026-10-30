import { useEffect, type RefObject } from 'react'

/**
 * Keeps the `[aria-selected="true"]` child of a horizontally scrollable tab strip in view.
 * Only touches the container's scrollLeft, so the page itself never scrolls.
 */
export function useScrollActiveIntoView(
  containerRef: RefObject<HTMLElement | null>,
  activeKey: unknown
): void {
  useEffect(() => {
    const container = containerRef.current
    if (!container || container.scrollWidth <= container.clientWidth) return

    const active = container.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!active) return

    const containerRect = container.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const left = activeRect.left - containerRect.left + container.scrollLeft
    const right = left + activeRect.width
    if (left < container.scrollLeft) {
      container.scrollLeft = left
    } else if (right > container.scrollLeft + container.clientWidth) {
      container.scrollLeft = right - container.clientWidth
    }
  }, [containerRef, activeKey])
}

export default useScrollActiveIntoView
