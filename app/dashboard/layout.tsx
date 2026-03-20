// app/dashboard/layout.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/real-estate/dashboard/DashboardLayout";

// Dashboard metadata configuration
export const dashboardConfig = {
  title: "Dashboard || Homez - Real Estate NextJS Template",
  description: "Manage your properties and account settings",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardRootLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  
  // You can add logic here to show/hide title based on route
  const shouldShowTitle = !pathname?.includes('settings'); // Example condition

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}