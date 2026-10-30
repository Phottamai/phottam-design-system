import type { JSX } from 'react'

export type LoaderSize = 'sm' | 'md' | 'lg'

export interface LoaderProps {
  size?: LoaderSize
  className?: string
  label?: string
}

const sizeClassMap: Record<LoaderSize, string> = {
  sm: 'ph-loader-container--sm',
  md: 'ph-loader-container--md',
  lg: 'ph-loader-container--lg'
}

export function Loader({
  size = 'md',
  className = '',
  label = 'Loading'
}: LoaderProps): JSX.Element {
  return (
    <div
      className={`ph-loader-container ${sizeClassMap[size]} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="ph-loader" aria-hidden />
    </div>
  )
}

export default Loader
