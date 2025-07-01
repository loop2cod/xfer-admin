"use client"

import type * as React from "react"
import {
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Settings,
  Shield,
  Users,
  Wallet,
  LogOut,
  UserCog,
  User,
  CheckCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import XferLogo from "./logo/xfer-logo"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { usePendingCount } from "@/context/PendingCountContext"
import { PendingCountBadge } from "./PendingCountBadge"

// Menu items with permissions
const getMenuData = (hasPermission: (permission: string) => boolean, isSuperAdmin: boolean, pendingCount: number) => ({
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
          permission: null, // Everyone can access dashboard
        }
      ],
    },
    {
      title: "Transfer Requests",
      items: [
        {
          title: "Pending Queue",
          url: "/requests/pending",
          icon: CreditCard,
          badge: pendingCount > 0 ? pendingCount.toString() : undefined,
          permission: "can_approve_transfers",
          urgent: pendingCount > 10, // Mark as urgent if more than 10 pending
        },
        {
          title: "All Requests",
          url: "/requests",
          icon: FileText,
          permission: "can_view_reports",
        },
        {
          title: "Failed Requests",
          url: "/requests/failed",
          icon: Shield,
          permission: "can_view_reports",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Customers",
          url: "/customers",
          icon: Users,
          permission: "can_manage_users",
        },
        {
          title: "Wallets & Banks",
          url: "/wallets",
          icon: Wallet,
          permission: "can_manage_wallets",
        },
        {
          title: "Financial Reports",
          url: "/reports",
          icon: DollarSign,
          permission: "can_view_reports",
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Admin Users",
          url: "/admin-users",
          icon: UserCog,
          permission: "can_manage_admins",
          superAdminOnly: true,
        },
        {
          title: "System Settings",
          url: "/settings",
          icon: Settings,
          permission: "can_manage_system_settings",
        },
      ],
    },
    {
      title: "Advanced",
      items: [
        {
          title: "Audit Logs",
          url: "/audit",
          icon: FileText,
          permission: "can_view_audit_logs",
        },
      ],
    },
  ],
});

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { admin, logout, hasPermission, isSuperAdmin } = useAuth();
  const { pendingCount, isLoading: isPendingCountLoading } = usePendingCount();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleAccountSettings = () => {
    router.push('/profile');
  };

  // Filter menu items based on permissions
  const filterMenuItems = (items: any[]) => {
    return items.filter(item => {
      if (!item.permission) return true; // No permission required
      if (item.superAdminOnly && !isSuperAdmin()) return false;
      return hasPermission(item.permission);
    });
  };

  const data = getMenuData(hasPermission, isSuperAdmin(), pendingCount);
  const filteredNavMain = data.navMain.map(group => ({
    ...group,
    items: filterMenuItems(group.items)
  })).filter(group => group.items.length > 0); // Remove empty groups

  // Generate initials from admin name
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'AD';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
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

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <XferLogo height='80%'/>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <div onClick={()=>{
                        router.push(item.url);
                      }} className="flex items-center cursor-pointer">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {item.title === "Pending Queue" ? (
                          <PendingCountBadge className="ml-auto relative" />
                        ) : item.badge && (
                          <span className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full transition-all duration-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/admin.png" alt={admin?.first_name} />
                    <AvatarFallback className="rounded-lg bg-gray-900 text-white">
                      {getInitials(admin?.first_name, admin?.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">
                        {admin ? `${admin.first_name} ${admin.last_name}` : 'Loading...'}
                      </span>
                      {admin?.role && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRoleColor(admin.role)}`}
                        >
                          {formatRole(admin.role)}
                        </Badge>
                      )}
                    </div>
                    <span className="truncate text-xs text-gray-500">
                      {admin?.email || 'Loading...'}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleAccountSettings} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAccountSettings} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
