// components/property/PropertyCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Property } from "@/types/property";
import { useLike } from "@/hook/use-like";


interface PropertyCardProps {
  property: Property;
  colstyle?: boolean; // true cho list view, false cho grid view
}

const PropertyCard = ({ property, colstyle = false }: PropertyCardProps) => {
  const { isLiked, handleLikeDisLike } = useLike("property", property.id);
  
  // Xử lý images (có thể là JSON string)
  const images = property.images ? JSON.parse(property.images as string) : [];
  const mainImage = images[0] || '/images/property-placeholder.jpg';
  

  // Xác định loại BĐS (For Rent / For Sale)
  const isForRent = property.type === 'rent';
  const isFeatured = property.is_featured;

  return (
    <div className={colstyle ? 'col-sm-12' : 'col-md-6'}>
      <div className={colstyle ? "listing-style1" : "listing-style1 listCustom listing-type"}>
        {/* Image Section */}
        <div className="list-thumb">
          <Image
            width={382}
            height={248}
            className="w-100 cover"
            style={{ height: colstyle ? '248px' : '354px' }}
            src={mainImage}
            alt={property.name}
          />
          
          {/* Featured Tag */}
          {isFeatured && (
            <div className="sale-sticker-wrap">
              <div className="list-tag fz12">
                <span className="flaticon-electricity me-2" />
                FEATURED
              </div>
            </div>
          )}

          {/* Price Tag */}
          <div className="list-price">
            {property.price}
            {isForRent && property.period && ` / ${property.period}`}
          </div>
        </div>

        {/* Content Section */}
        <div className="list-content">
          {/* Agent Avatar (có thể thay bằng logo nếu có) */}
          <div className="list-agent topFive">
            <Image
              width={114}
              height={114}
              className="rounded-circle w-full h-full cover"
              src="/images/team/agent-single-1.png"
              alt="agent"
            />
          </div>

          {/* Title */}
          <h6 className="list-title">
            <Link href={`/property/${property.slug || property.id}`}>
              {property.name}
            </Link>
          </h6>

          {/* Location */}
          <p className="list-text">{property.location || ''}</p>

          {/* Property Details (Bed, Bath, Sqft) */}
          <div className="list-meta d-flex align-items-center">
            <a href="#">
              <span className="flaticon-bed" /> {property.number_bedroom || 0} bed
            </a>
            <a href="#">
              <span className="flaticon-shower" /> {property.number_bathroom || 0} bath
            </a>
            <a href="#">
              <span className="flaticon-expand" /> {property.square || 0} sqft
            </a>
          </div>

          <hr className="mt-2 mb-2" />

          {/* Footer Actions */}
          <div className="list-meta2 d-flex justify-content-between align-items-center">
            <span className="for-what">
              {isForRent ? 'For Rent' : 'For Sale'}
            </span>
            <div className="icons d-flex align-items-center">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <span className="flaticon-fullscreen" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <span className="flaticon-new-tab" />
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLikeDisLike();
                }}
              >
                <span className={`flaticon-like ${isLiked ? 'text-danger' : ''}`} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;