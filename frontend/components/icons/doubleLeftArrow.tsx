import React from 'react'

interface DoubleLeftArrowProps {
  className?: string
  isCollapsed?: boolean
}

export function DoubleLeftArrow({ className = '', isCollapsed = false }: DoubleLeftArrowProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''} ${className}`}
    >
      {/* First Arrow - Original position */}
      <path 
        d="M10.939 4.939L3.87903 12L10.939 19.061L13.061 16.939L8.121 12L13.061 7.061L10.939 4.939Z" 
        fill="currentColor"
        className="transition-all duration-300"
      />
      {/* Second Arrow - Shifted right */}
      <path 
        d="M17.939 4.939L10.87903 12L17.939 19.061L20.061 16.939L15.121 12L20.061 7.061L17.939 4.939Z" 
        fill="currentColor"
        className="transition-all duration-300 opacity-80"
      />
    </svg>
  )
}