"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import LocationSelector from "@/components/location/LocationSelector";
import { useTranslation } from "react-i18next";

interface LocationFieldProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export interface LocationFieldRef {
  focusFirstError: () => boolean;
  validate: () => boolean;
}

const LocationField = forwardRef<LocationFieldRef, LocationFieldProps>(
  ({ formData, updateFormData, onValidationChange }, ref) => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    
    // Refs cho các input
    const streetRef = React.useRef<HTMLInputElement>(null);
    const countryRef = React.useRef<HTMLDivElement>(null);
    const provinceRef = React.useRef<HTMLDivElement>(null);
    const fullAddressRef = React.useRef<HTMLInputElement>(null);

    // Validate form
    const validate = () => {
      const newErrors: Record<string, string> = {};
      let firstErrorField: string | null = null;
      
      // Check country
      if (!formData.country_id) {
        newErrors.country = t("validation.country.required");
        if (!firstErrorField) firstErrorField = "country";
      }
      
      // Check province
      if (!formData.province_id && formData.country_id) {
        newErrors.province = t("validation.province.required");
        if (!firstErrorField) firstErrorField = "province";
      }
      
      // Check street (optional but validate format if provided)
      if (formData.street && formData.street.length < 2) {
        newErrors.street = t("validation.street.min_length");
        if (!firstErrorField) firstErrorField = "street";
      }
      
      // Check full address (optional but validate if provided)
      if (formData.full_address && formData.full_address.length < 5) {
        newErrors.full_address = t("validation.address.min_length");
        if (!firstErrorField) firstErrorField = "full_address";
      }
      
      // Check coordinates (optional but validate format if provided)
      if (formData.latitude && (isNaN(parseFloat(formData.latitude)) || Math.abs(parseFloat(formData.latitude)) > 90)) {
        newErrors.latitude = t("validation.latitude.invalid");
        if (!firstErrorField) firstErrorField = "latitude";
      }
      
      if (formData.longitude && (isNaN(parseFloat(formData.longitude)) || Math.abs(parseFloat(formData.longitude)) > 180)) {
        newErrors.longitude = t("validation.longitude.invalid");
        if (!firstErrorField) firstErrorField = "longitude";
      }
      
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (onValidationChange) onValidationChange(isValid);
      
      return { isValid, firstErrorField };
    };

    // Focus vào field bị lỗi đầu tiên
    const focusFirstError = () => {
      const { firstErrorField } = validate();
      
      if (!firstErrorField) return false;
      
      // Focus theo loại field
      if (firstErrorField === "street") {
        streetRef.current?.focus();
        streetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "full_address") {
        fullAddressRef.current?.focus();
        fullAddressRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "country") {
        countryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        countryRef.current?.classList.add("shake");
        setTimeout(() => countryRef.current?.classList.remove("shake"), 500);
      } else if (firstErrorField === "province") {
        provinceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        provinceRef.current?.classList.add("shake");
        setTimeout(() => provinceRef.current?.classList.remove("shake"), 500);
      } else if (firstErrorField === "latitude") {
        const latInput = document.querySelector('input[name="latitude"]') as HTMLInputElement;
        latInput?.focus();
        latInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "longitude") {
        const lngInput = document.querySelector('input[name="longitude"]') as HTMLInputElement;
        lngInput?.focus();
        lngInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      
      return true;
    };

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      focusFirstError,
      validate: () => {
        const { isValid } = validate();
        return isValid;
      }
    }));

    // Validate on change
    useEffect(() => {
      validate();
    }, [formData.country_id, formData.province_id, formData.street, formData.full_address, formData.latitude, formData.longitude]);

    const handleFieldBlur = (field: string) => {
      setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleLocationChange = (values: {
      country_id?: number;
      province_id?: number;
      district_id?: number;
      ward_id?: number;
    }) => {
      updateFormData("country_id", values.country_id);
      updateFormData("province_id", values.province_id);
      updateFormData("district_id", values.district_id);
      updateFormData("ward_id", values.ward_id);
      
      // Mark as touched
      if (values.country_id) setTouched(prev => ({ ...prev, country: true }));
      if (values.province_id) setTouched(prev => ({ ...prev, province: true }));
    };

    return (
      <form className="form-style1">
        <div className="row">
          {/* Street Address */}
          <div className="col-sm-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                {t("street.address")}
              </label>
              <input
                ref={streetRef}
                type="text"
                className={`form-control ${errors.street && touched.street ? "is-invalid" : ""}`}
                placeholder={t("street.name")}
                value={formData.street || ""}
                onChange={(e) => updateFormData("street", e.target.value)}
                onBlur={() => handleFieldBlur("street")}
              />
              {errors.street && touched.street && (
                <div className="invalid-feedback">{errors.street}</div>
              )}
            </div>
          </div>

          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                {t("street.number")}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="123"
                value={formData.street_number || ""}
                onChange={(e) => updateFormData("street_number", e.target.value)}
              />
            </div>
          </div>

          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                {t("building.name")}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("building.name.placeholder")}
                value={formData.building_name || ""}
                onChange={(e) => updateFormData("building_name", e.target.value)}
              />
            </div>
          </div>

          {/* Location Selector - Country, Province, District, Ward */}
          <div className="col-sm-12">
            <div 
              ref={countryRef}
              className={`mb20 ${errors.country && touched.country ? "has-error" : ""}`}
            >
              <LocationSelector
                countryId={formData.country_id}
                provinceId={formData.province_id}
                districtId={formData.district_id}
                wardId={formData.ward_id}
                onChange={handleLocationChange}
                showWard={true}
                required={true}
              />
              {errors.country && touched.country && (
                <div className="text-danger small mt-1">{errors.country}</div>
              )}
              {errors.province && touched.province && (
                <div className="text-danger small mt-1">{errors.province}</div>
              )}
            </div>
          </div>

          {/* Full Address */}
          <div className="col-sm-12">
            <div className="mb20 mt-2">
              <label className="heading-color ff-heading fw600 mb10">
                {t("full.address")}
              </label>
              <input
                ref={fullAddressRef}
                type="text"
                className={`form-control ${errors.full_address && touched.full_address ? "is-invalid" : ""}`}
                placeholder={t("full.address.placeholder")}
                value={formData.full_address || ""}
                onChange={(e) => updateFormData("full_address", e.target.value)}
                onBlur={() => handleFieldBlur("full_address")}
              />
              {errors.full_address && touched.full_address && (
                <div className="invalid-feedback">{errors.full_address}</div>
              )}
            </div>
          </div>

          {/* Coordinates */}
          <div className="col-sm-6 col-xl-4">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">
                {t("latitude")}
              </label>
              <input
                type="text"
                name="latitude"
                className={`form-control ${errors.latitude && touched.latitude ? "is-invalid" : ""}`}
                placeholder="e.g., 10.8231"
                value={formData.latitude || ""}
                onChange={(e) => updateFormData("latitude", e.target.value)}
                onBlur={() => handleFieldBlur("latitude")}
              />
              {errors.latitude && touched.latitude && (
                <div className="invalid-feedback">{errors.latitude}</div>
              )}
            </div>
          </div>

          <div className="col-sm-6 col-xl-4">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">
                {t("longitude")}
              </label>
              <input
                type="text"
                name="longitude"
                className={`form-control ${errors.longitude && touched.longitude ? "is-invalid" : ""}`}
                placeholder="e.g., 106.6297"
                value={formData.longitude || ""}
                onChange={(e) => updateFormData("longitude", e.target.value)}
                onBlur={() => handleFieldBlur("longitude")}
              />
              {errors.longitude && touched.longitude && (
                <div className="invalid-feedback">{errors.longitude}</div>
              )}
            </div>
          </div>

          {/* Map Preview */}
          {formData.latitude && formData.longitude && (
            <div className="col-sm-12">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  {t("map.preview")}
                </label>
                <div className="map-preview mt-2">
                  <iframe
                    width="100%"
                    height="300"
                    frameBorder="0"
                    style={{ border: 0, borderRadius: "12px" }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${formData.longitude - 0.01},${formData.latitude - 0.01},${formData.longitude + 0.01},${formData.latitude + 0.01}&layer=mapnik&marker=${formData.latitude},${formData.longitude}`}
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .has-error :global(.select-custom) {
            border-color: #dc3545;
          }
          .shake {
            animation: shake 0.5s ease-in-out;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}</style>
      </form>
    );
  }
);

LocationField.displayName = "LocationField";

export default LocationField;