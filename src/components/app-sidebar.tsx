"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Search,
  CheckSquare,
  Layers,
  CalendarCheck2,
  Activity,
  UserPlus,
  PackagePlus,
  FileText,
  Receipt,
  HelpCircle,
  UserX,
  Gift,
  Dumbbell,
  Utensils,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./custom/theme-toggle";
import { GYM_BRANDING } from "@/config/branding";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Members",
      url: "/members",
      icon: Users,
    },
    {
      title: "Sales & Invoices",
      url: "/sales",
      icon: TrendingUp,
    },
    {
      title: "Enquiries CRM",
      url: "/enquiries",
      icon: Search,
    },
    {
      title: "Diet & Nutrition",
      url: "/diet",
      icon: Utensils,
    },
    {
      title: "Tasks & To-Do",
      url: "/todo",
      icon: CheckSquare,
    },
    {
      title: "Membership Tiers",
      url: "/services",
      icon: Layers,
    },
  ],
  navSecondary: [
    {
      title: "Attendance Terminal",
      url: "/attendance",
      icon: CalendarCheck2,
    },
    {
      title: "Fitness Calculators",
      url: "/tools",
      icon: Activity,
    },
  ],
  documents: [
    {
      name: "New Member",
      url: "/members/new",
      icon: UserPlus,
    },
    {
      name: "New Service",
      url: "/services/new",
      icon: PackagePlus,
    },
    {
      name: "New Enquiry",
      url: "/enquiries/new",
      icon: FileText,
    },
    {
      name: "New Sale",
      url: "/sales/new",
      icon: Receipt,
    },
  ],
  followups: [
    {
      name: "Enquiries Radar",
      url: "/enquiries/followups",
      icon: HelpCircle,
    },
    {
      name: "Membership Renewals",
      url: "/sales/followups",
      icon: UserX,
    },
    {
      name: "Member Birthdays",
      url: "/members/birthdays",
      icon: Gift,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between items-center">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ccff00] text-black flex items-center justify-center font-black">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-white leading-tight">
                    {GYM_BRANDING.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    Executive CRM
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} title="Quick Creates" />
        <NavDocuments items={data.followups} title="Follow Ups" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "Super Admin",
            email: GYM_BRANDING.adminCredentials.email,
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
