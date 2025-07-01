import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

let toastCount = 0;

export function toast({
  title,
  description,
  variant = 'default',
  duration = 3000,
}: Omit<Toast, 'id'>) {
  // For now, we'll use console.log and alert as fallback
  // In a production app, you'd want to use a proper toast library like sonner or react-hot-toast
  
  const message = `${title ? title + ': ' : ''}${description || ''}`;
  
  if (variant === 'destructive') {
    console.error('Toast Error:', message);
    // You could show a simple alert for errors in development
    // alert(`Error: ${message}`);
  } else {
    console.log('Toast Success:', message);
  }
  
  // Return a toast object for consistency with toast libraries
  return {
    id: `toast-${++toastCount}`,
    title,
    description,
    variant,
    duration,
  };
}

// Hook for managing toasts (simplified version)
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCount}`;
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 3000);
    
    return newToast;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    toast: addToast,
    dismiss: removeToast,
  };
}

export default useToast;