"use client"

import { useState, useEffect } from "react"
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
import {
  CheckCircle,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  MessageSquare,
  FileText,
  Loader2,
  Eye,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import { apiClient, CustomerDetails, TransferRequest, UserNote } from "@/lib/api"
import { useToast } from "@/hooks/useToast"



function CustomerDetailsPage() {
  const {id} = useParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showActivateDialog, setShowActivateDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [transferHistory, setTransferHistory] = useState<TransferRequest[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadCustomerData()
    }
  }, [id])

  const loadCustomerData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load customer details
      const customerResponse = await apiClient.getUserById(id as string)
      if (customerResponse.success && customerResponse.data) {
        const userData = customerResponse.data
        
        // Transform user data to customer details format
        const customerDetails: CustomerDetails = {
          ...userData,
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email,
          status: userData.is_active ? "active" : "suspended",
          joinDate: userData.created_at,
          lastActivity: userData.last_login || userData.updated_at,
          verificationStatus: userData.kyc_status === 'approved' ? 'verified' : 
                             userData.kyc_status === 'rejected' ? 'rejected' : 'pending',
          riskLevel: "low", // Default risk level - could be calculated based on transfer history
          totalRequests: userData.total_transfers || 0,
          totalVolume: userData.total_volume || 0,
          completedRequests: userData.completed_transfers || 0,
          pendingRequests: userData.pending_transfers || 0,
          failedRequests: userData.failed_transfers || 0,
          averageRequestAmount: userData.total_volume && userData.total_transfers ? 
            userData.total_volume / userData.total_transfers : 0,
          lastRequestDate: undefined, // Will be set from transfer history
          notes: [], // Will be loaded separately
          documents: userData.verification_documents || [] // KYC documents from user data
        }
        
        setCustomer(customerDetails)
        
        // Load transfer history (don't fail if this fails)
        try {
          await loadTransferHistory(id as string)
        } catch (error) {
          console.error('Failed to load transfer history:', error)
        }
        
      } else {
        setError(customerResponse.error || 'Failed to load customer data')
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadTransferHistory = async (userId: string) => {
    try {
      const response = await apiClient.getUserTransfers(userId, { limit: 50 })
      if (response.success && response.data) {
        setTransferHistory(response.data.transfers)
        
        // Update last request date from transfer history
        const lastTransfer = response.data.transfers[0]
        if (lastTransfer) {
          setCustomer(prev => prev ? {
            ...prev,
            lastRequestDate: lastTransfer.created_at
          } : null)
        }
      }
    } catch (error) {
      console.error('Failed to load transfer history:', error)
    }
  }

  const handleSuspend = async () => {
    if (!customer) return
    
    setIsProcessing(true)
    try {
      const response = await apiClient.updateUserStatus(customer.id, false)
      if (response.success) {
        setCustomer(prev => prev ? { ...prev, status: "suspended", is_active: false } : null)
        toast({
          title: "Success",
          description: "Customer account has been suspended successfully.",
        })
        setShowSuspendDialog(false)
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to suspend customer account.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleActivate = async () => {
    if (!customer) return
    
    setIsProcessing(true)
    try {
      const response = await apiClient.updateUserStatus(customer.id, true)
      if (response.success) {
        setCustomer(prev => prev ? { ...prev, status: "active", is_active: true } : null)
        toast({
          title: "Success",
          description: "Customer account has been activated successfully.",
        })
        setShowActivateDialog(false)
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to activate customer account.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
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

  if (loading) {
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
                  <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Loading...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-5xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading customer details...</span>
          </div>
        </div>
      </>
    )
  }

  if (error || !customer) {
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
                  <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Error</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-5xl">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-12">
                <AlertTriangle className="w-8 h-8 text-red-500 mr-2" />
                <div>
                  <h3 className="text-lg font-semibold">Error Loading Customer</h3>
                  <p className="text-gray-600">{error || 'Customer not found'}</p>
                  <Button 
                    onClick={() => loadCustomerData()} 
                    className="mt-4"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{customer.customer_id || customer.id}</BreadcrumbPage>
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
                  <p className="text-sm text-gray-500">{customer.customer_id}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
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
                    {transferHistory.length > 0 ? (
                      transferHistory.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getRequestStatusIcon(request.status)}
                              <span className="font-medium">{request.transfer_id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {(request.type_ || request.transfer_type || 'crypto-to-fiat').replace("-", " to ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              ${(Number(request.amount || 0)).toFixed(2)} {request.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRequestStatusColor(request.status)}>{request.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{formatDate(request.created_at)}</p>
                              {request.completed_at && (
                                <p className="text-xs text-gray-500">Completed: {formatDate(request.completed_at)}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link href={`/requests/details/${request.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No transfer requests found
                        </TableCell>
                      </TableRow>
                    )}
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
                  {customer.documents && customer.documents.length > 0 ? (
                    customer.documents.map((doc, index) => (
                      <div key={doc.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{doc.type || 'Document'}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded: {doc.uploadDate ? formatDate(doc.uploadDate) : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getVerificationColor(doc.status || 'pending')}>{doc.status || 'pending'}</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No KYC documents uploaded yet</p>
                    </div>
                  )}
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
    </>
  )
}

export default function CustomerDetailsPageWrapper() {
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      <CustomerDetailsPage />
    </ProtectedRoute>
  )
}