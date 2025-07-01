"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Edit,
  History,
  Pause,
} from "lucide-react"
import { useParams } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAdminTransfer } from "@/context/AdminTransferContext"

function AdminRequestDetailsPage() {
  const params = useParams()
  const { selectedTransfer, getTransferById, updateTransfer, isLoading } = useAdminTransfer()

  const [copied, setCopied] = useState<string | null>(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showRemarksDialog, setShowRemarksDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminRemarks, setAdminRemarks] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  // Fetch transfer data on component mount
  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      getTransferById(params.id)
    }
  }, [params.id])

  const request = selectedTransfer

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleStatusUpdate = async () => {
    if (!request || !newStatus) return

    setIsProcessing(true)
    try {
      const success = await updateTransfer(request.id, {
        status: newStatus,
        status_message: statusMessage,
        admin_remarks: adminRemarks,
        internal_notes: internalNotes
      })

      if (success) {
        setShowStatusDialog(false)
        setNewStatus("")
        setStatusMessage("")
        setAdminRemarks("")
        setInternalNotes("")
        // Refresh the transfer data
        getTransferById(request.id)
      }
    } catch (error) {
      console.error('Failed to update transfer:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickStatusUpdate = async (status: string, message?: string) => {
    if (!request) return

    setIsProcessing(true)
    try {
      const success = await updateTransfer(request.id, {
        status,
        status_message: message,
      })

      if (success) {
        // Refresh the transfer data
        getTransferById(request.id)
      }
    } catch (error) {
      console.error('Failed to update transfer:', error)
    } finally {
      setIsProcessing(false)
    }
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
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "on_hold":
        return "bg-orange-100 text-orange-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
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

  // Show loading state
  if (isLoading || !request) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/requests">Transfer Requests</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Loading...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading transfer details...</span>
          </div>
        </div>
      </>
    )
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
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/requests">Transfer Requests</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{request.transfer_id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

    <div className="gap-4 p-4 pt-0">
  {/* Header Section */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
  {/* Left side - Title and Status */}
  <div className="grid grid-cols-[auto_1fr] items-center gap-3">
    {getStatusIcon(request.status)}
    <div className="grid gap-1 overflow-hidden">
      <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">
        {request.transfer_id}
      </h1>
      <p className="text-sm sm:text-base text-gray-600 truncate">Transfer Request Details</p>
    </div>
  </div>

  {/* Right side - Actions */}
  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-[auto_auto_auto_auto_auto] gap-2 justify-items-end sm:justify-items-center items-center">
    <div className="col-span-2 xs:col-span-1 sm:col-auto justify-self-start sm:justify-self-center">
      <Badge className={`${getStatusColor(request.status)} text-xs sm:text-sm px-2 sm:px-3 py-1 w-full text-center`}>
        {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
      </Badge>
    </div>
    
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowStatusDialog(true)}
      disabled={isProcessing}
      className="text-xs sm:text-sm w-full"
    >
      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
      <span>Update</span>
    </Button>

    {request.status === "pending" && (
      <>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm w-full"
          onClick={() => handleQuickStatusUpdate("completed", "Approved by admin")}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
          ) : (
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          )}
          <span>Approve</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs sm:text-sm w-full"
          onClick={() => handleQuickStatusUpdate("on_hold", "Put on hold for review")}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
          ) : (
            <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          )}
          <span>Hold</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 text-xs sm:text-sm w-full"
          onClick={() => handleQuickStatusUpdate("failed", "Rejected by admin")}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
          ) : (
            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          )}
          <span>Reject</span>
        </Button>
      </>
    )}
  </div>
