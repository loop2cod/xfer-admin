'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutWrapperProps {
  children: ReactNode;
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  // Routes that don't need the sidebar layout
  const publicRoutes = ['/login', '/unauthorized'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Always wrap with SidebarProvider to avoid build issues
  // The actual sidebar visibility will be controlled by the content
  return (
    <SidebarProvider>
      {isPublicRoute || (!isAuthenticated && !loading) ? (
        // Public routes or unauthenticated - render without sidebar
        <>{children}</>
      ) : (
        // Authenticated or loading - render with sidebar layout
        <>
          <AdminSidebar />
          <SidebarInset>{children}</SidebarInset>
        </>
      )}
    </SidebarProvider>
  );
}

export default AdminLayoutWrapper;