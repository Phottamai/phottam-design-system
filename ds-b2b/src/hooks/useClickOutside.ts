import { useEffect, RefObject } from 'react'

type UseClickOutsideOptions = {
  ignoreSelectors?: string | string[]
}

export function useClickOutside(
  refs: RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>,
  callback: () => void,
  options?: UseClickOutsideOptions
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (target instanceof Element && options?.ignoreSelectors) {
        const selectors = Array.isArray(options.ignoreSelectors)
          ? options.ignoreSelectors
          : [options.ignoreSelectors]

        if (selectors.some((selector) => target.closest(selector))) {
          return
        }
      }

      const isOutside = Array.isArray(refs)
        ? refs.every((ref) => !ref.current || !ref.current.contains(target))
        : !refs.current || !refs.current.contains(target)

      if (isOutside) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [refs, callback, options?.ignoreSelectors])
}
export default useClickOutside
