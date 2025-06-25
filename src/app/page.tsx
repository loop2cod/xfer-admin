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
import { DollarSign, TrendingUp, Users, Clock, CheckCircle, AlertTriangle,ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
    const router = useRouter();
    const stats = {
    totalRevenue: 12450.5,
    totalRequests: 1234,
    pendingRequests: 12,
    activeCustomers: 456,
    todayRevenue: 850.25,
    todayRequests: 45,
  }

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
      customer: "John Doe",
      type: "crypto-to-fiat",
      amount: "500.00",
      status: "pending",
      date: "2024-01-15T14:30:00Z",
    },
      {
      id: "REQ-004",
      customer: "John Doe",
      type: "crypto-to-fiat",
      amount: "500.00",
      status: "pending",
      date: "2024-01-15T14:30:00Z",
    },
  ]

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
              <CardTitle className="text-sm md:text-xl font-medium md:font-semibold">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-primary">+${stats.todayRevenue} from today</p>
            </CardContent>
          </Card>

          {/* Transactions Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-xl font-medium md:font-semibold">Total Requests</CardTitle>
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-primary">+{stats.todayRequests} today</p>
            </CardContent>
          </Card>

          {/* Active Customers Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-xl font-medium md:font-semibold">Active Customers</CardTitle>
              <Users className="h-4 w-4 md:h-6 md:w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCustomers}</div>
              <p className="text-xs text-primary">Registered users</p>
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
                  <Button 
                    onClick={() => router.push("/requests/pending")} 
                    className="w-full bg-gray-900 hover:bg-gray-800 relative z-10 cursor-pointer"
                  >
                    View All Pending Requests
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
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
                <Button className="w-full gap-2 flex cursor-pointer">
                  <Clock className="w-4 h-4 md:w-6 h-6" />
                  <span className="text-xs md:text-sm">Process Pending</span>
                </Button>
                <Button className="w-full gap-2 flex cursor-pointer">
                  <Users className="w-4 h-4 md:w-6 h-6" />
                  <span className="text-xs md:text-sm">Manage Customers</span>
                </Button>
                <Button className="w-full gap-2 flex cursor-pointer">
                  <DollarSign className="w-4 h-4 md:w-6 h-6" />
                  <span className="text-xs md:text-sm">Financial Reports</span>
                </Button>
                <Button className="w-full gap-2 flex cursor-pointer">
                  <TrendingUp className="w-4 h-4 md:w-6 h-6" />
                  <span className="text-xs md:text-sm">System Settings</span>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
