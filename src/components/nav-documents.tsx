"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavDocuments({
  items,
  title,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  title?: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden py-1">
      {title && (
        <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold px-3 py-1">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={`transition-all duration-150 rounded-xl px-3 py-2 text-xs font-medium ${
                  isActive
                    ? "bg-[#ccff00]/15 text-[#ccff00] font-semibold border border-[#ccff00]/30 shadow-xs"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Link href={item.url} prefetch={true} className="flex items-center gap-2.5">
                  <item.icon
                    className={`size-3.5 ${
                      isActive ? "text-[#ccff00]" : "text-zinc-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavDocuments;
