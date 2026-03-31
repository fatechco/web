import React from "react";
import type { Property } from "@/types/property";

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const columns = [
    [
      {
        label: "Property ID",
        value: property.id,
      },
      {
        label: "Price",
        value: property.price_formatted,
      },
      {
        label: "Property Size",
        value: property.area_formatted,
      },
      {
        label: "Bathrooms",
        value: property.bathrooms,
      },
      {
        label: "Bedrooms",
        value: property.bedrooms,
      },
    ],
    [
      {
        label: "Garage",
        value: property.garages,
      },
      {
        label: "Garage Size",
        value: property.garage_size,
      },
      {
        label: "Year Built",
        value: property.year_built,
      },
      {
        label: "Property Type",
        value: property.category?.name,
      },
      {
        label: "Property Status",
        value: property.type_label,
      },
    ],
  ];

  return (
    <div className="row">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`col-md-6 col-xl-4${
            columnIndex === 1 ? " offset-xl-2" : ""
          }`}
        >
          {column.map((detail, index) => {
            // Chỉ hiển thị nếu value không null/undefined
            if (detail.value == null) return null;
            
            return (
              <div key={index} className="d-flex justify-content-between">
                <div className="pd-list">
                  <p className="fw600 mb10 ff-heading dark-color">
                    {detail.label}
                  </p>
                </div>
                <div className="pd-list">
                  <p className="text mb10">{detail.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default PropertyDetails;