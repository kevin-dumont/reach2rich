"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  menus,
}: {
  menus: {
    name: string;
    items: {
      name: string;
      url: string;
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
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
