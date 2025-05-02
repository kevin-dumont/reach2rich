"use client";

import { Inter } from "next/font/google";

import { FormProvider } from "@/contexts/form-context";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <FormProvider>{children}</FormProvider>
        <Toaster />
      </body>
    </html>
  );
}
