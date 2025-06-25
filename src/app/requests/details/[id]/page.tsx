"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  ExternalLink,
  User,
  CreditCard,
  Wallet,
  Building,
  X,
  Loader2,
} from "lucide-react"
import { useParams } from "next/navigation"

interface AdminTransferRequest {
  id: any
  customer: {
    name: string
    email: string
    id: string
    joinDate: string
    totalRequests: number
  }
  type: "crypto-to-fiat" | "fiat-to-crypto"
  amount: string
  fee: string
  netAmount: string
  currency: string
  status: "pending" | "completed" | "failed"
  createdAt: string
  completedAt?: string
  wallet?: string
  bankDetails?: {
    accountName: string
    accountNumber: string
    bankName: string
    routingNumber: string
  }
  txHash?: string
  adminNotes?: string
  ipAddress: string
  userAgent: string
}

export default function AdminRequestDetailsPage() {
  const params = useParams()
  const [copied, setCopied] = useState<string | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock transaction data - in real app, fetch by ID
  const request: AdminTransferRequest = {
    id: params.id,
    customer: {
      name: "John Doe",
      email: "john@example.com",
      id: "CUST-001",
      joinDate: "2024-01-01T00:00:00Z",
      totalRequests: 15,
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
    adminNotes: "Customer verified via phone call",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowApproveDialog(false)
    // In real app, update transaction status and redirect
  }

  const handleReject = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowRejectDialog(false)
    // In real app, update transaction status and redirect
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-gray-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "failed":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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
                <BreadcrumbPage>{request.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(request.status)}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{request.id}</h1>
              <p className="text-gray-600">Transfer Request Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(request.status)} text-sm px-3 py-1`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
            {request.status === "pending" && (
              <>
                <Button className="bg-gray-900 hover:bg-gray-800" onClick={() => setShowApproveDialog(true)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Transfer Request Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Transaction Type</p>
                  <p className="font-medium capitalize">{request.type.replace("-", " to ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="font-medium">{request.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">${request.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fee</p>
                  <p className="font-medium">${request.fee}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Amount</p>
                  <p className="font-bold text-lg">${request.netAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium">{formatDate(request.createdAt)}</p>
              </div>

              {request.completedAt && (
                <div>
                  <p className="text-sm text-gray-600">Completed At</p>
                  <p className="font-medium">{formatDate(request.completedAt)}</p>
                </div>
              )}

              {request.txHash && (
                <div>
                  <p className="text-sm text-gray-600">Transaction Hash</p>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">{request.txHash}</code>
                    <Button size="sm" variant="outline" onClick={() => handleCopy(request.txHash!, "txHash")}>
                      {copied === "txHash" ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://tronscan.org/#/transaction/${request.txHash}`, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-medium">{request.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium">{request.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer ID</p>
                <p className="font-medium">{request.customer.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="font-medium">{formatDate(request.customer.joinDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="font-medium">{request.customer.totalRequests}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">IP Address</p>
                <p className="font-medium">{request.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User Agent</p>
                <p className="text-sm text-gray-800 break-all">{request.userAgent}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details (for crypto-to-fiat) */}
          {request.type === "crypto-to-fiat" && request.bankDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Bank Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Account Name</p>
                    <p className="font-medium">{request.bankDetails.accountName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-medium">{request.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="font-medium">{request.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Routing Number</p>
                    <p className="font-medium">{request.bankDetails.routingNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet Details (for fiat-to-crypto) */}
          {request.type === "fiat-to-crypto" && request.wallet && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Wallet Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-gray-600">Wallet Address</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">{request.wallet}</code>
                    <Button size="sm" variant="outline" onClick={() => handleCopy(request.wallet!, "wallet")}>
                      {copied === "wallet" ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {request.adminNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{request.adminNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Transfer Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this transfer request? This will mark it as completed.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Transaction ID:</p>
                <p className="font-medium">{request.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Customer:</p>
                <p className="font-medium">{request.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Net Amount:</p>
                <p className="font-medium">
                  ${request.netAmount} {request.currency}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Type:</p>
                <p className="font-medium capitalize">{request.type.replace("-", " to ")}</p>
              </div>
            </div>
          </div>
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
                  Approve Transaction
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
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Transaction ID:</p>
                <p className="font-medium">{request.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Customer:</p>
                <p className="font-medium">{request.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount:</p>
                <p className="font-medium">
                  ${request.amount} {request.currency}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Type:</p>
                <p className="font-medium capitalize">{request.type.replace("-", " to ")}</p>
              </div>
            </div>
          </div>
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
                  Reject Transaction
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
