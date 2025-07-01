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
import { Clock } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAdminTransfer } from "@/context/AdminTransferContext"
import { TransferRequest } from "@/lib/api"
import TransferRequestTable from "@/components/TransferRequestTable"

function PendingRequestsPage() {
  const {
    pendingTransfers,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    getPendingTransfers,
    approveTransfer,
    rejectTransfer,
  } = useAdminTransfer()

  useEffect(() => {
    // Initial load - fetch pending transfers
    getPendingTransfers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (transfer: TransferRequest) => {
    await approveTransfer(transfer.id, 'Transfer approved by admin')
  }

  const handleReject = async (transfer: TransferRequest) => {
    await rejectTransfer(transfer.id, 'Transfer rejected by admin')
  }

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
                <BreadcrumbPage>Pending Queue</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <TransferRequestTable
          transfers={pendingTransfers}
          isLoading={isLoading}
          error={error}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onRefresh={getPendingTransfers}
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={true}
          statusFilter="pending"
          title="Pending Requests"
          description="Review and process pending transfer requests"
          emptyStateIcon={<Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
          emptyStateTitle="No pending transfer requests"
          emptyStateDescription="All requests have been processed."
        />
      </div>
    </>
  )
}

export default function AdminPendingRequestsPage() {
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      <PendingRequestsPage />
    </ProtectedRoute>
  )
}