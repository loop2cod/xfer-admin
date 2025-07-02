"use client"

import { useState, useEffect } from "react"
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
  AlertTriangle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import { apiClient } from "@/lib/api"

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  is_active: boolean
  kyc_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  last_login?: string
  country?: string
  date_of_birth?: string
  address?: string
  // Computed fields
  name?: string
  status?: "active" | "suspended"
  joinDate?: string
  lastActivity?: string
  totalRequests?: number
  totalVolume?: number
  completedRequests?: number
  pendingRequests?: number
  failedRequests?: number
  riskLevel?: "low" | "medium" | "high"
  avatar?: string
}

function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterVerification, setFilterVerification] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    loadCustomers()
  }, [currentPage, searchTerm, filterStatus, filterVerification])

  const loadCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== "all" && { is_active: filterStatus === "active" }),
        ...(filterVerification !== "all" && { kyc_status: filterVerification }),
      }

      const response = await apiClient.getAllUsers(params)

      if (response.success && response.data) {
        // Transform API data to match our interface
        const transformedCustomers = response.data.users.map((user: any) => ({
          ...user,
          name: `${user.first_name} ${user.last_name}`,
          status: user.is_active ? "active" : "suspended",
          joinDate: user.created_at,
          lastActivity: user.last_login || user.updated_at,
          // These would come from additional API calls or be included in the response
          totalRequests: 0,
          totalVolume: 0,
          completedRequests: 0,
          pendingRequests: 0,
          failedRequests: 0,
          riskLevel: "low" as const
        }))

        setCustomers(transformedCustomers)
        setTotalCount(response.data.total_count)
        setTotalPages(response.data.total_pages)
      } else {
        setError(response.error || 'Failed to load customers')
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const customerName = customer.name || `${customer.first_name} ${customer.last_name}`
    const matchesSearch =
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const customerStatus = customer.status || (customer.is_active ? "active" : "suspended")
    const matchesStatus = filterStatus === "all" || customerStatus === filterStatus

    const matchesVerification = filterVerification === "all" || customer.kyc_status === filterVerification

    return matchesSearch && matchesStatus && matchesVerification
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadCustomers()
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
                {filteredCustomers.map((customer) => {
                  const customerName = customer.name || `${customer.first_name} ${customer.last_name}`
                  const customerStatus = customer.status || (customer.is_active ? "active" : "suspended")
                  const customerRisk = customer.riskLevel || "low"
                  const joinDate = customer.joinDate || customer.created_at

                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customerName} />
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {customerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customerName}</p>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                            <p className="text-xs text-gray-400">{customer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customerStatus)}>{customerStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(customerRisk)}>{customerRisk}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{customer.totalRequests || 0} total</p>
                          <p className="text-gray-500">
                            {customer.completedRequests || 0} completed, {customer.pendingRequests || 0} pending
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">${(customer.totalVolume || 0).toLocaleString()}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{new Date(joinDate).toLocaleDateString()}</p>
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
                  )
                })}
              </TableBody>
            </Table>

            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Loading customers...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading customers</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={loadCustomers} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} customers
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
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