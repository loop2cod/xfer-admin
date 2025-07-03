'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import apiClient, { AdminProfile, AdminCreateRequest, AdminUpdateRequest } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  UserPlus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield, 
  Settings,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from '@/hooks/useToast';

function AdminUsersContent() {
  const { admin, hasPermission, isSuperAdmin } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminProfile | null>(null);
  const [createFormData, setCreateFormData] = useState<AdminCreateRequest>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'admin',
  });
  const [editFormData, setEditFormData] = useState<AdminUpdateRequest>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAllAdmins();
      
      if (response.success && response.data) {
        setAdmins(response.data);
      } else {
        setError(response.error || 'Failed to load admin users');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!createFormData.email || !createFormData.password || !createFormData.first_name || !createFormData.last_name) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiClient.createAdmin(createFormData);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Admin user created successfully',
        });
        setShowCreateDialog(false);
        setCreateFormData({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          role: 'admin',
        });
        loadAdmins();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create admin user',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      setIsSubmitting(true);
      const response = await apiClient.updateAdmin(selectedAdmin.id, editFormData);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Admin user updated successfully',
        });
        setShowEditDialog(false);
        setSelectedAdmin(null);
        setEditFormData({});
        loadAdmins();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update admin user',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (adminId: string) => {
    try {
      const response = await apiClient.toggleAdminStatus(adminId);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Admin status updated successfully',
        });
        loadAdmins();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update admin status',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!confirm(`Are you sure you want to delete admin "${adminEmail}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiClient.deleteAdmin(adminId);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Admin user deleted successfully',
        });
        loadAdmins();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete admin user',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (adminUser: AdminProfile) => {
    setSelectedAdmin(adminUser);
    setEditFormData({
      first_name: adminUser.first_name,
      last_name: adminUser.last_name,
      role: adminUser.role,
      is_active: adminUser.is_active,
    });
    setShowEditDialog(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'operator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-600">Loading admin users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Admin Users</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadAdmins}>
            Try Again
          </Button>
        </div>
      </div>
    );
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
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Admin Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
            <p className="text-muted-foreground">
              Manage administrative accounts and their permissions
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Users ({admins.length})</CardTitle>
            <CardDescription>
              View and manage all administrative accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <UserPlus className="h-8 w-8 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">No admin users found</p>
                          <p className="text-xs text-muted-foreground">
                            Get started by creating your first admin user
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCreateDialog(true)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Admin User
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((adminUser) => (
                    <TableRow key={adminUser.id}>
                      <TableCell className="font-medium">
                        {adminUser.first_name} {adminUser.last_name}
                        {adminUser.id === admin?.id && (
                          <Badge variant="outline" className="ml-2">You</Badge>
                        )}
                      </TableCell>
                      <TableCell>{adminUser.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(adminUser.role)}>
                          {formatRole(adminUser.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(adminUser.is_active)}
                          <span className={adminUser.is_active ? 'text-green-600' : 'text-red-600'}>
                            {adminUser.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {adminUser.last_login
                          ? new Date(adminUser.last_login).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        {new Date(adminUser.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(adminUser)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            {adminUser.id !== admin?.id && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(adminUser.id)}
                                >
                                  {adminUser.is_active ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteAdmin(adminUser.id, adminUser.email)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Admin Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Admin User</DialogTitle>
            <DialogDescription>
              Add a new administrative user to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={createFormData.first_name}
                  onChange={(e) => setCreateFormData({...createFormData, first_name: e.target.value})}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={createFormData.last_name}
                  onChange={(e) => setCreateFormData({...createFormData, last_name: e.target.value})}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={createFormData.email}
                onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={createFormData.password}
                onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                placeholder="Enter strong password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={createFormData.role} 
                onValueChange={(value) => setCreateFormData({...createFormData, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdmin} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Admin'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>
              Update administrative user information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input
                  id="edit_first_name"
                  value={editFormData.first_name || ''}
                  onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input
                  id="edit_last_name"
                  value={editFormData.last_name || ''}
                  onChange={(e) => setEditFormData({...editFormData, last_name: e.target.value})}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_role">Role</Label>
              <Select 
                value={editFormData.role || ''} 
                onValueChange={(value) => setEditFormData({...editFormData, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAdmin} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Admin'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      <AdminUsersContent />
    </ProtectedRoute>
  );
}