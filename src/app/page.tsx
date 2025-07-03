"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { DollarSign, TrendingUp, Users, Clock, CheckCircle, AlertTriangle, ArrowUpRight, Loader2, RefreshCw, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import apiClient, { DashboardStats, TransferRequest } from "@/lib/api"

function DashboardContent() {
  const router = useRouter();
  const { admin, hasPermission } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load dashboard stats and recent pending transfers in parallel
      const [statsResponse, transfersResponse] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getAllTransfers({
          status_filter: 'pending',
          limit: 4,
          skip: 0
        })
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        setError(statsResponse.error || 'Failed to load dashboard stats');
      }

      if (transfersResponse.success && transfersResponse.data) {
        // Transform the transfer data to match the expected format
        const transformedRequests = transfersResponse.data.transfers.map(transfer => ({
          id: transfer.id,
          transfer_id: transfer.transfer_id,
          customer: transfer.user ? `${transfer.user.first_name}` : 'Unknown User',
          type: transfer.type_,
          amount: transfer.amount.toString(),
          status: transfer.status,
          date: transfer.created_at,
        }));
        setRecentRequests(transformedRequests);
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
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


  return (
      <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <Button onClick={loadDashboardData} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-3 p-3 md:p-6 md:gap-6 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Revenue Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-xl font-medium md:font-semibold">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.transfers.total_volume.toLocaleString() || '0'}</div>
              <p className="text-xs text-primary">All completed transfers</p>
            </CardContent>
          </Card>

          {/* Transactions Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-xl font-medium md:font-semibold">Total Requests</CardTitle>
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.transfers.total.toLocaleString() || '0'}</div>
              <p className="text-xs text-primary">+{stats?.recent_activity.transfers_24h || 0} in 24h</p>
            </CardContent>
          </Card>

          {/* Active Customers Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-xl font-medium md:font-semibold">Active Users</CardTitle>
              <Users className="h-4 w-4 md:h-6 md:w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users.active || 0}</div>
              <p className="text-xs text-primary">+{stats?.recent_activity.new_users_24h || 0} new users</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid">
          {/* Pending Transactions Alert */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Transfer Requests</CardTitle>
                  <CardDescription>Transfer requests requiring your attention</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Container with fade-out effect */}
                <div className="space-y-4 relative">
                  {/* Show only up to 4 pending requests */}
                  {recentRequests
                    .filter((t) => t.status === "pending")
                    .slice(0, 4)
                    .map((transaction, index, array) => (
                      <div
                      onClick={() => router.push(`/requests/details/${transaction.id}`)}
                        key={transaction.id}
                        className={`flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer ${
                          index === array.length - 1 && array.length > 2 ? "opacity-80" : ""
                        } ${
                          index === array.length - 2 && array.length > 3 ? "opacity-90" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-medium text-gray-900">{transaction.transfer_id}</p>
                            <p className="text-sm text-gray-600">{transaction.customer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${Number(transaction.amount || 0).toFixed(2)}</p>
                          <p className="text-sm text-gray-600 capitalize">{transaction.type.replace("-", " to ")}</p>
                        </div>
                      </div>
                    ))}
                  
                  {/* Gradient overlay for fade effect */}
                  {recentRequests.filter(t => t.status === "pending").length > 2 && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>
                
                {/* Button positioned below the fade */}
                <div className="mt-4">
                  {hasPermission('can_approve_transfers') ? (
                    <Button 
                      onClick={() => router.push("/requests/pending")} 
                      className="w-full bg-gray-900 hover:bg-gray-800 relative z-10 cursor-pointer"
                    >
                      View All Pending Requests
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="w-full relative z-10"
                    >
                      View All Pending Requests (No Permission)
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hasPermission('can_approve_transfers') && (
                  <Button 
                    onClick={() => router.push('/requests/pending')}
                    className="w-full gap-2 flex cursor-pointer"
                  >
                    <Clock className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="text-xs md:text-sm">Process Pending</span>
                  </Button>
                )}
                {hasPermission('can_manage_users') && (
                  <Button 
                    onClick={() => router.push('/customers')}
                    className="w-full gap-2 flex cursor-pointer"
                  >
                    <Users className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="text-xs md:text-sm">Manage Customers</span>
                  </Button>
                )}
                {hasPermission('can_view_reports') && (
                  <Button 
                    onClick={() => router.push('/reports')}
                    className="w-full gap-2 flex cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="text-xs md:text-sm">Financial Reports</span>
                  </Button>
                )}
                {hasPermission('can_manage_system_settings') && (
                  <Button 
                    onClick={() => router.push('/audit')}
                    className="w-full gap-2 flex cursor-pointer"
                  >
                    <FileText className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="text-xs md:text-sm">Audit logs</span>
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
