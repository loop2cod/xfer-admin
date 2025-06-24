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
  Bell,
  LogOut,
  Activity,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import XferLogo from "./logo/xfer-logo"
import { useRouter } from "next/navigation"

// Menu items
const data = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
        }
      ],
    },
    {
      title: "Transfer Requests",
      items: [
        {
          title: "Pending Queue",
          url: "/admin/requests/pending",
          icon: CreditCard,
          badge: "12", // Dynamic pending count
        },
        {
          title: "All Requests",
          url: "/admin/requests",
          icon: FileText,
        },
        {
          title: "Failed Requests",
          url: "/admin/requests/failed",
          icon: Shield,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Customers",
          url: "/admin/customers",
          icon: Users,
        },
        {
          title: "Wallets & Banks",
          url: "/admin/wallets",
          icon: Wallet,
        },
        {
          title: "Financial Reports",
          url: "/admin/reports",
          icon: DollarSign,
        },
      ],
    },
    // {
    //   title: "System",
    //   items: [
    //     {
    //       title: "Settings",
    //       url: "/admin/settings",
    //       icon: Settings,
    //     },
    //     {
    //       title: "Notifications",
    //       url: "/admin/notifications",
    //       icon: Bell,
    //     },
    //   ],
    // },
    {
      title: "Advanced",
      items: [
        {
          title: "Audit Logs",
          url: "/admin/audit",
          icon: FileText,
        },
        // {
        //   title: "Roles & Permissions",
        //   url: "/admin/roles",
        //   icon: Users,
        // },
        // {
        //   title: "Security Center",
        //   url: "/admin/security",
        //   icon: Shield,
        // },
      ],
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
     <XferLogo height='80%'/>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
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
                        {item.badge && (
                          <span className="ml-auto bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
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
                    <AvatarImage src="/avatars/admin.png" alt="Admin" />
                    <AvatarFallback className="rounded-lg bg-gray-900 text-white">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin User</span>
                    <span className="truncate text-xs text-gray-500">admin@xfer.com</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
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
