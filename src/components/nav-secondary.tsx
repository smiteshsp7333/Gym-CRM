"use client";

import * as React from "react";
import { LogOut, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/auth";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`transition-all duration-150 rounded-xl px-3 py-2 text-xs font-medium ${
                    isActive
                      ? "bg-[#ccff00]/15 text-[#ccff00] font-semibold border border-[#ccff00]/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Link href={item.url} prefetch={true} className="flex items-center gap-2.5">
                    <item.icon className={`size-3.5 ${isActive ? "text-[#ccff00]" : "text-zinc-400"}`} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {/* Quick Sign Out Action */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors"
              onClick={() => logoutAdmin()}
            >
              <button type="button" className="flex items-center gap-2.5 w-full text-left">
                <LogOut className="size-3.5 text-zinc-500 group-hover:text-rose-400" />
                <span>Sign Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default NavSecondary;
