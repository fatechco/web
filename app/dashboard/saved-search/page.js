
import Pagination from "@/components/real-estate/property/Pagination";
import SearchDataTable from "@/components/real-estate/property/dashboard/dashboard-saved-search/SearchDataTable";

export const metadata = {
  title: "Dashboard Saved Search || Homez - Real Estate NextJS Template",
};

const DashboardSavedSearch = () => {
  return (
    <>
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>My Favourites</h2>
                    <p className="text">We are glad to see you again!</p>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <SearchDataTable />
                    </div>
                    <div className="mt30">
                      <Pagination />
                    </div>
                  </div>
                </div>
              </div>
      
    </>
  );
};

export default DashboardSavedSearch;
