"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Loader2, 
  AlertTriangle, 
  FileText,
  ExternalLink,
  Clock,
  User,
  Settings,
  Shield,
  CreditCard,
  Database
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

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
  admin_name?: string
  // New enhanced fields
  type: string
  activity_description: string
  created_by: string
  reference_link?: string
  admin?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

interface AuditLogTableProps {
  logs: AuditLog[]
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onRefresh: () => Promise<void>
  onPageChange: (page: number) => void
  onSearch: (searchTerm: string) => void
  onFilterChange: (filterType: string, filterValue: string) => void
  title?: string
  description?: string
  showFilters?: boolean
}

export default function AuditLogTable({
  logs,
  isLoading,
  error,
  totalCount,
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onRefresh,
  onPageChange,
  onSearch,
  onFilterChange,
  title = "Audit Logs",
  description = "Track admin activities and system events",
  showFilters = true,
}: AuditLogTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  const handleFilterChange = (value: string) => {
    setFilterType(value)
    onFilterChange("type", value)
  }

  const getTypeIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      "Authentication": Shield,
      "User Management": User,
      "Transfer Management": CreditCard,
      "Admin Management": Settings,
      "System Settings": Settings,
      "Reports & Analytics": FileText,
      "Wallet Management": Database,
      "Bank Account Management": Database,
    }
    const IconComponent = iconMap[type] || FileText
    return <IconComponent className="w-4 h-4" />
  }

  const getTypeBadgeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      "Authentication": "bg-blue-100 text-blue-800 border-blue-200",
      "User Management": "bg-green-100 text-green-800 border-green-200",
      "Transfer Management": "bg-purple-100 text-purple-800 border-purple-200",
      "Admin Management": "bg-red-100 text-red-800 border-red-200",
      "System Settings": "bg-orange-100 text-orange-800 border-orange-200",
      "Reports & Analytics": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Wallet Management": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Bank Account Management": "bg-teal-100 text-teal-800 border-teal-200",
    }
    return colorMap[type] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-gray-600 text-sm lg:text-base">{description}</p>
        </div>
        <div className="flex items-center space-x-2 w-full lg:w-auto justify-between lg:justify-normal">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {totalCount} Total
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading audit logs...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading audit logs</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Type</TableHead>
                    <TableHead className="min-w-[300px]">Activity Description</TableHead>
                    <TableHead className="min-w-[200px]">Created At & By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(log.type)}
                            <Badge className={`text-xs ${getTypeBadgeColor(log.type)}`} variant="outline">
                              {log.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{log.activity_description}</p>
                            {log.reference_link && (
                              <Link 
                                href={log.reference_link} 
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Details
                              </Link>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center space-x-1 mb-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(log.created_at)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>by {log.created_by}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages} ({totalCount} total logs)
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => hasPrev && onPageChange(currentPage - 1)}
                  className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i
                if (pageNum <= totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => onPageChange(pageNum)}
                        isActive={pageNum === currentPage}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => hasNext && onPageChange(currentPage + 1)}
                  className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
