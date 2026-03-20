"use client";
import PropertyCard from "@/components/property/property-card";
import listings from "@/data/listings";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


const NearbySimilarProperty = () => {
  return (
    <>
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
          300: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
      >
        {listings.slice(0, 5).map((listing) => (
          <SwiperSlide key={listing.id}>
            <div className="item">
              <PropertyCard property={listing} colstyle={true} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default NearbySimilarProperty;
