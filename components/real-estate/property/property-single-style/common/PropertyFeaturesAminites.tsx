import React from "react";
import type { Amenity } from "@/types/amenity";

interface PropertyFeaturesAminitesProps {
  amenities?: Amenity[];
}

const PropertyFeaturesAminites = ({ amenities = [] }: PropertyFeaturesAminitesProps) => {
  // Nếu không có amenities, hiển thị thông báo
  if (!amenities || amenities.length === 0) {
    return (
      <div className="col-12">
        <p className="text-muted text-center">No amenities listed</p>
      </div>
    );
  }

  return (
    <>
      {amenities.map((amenity, index) => (
        <div key={amenity.id || index} className="col-sm-6 col-md-4">
          <div className="pd-list">
            <p className="text mb10">
              {amenity.icon ? (
                <i className={`${amenity.icon} fz14 align-middle pe-2`} />
              ) : (
                <i className="fas fa-circle fz6 align-middle pe-2" />
              )}
              {amenity.name}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyFeaturesAminites;