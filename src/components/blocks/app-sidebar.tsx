"use client";

import * as React from "react";
import {
  BookOpen,
  LifeBuoy,
  Package,
  File,
  FilePlus,
  Notebook,
  LibraryBig,
} from "lucide-react";

import { NavMain } from "@/components/blocks/nav-main";
import { NavSecondary } from "@/components/blocks/nav-secondary";
import { NavUser } from "@/components/blocks/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import LogoWithText from "../ui/logo-with-text";

const data = {
  main: [
    {
      name: "Offres",
      items: [{ name: "Mes offres", url: "/dashboard/offers", icon: Package }],
    },
    {
      name: "Stratégie éditoriale",
      items: [{ name: "Mes stratégies", icon: LibraryBig }],
    },
    {
      name: "Créer des posts",
      items: [{ name: "Mes posts", icon: Notebook }],
    },
  ],
  navSecondary: [
    {
      title: "Formation",
      url: "https://formation-linkedin.kevindumont.fr/school/course/reach2rich/lecture/6589078",
      icon: BookOpen,
    },
    {
      title: "Support",
      url: "https://discord.gg/vXDD9mSD4K",
      icon: LifeBuoy,
    },
    // {
    //   title: "Feedback",
    //   url: "https://senja.io/p/kevin-dumont/r/CHFLyy",
    //   icon: Send,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <LogoWithText size="md" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain menus={data.main} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.app_metadata?.display_name || "",
            email: user?.email || "",
            avatar: user?.app_metadata?.avatar_url || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
