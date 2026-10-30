import React from 'react'

interface ProgressBarProps {
  progress: number // Progress value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
      <div
        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-pink-500 to-orange-500 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar
