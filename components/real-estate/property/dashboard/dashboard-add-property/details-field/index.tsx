"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";

interface DetailsFieldProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
  categories?: any[];
}

export interface DetailsFieldRef {
  focusFirstError: () => boolean;
  validate: () => boolean;
}

const DetailsField = forwardRef<DetailsFieldRef, DetailsFieldProps>(
  ({ formData, updateFormData, onValidationChange, categories = [] }, ref) => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    
    // Check if selected category is land
    const selectedCategory = categories.find(cat => cat.id === formData.category_id);
    const isLandCategory = selectedCategory?.slug === 'land';
    
    // Refs cho các input
    const areaRef = React.useRef<HTMLInputElement>(null);
    const bedroomsRef = React.useRef<HTMLInputElement>(null);
    const bathroomsRef = React.useRef<HTMLInputElement>(null);

    // Current year for year picker
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

    // Validate form
    const validate = () => {
      const newErrors: Record<string, string> = {};
      let firstErrorField: string | null = null;
      
      // Area validation (required)
      if (!formData.area || parseFloat(formData.area) <= 0) {
        newErrors.area = t("validation.area.required");
        if (!firstErrorField) firstErrorField = "area";
      } else if (parseFloat(formData.area) > 10000) {
        newErrors.area = t("validation.area.too_large", { max: 10000 });
        if (!firstErrorField) firstErrorField = "area";
      }
      
      // Only validate these fields if NOT land category
      if (!isLandCategory) {
        // Bedrooms validation (optional but must be positive)
        if (formData.bedrooms && parseInt(formData.bedrooms) < 0) {
          newErrors.bedrooms = t("validation.bedrooms.positive");
          if (!firstErrorField) firstErrorField = "bedrooms";
        }
        
        // Bathrooms validation (optional but must be positive)
        if (formData.bathrooms && parseInt(formData.bathrooms) < 0) {
          newErrors.bathrooms = t("validation.bathrooms.positive");
          if (!firstErrorField) firstErrorField = "bathrooms";
        }
        
        // Year validation (if provided)
        if (formData.year_built) {
          const year = parseInt(formData.year_built);
          if (isNaN(year) || year < 1900 || year > currentYear + 1) {
            newErrors.year_built = t("validation.year.invalid", { min: 1900, max: currentYear });
            if (!firstErrorField) firstErrorField = "year_built";
          }
        }
        
        // Floors validation (if provided)
        if (formData.floors && parseInt(formData.floors) < 0) {
          newErrors.floors = t("validation.floors.positive");
          if (!firstErrorField) firstErrorField = "floors";
        }
        
        // Garages validation (if provided)
        if (formData.garages && parseInt(formData.garages) < 0) {
          newErrors.garages = t("validation.garages.positive");
          if (!firstErrorField) firstErrorField = "garages";
        }
      }
      
      // Land area validation (if provided)
      if (formData.land_area && parseFloat(formData.land_area) < 0) {
        newErrors.land_area = t("validation.land_area.positive");
        if (!firstErrorField) firstErrorField = "land_area";
      }
      
      // Built area validation (if provided)
      if (formData.built_area && parseFloat(formData.built_area) < 0) {
        newErrors.built_area = t("validation.built_area.positive");
        if (!firstErrorField) firstErrorField = "built_area";
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
      
      if (firstErrorField === "area") {
        areaRef.current?.focus();
        areaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "bedrooms") {
        bedroomsRef.current?.focus();
        bedroomsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "bathrooms") {
        bathroomsRef.current?.focus();
        bathroomsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "year_built") {
        const yearSelect = document.querySelector('select[name="year_built"]') as HTMLSelectElement;
        yearSelect?.focus();
        yearSelect?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "land_area") {
        const landAreaInput = document.querySelector('input[name="land_area"]') as HTMLInputElement;
        landAreaInput?.focus();
        landAreaInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "built_area") {
        const builtAreaInput = document.querySelector('input[name="built_area"]') as HTMLInputElement;
        builtAreaInput?.focus();
        builtAreaInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "floors") {
        const floorsInput = document.querySelector('input[name="floors"]') as HTMLInputElement;
        floorsInput?.focus();
        floorsInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstErrorField === "garages") {
        const garagesInput = document.querySelector('input[name="garages"]') as HTMLInputElement;
        garagesInput?.focus();
        garagesInput?.scrollIntoView({ behavior: "smooth", block: "center" });
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
    }, [formData.area, formData.bedrooms, formData.bathrooms, formData.year_built, 
        formData.land_area, formData.built_area, formData.floors, formData.garages, isLandCategory]);

    const handleFieldBlur = (field: string) => {
      setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleNumberChange = (field: string, value: string) => {
      const numValue = value === "" ? "" : parseFloat(value);
      if (value === "" || (!isNaN(numValue as number) && numValue >= 0)) {
        updateFormData(field, value);
      }
    };

    return (
      <form className="form-style1">
        <div className="row">
          {/* Area - Required */}
          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                {t("area")} (m²) <span className="text-danger">*</span>
              </label>
              <input
                ref={areaRef}
                type="number"
                className={`form-control ${errors.area && touched.area ? "is-invalid" : ""}`}
                placeholder={t("area.placeholder")}
                value={formData.area}
                onChange={(e) => handleNumberChange("area", e.target.value)}
                onBlur={() => handleFieldBlur("area")}
              />
              {errors.area && touched.area && (
                <div className="invalid-feedback">{errors.area}</div>
              )}
            </div>
          </div>

          {/* Land Area - Optional */}
          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">{t("land.area")} (m²)</label>
              <input
                type="number"
                name="land_area"
                className={`form-control ${errors.land_area && touched.land_area ? "is-invalid" : ""}`}
                placeholder={t("land.area.placeholder")}
                value={formData.land_area}
                onChange={(e) => handleNumberChange("land_area", e.target.value)}
                onBlur={() => handleFieldBlur("land_area")}
              />
              {errors.land_area && touched.land_area && (
                <div className="invalid-feedback">{errors.land_area}</div>
              )}
            </div>
          </div>

          {/* Built Area - Optional */}
          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">{t("built.area")} (m²)</label>
              <input
                type="number"
                name="built_area"
                className={`form-control ${errors.built_area && touched.built_area ? "is-invalid" : ""}`}
                placeholder={t("built.area.placeholder")}
                value={formData.built_area}
                onChange={(e) => handleNumberChange("built_area", e.target.value)}
                onBlur={() => handleFieldBlur("built_area")}
              />
              {errors.built_area && touched.built_area && (
                <div className="invalid-feedback">{errors.built_area}</div>
              )}
            </div>
          </div>

          {/* Bedrooms - Hidden for land category */}
          {!isLandCategory && (
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">{t("bedrooms")}</label>
                <input
                  ref={bedroomsRef}
                  type="number"
                  className={`form-control ${errors.bedrooms && touched.bedrooms ? "is-invalid" : ""}`}
                  placeholder={t("bedrooms.placeholder")}
                  value={formData.bedrooms}
                  onChange={(e) => handleNumberChange("bedrooms", e.target.value)}
                  onBlur={() => handleFieldBlur("bedrooms")}
                />
                {errors.bedrooms && touched.bedrooms && (
                  <div className="invalid-feedback">{errors.bedrooms}</div>
                )}
              </div>
            </div>
          )}

          {/* Bathrooms - Hidden for land category */}
          {!isLandCategory && (
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">{t("bathrooms")}</label>
                <input
                  ref={bathroomsRef}
                  type="number"
                  className={`form-control ${errors.bathrooms && touched.bathrooms ? "is-invalid" : ""}`}
                  placeholder={t("bathrooms.placeholder")}
                  value={formData.bathrooms}
                  onChange={(e) => handleNumberChange("bathrooms", e.target.value)}
                  onBlur={() => handleFieldBlur("bathrooms")}
                />
                {errors.bathrooms && touched.bathrooms && (
                  <div className="invalid-feedback">{errors.bathrooms}</div>
                )}
              </div>
            </div>
          )}

          {/* Floors - Hidden for land category */}
          {!isLandCategory && (
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">{t("floors")}</label>
                <input
                  type="number"
                  name="floors"
                  className={`form-control ${errors.floors && touched.floors ? "is-invalid" : ""}`}
                  placeholder={t("floors.placeholder")}
                  value={formData.floors}
                  onChange={(e) => handleNumberChange("floors", e.target.value)}
                  onBlur={() => handleFieldBlur("floors")}
                />
                {errors.floors && touched.floors && (
                  <div className="invalid-feedback">{errors.floors}</div>
                )}
              </div>
            </div>
          )}

          {/* Garages - Hidden for land category */}
          {!isLandCategory && (
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">{t("garages")}</label>
                <input
                  type="number"
                  name="garages"
                  className={`form-control ${errors.garages && touched.garages ? "is-invalid" : ""}`}
                  placeholder={t("garages.placeholder")}
                  value={formData.garages}
                  onChange={(e) => handleNumberChange("garages", e.target.value)}
                  onBlur={() => handleFieldBlur("garages")}
                />
                {errors.garages && touched.garages && (
                  <div className="invalid-feedback">{errors.garages}</div>
                )}
              </div>
            </div>
          )}

          {/* Year Built - Hidden for land category */}
          {!isLandCategory && (
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">{t("year.built")}</label>
                <select
                  name="year_built"
                  className={`form-select ${errors.year_built && touched.year_built ? "is-invalid" : ""}`}
                  value={formData.year_built}
                  onChange={(e) => updateFormData("year_built", e.target.value)}
                  onBlur={() => handleFieldBlur("year_built")}
                >
                  <option value="">{t("year.select")}</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year_built && touched.year_built && (
                  <div className="invalid-feedback">{errors.year_built}</div>
                )}
              </div>
            </div>
          )}

          {/* Furnishing - Hidden for land category */}
          {!isLandCategory && (
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">{t("furnishing")}</label>
                <select
                  className="form-select"
                  value={formData.furnishing}
                  onChange={(e) => updateFormData("furnishing", e.target.value)}
                >
                  <option value="">{t("furnishing.select")}</option>
                  <option value="unfurnished">{t("furnishing.unfurnished")}</option>
                  <option value="semi-furnished">{t("furnishing.semi")}</option>
                  <option value="furnished">{t("furnishing.furnished")}</option>
                  <option value="fully-furnished">{t("furnishing.fully")}</option>
                </select>
              </div>
            </div>
          )}

          {/* Legal Status - Always show */}
          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">{t("legal.status")}</label>
              <select
                className="form-select"
                value={formData.legal_status}
                onChange={(e) => updateFormData("legal_status", e.target.value)}
              >
                <option value="">{t("legal.select")}</option>
                <option value="pink_book">{t("legal.pink_book")}</option>
                <option value="red_book">{t("legal.red_book")}</option>
                <option value="pending">{t("legal.pending")}</option>
                <option value="other">{t("legal.other")}</option>
              </select>
            </div>
          </div>

          {/* Ownership Type - Always show */}
          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">{t("ownership.type")}</label>
              <select
                className="form-select"
                value={formData.ownership_type}
                onChange={(e) => updateFormData("ownership_type", e.target.value)}
              >
                <option value="">{t("ownership.select")}</option>
                <option value="private">{t("ownership.private")}</option>
                <option value="company">{t("ownership.company")}</option>
                <option value="joint">{t("ownership.joint")}</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    );
  }
);

DetailsField.displayName = "DetailsField";

export default DetailsField;