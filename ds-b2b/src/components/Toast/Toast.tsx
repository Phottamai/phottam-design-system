import React, { useEffect, useRef, useState } from 'react'
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCloseOutline,
  IoInformationCircle
} from 'react-icons/io5'

// Define the base toast type
export type ToastType = 'success' | 'error' | 'warning' | 'info'

// Define the toast item interface
export interface ToastItem {
  id: number
  message: string
  type: ToastType
  description?: React.ReactNode
}

// Props interface for the Toast component
interface ToastProps {
  message: string
  type: ToastType
  description?: React.ReactNode
  duration?: number
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, description, duration = 3000, onClose }) => {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Failure/error toasts last an additional 2 seconds so the user can read the error message comfortably
  const effectiveDuration =
    type === 'error' ? (duration === 3000 ? 5000 : duration + 2000) : duration

  // Use a ref for hover state so the setTimeout closure always reads the live value
  const isHoveredRef = useRef(false)
  const [, setIsHovered] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const remainingRef = useRef<number>(effectiveDuration)
  const timerStartedRef = useRef<boolean>(false)

  const [progressWidth, setProgressWidth] = useState('0%')
  const [transitionDuration, setTransitionDuration] = useState('none')

  // Start the countdown on mount
  useEffect(() => {
    // Small delay to allow the slide-in animation to start first
    const kickoff = setTimeout(() => {
      // If user is already hovering, don't start the timer
      if (isHoveredRef.current) return

      startTimeRef.current = Date.now()
      timerStartedRef.current = true
      setTransitionDuration(`${remainingRef.current}ms`)
      setProgressWidth('100%')

      timerRef.current = setTimeout(() => {
        if (!isHoveredRef.current) onCloseRef.current()
      }, remainingRef.current)
    }, 50)

    return () => {
      clearTimeout(kickoff)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    // Set ref immediately — before anything else — so any in-flight setTimeout sees it
    isHoveredRef.current = true
    setIsHovered(true)

    // Freeze the JS timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Only subtract elapsed if the countdown actually started
    if (timerStartedRef.current) {
      const elapsed = Date.now() - startTimeRef.current
      remainingRef.current = Math.max(0, remainingRef.current - elapsed)
    }

    // Freeze the progress bar at current position
    const elapsed_total = effectiveDuration - remainingRef.current
    const currentPct = (elapsed_total / effectiveDuration) * 100
    setTransitionDuration('none')
    setProgressWidth(`${currentPct}%`)
  }

  const handleMouseLeave = () => {
    // Clear ref immediately — before anything else
    isHoveredRef.current = false
    setIsHovered(false)

    if (remainingRef.current <= 0) return

    // Resume the progress bar
    startTimeRef.current = Date.now()
    timerStartedRef.current = true
    setTransitionDuration(`${remainingRef.current}ms`)
    setProgressWidth('100%')

    // Resume the JS timer
    timerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) onCloseRef.current()
    }, remainingRef.current)
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <IoCheckmarkCircle className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-400" />
          ),
          gradient:
            'from-emerald-500/[0.06] via-emerald-500/[0.01] to-white dark:from-emerald-500/[0.08] dark:via-zinc-900/95 dark:to-zinc-900/95',
          border: 'border-emerald-100/60 dark:border-emerald-900/30',
          shadow: 'shadow-emerald-500/2',
          progress: 'bg-emerald-500 dark:bg-emerald-400'
        }
      case 'error':
        return {
          icon: <IoCloseCircle className="w-5.5 h-5.5 text-rose-600 dark:text-rose-400" />,
          gradient:
            'from-rose-500/[0.06] via-rose-500/[0.01] to-white dark:from-rose-500/[0.08] dark:via-zinc-900/95 dark:to-zinc-900/95',
          border: 'border-rose-100/60 dark:border-rose-900/30',
          shadow: 'shadow-rose-500/2',
          progress: 'bg-rose-500 dark:bg-rose-400'
        }
      case 'warning':
        return {
          icon: <IoAlertCircle className="w-5.5 h-5.5 text-amber-500 dark:text-amber-400" />,
          gradient:
            'from-amber-500/[0.06] via-amber-500/[0.01] to-white dark:from-amber-500/[0.08] dark:via-zinc-900/95 dark:to-zinc-900/95',
          border: 'border-amber-100/60 dark:border-amber-900/30',
          shadow: 'shadow-amber-500/2',
          progress: 'bg-amber-500 dark:bg-amber-400'
        }
      case 'info':
        return {
          icon: <IoInformationCircle className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" />,
          gradient:
            'from-blue-500/[0.06] via-blue-500/[0.01] to-white dark:from-blue-500/[0.08] dark:via-zinc-900/95 dark:to-zinc-900/95',
          border: 'border-blue-100/60 dark:border-blue-900/30',
          shadow: 'shadow-blue-500/2',
          progress: 'bg-blue-500 dark:bg-blue-400'
        }
    }
  }

  const styles = getStyles()

  return (
    <div className="w-full max-w-md animate-[slideInRight_0.25s_cubic-bezier(0.16,1,0.3,1)]">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          flex items-center gap-3 px-4 py-3.5 rounded-lg
          bg-white dark:bg-zinc-900 bg-gradient-to-r ${styles.gradient}
          border ${styles.border}
          shadow-lg ${styles.shadow}
          transform transition-all duration-200 hover:scale-[1.01]
          relative overflow-hidden
        `}
      >
        {/* Icon */}
        <div className="flex-shrink-0 relative z-10 flex items-center justify-center">
          {styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 relative z-10">
          <p className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
            {description || message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 focus:outline-none transition-all duration-150 relative z-10"
        >
          <IoCloseOutline className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-zinc-100/40 dark:bg-zinc-800/10 overflow-hidden">
          <div
            className={`h-full ${styles.progress}`}
            style={{
              width: progressWidth,
              transition:
                transitionDuration === 'none' ? 'none' : `width ${transitionDuration} linear`
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(1.5rem);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Toast
