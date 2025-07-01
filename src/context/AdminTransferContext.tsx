"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient, TransferRequest, TransferStats, TransferUpdateRequest, TransferFilters, PaginationMeta } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { usePendingCount } from '@/context/PendingCountContext';

interface AdminTransferContextType {
  // State
  transfers: TransferRequest[];
  pendingTransfers: TransferRequest[];
  failedTransfers: TransferRequest[];
  completedTransfers: TransferRequest[];
  stats: TransferStats | null;
  isLoading: boolean;
  error: string | null;
  selectedTransfer: TransferRequest | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;

  // Actions
  getAllTransfers: (filters?: TransferFilters) => Promise<void>;
  getPendingTransfers: (filters?: TransferFilters) => Promise<void>;
  getFailedTransfers: (filters?: TransferFilters) => Promise<void>;
  getCompletedTransfers: (filters?: TransferFilters) => Promise<void>;
  getTransferById: (id: string) => Promise<void>;
  updateTransfer: (id: string, data: TransferUpdateRequest) => Promise<boolean>;
  approveTransfer: (id: string, notes?: string) => Promise<boolean>;
  rejectTransfer: (id: string, reason?: string) => Promise<boolean>;
  bulkUpdateStatus: (transferIds: string[], status: string, statusMessage?: string) => Promise<boolean>;
  getTransferStats: () => Promise<void>;
  setSelectedTransfer: (transfer: TransferRequest | null) => void;
  refreshTransfers: (filters?: TransferFilters) => Promise<void>;
}

const AdminTransferContext = createContext<AdminTransferContextType | undefined>(undefined);

