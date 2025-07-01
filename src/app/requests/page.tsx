"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Search } from "lucide-react"
import { useAdminTransfer } from "@/context/AdminTransferContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import TransferRequestTable from "@/components/TransferRequestTable"

function AllRequestsPage() {
  const {
    transfers,
    stats,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    getAllTransfers,
    refreshTransfers
  } = useAdminTransfer()

  useEffect(() => {
    // Initial load
    refreshTransfers()
  }, [])

  const defaultStats = {
    total: transfers.length,
    completed: transfers.filter((r) => r.status === "completed").length,
    pending: transfers.filter((r) => r.status === "pending" || r.status === "awaiting_crypto" || r.status === "crypto_received").length,
    failed: transfers.filter((r) => r.status === "failed" || r.status === "cancelled" || r.status === "expired").length,
  }

  const displayStats = stats ? {
    total: stats.total_requests,
    completed: stats.completed_requests,
    pending: stats.pending_requests,
    failed: stats.failed_requests,
  } : defaultStats

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
              <BreadcrumbItem>
                <BreadcrumbPage>Transfer Requests</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="space-y-4 overflow-hidden p-4 pt-0">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{displayStats.total}</div>
              <p className="text-sm text-gray-600">Total Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{displayStats.completed}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{displayStats.pending}</div>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{displayStats.failed}</div>
              <p className="text-sm text-gray-600">Failed</p>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Requests Table */}
        <TransferRequestTable
          transfers={transfers}
          isLoading={isLoading}
          error={error}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onRefresh={getAllTransfers}
          title="All Transfer Requests"
          description="Complete transfer request history and management"
          emptyStateIcon={<Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
          emptyStateTitle="No transfer requests found"
          emptyStateDescription="Try adjusting your search or filter criteria."
        />
      </div>
    </>
  )
}


export default function AdminRequestsPage() {
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      <AllRequestsPage />
    </ProtectedRoute>
  )
}