</div>

  {/* Main Content Grid */}
  <div className="grid gap-4 lg:grid-cols-2">
    {/* Transaction Details Card */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sm sm:text-base">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Transfer Request Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Transaction Type</p>
            <p className="font-medium text-sm sm:text-base capitalize">
              {request?.type_}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Currency</p>
            <p className="font-medium text-sm sm:text-base">{request.currency}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Amount</p>
            <p className="font-medium text-sm sm:text-base">
              ${(Number(request.amount || 0.0)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Fee</p>
            <p className="font-medium text-sm sm:text-base">
              ${(Number(request.fee_amount || request.fee || 0.0)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Net Amount</p>
            <p className="font-bold text-sm sm:text-lg">
              ${(Number(request.net_amount || request.amount_after_fee || 0.0)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Status</p>
            <Badge className={`${getStatusColor(request.status)} text-xs sm:text-sm`}>
              {request.status}
            </Badge>
          </div>
        </div>

        <Separator className="my-2 sm:my-3" />

        <div className="space-y-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Created At</p>
            <p className="font-medium text-sm sm:text-base">
              {formatDate(request.created_at)}
            </p>
          </div>

          {request.completed_at && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Completed At</p>
              <p className="font-medium text-sm sm:text-base">
                {formatDate(request.completed_at)}
              </p>
            </div>
          )}

          {request.crypto_tx_hash && (
     <div>
  <p className="text-xs sm:text-sm text-gray-600">Transaction Hash</p>
  <div className="grid grid-cols-12 gap-2 mt-1 items-center">
    <code className="col-span-10 xs:col-span-9 sm:col-span-10 text-xs bg-gray-100 px-2 py-1.5 rounded truncate">
      {request.crypto_tx_hash}
    </code>
    <div className="col-span-2 xs:col-span-3 sm:col-span-2 flex justify-end gap-1">
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8"
        onClick={() => handleCopy(request.crypto_tx_hash!, "txHash")}
        title={copied === "txHash" ? "Copied!" : "Copy to clipboard"}
      >
        {copied === "txHash" ? (
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8"
        onClick={() => window.open(`https://tronscan.org/#/transaction/${request.crypto_tx_hash}`, "_blank")}
        title="View on Tronscan"
      >
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
      </Button>
    </div>
  </div>
</div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Customer Information Card */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sm sm:text-base">
          <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {request.user ? (
          <>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Customer Name</p>
              <p className="font-medium text-sm sm:text-base">
                {request.user.first_name} {request.user.last_name}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Email Address</p>
              <p className="font-medium text-sm sm:text-base truncate">
                {request.user.email}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Customer ID</p>
              <p className="font-medium text-sm sm:text-base">{request.user.customer_id || request.user.id}</p>
            </div>
          </>
        ) : (
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Customer Information</p>
            <p className="font-medium text-sm sm:text-base text-gray-500">
              Not available
            </p>
          </div>
        )}

        <div>
          <p className="text-xs sm:text-sm text-gray-600">Transfer ID</p>
          <p className="font-medium text-sm sm:text-base">{request.transfer_id}</p>
        </div>

        <div>
          <p className="text-xs sm:text-sm text-gray-600">User ID</p>
          <p className="font-medium text-sm sm:text-base">{request.user_id}</p>
        </div>

        {(request.admin_remarks || request.processing_notes) && (
          <>
            <Separator className="my-2 sm:my-3" />
            {request.admin_remarks && (
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Admin Remarks</p>
                <p className="text-xs sm:text-sm text-gray-800">
                  {request.admin_remarks}
                </p>
              </div>
            )}
            {request.processing_notes && (
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Processing Notes</p>
                <p className="text-xs sm:text-sm text-gray-800">
                  {request.processing_notes}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>

    {/* Bank Details Card (conditional) */}
    {request.transfer_type === "crypto-to-fiat" && request.bank_accounts && request.bank_accounts.length > 0 && (
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center text-sm sm:text-base">
            <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Bank Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {request.bank_accounts.map((account: any, index: number) => (
            <div key={index} className="border rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-sm sm:text-base mb-2">
                Bank Account {index + 1}
              </h4>
              <div className="grid grid-cols-1 xs:grid-cols-2">
                  <div>
                  <p className="text-xs sm:text-sm text-gray-600">Bank Name</p>
                  <p className="font-medium text-sm sm:text-base">
                    {account.bank_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Account Name</p>
                  <p className="font-medium text-sm sm:text-base">
                    {account.account_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Account Number</p>
                  <p className="font-medium text-sm sm:text-base">
                    {account.account_number || "N/A"}
                  </p>
                </div>
                   <div>
                  <p className="text-xs sm:text-sm text-gray-600">Routing Number</p>
                  <p className="font-medium text-sm sm:text-base">
                    {account.routing_number || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Transfer Amount</p>
                  <p className="font-medium text-sm sm:text-base">
                    ${account.transfer_amount || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )}

    {/* Wallet Details Card (conditional) */}
    {request.transfer_type === "fiat-to-crypto" && request.deposit_wallet_address && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm sm:text-base">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Wallet Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Deposit Wallet Address</p>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                {request.deposit_wallet_address}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(request.deposit_wallet_address!, "wallet")}
              >
                {copied === "wallet" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
          {request.admin_wallet_address && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Admin Wallet Address</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                  {request.admin_wallet_address}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopy(request.admin_wallet_address!, "adminWallet")}
                >
                  {copied === "adminWallet" ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          )}
          {request.network && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Network</p>
              <p className="font-medium text-sm sm:text-base">{request.network}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )}

    {/* Status History Card (conditional) */}
    {request.status_history && request.status_history.length > 0 && (
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center text-sm sm:text-base">
            <History className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Status History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {request.status_history.map((entry, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-3 sm:pl-4 pb-2 sm:pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {entry.from_status} → {entry.to_status}
                    </p>
                    <p className="text-xs text-gray-600">
                      by {entry.changed_by_name} on {formatDate(entry.timestamp)}
                    </p>
                  </div>
                </div>
                {entry.remarks && (
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    {entry.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )}
  </div>
</div>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-[5∏25px]">
          <DialogHeader>
            <DialogTitle>Update Transfer Status</DialogTitle>
            <DialogDescription>
              Change the status of this transfer request and add optional remarks.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Status update message..."
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adminRemarks" className="text-right">
                Admin Remarks
              </Label>
              <Textarea
                id="adminRemarks"
                placeholder="Remarks visible to client..."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="internalNotes" className="text-right">
                Internal Notes
              </Label>
              <Textarea
                id="internalNotes"
                placeholder="Internal notes (not visible to client)..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isProcessing || !newStatus}>
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


export default function AdminRequestDetailPage() {
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      <AdminRequestDetailsPage />
    </ProtectedRoute>
  )
}