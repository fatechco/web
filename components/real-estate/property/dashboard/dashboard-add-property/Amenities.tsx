"use client";

import React, { useState, useEffect } from "react";
import { useAmenities } from "@/hook/use-amenity";

interface AmenitiesProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const Amenities = ({ formData, updateFormData }: AmenitiesProps) => {
  const { amenities, isLoading } = useAmenities();
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(formData.amenities || []);

  // Chỉ cập nhật khi selectedAmenities thay đổi do user click
  useEffect(() => {
    updateFormData("amenities", selectedAmenities);
  }, [selectedAmenities]); // ✅ chỉ phụ thuộc vào selectedAmenities

  // Không cần useEffect để init từ formData vì đã init trong useState

  const toggleAmenity = (amenityId: number) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  if (isLoading) {
    return <div className="text-center py-5">Loading amenities...</div>;
  }

  if (!amenities || amenities.length === 0) {
    return <div className="text-center py-5 text-gray-500">No amenities found</div>;
  }

  const columns = [[], [], []];
  amenities.forEach((amenity: any, index: number) => {
    columns[index % 3].push(amenity);
  });

  return (
    <div className="row">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="col-sm-6 col-lg-4">
          <div className="checkbox-style1">
            {column.map((amenity: any) => {
              const isChecked = selectedAmenities.includes(amenity.id);
              return (
                <label key={amenity.id} className="custom_checkbox">
                  {amenity.name}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAmenity(amenity.id)}
                  />
                  <span className="checkmark" />
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Amenities;