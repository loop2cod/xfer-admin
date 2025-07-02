"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
  Search,
  Download,
  CalendarIcon,
  User,
  Settings,
  Shield,
  CreditCard,
  Database,
  FileText,
  Clock,
  AlertTriangle,
  RefreshCw,
  Filter,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import ProtectedRoute from "@/components/ProtectedRoute"

interface AuditLog {
  id: string
  admin_id: string
  action: string
  resource_type: string
  resource_id?: string
  details?: any
  ip_address?: string
  user_agent?: string
  created_at: string
  admin?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

interface AuditStats {
  total_logs: number
  unique_admins: number
  actions_today: number
  most_common_action: string
}

function AuditPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [selectedResourceType, setSelectedResourceType] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 20

  useEffect(() => {
    loadAuditLogs()
    loadAuditStats()
  }, [currentPage, selectedAction, selectedResourceType])

  const loadAuditLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      }

      if (selectedAction !== "all") {
        params.action = selectedAction
      }
      if (selectedResourceType !== "all") {
        params.resource_type = selectedResourceType
      }

      const response = await apiClient.getAuditLogs(params)

      if (response.success && response.data) {
        setLogs(response.data.logs)
        setTotalCount(response.data.total)
        setTotalPages(Math.ceil(response.data.total / itemsPerPage))
      } else {
        setError(response.error || 'Failed to load audit logs')
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadAuditStats = async () => {
    try {
      const response = await apiClient.getAuditStats()

      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to load audit stats:', error)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadAuditLogs()
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return "bg-green-100 text-green-800"
      case 'update':
        return "bg-blue-100 text-blue-800"
      case 'delete':
        return "bg-red-100 text-red-800"
      case 'approve':
        return "bg-purple-100 text-purple-800"
      case 'reject':
        return "bg-orange-100 text-orange-800"
      case 'login':
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getResourceTypeColor = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case 'transfer_request':
        return "bg-blue-100 text-blue-800"
      case 'user':
        return "bg-green-100 text-green-800"
      case 'admin':
        return "bg-purple-100 text-purple-800"
      case 'wallet':
        return "bg-yellow-100 text-yellow-800"
      case 'system_settings':
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDetails = (details: any) => {
    if (!details) return "No details"
    if (typeof details === 'string') return details
    return JSON.stringify(details, null, 2)
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Audit Logs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">
              Track admin activities and system events
            </p>
          </div>
          <Button onClick={loadAuditLogs} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_logs.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unique_admins}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actions Today</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.actions_today}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Common</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{stats.most_common_action}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by action, resource, or admin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="transfer_request">Transfer Request</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="system_settings">System Settings</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Loading audit logs...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading audit logs</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={loadAuditLogs} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {new Date(log.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {log.admin ? `${log.admin.first_name} ${log.admin.last_name}` : 'Unknown'}
                            </p>
                            <p className="text-gray-500">{log.admin?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <Badge className={getResourceTypeColor(log.resource_type)} variant="outline">
                              {log.resource_type}
                            </Badge>
                            {log.resource_id && (
                              <p className="text-gray-500 mt-1">ID: {log.resource_id}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs">
                            <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded">
                              {formatDetails(log.details)}
                            </pre>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-mono">{log.ip_address || 'N/A'}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t">
                    <div className="text-sm text-gray-500">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} logs
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
              </>
            )}

            {!loading && !error && filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
                <p className="text-gray-500">No logs match your current search and filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
)}

export default function AuditPageWrapper() {
  return (
    <ProtectedRoute>
      <AuditPage />
    </ProtectedRoute>
  )
}
