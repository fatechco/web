
import AllReviews from "@/components/real-estate/property/dashboard/dashboard-reviews";
import Pagination from "@/components/real-estate/property/Pagination";
export const metadata = {
  title: "Dashboard Reviews || Homez - Real Estate NextJS Template",
};

const DashboardReviews = () => {
  return (
    <>
      
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>Reviews</h2>
                    <p className="text">We are glad to see you again!</p>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <AllReviews />
                    <div className="mt30">
                      <Pagination />
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}
      
    </>
  );
};

export default DashboardReviews;
