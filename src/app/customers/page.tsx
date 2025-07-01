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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Download,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  status: "active" | "suspended"
  joinDate: string
  lastActivity: string
  totalRequests: number
  totalVolume: number
  completedRequests: number
  pendingRequests: number
  failedRequests: number
  riskLevel: "low" | "medium" | "high"
  country?: string
  avatar?: string
}

function CustomersPage() {
    const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterVerification, setFilterVerification] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock customers data
  const customers: Customer[] = [
    {
      id: "CUST-001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0123",
      status: "active",
      joinDate: "2024-01-01T00:00:00Z",
      lastActivity: "2024-01-15T14:30:00Z",
      totalRequests: 15,
      totalVolume: 7500.0,
      completedRequests: 12,
      pendingRequests: 2,
      failedRequests: 1,
      riskLevel: "low",
      country: "United States",
    },
    {
      id: "CUST-002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1-555-0124",
      status: "active",
      joinDate: "2024-01-05T00:00:00Z",
      lastActivity: "2024-01-15T12:15:00Z",
      totalRequests: 8,
      totalVolume: 4200.0,
      completedRequests: 7,
      pendingRequests: 1,
      failedRequests: 0,
      riskLevel: "low",
      country: "Canada",
    },
    {
      id: "CUST-003",
      name: "Mike Johnson",
      email: "mike@example.com",
      status: "suspended",
      joinDate: "2024-01-10T00:00:00Z",
      lastActivity: "2024-01-13T16:45:00Z",
      totalRequests: 3,
      totalVolume: 1250.0,
      completedRequests: 1,
      pendingRequests: 0,
      failedRequests: 2,
      riskLevel: "high",
      country: "United Kingdom",
    },
    {
      id: "CUST-004",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1-555-0126",
      status: "active",
      joinDate: "2024-01-14T00:00:00Z",
      lastActivity: "2024-01-14T16:20:00Z",
      totalRequests: 1,
      totalVolume: 750.0,
      completedRequests: 1,
      pendingRequests: 0,
      failedRequests: 0,
      riskLevel: "medium",
      country: "Australia",
    },
    {
      id: "CUST-005",
      name: "David Brown",
      email: "david@example.com",
      phone: "+1-555-0127",
      status: "active",
      joinDate: "2024-01-12T00:00:00Z",
      lastActivity: "2024-01-14T09:10:00Z",
      totalRequests: 5,
      totalVolume: 3750.0,
      completedRequests: 5,
      pendingRequests: 0,
      failedRequests: 0,
      riskLevel: "low",
      country: "Germany",
    },
  ]

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || customer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    suspended: customers.filter((c) => c.status === "suspended").length,
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
              <BreadcrumbItem>
                <BreadcrumbPage>Customers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
            <p className="text-gray-600">Manage customer accounts and verification status</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-800">{stats.active}</div>
              <p className="text-sm text-gray-600">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
              <p className="text-sm text-gray-600">Suspended</p>
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
                    placeholder="Search by customer ID, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterVerification} onValueChange={setFilterVerification}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verification</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                          <AvatarFallback className="bg-gray-100 text-gray-600">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                          <p className="text-xs text-gray-400">{customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(customer.riskLevel)}>{customer.riskLevel}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{customer.totalRequests} total</p>
                        <p className="text-gray-500">
                          {customer.completedRequests} completed, {customer.pendingRequests} pending
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">${customer.totalVolume.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(customer.joinDate)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                          <Button onClick={() => {
                            router.push(`/customers/details/${customer.id}`)
                          }} variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Call Customer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {customer.status === "active" ? (
                              <DropdownMenuItem className="text-red-600">
                                <UserX className="w-4 h-4 mr-2" />
                                Suspend Account
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function CustomersListPage() {
  return (
    <ProtectedRoute>
      <CustomersPage />
    </ProtectedRoute>
  )
}