"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  RefreshCw,
  Filter,
  Activity,
  FileText,
  User,
  CalendarIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient, AuditLog } from "@/lib/api"
import ProtectedRoute from "@/components/ProtectedRoute"
import AuditLogTable from "@/components/AuditLogTable"

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



  const filteredLogs = logs.filter((log) => {
    const matchesSearch = searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.activity_description?.toLowerCase().includes(searchTerm.toLowerCase())

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
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <AuditLogTable
          logs={filteredLogs}
          isLoading={loading}
          error={error}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={currentPage < totalPages}
          hasPrev={currentPage > 1}
          onRefresh={loadAuditLogs}
          onPageChange={setCurrentPage}
          onSearch={(searchTerm) => {
            setSearchTerm(searchTerm)
            // Trigger search when called
            loadAuditLogs()
          }}
          onFilterChange={(filterType, filterValue) => {
            if (filterType === "type") {
              setSelectedResourceType(filterValue)
            }
            // Trigger filter when called
            loadAuditLogs()
          }}
          showFilters={false} // We're using the existing filters above
        />
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
