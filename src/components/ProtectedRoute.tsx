'use client';

import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SidebarInset, SidebarProvider } from './ui/sidebar';
import { AdminSidebar } from './admin-sidebar';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requireSuperAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requireSuperAdmin = false
}: ProtectedRouteProps) {
  const { isAuthenticated, admin, loading, hasPermission, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check if super admin is required
      if (requireSuperAdmin && !isSuperAdmin()) {
        router.push('/unauthorized');
        return;
      }

      // Check specific permission
      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [
    isAuthenticated,
    admin,
    loading,
    router,
    requiredPermission,
    requireSuperAdmin,
    hasPermission,
    isSuperAdmin
  ]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or checking permissions
  if (!isAuthenticated) {
    return null;
  }

  // Check permissions
  if (requireSuperAdmin && !isSuperAdmin()) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider></>;
}

export default ProtectedRoute;