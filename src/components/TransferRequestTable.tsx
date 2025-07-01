"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CheckCircle, Clock, AlertTriangle, Search, Filter, Eye, X, Loader2, RefreshCw, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { TransferRequest, TransferFilters } from "@/lib/api"
import { useDebounce } from "@/hooks/useDebounce"

interface TransferRequestTableProps {
  transfers: TransferRequest[]
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onRefresh: (filters: TransferFilters) => Promise<void>
  onApprove?: (transfer: TransferRequest) => Promise<void>
  onReject?: (transfer: TransferRequest) => Promise<void>
  showActions?: boolean
  statusFilter?: string
  title: string
  description: string
  emptyStateIcon?: React.ReactNode
  emptyStateTitle?: string
  emptyStateDescription?: string
}

export default function TransferRequestTable({
  transfers,
  isLoading,
  totalCount,
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onRefresh,
  statusFilter,
  title,
  description,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
}: TransferRequestTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pageSize, setPageSize] = useState(20)

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      transfer.transfer_id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (transfer.user ? `${transfer.user.first_name} ${transfer.user.last_name}`.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) : false) ||
      (transfer.user?.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || false)

    const matchesType = filterType === "all" || transfer.transfer_type === filterType || (transfer as any).type === filterType

    return matchesSearch && matchesType
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh({
        search: searchTerm || undefined,
        type_filter: filterType !== "all" ? filterType : undefined,
        status_filter: statusFilter,
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSearch = async () => {
    await onRefresh({
      search: searchTerm || undefined,
      type_filter: filterType !== "all" ? filterType : undefined,
      status_filter: statusFilter,
      skip: 0,
      limit: pageSize,
    })
  }

  const handlePageChange = async (page: number) => {
    await onRefresh({
      search: searchTerm || undefined,
      type_filter: filterType !== "all" ? filterType : undefined,
      status_filter: statusFilter,
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
  }

  const handlePageSizeChange = async (newPageSize: string) => {
    const size = parseInt(newPageSize)
    setPageSize(size)
    await onRefresh({
      search: searchTerm || undefined,
      type_filter: filterType !== "all" ? filterType : undefined,
      status_filter: statusFilter,
      skip: 0,
      limit: size,
    })
  }


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
      case "awaiting_crypto":
      case "crypto_received":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
      case "cancelled":
      case "expired":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
      case "awaiting_crypto":
      case "crypto_received":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "cancelled":
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number | string, currency: string = "USD") => {
    return `$${Number(amount).toFixed(2)} ${currency}`
  }

  return (
    <div className="space-y-4">
      {/* Header - Improved responsive layout */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-gray-600 text-sm lg:text-base">{description}</p>
        </div>
        <div className="flex items-center space-x-2 w-full lg:w-auto justify-between lg:justify-normal">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {totalCount} Total
          </Badge>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="">Refresh</span>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              <span className="">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters - Improved mobile layout */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="w-full lg:flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by request ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-10 w-full"
                />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-500 hidden sm:block" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="crypto-to-fiat">Crypto to Fiat</SelectItem>
                    <SelectItem value="fiat-to-crypto">Fiat to Crypto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-full sm:w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleSearch} size="sm" className="w-fit">
                  <Search className="w-4 h-4" />
                  <span className="">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Desktop Table - Improved responsive behavior */}
      <Card className="">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Request</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Loading transfers...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      {emptyStateIcon || <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {emptyStateTitle || "No transfers found"}
                      </h3>
                      <p className="text-gray-500">
                        {emptyStateDescription || "Try adjusting your search or filter criteria."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id} className="hover:bg-gray-50">
                      <TableCell className="py-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transfer.status)}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{transfer.transfer_id}</p>
                            <p className="text-xs text-gray-500 truncate">
                              Fee: {formatCurrency(transfer.fee_amount || (transfer as any).fee || 0, transfer.currency)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {transfer.user ? `${transfer.user.first_name} ${transfer.user.last_name}` : 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{transfer.user?.email || 'No email'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="text-xs">
                          {(transfer.transfer_type || (transfer as any).type || 'crypto-to-fiat').replace(/[-_]/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm">
                            {formatCurrency(transfer.amount, transfer.currency)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Net: {formatCurrency(transfer.net_amount || (transfer as any).amount_after_fee || 0, transfer.currency)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge className={`text-xs ${getStatusColor(transfer.status)}`}>
                          {transfer.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="min-w-0">
                          <p className="text-xs">{formatDate(transfer.created_at)}</p>
                          {transfer.completed_at && (
                            <p className="text-xs text-gray-500 truncate">
                              Completed: {formatDate(transfer.completed_at)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center space-x-1">
                          <Button
                            onClick={() => router.push(`/requests/details/${transfer.id}`)}
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1 h-8"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination - Responsive layout */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-gray-500 whitespace-nowrap">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
              </div>
              <Pagination className="w-full sm:w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        if (hasPrev) handlePageChange(currentPage - 1)
                      }}
                      className={!hasPrev ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {/* Page numbers - Responsive pagination items */}
                  {Array.from({ length: Math.min(totalPages <= 5 ? totalPages : 3, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 3 + i
                    } else {
                      pageNum = currentPage - 1 + i
                    }
                    
                    return (
                      <PaginationItem key={pageNum} className="hidden sm:block">
                        <PaginationLink
                          href="#"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(pageNum)
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem className="hidden sm:block">
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {totalPages > 5 && (
                    <PaginationItem className="hidden sm:block">
                      <PaginationLink
                        href="#"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(totalPages)
                        }}
                        isActive={currentPage === totalPages}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        if (hasNext) handlePageChange(currentPage + 1)
                      }}
                      className={!hasNext ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}