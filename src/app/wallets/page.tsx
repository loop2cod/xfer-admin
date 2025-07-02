"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  Star,
  StarOff,
  Percent,
  Loader2,
  Dot,
  DotIcon,
  DotSquare
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import ProtectedRoute from "@/components/ProtectedRoute"
import { 
  apiClient,
  AdminWallet,
  AdminBankAccount,
  AdminWalletCreateRequest,
  AdminWalletUpdateRequest,
  AdminBankAccountCreateRequest,
  AdminBankAccountUpdateRequest
} from "@/lib/api"

function WalletsPage() {
  const { toast } = useToast()
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [wallets, setWallets] = useState<AdminWallet[]>([])
  const [bankAccounts, setBankAccounts] = useState<AdminBankAccount[]>([])
  
  // Dialog states
  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [bankDialogOpen, setBankDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentWallet, setCurrentWallet] = useState<AdminWallet | null>(null)
  const [currentBankAccount, setCurrentBankAccount] = useState<AdminBankAccount | null>(null)
  
  // Form states
  const [walletForm, setWalletForm] = useState<AdminWalletCreateRequest>({
    name: "",
    address: "",
    currency: "USDT",
    network: "TRC20",
    fee_percentage: 0,
    is_active: true,
    notes: ""
  })
  
  const [bankForm, setBankForm] = useState<AdminBankAccountCreateRequest>({
    name: "",
    bank_name: "",
    account_number: "",
    routing_number: "",
    account_type: "Checking",
    fee_percentage: 0,
    is_active: true,
    account_holder_name: "",
    swift_code: "",
    iban: "",
    notes: ""
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchWallets()
    fetchBankAccounts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchWallets = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getAdminWallets()
      if (response.success) {
        setWallets(response.data || [])
      } else {
        throw new Error(response.error || 'Failed to fetch wallets')
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBankAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getAdminBankAccounts()
      if (response.success) {
        setBankAccounts(response.data || [])
      } else {
        throw new Error(response.error || 'Failed to fetch bank accounts')
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error)
      toast({
        title: "Error",
        description: "Failed to load bank account data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(type)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  // Wallet form handlers
  const handleWalletFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setWalletForm(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'fee_percentage') {
      // Ensure fee is a number between 0 and 100
      const fee = parseFloat(value)
      if (!isNaN(fee) && fee >= 0 && fee <= 100) {
        setWalletForm(prev => ({ ...prev, [name]: fee }))
      }
    } else {
      setWalletForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setBankForm(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'fee_percentage') {
      // Ensure fee is a number between 0 and 100
      const fee = parseFloat(value)
      if (!isNaN(fee) && fee >= 0 && fee <= 100) {
        setBankForm(prev => ({ ...prev, [name]: fee }))
      }
    } else {
      setBankForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const resetWalletForm = () => {
    setWalletForm({
      name: "",
      address: "",
      currency: "USDT",
      network: "TRC20",
      fee_percentage: 0,
      is_active: true,
      notes: ""
    })
    setIsEditing(false)
    setCurrentWallet(null)
  }

  const resetBankForm = () => {
    setBankForm({
      name: "",
      bank_name: "",
      account_number: "",
      routing_number: "",
      account_type: "Checking",
      fee_percentage: 0,
      is_active: true,
      account_holder_name: "",
      swift_code: "",
      iban: "",
      notes: ""
    })
    setIsEditing(false)
    setCurrentBankAccount(null)
  }

  const handleEditWallet = (wallet: AdminWallet) => {
    setCurrentWallet(wallet)
    setWalletForm({
      name: wallet.name,
      address: wallet.address,
      currency: wallet.currency,
      network: wallet.network,
      fee_percentage: wallet.fee_percentage,
      is_active: wallet.is_active,
      notes: wallet.notes || ""
    })
    setIsEditing(true)
    setWalletDialogOpen(true)
  }

  const handleEditBankAccount = (account: AdminBankAccount) => {
    setCurrentBankAccount(account)
    setBankForm({
      name: account.name,
      bank_name: account.bank_name,
      account_number: account.account_number,
      routing_number: account.routing_number || "",
      account_type: account.account_type,
      fee_percentage: account.fee_percentage,
      is_active: account.is_active,
      account_holder_name: account.account_holder_name || "",
      swift_code: account.swift_code || "",
      iban: account.iban || "",
      notes: account.notes || ""
    })
    setIsEditing(true)
    setBankDialogOpen(true)
  }

  const handleSubmitWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      
      if (isEditing && currentWallet) {
        // Update existing wallet
        const response = await apiClient.updateAdminWallet(currentWallet.id, walletForm)
        if (response.success) {
          toast({
            title: "Success",
            description: "Wallet updated successfully",
          })
          fetchWallets()
        } else {
          throw new Error(response.error || 'Failed to update wallet')
        }
      } else {
        // Create new wallet
        const response = await apiClient.createAdminWallet(walletForm)
        if (response.success) {
          toast({
            title: "Success",
            description: "Wallet created successfully",
          })
          fetchWallets()
        } else {
          throw new Error(response.error || 'Failed to create wallet')
        }
      }
      
      setWalletDialogOpen(false)
      resetWalletForm()
    } catch (error) {
      console.error('Error saving wallet:', error)
      toast({
        title: "Error",
        description: "Failed to save wallet",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitBankAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      
      if (isEditing && currentBankAccount) {
        // Update existing bank account
        const response = await apiClient.updateAdminBankAccount(currentBankAccount.id, bankForm)
        if (response.success) {
          toast({
            title: "Success",
            description: "Bank account updated successfully",
          })
          fetchBankAccounts()
        } else {
          throw new Error(response.error || 'Failed to update bank account')
        }
      } else {
        // Create new bank account
        const response = await apiClient.createAdminBankAccount(bankForm)
        if (response.success) {
          toast({
            title: "Success",
            description: "Bank account created successfully",
          })
          fetchBankAccounts()
        } else {
          throw new Error(response.error || 'Failed to create bank account')
        }
      }
      
      setBankDialogOpen(false)
      resetBankForm()
    } catch (error) {
      console.error('Error saving bank account:', error)
      toast({
        title: "Error",
        description: "Failed to save bank account",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteWallet = async (id: string) => {
    if (confirm("Are you sure you want to delete this wallet?")) {
      try {
        setIsLoading(true)
        const response = await apiClient.deleteAdminWallet(id)
        if (response.success) {
          toast({
            title: "Success",
            description: "Wallet deleted successfully",
          })
          fetchWallets()
        } else {
          throw new Error(response.error || 'Failed to delete wallet')
        }
      } catch (error) {
        console.error('Error deleting wallet:', error)
        toast({
          title: "Error",
          description: "Failed to delete wallet",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteBankAccount = async (id: string) => {
    if (confirm("Are you sure you want to delete this bank account?")) {
      try {
        setIsLoading(true)
        const response = await apiClient.deleteAdminBankAccount(id)
        if (response.success) {
          toast({
            title: "Success",
            description: "Bank account deleted successfully",
          })
          fetchBankAccounts()
        } else {
          throw new Error(response.error || 'Failed to delete bank account')
        }
      } catch (error) {
        console.error('Error deleting bank account:', error)
        toast({
          title: "Error",
          description: "Failed to delete bank account",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSetPrimaryWallet = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.setPrimaryAdminWallet(id)
      if (response.success) {
        toast({
          title: "Success",
          description: "Primary wallet updated successfully",
        })
        fetchWallets()
      } else {
        throw new Error(response.error || 'Failed to set primary wallet')
      }
    } catch (error) {
      console.error('Error setting primary wallet:', error)
      toast({
        title: "Error",
        description: "Failed to set primary wallet",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetPrimaryBankAccount = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.setPrimaryAdminBankAccount(id)
      if (response.success) {
        toast({
          title: "Success",
          description: "Primary bank account updated successfully",
        })
        fetchBankAccounts()
      } else {
        throw new Error(response.error || 'Failed to set primary bank account')
      }
    } catch (error) {
      console.error('Error setting primary bank account:', error)
      toast({
        title: "Error",
        description: "Failed to set primary bank account",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate stats
  const activeWallets = wallets.filter(w => w.is_active).length
  const activeBankAccounts = bankAccounts.filter(a => a.is_active).length

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage> Wallets & Bank Accounts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Wallets & Bank Accounts</h2>
            <p className="text-muted-foreground">Manage crypto wallets and bank account configurations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => {
                  resetWalletForm()
                  setWalletDialogOpen(true)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Wallet" : "Add New Wallet"}</DialogTitle>
                  <DialogDescription>
                    {isEditing 
                      ? "Update the wallet details below." 
                      : "Add a new wallet address to receive crypto payments."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitWallet}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={walletForm.name}
                        onChange={handleWalletFormChange}
                        className="col-span-3" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">Address</Label>
                      <Input 
                        id="address" 
                        name="address"
                        value={walletForm.address}
                        onChange={handleWalletFormChange}
                        className="col-span-3" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="currency" className="text-right">Currency</Label>
                      <Select 
                        name="currency" 
                        disabled
                        value={walletForm.currency}
                        onValueChange={(value) => setWalletForm(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDT">USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="network" className="text-right">Network</Label>
                      <Select 
                        name="network" 
                        value={walletForm.network}
                        onValueChange={(value) => setWalletForm(prev => ({ ...prev, network: value }))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRC20">Tron (TRC20)</SelectItem>
                          <SelectItem value="ERC20">Ethereum (ERC20)</SelectItem>
                          <SelectItem value="BEP20">Binance Smart Chain (BEP20)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fee_percentage" className="text-right">Fee (%)</Label>
                      <div className="col-span-3 flex items-center">
                        <Input 
                          id="fee_percentage" 
                          name="fee_percentage"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={walletForm.fee_percentage}
                          onChange={handleWalletFormChange}
                          className="mr-2" 
                        />
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="is_active" className="text-right">Status</Label>
                      <Select 
                        name="is_active" 
                        value={walletForm.is_active ? "active" : "inactive"}
                        onValueChange={(value) => setWalletForm(prev => ({ ...prev, is_active: value === "active" }))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                      <Textarea 
                        id="notes" 
                        name="notes"
                        value={walletForm.notes}
                        onChange={handleWalletFormChange}
                        className="col-span-3" 
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      resetWalletForm()
                      setWalletDialogOpen(false)
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditing ? "Update" : "Add"} Wallet
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800" onClick={() => {
                  resetBankForm()
                  setBankDialogOpen(true)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bank Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Bank Account" : "Add New Bank Account"}</DialogTitle>
                  <DialogDescription>
                    {isEditing 
                      ? "Update the bank account details below." 
                      : "Add a new bank account for fiat transactions."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitBankAccount}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Account Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={bankForm.name}
                        onChange={handleBankFormChange}
                        className="col-span-3" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bank_name" className="text-right">Bank Name</Label>
                      <Input 
                        id="bank_name" 
                        name="bank_name"
                        value={bankForm.bank_name}
                        onChange={handleBankFormChange}
                        className="col-span-3" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="account_holder_name" className="text-right">Account Holder</Label>
                      <Input 
                        id="account_holder_name" 
                        name="account_holder_name"
                        value={bankForm.account_holder_name}
                        onChange={handleBankFormChange}
                        className="col-span-3" 
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="account_number" className="text-right">Account Number</Label>
                      <Input 
                        id="account_number" 
                        name="account_number"
                        value={bankForm.account_number}
                        onChange={handleBankFormChange}
                        className="col-span-3" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="routing_number" className="text-right">Routing Number</Label>
                      <Input 
                        id="routing_number" 
                        name="routing_number"
                        value={bankForm.routing_number}
                        onChange={handleBankFormChange}
                        className="col-span-3" 
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="account_type" className="text-right">Account Type</Label>
                      <Select 
                        name="account_type" 
                        value={bankForm.account_type}
                        onValueChange={(value) => setBankForm(prev => ({ ...prev, account_type: value }))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Checking">Checking</SelectItem>
                          <SelectItem value="Savings">Savings</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="swift_code" className="text-right">SWIFT Code</Label>
                      <Input 
                        id="swift_code" 
                        name="swift_code"
                        value={bankForm.swift_code}
                        onChange={handleBankFormChange}
                        className="col-span-3" 
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="iban" className="text-right">IBAN</Label>
                      <Input 
                        id="iban" 
                        name="iban"
                        value={bankForm.iban}
                        onChange={handleBankFormChange}
                        className="col-span-3" 
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fee_percentage" className="text-right">Fee (%)</Label>
                      <div className="col-span-3 flex items-center">
                        <Input 
                          id="fee_percentage" 
                          name="fee_percentage"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={bankForm.fee_percentage}
                          onChange={handleBankFormChange}
                          className="mr-2" 
                        />
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="is_active" className="text-right">Status</Label>
                      <Select 
                        name="is_active" 
                        value={bankForm.is_active ? "active" : "inactive"}
                        onValueChange={(value) => setBankForm(prev => ({ ...prev, is_active: value === "active" }))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                      <Textarea 
                        id="notes" 
                        name="notes"
                        value={bankForm.notes}
                        onChange={handleBankFormChange}
                        className="col-span-3" 
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      resetBankForm()
                      setBankDialogOpen(false)
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditing ? "Update" : "Add"} Bank Account
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWallets}</div>
              <p className="text-xs text-muted-foreground">
                {wallets.length - activeWallets} inactive {wallets.length - activeWallets === 1 ? 'wallet' : 'wallets'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bank Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBankAccounts}</div>
              <p className="text-xs text-muted-foreground">
                {bankAccounts.length - activeBankAccounts} inactive {bankAccounts.length - activeBankAccounts === 1 ? 'account' : 'accounts'}
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
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : wallets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No wallets found. Add your first wallet to get started.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Wallet Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Network</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wallets.map((wallet) => (
                        <TableRow key={wallet.id}>
                          <TableCell className="font-medium flex items-center">
                            {wallet.is_primary && (
                              <DotSquare className="w-4 text-yellow-500 mr-2" />
                            )}
                            {wallet.name}
                          </TableCell>
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
                          <TableCell>{wallet.fee_percentage}%</TableCell>
                          <TableCell>
                            <Badge
                              variant={wallet.is_active ? "default" : "secondary"}
                              className={wallet.is_active ? "bg-green-100 text-green-800" : ""}
                            >
                              {wallet.is_active ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <AlertCircle className="w-3 h-3 mr-1" />
                              )}
                              {wallet.is_active ? "active" : "inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {!wallet.is_primary && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleSetPrimaryWallet(wallet.id)}
                                  title="Set as primary"
                                >
                                  <DotSquare className="w-4 h-4 text-yellow-500" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditWallet(wallet)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => handleDeleteWallet(wallet.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {wallets.length} {wallets.length === 1 ? 'wallet' : 'wallets'} total
                </p>
                <Button variant="outline" size="sm" onClick={() => {
                  resetWalletForm()
                  setWalletDialogOpen(true)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Wallet
                </Button>
              </CardFooter>
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
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : bankAccounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No bank accounts found. Add your first bank account to get started.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Bank</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bankAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium flex items-center">
                            {account.is_primary && (
                              <DotSquare className="w-4 text-yellow-500 mr-2" />
                            )}
                            {account.name}
                          </TableCell>
                          <TableCell>{account.bank_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                ****{account.account_number.slice(-4)}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(account.account_number, `bank-${account.id}`)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              {copiedAddress === `bank-${account.id}` && (
                                <span className="text-xs text-green-600">Copied!</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{account.account_type}</TableCell>
                          <TableCell>{account.fee_percentage}%</TableCell>
                          <TableCell>
                            <Badge
                              variant={account.is_active ? "default" : "secondary"}
                              className={account.is_active ? "bg-green-100 text-green-800" : ""}
                            >
                              {account.is_active ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <AlertCircle className="w-3 h-3 mr-1" />
                              )}
                              {account.is_active ? "active" : "inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {!account.is_primary && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleSetPrimaryBankAccount(account.id)}
                                  title="Set as primary"
                                >
                                  <DotSquare className="w-4 h-4 text-yellow-500" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditBankAccount(account)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => handleDeleteBankAccount(account.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {bankAccounts.length} {bankAccounts.length === 1 ? 'bank account' : 'bank accounts'} total
                </p>
                <Button variant="outline" size="sm" onClick={() => {
                  resetBankForm()
                  setBankDialogOpen(true)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bank Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}


export default function WalletManagementPage(){
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      <WalletsPage />
    </ProtectedRoute>
  )
};