import React, { Suspense, lazy, useEffect, useState } from 'react'
import pickogEmptyAnim from '../../assets/pickog-empty.json'

// lottie-web reads `document` when imported, so load it lazily and only in the browser.
const Lottie = lazy(() => import('lottie-react'))

interface EmptyStateProps {
  message?: string
  subtext?: string
  error?: Error
  children?: React.ReactElement
  messageClassName?: string
  subtextClassName?: string
  imageSizeClassName?: string
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Oops! Nothing to show here.',
  subtext,
  error,
  children,
  messageClassName,
  subtextClassName,
  imageSizeClassName = 'h-36 w-36 sm:h-48 sm:w-48',
  className = 'relative flex h-full w-full flex-col items-center justify-start pt-12 pb-10'
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className={className}>
      <div
        className={`-mt-2 flex items-center justify-center drop-shadow-md ${imageSizeClassName}`}
      >
        {mounted ? (
          <Suspense fallback={null}>
            <Lottie
              animationData={pickogEmptyAnim}
              loop
              autoplay
              className="max-h-full max-w-full"
              aria-hidden
            />
          </Suspense>
        ) : null}
      </div>

      <div
        className={`mt-3 flex flex-col items-center gap-2 px-4 text-center ${subtext ? 'max-w-xs' : ''}`}
      >
        <p className={messageClassName || 'text-sm font-medium text-gray-600 dark:text-gray-400'}>
          {error?.message || message}
        </p>

        {subtext && (
          <p className={subtextClassName || 'text-sm font-medium text-gray-500 dark:text-gray-400'}>
            {subtext}
          </p>
        )}
      </div>

      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}

export default EmptyState
