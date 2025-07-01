"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { apiClient } from '@/lib/api'
import { toast } from 'sonner'

interface PendingCountContextType {
  pendingCount: number
  isLoading: boolean
  error: string | null
  refreshPendingCount: () => Promise<void>
  decrementPendingCount: () => void
  incrementPendingCount: () => void
}

const PendingCountContext = createContext<PendingCountContextType | undefined>(undefined)

interface PendingCountProviderProps {
  children: ReactNode
}

export function PendingCountProvider({ children }: PendingCountProviderProps) {
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previousCount, setPreviousCount] = useState<number>(0)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchPendingCount = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Use the optimized pending count endpoint
      const response = await apiClient.getPendingCount()
      
      if (response.success && response.data) {
        const newCount = response.data.pending_count
        
        // Show notification for significant changes (only after initialization)
        if (isInitialized && newCount !== pendingCount) {
          const difference = newCount - pendingCount
          
          if (difference > 0) {
            toast.info(`${difference} new pending transfer${difference > 1 ? 's' : ''} received`, {
              description: `Total pending: ${newCount}`,
              duration: 3000,
            })
          } else if (difference < 0 && Math.abs(difference) > 1) {
            toast.success(`${Math.abs(difference)} transfer${Math.abs(difference) > 1 ? 's' : ''} processed`, {
              description: `Remaining pending: ${newCount}`,
              duration: 3000,
            })
          }
        }
        
        setPreviousCount(pendingCount)
        setPendingCount(newCount)
        
        if (!isInitialized) {
          setIsInitialized(true)
        }
      } else {
        setError(response.error || 'Failed to fetch pending count')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching pending count:', err)
    } finally {
      setIsLoading(false)
    }
  }, [pendingCount, isInitialized])

  const refreshPendingCount = async () => {
    await fetchPendingCount()
  }

  const decrementPendingCount = () => {
    setPendingCount(prev => Math.max(0, prev - 1))
  }

  const incrementPendingCount = () => {
    setPendingCount(prev => prev + 1)
  }

  useEffect(() => {
    fetchPendingCount()
    
    // Set up polling to refresh count every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000)
    
    // Listen for visibility change to refresh when tab becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPendingCount()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchPendingCount])

  const value: PendingCountContextType = {
    pendingCount,
    isLoading,
    error,
    refreshPendingCount,
    decrementPendingCount,
    incrementPendingCount
  }

  return (
    <PendingCountContext.Provider value={value}>
      {children}
    </PendingCountContext.Provider>
  )
}

export function usePendingCount() {
  const context = useContext(PendingCountContext)
  if (context === undefined) {
    throw new Error('usePendingCount must be used within a PendingCountProvider')
  }
  return context
}