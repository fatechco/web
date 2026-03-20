import TopStateBlock from "@/components/real-estate/property/dashboard/dashboard-home/TopStateBlock";
import PropertyViews from "@/components/real-estate/property/property-single-style/common/property-view";
import RecentActivities from "@/components/real-estate/property/dashboard/dashboard-home/RecentActivities";
export const metadata = {
  title: "Dashboard Home || Homez - Real Estate NextJS Template",
};

const DashboardHome = () => {
  return (
    <>
        <div>
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>Howdy, Ali!</h2>
                    <p className="text">We are glad to see you again!</p>
                  </div>
                </div>
                {/* col-lg-12 */}
              </div>
              {/* End .row */}

              <div className="row">
                <TopStateBlock />
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-8">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="row">
                      <PropertyViews />
                    </div>
                  </div>
                </div>
                {/* End col-xl-8 */}

                <div className="col-xl-4">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb25">Recent Activities</h4>
                    <RecentActivities />
                  </div>
                </div>
                {/* End .col-xl-4 */}
              </div>           
    </>
  );
};

export default DashboardHome;
