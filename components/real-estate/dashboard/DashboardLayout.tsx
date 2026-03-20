// components/real-estate/dashboard/DashboardLayout.tsx
"use client";
import React, { ReactNode } from "react";
import DashboardHeader from "@/components/real-estate/common/DashboardHeader";
import MobileMenu from "@/components/real-estate/common/mobile-menu";
import SidebarDashboard from "@/components/real-estate/property/dashboard/SidebarDashboard";
import DboardMobileNavigation from "@/components/real-estate/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/real-estate/property/dashboard/Footer";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  headerContent?: ReactNode;
  containerClassName?: string;
}

const DashboardLayout = ({
  children,
  title,
  subtitle,
  showTitle = true,
  headerContent,
  containerClassName,
}: DashboardLayoutProps) => {
  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              {/* Mobile Navigation */}
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>


              {/* Main Content */}
              <div className={containerClassName || "row"}>
                {children}
              </div>
            </div>
            {/* End .dashboard__content */}

            <Footer />
          </div>
          {/* End .dashboard__main */}
        </div>
      </div>
      {/* dashboard_content_wrapper */}
    </>
  );
};

export default DashboardLayout;    