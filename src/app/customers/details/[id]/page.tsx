"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  MessageSquare,
  FileText,
  Loader2,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface CustomerDetails {
  id: any
  name: string
  email: string
  phone?: string
  status: "active" | "suspended" | "pending"
  joinDate: string
  lastActivity: string
  verificationStatus: "verified" | "pending" | "rejected"
  riskLevel: "low" | "medium" | "high"
  country?: string
  address?: string
  dateOfBirth?: string
  avatar?: string
  totalRequests: number
  totalVolume: number
  completedRequests: number
  pendingRequests: number
  failedRequests: number
  averageRequestAmount: number
  lastRequestDate?: string
  notes: string[]
  documents: {
    id: string
    type: string
    status: "approved" | "pending" | "rejected"
    uploadDate: string
  }[]
}

interface TransferRequest {
  id: string
  type: "crypto-to-fiat" | "fiat-to-crypto"
  amount: string
  currency: string
  status: "pending" | "completed" | "failed"
  createdAt: string
  completedAt?: string
}

export default function CustomerDetailsPage() {
  const {id} = useParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showActivateDialog, setShowActivateDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock customer data - in real app, fetch by ID
  const customer: CustomerDetails = {
    id: id,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0123",
    status: "active",
    joinDate: "2024-01-01T00:00:00Z",
    lastActivity: "2024-01-15T14:30:00Z",
    verificationStatus: "verified",
    riskLevel: "low",
    country: "United States",
    address: "123 Main St, New York, NY 10001",
    dateOfBirth: "1990-05-15",
    totalRequests: 15,
    totalVolume: 7500.0,
    completedRequests: 12,
    pendingRequests: 2,
    failedRequests: 1,
    averageRequestAmount: 500.0,
    lastRequestDate: "2024-01-15T14:30:00Z",
    notes: [
      "Customer verified via phone call - 2024-01-10",
      "Requested higher transaction limits - 2024-01-05",
      "Initial KYC documents approved - 2024-01-01",
    ],
    documents: [
      {
        id: "DOC-001",
        type: "Government ID",
        status: "approved",
        uploadDate: "2024-01-01T00:00:00Z",
      },
      {
        id: "DOC-002",
        type: "Proof of Address",
        status: "approved",
        uploadDate: "2024-01-01T00:00:00Z",
      },
      {
        id: "DOC-003",
        type: "Bank Statement",
        status: "pending",
        uploadDate: "2024-01-14T00:00:00Z",
      },
    ],
  }

  // Mock transaction history
  const transferHistory: TransferRequest[] = [
    {
      id: "REQ-001",
      type: "crypto-to-fiat",
      amount: "500.00",
      currency: "USDT",
      status: "completed",
      createdAt: "2024-01-15T14:30:00Z",
      completedAt: "2024-01-15T15:45:00Z",
    },
    {
      id: "REQ-002",
      type: "fiat-to-crypto",
      amount: "1000.00",
      currency: "USDT",
      status: "pending",
      createdAt: "2024-01-15T12:15:00Z",
    },
    {
      id: "REQ-003",
      type: "crypto-to-fiat",
      amount: "250.00",
      currency: "USDT",
      status: "failed",
      createdAt: "2024-01-13T16:45:00Z",
    },
  ]

  const handleSuspend = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowSuspendDialog(false)
    // In real app, update customer status
  }

  const handleActivate = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowActivateDialog(false)
    // In real app, update customer status
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    setNewNote("")
    setShowNoteDialog(false)
    // In real app, add note to customer
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRequestStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-gray-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getRequestStatusColor = (status: string) => {
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
                <BreadcrumbLink href="/admin/customers">Customers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{customer.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-5xl">
        {/* Customer Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-lg">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{customer.name}</h1>
                  <p className="text-gray-600">{customer.email}</p>
                  <p className="text-sm text-gray-500">{customer.id}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    <Badge className={getVerificationColor(customer.verificationStatus)}>
                      {customer.verificationStatus}
                    </Badge>
                    <Badge className={getRiskColor(customer.riskLevel)}>Risk: {customer.riskLevel}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {customer.status === "active" ? (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setShowSuspendDialog(true)}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Suspend
                  </Button>
                ) : (
                  <Button className="bg-gray-900 hover:bg-gray-800" onClick={() => setShowActivateDialog(true)}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Transfer Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              {/* Account Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Account Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Requests</p>
                      <p className="text-2xl font-bold">{customer.totalRequests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Volume</p>
                      <p className="text-2xl font-bold">${customer.totalVolume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-lg font-semibold text-gray-800">{customer.completedRequests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-lg font-semibold text-yellow-600">{customer.pendingRequests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Failed</p>
                      <p className="text-lg font-semibold text-red-600">{customer.failedRequests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Amount</p>
                      <p className="text-lg font-semibold">${customer.averageRequestAmount}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600">Last Activity</p>
                    <p className="font-medium">{formatDate(customer.lastActivity)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Request History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transferHistory.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getRequestStatusIcon(request.status)}
                            <span className="font-medium">{request.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {request.type.replace("-", " to ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            ${request.amount} {request.currency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRequestStatusColor(request.status)}>{request.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{formatDate(request.createdAt)}</p>
                            {request.completedAt && (
                              <p className="text-xs text-gray-500">Completed: {formatDate(request.completedAt)}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/requests/${request.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  KYC Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          <p className="text-sm text-gray-500">Uploaded: {formatDate(doc.uploadDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getVerificationColor(doc.status)}>{doc.status}</Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Admin Notes & Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.notes.map((note, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm">{note}</p>
                    </div>
                  ))}
                  {customer.notes.length === 0 && <p className="text-gray-500 text-center py-8">No notes available</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Customer Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {customer.name}&apos;s account? This will prevent them from making new
              transfer requests.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suspending...
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Suspend Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Dialog */}
      <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Customer Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to activate {customer.name}&apos;s account? This will allow them to make transfer
              requests.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivateDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleActivate} disabled={isProcessing} className="bg-gray-900 hover:bg-gray-800">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activate Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin Note</DialogTitle>
            <DialogDescription>Add a note about {customer.name} for future reference.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Enter your note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={isProcessing || !newNote.trim()}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Note"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
