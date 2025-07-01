"use client"

import { useState, useEffect } from 'react'
import { usePendingCount } from '@/context/PendingCountContext'

interface PendingCountBadgeProps {
  className?: string
  showAnimation?: boolean
}

export function PendingCountBadge({ className = "", showAnimation = true }: PendingCountBadgeProps) {
  const { pendingCount, isLoading } = usePendingCount()
  const [previousCount, setPreviousCount] = useState(pendingCount)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (pendingCount !== previousCount && showAnimation) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setPreviousCount(pendingCount)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [pendingCount, previousCount, showAnimation])

  if (isLoading && pendingCount === 0) {
    return (
      <span className={`bg-gray-300 text-gray-600 text-xs px-2 py-0.5 rounded-full animate-pulse ${className}`}>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
      </span>
    )
  }

  if (pendingCount === 0) {
    return null
  }

  const isUrgent = pendingCount > 10
  const isHigh = pendingCount > 5

  return (
    <span 
      className={`
        text-white text-xs px-2 py-0.5 rounded-full transition-all duration-300 
        ${isUrgent 
          ? 'bg-red-600 animate-pulse shadow-lg shadow-red-600/50' 
          : isHigh
          ? 'bg-orange-600 hover:bg-orange-700'
          : 'bg-blue-600 hover:bg-blue-700'
        }
        ${isAnimating ? 'scale-110 ring-2 ring-white/50' : 'scale-100'}
        ${className}
      `}
    >
      {pendingCount}
      {isAnimating && (
        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping"></span>
      )}
    </span>
  )
}