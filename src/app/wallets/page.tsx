"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Wallet,
  Building2,
  Copy,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react"

export default function WalletsPage() {
  // const [showPrivateKeys, setShowPrivateKeys] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(type)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const wallets = [
    {
      id: 1,
      name: "USDT Wallet 1",
      address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
      status: "active",
      network: "Tron (TRC20)",
    },
    {
      id: 2,
      name: "USDT Wallet 2",
      address: "TLsV52sRDL79HXGGm9yzwDeznWenhQAA6H",
      status: "inactive",
      network: "Tron (TRC20)",
    },
    {
      id: 3,
      name: "USDT Wallet 3",
      address: "TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9",
      status: "inactive",
      network: "Tron (TRC20)",
    },
  ]

  const bankAccounts = [
    {
      id: 1,
      name: "Account 1",
      bank: "Chase Bank",
      accountNumber: "****1234",
      routingNumber: "021000021",
      status: "active",
      type: "Checking",
    },
    {
      id: 2,
      name: "Account 2",
      bank: "Bank of America",
      accountNumber: "****5678",
      routingNumber: "026009593",
      status: "inactive",
      type: "Business Savings",
    },
    {
      id: 3,
      name: "Account 3",
      bank: "Wells Fargo",
      accountNumber: "****9012",
      routingNumber: "121000248",
      status: "inactive",
      type: "Checking",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallets & Bank Accounts</h2>
          <p className="text-muted-foreground">Manage crypto wallets and bank account configurations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet
          </Button>
          <Button className="bg-gray-900 hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Add Bank Account
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crypto Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$171,077.50</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fiat Balance</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$66,431.50</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 inactive wallet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,580</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.3%</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="wallets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallets">Crypto Wallets</TabsTrigger>
          <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Crypto Wallets
              </CardTitle>
              <CardDescription>Manage USDT wallet addresses and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(wallet.address, `wallet-${wallet.id}`)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          {copiedAddress === `wallet-${wallet.id}` && (
                            <span className="text-xs text-green-600">Copied!</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{wallet.network}</TableCell>
                      <TableCell>
                        <Badge
                          variant={wallet.status === "active" ? "default" : "secondary"}
                          className={wallet.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {wallet.status === "active" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {wallet.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Bank Accounts
              </CardTitle>
              <CardDescription>Manage bank account details for fiat transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.bank}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{account.accountNumber}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(account.accountNumber, `bank-${account.id}`)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          {copiedAddress === `bank-${account.id}` && (
                            <span className="text-xs text-green-600">Copied!</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={account.status === "active" ? "default" : "secondary"}
                          className={account.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {account.status === "active" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