export function AdminTransferProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { decrementPendingCount, refreshPendingCount } = usePendingCount();
  
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [pendingTransfers, setPendingTransfers] = useState<TransferRequest[]>([]);
  const [failedTransfers, setFailedTransfers] = useState<TransferRequest[]>([]);
  const [completedTransfers, setCompletedTransfers] = useState<TransferRequest[]>([]);
  const [stats, setStats] = useState<TransferStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const updatePaginationMeta = useCallback((meta?: PaginationMeta) => {
    if (meta) {
      setTotalCount(meta.total);
      setCurrentPage(meta.current_page);
      setTotalPages(meta.total_pages);
      setHasNext(meta.has_next);
      setHasPrev(meta.has_prev);
    }
  }, []);

  const getAllTransfers = useCallback(async (filters?: TransferFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getAllTransfers(filters);
      
      if (response.success && response.data) {
        setTransfers(response.data.transfers);
        setTotalCount(response.data.total_count);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.total_pages);
        setHasNext(response.data.has_next);
        setHasPrev(response.data.has_prev);
      } else {
        setError(response.error || 'Failed to fetch transfers');
        toast({
          title: "Error",
          description: response.error || 'Failed to fetch transfers',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch transfers';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getPendingTransfers = useCallback(async (filters?: TransferFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get pending transfers by making separate calls for each status
      const pendingStatuses = ['pending', 'processing', 'awaiting_crypto', 'crypto_received'];
      const allPendingTransfers: TransferRequest[] = [];
      let totalPendingCount = 0;
      
      // For simplicity, let's just use 'pending' for now and you can expand this
      const response = await apiClient.getAllTransfers({
        ...filters,
        status_filter: 'pending'
      });
      
      if (response.success && response.data) {
        setPendingTransfers(response.data.transfers);
        setTotalCount(response.data.total_count);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.total_pages);
        setHasNext(response.data.has_next);
        setHasPrev(response.data.has_prev);
      } else {
        setError(response.error || 'Failed to fetch pending transfers');
        toast({
          title: "Error",
          description: response.error || 'Failed to fetch pending transfers',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch pending transfers';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getFailedTransfers = useCallback(async (filters?: TransferFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get failed transfers
      const response = await apiClient.getAllTransfers({
        ...filters,
        status_filter: 'failed'
      });
      
      if (response.success && response.data) {
        setFailedTransfers(response.data.transfers);
        setTotalCount(response.data.total_count);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.total_pages);
        setHasNext(response.data.has_next);
        setHasPrev(response.data.has_prev);
      } else {
        setError(response.error || 'Failed to fetch failed transfers');
        toast({
          title: "Error",
          description: response.error || 'Failed to fetch failed transfers',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch failed transfers';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getCompletedTransfers = useCallback(async (filters?: TransferFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get completed transfers
      const response = await apiClient.getAllTransfers({
        ...filters,
        status_filter: 'completed'
      });
      
      if (response.success && response.data) {
        setCompletedTransfers(response.data.transfers);
        setTotalCount(response.data.total_count);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.total_pages);
        setHasNext(response.data.has_next);
        setHasPrev(response.data.has_prev);
      } else {
        setError(response.error || 'Failed to fetch completed transfers');
        toast({
          title: "Error",
          description: response.error || 'Failed to fetch completed transfers',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch completed transfers';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getTransferById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getTransferById(id);
      
      if (response.success && response.data) {
        setSelectedTransfer(response.data);
        // Update the transfer in the list if it exists
        setTransfers(prev => prev.map(t => t.id === id ? response.data! : t));
      } else {
        setError(response.error || 'Failed to fetch transfer details');
        toast({
          title: "Error",
          description: response.error || 'Failed to fetch transfer details',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch transfer details';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateTransfer = useCallback(async (id: string, data: TransferUpdateRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.updateTransfer(id, data);
      
      if (response.success && response.data) {
        // Update the transfer in the list
        setTransfers(prev => prev.map(t => t.id === id ? response.data! : t));
        if (selectedTransfer?.id === id) {
          setSelectedTransfer(response.data);
        }
        
        // Update pending count and lists if status changed from pending
        const oldTransfer = transfers.find(t => t.id === id);
        if (oldTransfer?.status === 'pending' && response.data.status !== 'pending') {
          decrementPendingCount();
          // Remove from pending transfers list
          setPendingTransfers(prev => prev.filter(t => t.id !== id));
          
          // Add to appropriate list based on new status
          if (response.data.status === 'completed') {
            setCompletedTransfers(prev => [response.data!, ...prev]);
          } else if (response.data.status === 'failed') {
            setFailedTransfers(prev => [response.data!, ...prev]);
          }
        }
        
        toast({
          title: "Success",
          description: "Transfer updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to update transfer',
          variant: "destructive",
        });
        return false;
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to update transfer',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTransfer, toast, transfers, decrementPendingCount]);

  const approveTransfer = useCallback(async (id: string, notes?: string): Promise<boolean> => {
    return await updateTransfer(id, {
      status: 'completed',
      status_message: 'Transfer approved by admin',
      processing_notes: notes,
    });
  }, [updateTransfer]);

  const rejectTransfer = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    return await updateTransfer(id, {
      status: 'failed',
      status_message: reason || 'Transfer rejected by admin',
      processing_notes: reason,
    });
  }, [updateTransfer]);

  const bulkUpdateStatus = useCallback(async (
    transferIds: string[], 
    status: string, 
    statusMessage?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.bulkUpdateTransferStatus(transferIds, status, statusMessage);
      
      if (response.success) {
        // Refresh transfers to get updated data
        await getAllTransfers();
        
        toast({
          title: "Success",
          description: `${transferIds.length} transfer(s) updated successfully`,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to bulk update transfers',
          variant: "destructive",
        });
        return false;
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to bulk update transfers',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getAllTransfers, toast]);

  const getTransferStats = useCallback(async () => {
    try {
      const response = await apiClient.getTransferStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to fetch transfer statistics',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch transfer statistics',
        variant: "destructive",
      });
    }
  }, [toast]);

  const refreshTransfers = useCallback(async (filters?: TransferFilters) => {
    await Promise.all([
      getAllTransfers(filters),
      getTransferStats()
    ]);
  }, [getAllTransfers, getTransferStats]);

  const value: AdminTransferContextType = {
    // State
    transfers,
    pendingTransfers,
    failedTransfers,
    completedTransfers,
    stats,
    isLoading,
    error,
    selectedTransfer,
    totalCount,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,

    // Actions
    getAllTransfers,
    getPendingTransfers,
    getFailedTransfers,
    getCompletedTransfers,
    getTransferById,
    updateTransfer,
    approveTransfer,
    rejectTransfer,
    bulkUpdateStatus,
    getTransferStats,
    setSelectedTransfer,
    refreshTransfers,
  };

  return (
    <AdminTransferContext.Provider value={value}>
      {children}
    </AdminTransferContext.Provider>
  );
}

export function useAdminTransfer() {
  const context = useContext(AdminTransferContext);
  if (context === undefined) {
    throw new Error('useAdminTransfer must be used within an AdminTransferProvider');
  }
  return context;
}