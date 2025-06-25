"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
} from "lucide-react"
import { format } from "date-fns"

export default function AuditPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<string>("all")

  const auditLogs = [
    {
      id: "AUD-001",
      timestamp: "2024-01-15 14:30:25",
      user: "admin@xfer.com",
      action: "transfer_approved",
      resource: "Transfer Request #TXN-2024-001234",
      details: "Approved transfer of $5,500 USDT",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0",
      severity: "medium",
      status: "success",
    },
    {
      id: "AUD-002",
      timestamp: "2024-01-15 14:25:12",
      user: "operator@xfer.com",
      action: "settings_modified",
      resource: "System Settings",
      details: "Updated transfer fee from 1.0% to 1.2%",
      ipAddress: "192.168.1.101",
      userAgent: "Firefox 121.0.0.0",
      severity: "high",
      status: "success",
    },
    {
      id: "AUD-003",
      timestamp: "2024-01-15 14:20:45",
      user: "admin@xfer.com",
      action: "user_created",
      resource: "User Account",
      details: "Created new admin user: manager@xfer.com",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0",
      severity: "high",
      status: "success",
    },
    {
      id: "AUD-004",
      timestamp: "2024-01-15 14:15:33",
      user: "system",
      action: "backup_completed",
      resource: "Database Backup",
      details: "Automated daily backup completed successfully",
      ipAddress: "127.0.0.1",
      userAgent: "System Process",
      severity: "low",
      status: "success",
    },
    {
      id: "AUD-005",
      timestamp: "2024-01-15 14:10:18",
      user: "operator@xfer.com",
      action: "login_failed",
      resource: "Authentication",
      details: "Failed login attempt - invalid password",
      ipAddress: "192.168.1.102",
      userAgent: "Chrome 120.0.0.0",
      severity: "medium",
      status: "failed",
    },
    {
      id: "AUD-006",
      timestamp: "2024-01-15 14:05:07",
      user: "admin@xfer.com",
      action: "wallet_modified",
      resource: "Crypto Wallet",
      details: "Updated primary USDT wallet address",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0",
      severity: "high",
      status: "success",
    },
  ]

  const actionTypes = [
    { value: "all", label: "All Actions" },
    { value: "transfer_approved", label: "Transfer Approved" },
    { value: "transfer_rejected", label: "Transfer Rejected" },
    { value: "settings_modified", label: "Settings Modified" },
    { value: "user_created", label: "User Created" },
    { value: "user_modified", label: "User Modified" },
    { value: "login_success", label: "Login Success" },
    { value: "login_failed", label: "Login Failed" },
    { value: "wallet_modified", label: "Wallet Modified" },
    { value: "backup_completed", label: "Backup Completed" },
  ]

  const users = [
    { value: "all", label: "All Users" },
    { value: "admin@xfer.com", label: "Admin User" },
    { value: "operator@xfer.com", label: "Operator" },
    { value: "manager@xfer.com", label: "Manager" },
    { value: "system", label: "System" },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case "transfer_approved":
      case "transfer_rejected":
        return <CreditCard className="w-4 h-4" />
      case "settings_modified":
        return <Settings className="w-4 h-4" />
      case "user_created":
      case "user_modified":
        return <User className="w-4 h-4" />
      case "login_success":
      case "login_failed":
        return <Shield className="w-4 h-4" />
      case "wallet_modified":
        return <Database className="w-4 h-4" />
      case "backup_completed":
        return <FileText className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">Complete audit trail of all system activities and user actions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">5 require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+2</span> from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 admin sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Audit Logs</CardTitle>
          <CardDescription>Filter and search through audit log entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-8" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.value} value={user.value}>
                      {user.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>Detailed log of all system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm capitalize">{log.action.replace("_", " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{log.resource}</TableCell>
                  <TableCell className="max-w-sm truncate">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
