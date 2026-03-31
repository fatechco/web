// app/property/[slug]/page.tsx
"use client";

import { useProperty } from "@/hook/use-properties";
import MobileMenu from "@/components/real-estate/common/mobile-menu";
import EnergyClass from "@/components/real-estate/property/property-single-style/common/EnergyClass";
import FloorPlans from "@/components/real-estate/property/property-single-style/common/FloorPlans";
import HomeValueChart from "@/components/real-estate/property/property-single-style/common/HomeValueChart";
import InfoWithForm from "@/components/real-estate/property/property-single-style/common/more-info";
import NearbySimilarProperty from "@/components/real-estate/property/property-single-style/common/NearbySimilarProperty";
import OverView from "@/components/real-estate/property/property-single-style/single-v2/OverView";
import PropertyAddress from "@/components/real-estate/property/property-single-style/common/PropertyAddress";
import PropertyDetails from "@/components/real-estate/property/property-single-style/common/PropertyDetails";
import PropertyFeaturesAminites from "@/components/real-estate/property/property-single-style/common/PropertyFeaturesAminites";
import PropertyNearby from "@/components/real-estate/property/property-single-style/common/PropertyNearby";
import PropertyVideo from "@/components/real-estate/property/property-single-style/common/PropertyVideo";
import PropertyViews from "@/components/real-estate/property/property-single-style/common/property-view";
import ProperytyDescriptions from "@/components/real-estate/property/property-single-style/common/ProperytyDescriptions";
import ReviewBoxForm from "@/components/real-estate/property/property-single-style/common/ReviewBoxForm";
import VirtualTour360 from "@/components/real-estate/property/property-single-style/common/VirtualTour360";
import AllReviews from "@/components/real-estate/property/property-single-style/common/reviews";
import ContactWithAgent from "@/components/real-estate/property/property-single-style/single-v2/ContactWithAgent";
import PropertyGallery from "@/components/real-estate/property/property-single-style/single-v2/PropertyGallery";
import MortgageCalculator from "@/components/real-estate/property/property-single-style/common/MortgageCalculator";
import WalkScore from "@/components/real-estate/property/property-single-style/common/WalkScore";
import PropertyHeader from "@/components/real-estate/property/property-single-style/single-v2/PropertyHeader";
import ScheduleForm from "@/components/real-estate/property/property-single-style/single-v2/ScheduleForm";

import { notFound } from "next/navigation";
import { PropertyDetailSkeleton } from "@/components/skeleton/property-detail-skeleton";
import { use } from "react";


interface SingleV2Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function SingleV2({ params }: SingleV2Props) {
  const { slug } = use(params);
  const { data, isLoading, error } = useProperty(slug);

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !data?.data) {
    notFound();
  }

  const property = data.data;

  return (
    <>
      {/* Mobile Nav */}
      <MobileMenu />
      {/* End Mobile Nav */}

      {/* Property All Single V1 */}
      <section className="pt60 pb0 bgc-white">
        <div className="container">
          <div className="row">
            <PropertyHeader property={property} />
          </div>

          <div className="row mb30 mt30">
            <PropertyGallery images={property.images || []} />
          </div>

          <div className="row mt30">
            <OverView property={property} />
          </div>
        </div>
      </section>

      <section className="pt60 pb90 bgc-f7">
        <div className="container">
          <div className="row wrap">
            <div className="col-lg-8">
              {/* Property Description */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Property Description</h4>
                <ProperytyDescriptions property={property} />
              </div>

              {/* Property Details */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30 mt30">Property Details</h4>
                <div className="row">
                  <PropertyDetails property={property} />
                </div>
              </div>

              {/* Address */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30 mt30">Address</h4>
                <div className="row">
                  {/*<PropertyAddress address={property.full_address} /> */}
                </div>
              </div>

              {/* Features & Amenities */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Features &amp; Amenities</h4>
                <div className="row">
                  <PropertyFeaturesAminites amenities={property.amenities} />
                </div>
              </div>

              {/* Energy Class */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Energy Class</h4>
                <div className="row">
                  <EnergyClass />
                </div>
              </div>

              {/* Floor Plans */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Floor Plans</h4>
                <div className="row">
                  <div className="col-md-12">
                    <div className="accordion-style1 style2">
                      <FloorPlans />
                    </div>
                  </div>
                </div>
              </div>

              {/* Video */}
              {property.video_url && (
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
                  <h4 className="title fz17 mb30">Video</h4>
                  <div className="row">
                    <PropertyVideo videoUrl={property.video_url} />
                  </div>
                </div>
              )}

              {/* Virtual Tour */}
              {property.virtual_tour_url && (
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  <h4 className="title fz17 mb30">360° Virtual Tour</h4>
                  <div className="row">
                    <VirtualTour360 tourUrl={property.virtual_tour_url} />
                  </div>
                </div>
              )}

              {/* ... các components khác tương tự */}
            </div>

            <div className="col-lg-4">
              <div className="column">
                <div className="default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white position-relative">
                  <h6 className="title fz17 mb30">Get More Information</h6>
                  <ContactWithAgent property={property} />
                  <ScheduleForm property={property} />
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <div className="row mt30">
            <div className="col-lg-12">
              <NearbySimilarProperty propertyId={property.id} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
