import type { JSX } from 'react'

export type LoaderSize = 'sm' | 'md' | 'lg'

export interface LoaderProps {
  size?: LoaderSize
  className?: string
  label?: string
}

const sizeClassMap: Record<LoaderSize, string> = {
  sm: 'ds-loader-container--sm',
  md: 'ds-loader-container--md',
  lg: 'ds-loader-container--lg'
}

export function Loader({
  size = 'md',
  className = '',
  label = 'Loading'
}: LoaderProps): JSX.Element {
  return (
    <div
      className={`ds-loader-container ${sizeClassMap[size]} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="ds-loader" aria-hidden />
    </div>
  )
}

export default Loader
