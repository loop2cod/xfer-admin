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
import { DollarSign, TrendingUp, Users, Clock, CheckCircle, AlertTriangle, ArrowUpRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import apiClient, { DashboardStats } from "@/lib/api"

function DashboardContent() {
  const router = useRouter();
  const { admin, hasPermission } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getDashboardStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to load dashboard stats');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Mock recent requests - in real app this would come from API
  const recentRequests = [
    {
      id: "REQ-001",
      customer: "John Doe",
      type: "crypto-to-fiat",
      amount: "500.00",
      status: "pending",
      date: "2024-01-15T14:30:00Z",
    },
    {
      id: "REQ-005",
      customer: "Jane Smith",
      type: "fiat-to-crypto",
      amount: "750.00",
      status: "pending",
      date: "2024-01-15T14:30:00Z",
    },
    {
      id: "REQ-004",
      customer: "Bob Wilson",
      type: "crypto-to-crypto",
      amount: "1200.00",
      status: "pending",
      date: "2024-01-15T14:30:00Z",
    },
  ];

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDashboardStats}>
            Try Again
          </Button>
        </div>
      </div>
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
        <div className="flex items-center gap-2 px-4">
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
                        key={transaction.id}
                        className={`flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 ${
                          index === array.length - 1 && array.length > 2 ? "opacity-80" : ""
                        } ${
                          index === array.length - 2 && array.length > 3 ? "opacity-90" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-medium text-gray-900">{transaction.id}</p>
                            <p className="text-sm text-gray-600">{transaction.customer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${transaction.amount}</p>
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
                    <Clock className="w-4 h-4 md:w-6 h-6" />
                    <span className="text-xs md:text-sm">Process Pending</span>
                  </Button>
                )}
                {hasPermission('can_manage_users') && (
                  <Button 
                    onClick={() => router.push('/customers')}
                    className="w-full gap-2 flex cursor-pointer"
                  >
                    <Users className="w-4 h-4 md:w-6 h-6" />
                    <span className="text-xs md:text-sm">Manage Customers</span>
                  </Button>
                )}
                {hasPermission('can_view_reports') && (
                  <Button 
                    onClick={() => router.push('/reports')}
                    className="w-full gap-2 flex cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4 md:w-6 h-6" />
                    <span className="text-xs md:text-sm">Financial Reports</span>
                  </Button>
                )}
                {hasPermission('can_manage_system_settings') && (
                  <Button 
                    onClick={() => router.push('/settings')}
                    className="w-full gap-2 flex cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 md:w-6 h-6" />
                    <span className="text-xs md:text-sm">System Settings</span>
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
