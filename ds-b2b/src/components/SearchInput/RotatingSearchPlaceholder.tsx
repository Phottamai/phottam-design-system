import type { JSX } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }

interface RotatingSearchPlaceholderProps {
  prefix: string
  suffixes: readonly string[]
  activeIndex: number
  visible: boolean
}

/**
 * Fixed prefix + smooth Swiggy-style vertical roll/slide suffix transition.
 */
export function RotatingSearchPlaceholder({
  prefix,
  suffixes,
  activeIndex,
  visible
}: RotatingSearchPlaceholderProps): JSX.Element | null {
  if (!visible || suffixes.length === 0) return null

  const text = suffixes[activeIndex] ?? suffixes[0]

  return (
    <span
      className="flex min-w-0 w-full items-center gap-1 font-['Frank_Ruhl_Libre'] text-xs text-gray-600 dark:text-gray-300"
      aria-hidden
    >
      <span className="shrink-0 whitespace-pre leading-none">{prefix.trim()}</span>
      <span className="relative h-4 min-w-0 flex-1 overflow-hidden italic leading-none">
        <AnimatePresence initial={false}>
          <motion.span
            key={`${activeIndex}-${text}`}
            className="absolute inset-0 flex items-center truncate leading-none"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={TRANSITION}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}

export default RotatingSearchPlaceholder
