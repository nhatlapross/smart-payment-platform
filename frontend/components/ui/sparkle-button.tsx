'use client'

import React from 'react'
import DoubleLeftArrowIcon from '@/assests/doubleLeftArrow'

interface SparkleToggleButtonProps {
  isCollapsed: boolean
  onClick: () => void
}

export function SparkleToggleButton({ isCollapsed, onClick }: SparkleToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full relative group overflow-hidden rounded-lg"
      style={{
        backgroundImage: 'url(/SliderButtonbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '44px'
      }}
    >
      {/* Multiple Sparkle Layers for Enhanced Effect */}
      <div className="absolute inset-0">
        {/* Base glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Moving sparkle line */}
        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100">
          <div className="sparkle-line absolute h-full w-32 bg-gradient-to-r 
                        from-transparent via-white/40 to-transparent 
                        -left-32 group-hover:left-full transition-all duration-700 
                        transform rotate-12" />
        </div>
        
        {/* Sparkle particles */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
          <div className="sparkle-particle sparkle-1"></div>
          <div className="sparkle-particle sparkle-2"></div>
          <div className="sparkle-particle sparkle-3"></div>
          <div className="sparkle-particle sparkle-4"></div>
        </div>
      </div>
      
      {/* Button Content */}
      <div className="relative z-10 flex items-center justify-center px-3 py-2.5 
                    backdrop-blur-sm bg-gradient-to-r from-black/30 to-black/20 
                    hover:from-black/40 hover:to-black/30 
                    transition-all duration-300">
        <DoubleLeftArrowIcon 
          isCollapsed={isCollapsed}
          className="text-white group-hover:text-cyan-300 transition-all duration-300 
                   group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        />
        {!isCollapsed && (
          <span className="ml-2 text-sm font-medium text-white 
                         group-hover:text-cyan-300 transition-all duration-300
                         group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
            Hide
          </span>
        )}
      </div>
      
      {/* Edge glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-lg border border-cyan-400/50 
                      group-hover:animate-pulse" />
      </div>
    </button>
  )
}