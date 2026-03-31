"use client";
import PropertyCard from "@/components/property/property-card";
import PropertyCardSkeleton from "@/components/skeleton/property-card-skeleton";
import { useSimilarProperties } from "@/hook/use-properties";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface NearbySimilarPropertyProps {
  propertyId: number;
}

const NearbySimilarProperty = ({ propertyId }: NearbySimilarPropertyProps) => {
  
  // Sử dụng hook useSimilarProperties
  const { 
    properties, 
    isLoading, 
    //isFetching,
    error 
  } = useSimilarProperties(propertyId, { per_page: 10 });

  // Loading state
  {isLoading && (
  <div className="row">
    {[1, 2, 3].map((item) => (
      <div key={item} className="col-lg-4 col-md-6 mb-4">
        <PropertyCardSkeleton colstyle={true} />
      </div>
    ))}
  </div>
)}


  // Error state
  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Unable to load similar properties</p>
      </div>
    );
  }

  // Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No similar properties found</p>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={30}
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: ".featured-next__active",
        prevEl: ".featured-prev__active",
      }}
      pagination={{
        el: ".featured-pagination__active",
        clickable: true,
      }}
      slidesPerView={1}
      breakpoints={{
        300: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      }}
    >
      {properties.map((property) => (
        <SwiperSlide key={property.id}>
          <div className="item">
            <PropertyCard property={property} colstyle={true} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default NearbySimilarProperty;