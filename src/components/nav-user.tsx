"use client";

import React from "react";
import {
  CreditCard,
  MoreVertical,
  LogOut,
  Bell,
  User as UserIcon,
  Shield,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { logoutAdmin } from "@/lib/auth";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-zinc-800/80 data-[state=open]:text-white rounded-2xl hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-[#ccff00]">
                {initials}
              </div>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-semibold text-zinc-100">{user.name}</span>
                <span className="text-zinc-500 truncate text-[10px] font-mono">
                  {user.email}
                </span>
              </div>
              <MoreVertical className="ml-auto size-4 text-zinc-500" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl bg-[#12141c] border border-zinc-800 shadow-2xl p-1.5"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-2.5 text-left text-xs">
                <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-[#ccff00]">
                  {initials}
                </div>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-bold text-white">{user.name}</span>
                  <span className="text-zinc-400 truncate text-[11px] font-mono">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-xl cursor-pointer">
                <UserIcon className="size-3.5 mr-2 text-zinc-400" />
                Admin Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-xl cursor-pointer">
                <CreditCard className="size-3.5 mr-2 text-zinc-400" />
                Subscription & Plan
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-xl cursor-pointer">
                <Bell className="size-3.5 mr-2 text-zinc-400" />
                Alerts & Reminders
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              onClick={() => logoutAdmin()}
              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl cursor-pointer"
            >
              <LogOut className="size-3.5 mr-2 text-rose-400" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavUser;
