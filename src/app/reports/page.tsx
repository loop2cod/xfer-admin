"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, CreditCard, BarChart3, Download, RefreshCw, ArrowUpRight } from "lucide-react"

// Mock chart component - in real app, use recharts or similar
function SimpleChart({ data, type = "line" }: { data: any[]; type?: "line" | "bar" | "pie" }) {
  return (
    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">{type.charAt(0).toUpperCase() + type.slice(1)} Chart</p>
        <p className="text-xs text-gray-400">{data.length} data points</p>
      </div>
    </div>
  )
}

export default function FinancialReportsPage() {
  // const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //   from: addDays(new Date(), -30),
  //   to: new Date(),
  // })
  const [timeframe, setTimeframe] = useState("30d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock financial data
  const financialMetrics = {
    totalRevenue: 125450.75,
    totalVolume: 2508915.0,
    totalFees: 25089.15,
    netProfit: 100361.6,
    totalRequests: 1247,
    averageRequestSize: 2012.45,
    conversionRate: 96.2,
    customerGrowth: 12.5,
    revenueGrowth: 8.3,
    volumeGrowth: 15.7,
    feeGrowth: 8.3,
  }

  const revenueData = [
    { date: "2024-01-01", revenue: 4500, volume: 90000, fees: 900 },
    { date: "2024-01-02", revenue: 5200, volume: 104000, fees: 1040 },
    { date: "2024-01-03", revenue: 4800, volume: 96000, fees: 960 },
    { date: "2024-01-04", revenue: 6100, volume: 122000, fees: 1220 },
    { date: "2024-01-05", revenue: 5500, volume: 110000, fees: 1100 },
  ]

  const requestTypeData = [
    { type: "Crypto to Fiat", count: 742, percentage: 59.5, revenue: 74200 },
    { type: "Fiat to Crypto", count: 505, percentage: 40.5, revenue: 51250 },
  ]

  const topCustomers = [
    { id: "CUST-001", name: "John Doe", volume: 45000, requests: 23, revenue: 450 },
    { id: "CUST-005", name: "David Brown", volume: 38500, requests: 19, revenue: 385 },
    { id: "CUST-002", name: "Jane Smith", volume: 32000, requests: 16, revenue: 320 },
    { id: "CUST-008", name: "Lisa Wilson", volume: 28500, requests: 14, revenue: 285 },
    { id: "CUST-012", name: "Mark Johnson", volume: 25000, requests: 12, revenue: 250 },
  ]

  const monthlyTrends = [
    { month: "Oct 2023", revenue: 85000, volume: 1700000, customers: 156 },
    { month: "Nov 2023", revenue: 92000, volume: 1840000, customers: 168 },
    { month: "Dec 2023", revenue: 108000, volume: 2160000, customers: 184 },
    { month: "Jan 2024", revenue: 125450, volume: 2508915, customers: 203 },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
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
              <BreadcrumbItem>
                <BreadcrumbPage>Financial Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Financial Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive financial insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            {/* <DatePickerWithRange date={dateRange} onDateChange={setDateRange} /> */}
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

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(financialMetrics.totalRevenue)}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">{formatPercentage(financialMetrics.revenueGrowth)}</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold">{formatCurrency(financialMetrics.totalVolume)}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">{formatPercentage(financialMetrics.volumeGrowth)}</span>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold">{financialMetrics.totalRequests.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">{formatPercentage(financialMetrics.customerGrowth)}</span>
                  </div>
                </div>
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">{financialMetrics.conversionRate}%</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+2.1%</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Fees Collected</span>
                      <span className="font-semibold">{formatCurrency(financialMetrics.totalFees)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Processing Costs</span>
                      <span className="font-semibold">{formatCurrency(25089.15)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Net Profit</span>
                      <span className="font-bold text-lg">{formatCurrency(financialMetrics.netProfit)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profit Margin</span>
                      <Badge className="bg-green-100 text-green-800">
                        {((financialMetrics.netProfit / financialMetrics.totalRevenue) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Request Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requestTypeData.map((item) => (
                      <div key={item.type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.type}</span>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gray-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{item.count} requests</span>
                          <span>{formatCurrency(item.revenue)} revenue</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleChart data={revenueData} type="line" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Daily Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleChart data={revenueData} type="bar" />
                </CardContent>
              </Card>

              {/* Revenue Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Transfer Fees (1%)</p>
                        <p className="text-sm text-gray-600">Primary revenue source</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(financialMetrics.totalFees)}</p>
                        <p className="text-sm text-gray-600">100% of revenue</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">
                          {formatCurrency(financialMetrics.averageRequestSize)}
                        </p>
                        <p className="text-sm text-gray-600">Avg Request Size</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">
                          {formatCurrency(financialMetrics.totalFees / financialMetrics.totalRequests)}
                        </p>
                        <p className="text-sm text-gray-600">Avg Fee per Request</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-right p-2">Volume</th>
                        <th className="text-right p-2">Fees</th>
                        <th className="text-right p-2">Requests</th>
                        <th className="text-right p-2">Avg Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((day) => (
                        <tr key={day.date} className="border-b">
                          <td className="p-2">{new Date(day.date).toLocaleDateString()}</td>
                          <td className="text-right p-2 font-medium">{formatCurrency(day.volume)}</td>
                          <td className="text-right p-2 font-medium">{formatCurrency(day.fees)}</td>
                          <td className="text-right p-2">{Math.floor(day.volume / 2000)}</td>
                          <td className="text-right p-2">
                            {formatCurrency(day.volume / Math.floor(day.volume / 2000))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Top Customers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers by Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCustomers.map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-600">{customer.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(customer.volume)}</p>
                          <p className="text-sm text-gray-600">{customer.requests} requests</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">203</p>
                        <p className="text-sm text-gray-600">Total Customers</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">+19</p>
                        <p className="text-sm text-gray-600">New This Month</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Customers</span>
                        <span className="font-medium">187 (92.1%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Verified Customers</span>
                        <span className="font-medium">165 (81.3%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Requests per Customer</span>
                        <span className="font-medium">6.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Customer Lifetime Value</span>
                        <span className="font-medium">{formatCurrency(617.73)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleChart data={monthlyTrends} type="line" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Request Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">1,199</span>
                        <Badge className="bg-gray-100 text-gray-800">96.2%</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">35</span>
                        <Badge className="bg-yellow-100 text-yellow-800">2.8%</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Failed</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">13</span>
                        <Badge className="bg-red-100 text-red-800">1.0%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Times */}
              <Card>
                <CardHeader>
                  <CardTitle>Processing Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Processing</span>
                      <span className="font-medium">2.4 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fastest Processing</span>
                      <span className="font-medium">15 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SLA Compliance</span>
                      <Badge className="bg-green-100 text-green-800">98.5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Request Volume */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Daily Average</span>
                      <span className="font-medium">41.6</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Peak Day</span>
                      <span className="font-medium">67 requests</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Growth Rate</span>
                      <Badge className="bg-green-100 text-green-800">+12.5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Request Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Request Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleChart data={revenueData} type="bar" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Month</th>
                        <th className="text-right p-2">Revenue</th>
                        <th className="text-right p-2">Volume</th>
                        <th className="text-right p-2">Customers</th>
                        <th className="text-right p-2">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTrends.map((month, index) => {
                        const prevMonth = monthlyTrends[index - 1]
                        const growth = prevMonth ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue) * 100 : 0
                        return (
                          <tr key={month.month} className="border-b">
                            <td className="p-2 font-medium">{month.month}</td>
                            <td className="text-right p-2">{formatCurrency(month.revenue)}</td>
                            <td className="text-right p-2">{formatCurrency(month.volume)}</td>
                            <td className="text-right p-2">{month.customers}</td>
                            <td className="text-right p-2">
                              {index > 0 && (
                                <Badge
                                  className={
                                    growth > 0
                                      ? "bg-green-100 text-green-800"
                                      : growth < 0
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {formatPercentage(growth)}
                                </Badge>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Trend Analysis */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Revenue Growth</p>
                        <p className="text-sm text-green-600">Month over month</p>
                      </div>
                      <div className="flex items-center">
                        <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                        <span className="font-bold text-green-800">
                          {formatPercentage(financialMetrics.revenueGrowth)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Volume Growth</p>
                        <p className="text-sm text-blue-600">Month over month</p>
                      </div>
                      <div className="flex items-center">
                        <ArrowUpRight className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="font-bold text-blue-800">
                          {formatPercentage(financialMetrics.volumeGrowth)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-800">Customer Growth</p>
                        <p className="text-sm text-purple-600">Month over month</p>
                      </div>
                      <div className="flex items-center">
                        <ArrowUpRight className="w-4 h-4 text-purple-600 mr-1" />
                        <span className="font-bold text-purple-800">
                          {formatPercentage(financialMetrics.customerGrowth)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Forecasting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Next Month Projection</p>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(135000)}</p>
                      <p className="text-sm text-gray-600">Based on current growth rate</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Quarterly Target</p>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(400000)}</p>
                      <p className="text-sm text-gray-600">Q1 2024 goal</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Annual Projection</p>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(1600000)}</p>
                      <p className="text-sm text-gray-600">2024 forecast</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
