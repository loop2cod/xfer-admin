"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, Search, Filter, CheckCircle, X, Eye, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"

interface PendingTransferRequest {
  id: string
  customer: {
    name: string
    email: string
    id: string
  }
  type: "crypto-to-fiat" | "fiat-to-crypto"
  amount: string
  fee: string
  netAmount: string
  currency: string
  status: "pending"
  createdAt: string
  wallet?: string
  bankDetails?: {
    accountName: string
    accountNumber: string
    bankName: string
    routingNumber: string
  }
  txHash?: string
}

export default function PendingRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<PendingTransferRequest | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock pending transactions data
  const [pendingRequests, setPendingRequests] = useState<PendingTransferRequest[]>([
    {
      id: "REQ-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        id: "CUST-001",
      },
      type: "crypto-to-fiat",
      amount: "500.00",
      fee: "5.00",
      netAmount: "495.00",
      currency: "USDT",
      status: "pending",
      createdAt: "2024-01-15T14:30:00Z",
      bankDetails: {
        accountName: "John Doe",
        accountNumber: "1234567890",
        bankName: "Chase Bank",
        routingNumber: "021000021",
      },
      txHash: "0x742d35cc6bf3c8f3a1234567890abcdef",
    },
    {
      id: "REQ-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        id: "CUST-002",
      },
      type: "fiat-to-crypto",
      amount: "1000.00",
      fee: "10.00",
      netAmount: "990.00",
      currency: "USDT",
      status: "pending",
      createdAt: "2024-01-15T12:15:00Z",
      wallet: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    },
    {
      id: "REQ-003",
      customer: {
        name: "Mike Johnson",
        email: "mike@example.com",
        id: "CUST-003",
      },
      type: "crypto-to-fiat",
      amount: "250.00",
      fee: "2.50",
      netAmount: "247.50",
      currency: "USDT",
      status: "pending",
      createdAt: "2024-01-15T10:45:00Z",
      bankDetails: {
        accountName: "Mike Johnson",
        accountNumber: "9876543210",
        bankName: "Bank of America",
        routingNumber: "026009593",
      },
      txHash: "0x123abc456def789ghi012jkl345mno678pqr",
    },
  ])

  const filteredRequests = pendingRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || request.type === filterType

    return matchesSearch && matchesFilter
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleApprove = async () => {
    if (!selectedRequest) return

    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Remove from pending list
    setPendingRequests((prev) => prev.filter((t) => t.id !== selectedRequest.id))

    setIsProcessing(false)
    setShowApproveDialog(false)
    setSelectedRequest(null)
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Remove from pending list
    setPendingRequests((prev) => prev.filter((t) => t.id !== selectedRequest.id))

    setIsProcessing(false)
    setShowRejectDialog(false)
    setSelectedRequest(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
                <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/requests">Transfer Requests</BreadcrumbLink>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pending Transfer Requests</h1>
            <p className="text-gray-600">Review and process pending transfer requests</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {filteredRequests.length} Pending
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by request ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="crypto-to-fiat">Crypto to Fiat</SelectItem>
                    <SelectItem value="fiat-to-crypto">Fiat to Crypto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <div>
                          <p className="font-medium">{request.id}</p>
                          <p className="text-sm text-gray-500">
                            Fee: ${request.fee} {request.currency}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.customer.name}</p>
                        <p className="text-sm text-gray-500">{request.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {request.type.replace("-", " to ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          ${request.amount} {request.currency}
                        </p>
                        <p className="text-sm text-gray-500">Net: ${request.netAmount}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(request.createdAt)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`/admin/transactions/${request.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-gray-900 hover:bg-gray-800"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowApproveDialog(true)
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowRejectDialog(true)
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending transfer requests</h3>
                <p className="text-gray-500">All requests have been processed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Transfer Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this transfer request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Request ID:</p>
                    <p className="font-medium">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer:</p>
                    <p className="font-medium">{selectedRequest.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount:</p>
                    <p className="font-medium">
                      ${selectedRequest.amount} {selectedRequest.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Net Amount:</p>
                    <p className="font-medium">
                      ${selectedRequest.netAmount} {selectedRequest.currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing} className="bg-gray-900 hover:bg-gray-800">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Transfer Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Transfer Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this transfer request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Request ID:</p>
                    <p className="font-medium">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer:</p>
                    <p className="font-medium">{selectedRequest.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount:</p>
                    <p className="font-medium">
                      ${selectedRequest.amount} {selectedRequest.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type:</p>
                    <p className="font-medium capitalize">{selectedRequest.type.replace("-", " to ")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject Transfer Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
