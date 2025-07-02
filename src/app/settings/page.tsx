"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Save,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import ProtectedRoute from "@/components/ProtectedRoute"

interface SystemSetting {
  id: string
  key: string
  value: any
  description?: string
  category: string
  is_public: boolean
  updated_by: string
  created_at: string
  updated_at: string
}

interface SettingFormData {
  key: string
  value: string
  description: string
  category: string
  is_public: boolean
}

function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null)
  const [formData, setFormData] = useState<SettingFormData>({
    key: "",
    value: "",
    description: "",
    category: "",
    is_public: false,
  })

  useEffect(() => {
    loadSettings()
    loadCategories()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.getSystemSettings(
        selectedCategory !== "all" ? selectedCategory : undefined
      )
      
      if (response.success && response.data) {
        setSettings(response.data)
      } else {
        setError(response.error || 'Failed to load settings')
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await apiClient.getSettingCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        // Fallback to extracting from existing settings
        const uniqueCategories = [...new Set(settings.map(s => s.category))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
      // Fallback to extracting from existing settings
      const uniqueCategories = [...new Set(settings.map(s => s.category))]
      setCategories(uniqueCategories)
    }
  }

  const handleSaveSetting = async () => {
    try {
      let response
      if (editingSetting) {
        response = await apiClient.updateSystemSetting(editingSetting.key, {
          value: JSON.parse(formData.value),
          description: formData.description,
          category: formData.category,
          is_public: formData.is_public,
        })
      } else {
        response = await apiClient.createSystemSetting({
          key: formData.key,
          value: JSON.parse(formData.value),
          description: formData.description,
          category: formData.category,
          is_public: formData.is_public,
        })
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Setting ${editingSetting ? 'updated' : 'created'} successfully`,
        })
        setIsDialogOpen(false)
        setEditingSetting(null)
        resetForm()
        loadSettings()
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to save setting',
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      })
    }
  }

  const handleDeleteSetting = async (key: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return

    try {
      const response = await apiClient.deleteSystemSetting(key)
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Setting deleted successfully",
        })
        loadSettings()
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to delete setting',
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (setting: SystemSetting) => {
    setEditingSetting(setting)
    setFormData({
      key: setting.key,
      value: JSON.stringify(setting.value, null, 2),
      description: setting.description || "",
      category: setting.category,
      is_public: setting.is_public,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      key: "",
      value: "",
      description: "",
      category: "",
      is_public: false,
    })
  }

  const filteredSettings = selectedCategory === "all" 
    ? settings 
    : settings.filter(s => s.category === selectedCategory)

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
                <BreadcrumbPage>System Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">
              Manage system configuration and parameters
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingSetting(null) }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Setting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSetting ? 'Edit Setting' : 'Add New Setting'}
                </DialogTitle>
                <DialogDescription>
                  {editingSetting 
                    ? 'Update the system setting configuration'
                    : 'Create a new system setting'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="key" className="text-right">
                    Key
                  </Label>
                  <Input
                    id="key"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="col-span-3"
                    disabled={!!editingSetting}
                    placeholder="setting.key.name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="col-span-3"
                    placeholder="general, fees, security, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="value" className="text-right pt-2">
                    Value (JSON)
                  </Label>
                  <Textarea
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="col-span-3"
                    rows={4}
                    placeholder='{"key": "value"} or "simple string" or 123'
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                    rows={2}
                    placeholder="Description of this setting"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_public" className="text-right">
                    Public
                  </Label>
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSetting}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingSetting ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration Settings
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadSettings}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Loading settings...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading settings</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={loadSettings} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Public</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSettings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{setting.key}</p>
                          {setting.description && (
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{setting.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {JSON.stringify(setting.value)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={setting.is_public ? "default" : "secondary"}>
                          {setting.is_public ? "Public" : "Private"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{new Date(setting.updated_at).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(setting)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSetting(setting.key)}
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

            {!loading && !error && filteredSettings.length === 0 && (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No settings found</h3>
                <p className="text-gray-500">
                  {selectedCategory === "all" 
                    ? "No system settings have been configured yet."
                    : `No settings found in the "${selectedCategory}" category.`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function SystemSettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  )
}
