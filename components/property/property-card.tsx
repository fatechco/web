"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Property } from "@/types/property";
import { useLike } from "@/hook/use-like";

interface PropertyCardProps {
  property: Property;
  colstyle?: boolean; // true cho list view, false cho grid view
}

const PropertyCard = ({ property, colstyle = false }: PropertyCardProps) => {
  const { isLiked, handleLikeDisLike } = useLike("property", property.id);
  
  // Lấy ảnh chính từ property
  const mainImage = property.primary_image || property.images?.[0]?.url || '/images/property-placeholder.jpg';
  
  // Format giá
  const formatPrice = (price: number | string) => {
    if (!price) return 'N/A';
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(priceNum)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceNum);
  };

  // Xác định loại BĐS (For Rent / For Sale)
  const isForRent = property.type === 'rent';
  const isFeatured = property.is_featured;

  return (
    <div className={colstyle ? 'col-sm-12' : 'col-md-6'}>
      <div className={colstyle ? "listing-style1" : "listing-style1 listCustom listing-type"}>
        {/* Image Section */}
        <div className="list-thumb">
          <Image
          unoptimized
            width={382}
            height={248}
            className="w-100 cover"
            style={{ height: colstyle ? '248px' : '354px' }}
            src={mainImage}
            alt={property.title || property.name || 'Property'}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/property-placeholder.jpg';
            }}
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
            {property.price_formatted || formatPrice(property.price)}
            {isForRent && property.period && ` / ${property.period}`}
          </div>
        </div>

        {/* Content Section */}
        <div className="list-content">
          {/* Agent Avatar */}
          <div className="list-agent topFive">
            <Image
            unoptimized
              width={114}
              height={114}
              className="rounded-circle w-full h-full cover"
              src={property.user?.avatar || "/images/team/agent-single-1.png"}
              alt={property.user?.name || "agent"}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/team/agent-single-1.png';
              }}
            />
          </div>

          {/* Title */}
          <h6 className="list-title">
            <Link href={`/property/${property.slug || property.uuid || property.id}`}>
              {property.title || property.name}
            </Link>
          </h6>

          {/* Location */}
          <p className="list-text">{property.full_address || property.address || ''}</p>

          {/* Property Details (Bed, Bath, Sqft) */}
          <div className="list-meta d-flex align-items-center">
            <a href="#">
              <span className="flaticon-bed" /> {property.bedrooms || 0} bed
            </a>
            <a href="#">
              <span className="flaticon-shower" /> {property.bathrooms || 0} bath
            </a>
            <a href="#">
              <span className="flaticon-expand" /> {property.area || 0} sqft
            </a>
          </div>

          <hr className="mt-2 mb-2" />

          {/* Footer Actions */}
          <div className="list-meta2 d-flex justify-content-between align-items-center">
            <span className="for-what">
              {property.type_label || (isForRent ? 'For Rent' : 'For Sale')}
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