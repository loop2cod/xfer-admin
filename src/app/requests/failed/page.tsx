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
import { AlertTriangle, Search, Filter, Eye, RefreshCw, RotateCcw } from "lucide-react"
import Link from "next/link"

interface FailedTransferRequest {
  id: string
  customer: {
    name: string
    email: string
    id: string
  }
  type: "crypto-to-fiat" | "fiat-to-crypto"
  amount: string
  fee: string
  currency: string
  status: "failed"
  createdAt: string
  failedAt: string
  failureReason: string
}

export default function FailedRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock failed requests data
  const failedRequests: FailedTransferRequest[] = [
    {
      id: "REQ-003",
      customer: { name: "Mike Johnson", email: "mike@example.com", id: "CUST-003" },
      type: "crypto-to-fiat",
      amount: "250.00",
      fee: "2.50",
      currency: "USDT",
      status: "failed",
      createdAt: "2024-01-15T10:45:00Z",
      failedAt: "2024-01-15T11:30:00Z",
      failureReason: "Invalid bank account details",
    },
    {
      id: "REQ-007",
      customer: { name: "Alice Cooper", email: "alice@example.com", id: "CUST-007" },
      type: "fiat-to-crypto",
      amount: "500.00",
      fee: "5.00",
      currency: "USDT",
      status: "failed",
      createdAt: "2024-01-14T14:20:00Z",
      failedAt: "2024-01-14T15:45:00Z",
      failureReason: "Payment verification failed",
    },
    {
      id: "REQ-012",
      customer: { name: "Bob Wilson", email: "bob@example.com", id: "CUST-012" },
      type: "crypto-to-fiat",
      amount: "1000.00",
      fee: "10.00",
      currency: "USDT",
      status: "failed",
      createdAt: "2024-01-13T09:15:00Z",
      failedAt: "2024-01-13T10:30:00Z",
      failureReason: "Insufficient crypto balance",
    },
  ]

  const filteredRequests = failedRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || request.type === filterType

    return matchesSearch && matchesType
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
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
                <BreadcrumbLink href="/admin/requests">Transfer Requests</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Failed Requests</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Failed Transfer Requests</h1>
            <p className="text-gray-600">Review and manage failed transfer requests</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {filteredRequests.length} Failed
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Failed Requests Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Failed Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
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
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(request.failedAt)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-red-600 max-w-xs truncate" title={request.failureReason}>
                        {request.failureReason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`/admin/requests/${request.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Retry
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No failed requests found</h3>
                <p className="text-gray-500">All transfer requests have been processed successfully.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
