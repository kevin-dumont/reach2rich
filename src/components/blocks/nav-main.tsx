"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  menus,
}: {
  menus: {
    name: string;
    items: {
      name: string;
      url?: string;
      icon: LucideIcon;
    }[];
  }[];
}) {
  return (
    <>
      {menus.map((menu) => (
        <SidebarGroup
          key={menu.name}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupLabel>{menu.name}</SidebarGroupLabel>
          <SidebarMenu>
            {menu.items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  {item.url ? (
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <div className="opacity-50 hover:bg-none">
                      <item.icon />
                      <span className="flex items-end gap-1">
                        <span>{item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          (À venir)
                        </span>
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
