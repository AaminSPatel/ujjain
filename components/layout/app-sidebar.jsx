"use client"

import { Car, Calendar, MapPin, MessageSquare, FileText, Users, Settings, BarChart3, Home, Hotel, Truck, User, PersonStandingIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Cabs",
    url: "/dashboard/cars",
    icon: Car,
  },{
    title: "Drivers",
    url: "/dashboard/drivers",
    icon: PersonStandingIcon,
  },
  {
    title: "Logistics",
    url: "/dashboard/logistics",
    icon: Truck,
  },
  {
    title: "Places",
    url: "/dashboard/places",
    icon: MapPin,
  },
  {
    title: "Hotels",
    url: "/dashboard/hotels",
    icon: Hotel,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: User,
  },
 /*  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Reviews",
    url: "/dashboard/reviews",
    icon: MessageSquare,
  },
  
  {
    title: "Contacts",
    url: "/dashboard/contacts",
    icon: Users,
  }, */
]

const secondaryItems = [
  /* {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  }, */
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Car className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Safar Sathi</span>
            <span className="text-xs text-sidebar-foreground/70">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
