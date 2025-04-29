"use client";

import { FormProvider } from "@/contexts/FormContext";
import { AppSidebar } from "@/components/blocks/app-sidebar";
import { AppBreadcrumb } from "@/components/blocks/app-breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";

export default function OfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-3">
            <div className="flex items-center gap-4 px-4 h-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" />
              <AppBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </FormProvider>
  );
}
