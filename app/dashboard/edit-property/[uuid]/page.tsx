"use client";

import { useParams } from "next/navigation";
import { usePropertyForEdit } from "@/hook/use-properties";
import EditPropertyTabContent from "@/components/real-estate/property/dashboard/dashboard-add-property/EditPropertyForm";
import { useTranslation } from "react-i18next";

const DashboardEditProperty = () => {
  const { t } = useTranslation();
  const params = useParams();
  const uuid = params.uuid as string;
  
  const { data, isLoading, error } = usePropertyForEdit(uuid);

  // Show loading state
  if (isLoading) {
    return (
      <>
        <div className="row align-items-center pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>{t("edit.property")}</h2>
              <p className="text">{t("update.your.property.information")}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{t("loading")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error || !data?.data) {
    return (
      <>
        <div className="row align-items-center pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>{t("edit.property")}</h2>
              <p className="text">{t("update.your.property.information")}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
              <div className="text-center py-5">
                <h3 className="text-red-500">{t("property.not.found")}</h3>
                <p className="text-gray-500 mt-2">{t("property.not.found.message")}</p>
                <button 
                  onClick={() => window.location.href = "/dashboard/my-properties"}
                  className="ud-btn btn-thm mt-4"
                >
                  {t("back.to.my.properties")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>{t("edit.property")}</h2>
            <p className="text">{t("update.your.property.information")}</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
            <div className="navtab-style1">
              <EditPropertyTabContent property={data.data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardEditProperty;