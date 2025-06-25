"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { CheckCircle, Clock, AlertTriangle, Search, Filter, Eye, RefreshCw, Download } from "lucide-react"
import { useRouter } from "next/navigation"

interface TransferRequest {
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
  status: "pending" | "completed" | "failed"
  createdAt: string
  completedAt?: string
}

export default function AllRequestsPage() {
    const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock transactions data
  const requests: TransferRequest[] = [
    {
      id: "REQ-001",
      customer: { name: "John Doe", email: "john@example.com", id: "CUST-001" },
      type: "crypto-to-fiat",
      amount: "500.00",
      fee: "5.00",
      netAmount: "495.00",
      currency: "USDT",
      status: "completed",
      createdAt: "2024-01-15T14:30:00Z",
      completedAt: "2024-01-15T15:45:00Z",
    },
    {
      id: "REQ-002",
      customer: { name: "Jane Smith", email: "jane@example.com", id: "CUST-002" },
      type: "fiat-to-crypto",
      amount: "1000.00",
      fee: "10.00",
      netAmount: "990.00",
      currency: "USDT",
      status: "pending",
      createdAt: "2024-01-15T12:15:00Z",
    },
    {
      id: "REQ-003",
      customer: { name: "Mike Johnson", email: "mike@example.com", id: "CUST-003" },
      type: "crypto-to-fiat",
      amount: "250.00",
      fee: "2.50",
      netAmount: "247.50",
      currency: "USDT",
      status: "failed",
      createdAt: "2024-01-15T10:45:00Z",
    },
    {
      id: "REQ-004",
      customer: { name: "Sarah Wilson", email: "sarah@example.com", id: "CUST-004" },
      type: "fiat-to-crypto",
      amount: "750.00",
      fee: "7.50",
      netAmount: "742.50",
      currency: "USDT",
      status: "completed",
      createdAt: "2024-01-14T16:20:00Z",
      completedAt: "2024-01-14T17:30:00Z",
    },
    {
      id: "REQ-005",
      customer: { name: "David Brown", email: "david@example.com", id: "CUST-005" },
      type: "crypto-to-fiat",
      amount: "1500.00",
      fee: "15.00",
      netAmount: "1485.00",
      currency: "USDT",
      status: "completed",
      createdAt: "2024-01-14T09:10:00Z",
      completedAt: "2024-01-14T10:25:00Z",
    },
  ]

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || request.type === filterType
    const matchesStatus = filterStatus === "all" || request.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getStatusIcon = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = {
    total: requests.length,
    completed: requests.filter((r) => r.status === "completed").length,
    pending: requests.filter((r) => r.status === "pending").length,
    failed: requests.filter((r) => r.status === "failed").length,
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
              <BreadcrumbItem>
                <BreadcrumbPage>All Transfer Requests</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Transfer Requests</h1>
            <p className="text-gray-600">Complete transfer request history and management</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-800">{stats.completed}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <p className="text-sm text-gray-600">Failed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
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
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
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
                        <Button onClick={() => router.push(`/requests/details/${request.id}`)} variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transfer requests found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
