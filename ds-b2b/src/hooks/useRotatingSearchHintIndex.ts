import { useEffect, useState } from 'react'

const DEFAULT_INTERVAL_MS = 2000

/**
 * Cycles 0..length-1. Pauses when `paused` is true (e.g. non-empty search value).
 */
export function useRotatingSearchHintIndex(
  length: number,
  paused: boolean,
  intervalMs: number = DEFAULT_INTERVAL_MS
): number {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (length <= 1 || paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [length, paused, intervalMs])

  useEffect(() => {
    if (length <= 0) return
    setIndex((i) => (i >= length ? 0 : i))
  }, [length])

  return length <= 0 ? 0 : index % length
}
