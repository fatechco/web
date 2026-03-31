import React from "react";
import type { Property } from "@/types/property";

interface PropertyAddressProps {
  property: Property;
}

const PropertyAddress = ({ property }: PropertyAddressProps) => {
  // Lấy địa chỉ đầy đủ từ property
  const fullAddress = property.address;
  const city = property.city || property.district?.name;
  

  // Tạo địa chỉ cho map
  const mapAddress = fullAddress ;

  // Tạo URL Google Maps
  const mapUrl = mapAddress 
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=m&z=14&output=embed&iwloc=near`
    : "";

  return (
    <>
      {/* Address Info */}
      <div className="col-md-6 col-xl-4">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Address</p>
            <p className="fw600 mb10 ff-heading dark-color">City</p>
            <p className="fw600 mb-0 ff-heading dark-color">State/county</p>
          </div>
          <div className="pd-list text-end">
            <p className="text mb10">{fullAddress || "N/A"}</p>
            <p className="text mb10">{city || "N/A"}</p>
            <p className="text mb-0">{state || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Optional: Additional address details if available */}
      {(zipCode || country) && (
        <div className="col-md-6 col-xl-4 offset-xl-2">
          <div className="d-flex justify-content-between">
            <div className="pd-list">
              {zipCode && <p className="fw600 mb10 ff-heading dark-color">Zip Code</p>}
              {country && <p className="fw600 mb-0 ff-heading dark-color">Country</p>}
            </div>
            <div className="pd-list text-end">
              {zipCode && <p className="text mb10">{zipCode}</p>}
              {country && <p className="text mb-0">{country}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      {mapAddress && (
        <div className="col-md-12">
          <iframe
            className="position-relative bdrs12 mt30 h250"
            loading="lazy"
            src={mapUrl}
            title={`Map of ${mapAddress}`}
            aria-label={`Map showing location of ${mapAddress}`}
          />
        </div>
      )}
    </>
  );
};

export default PropertyAddress;