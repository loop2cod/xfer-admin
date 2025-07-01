"use client"

import { useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AlertTriangle } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import TransferRequestTable from "@/components/TransferRequestTable"
import { useAdminTransfer } from "@/context/AdminTransferContext"

function FailedRequestsPage() {
  const {
    failedTransfers,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    getFailedTransfers,
  } = useAdminTransfer()

  useEffect(() => {
    // Initial load - fetch failed transfers
    getFailedTransfers()
  }, [])

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Admin Panel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/requests">Transfer Requests</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Failed Requests</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <TransferRequestTable
          transfers={failedTransfers}
          isLoading={isLoading}
          error={error}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onRefresh={getFailedTransfers}
          showActions={false}
          statusFilter="failed"
          title="Failed Transfer Requests"
          description="Review and manage failed transfer requests"
          emptyStateIcon={<AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
          emptyStateTitle="No failed requests found"
          emptyStateDescription="All transfer requests have been processed successfully."
        />
      </div>
    </>
  )
}

export default function AdminFailedRequestsPage() {
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      <FailedRequestsPage />
    </ProtectedRoute>
  )
}