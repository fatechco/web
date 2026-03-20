import DashboardHeader from "@/components/real-estate/common/DashboardHeader";
import MobileMenu from "@/components/real-estate/common/mobile-menu";
import Pagination from "@/components/real-estate/property/Pagination";
import Footer from "@/components/real-estate/property/dashboard/Footer";
import SidebarDashboard from "@/components/real-estate/property/dashboard/SidebarDashboard";
import FilterHeader from "@/components/real-estate/property/dashboard/dashboard-my-properties/FilterHeader";
import PropertyDataTable from "@/components/real-estate/property/dashboard/dashboard-my-properties/PropertyDataTable";
import DboardMobileNavigation from "@/components/real-estate/property/dashboard/DboardMobileNavigation";

export const metadata = {
  title: "Dashboard Properties || Homez - Real Estate NextJS Template",
};

const DashboardMyProperties = () => {
  return (
    <>
     
              <div className="row align-items-center pb40">
                <div className="col-xxl-3">
                  <div className="dashboard_title_area">
                    <h2>My Properties</h2>
                    <p className="text">We are glad to see you again!</p>
                  </div>
                </div>
                <div className="col-xxl-9">
                  <FilterHeader />
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <PropertyDataTable />

                      <div className="mt30">
                        <Pagination />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}
    </>
  );
};

export default DashboardMyProperties;
