"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useUpdateProperty } from "@/hook/use-properties";
import { useCategories } from "@/hook/use-categories";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsField from "./details-field";
import Amenities from "./Amenities";
import { Property } from "@/types/property";

interface EditPropertyFormProps {
  property: Property;
}

const EditPropertyForm = ({ property }: EditPropertyFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { categories } = useCategories();
  const [activeStep, setActiveStep] = useState(0);
  
  // Refs cho các components
  const descriptionRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const detailsRef = useRef<any>(null);
  const amenitiesRef = useRef<any>(null);
  
  const [stepValid, setStepValid] = useState({
    description: false,
    media: true,
    location: false,
    details: false,
    amenities: true,
  });

  // Transform existing images từ API
  const transformExistingImages = useCallback(() => {
    const images = property.existing_images || property.images || [];
    if (!images.length) return [];
    
    return images.map((img: any) => ({
      id: img.id,
      url: img.url,
      thumbnail: img.thumbnail || img.url,
      is_primary: img.is_primary || false,
      order: img.order || 0,
      caption: img.caption || "",
      original_name: img.original_name || "Image",
      size_bytes: img.size_bytes || 0,
    }));
  }, [property.existing_images, property.images]);

  // Khởi tạo form data
  const [formData, setFormData] = useState({
    // Translations
    translations: property.translations || {},
    
    // Basic info
    category_id: property.category?.id || property.category_id,
    type: property.type,
    status: property.status,
    price: property.price.toString(),
    is_negotiable: property.is_negotiable,
    
    // Details
    area: property.area?.toString() || "",
    land_area: property.land_area?.toString() || "",
    built_area: property.built_area?.toString() || "",
    bedrooms: property.bedrooms?.toString() || "",
    bathrooms: property.bathrooms?.toString() || "",
    floors: property.floors?.toString() || "",
    garages: property.garages?.toString() || "",
    year_built: property.year_built?.toString() || "",
    furnishing: property.furnishing || "",
    legal_status: property.legal_status || "",
    ownership_type: property.ownership_type || "",
    
    // Location
    country_id: property.country_id,
    province_id: property.province_id,
    district_id: property.district_id,
    ward_id: property.ward_id,
    street: property.street || "",
    street_number: property.street_number || "",
    building_name: property.building_name || "",
    full_address: property.full_address || "",
    latitude: property.latitude?.toString() || "",
    longitude: property.longitude?.toString() || "",
    
    // Media
    images: [] as any[],
    existing_images: transformExistingImages(),
    video_url: property.video_url || "",
    virtual_tour_url: property.virtual_tour_url || "",
    
    // Amenities
    amenities: property.amenities || [],
  });

  const { updateProperty, isUpdating } = useUpdateProperty();

  const steps = [
    { id: "description", label: t("1.description"), component: PropertyDescription, ref: descriptionRef },
    { id: "media", label: t("2.media"), component: UploadMedia, ref: mediaRef },
    { id: "location", label: t("3.location"), component: LocationField, ref: locationRef },
    { id: "details", label: t("4.details"), component: DetailsField, ref: detailsRef },
    { id: "amenities", label: t("5.amenities"), component: Amenities, ref: amenitiesRef },
  ];

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateStepValidation = useCallback((step: string, isValid: boolean) => {
    setStepValid(prev => ({ ...prev, [step]: isValid }));
  }, []);

  const revalidateCurrentStep = useCallback(() => {
    const currentStepId = steps[activeStep].id;
    const currentRef = steps[activeStep].ref;
    
    if (currentRef.current?.validate) {
      const isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    }
  }, [activeStep, steps, updateStepValidation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      revalidateCurrentStep();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeStep, revalidateCurrentStep]);

  const focusCurrentStepError = useCallback(() => {
    const currentRef = steps[activeStep].ref;
    if (currentRef.current?.focusFirstError) {
      currentRef.current.focusFirstError();
    }
  }, [activeStep, steps]);

  const handleNext = useCallback(() => {
    const currentStepId = steps[activeStep].id;
    const currentRef = steps[activeStep].ref;
    
    let isValid = stepValid[currentStepId as keyof typeof stepValid];
    
    if (currentRef.current?.validate) {
      isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    }
    
    if (!isValid) {
      focusCurrentStepError();
      return;
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  }, [activeStep, steps, stepValid, updateStepValidation, focusCurrentStepError]);

  const handlePrevious = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  const buildFormData = useCallback((): FormData => {
    const formDataToSend = new FormData();
    formDataToSend.append("_method", "PUT");
    
    // 1. Translations
    Object.entries(formData.translations).forEach(([locale, data]: [string, any]) => {
      formDataToSend.append(`translations[${locale}][title]`, data.title);
      formDataToSend.append(`translations[${locale}][description]`, data.description);
      if (data.content) formDataToSend.append(`translations[${locale}][content]`, data.content);
    });
    
    // 2. Basic info
    if (formData.category_id) {
      formDataToSend.append("category_id", String(formData.category_id));
    }
    formDataToSend.append("type", formData.type);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("is_negotiable", formData.is_negotiable ? "1" : "0");
    
    // 3. Details
    const detailFields = ["area", "land_area", "built_area", "bedrooms", "bathrooms", "floors", "garages", "year_built", "furnishing", "legal_status", "ownership_type"];
    detailFields.forEach(field => {
      if (formData[field]) {
        formDataToSend.append(field, String(formData[field]));
      }
    });
    
    // 4. Location
    const locationFields = ["country_id", "province_id", "district_id", "ward_id", "street", "street_number", "building_name", "full_address", "latitude", "longitude"];
    locationFields.forEach(field => {
      if (formData[field]) {
        formDataToSend.append(field, String(formData[field]));
      }
    });
    
    // 5. New images - KIỂM TRA FILE ĐÚNG
    formData.images.forEach((item: any, index: number) => {
      let file = null;
      if (item instanceof File) {
        file = item;
      } else if (item?.file instanceof File) {
        file = item.file;
      }
      if (file) {
        formDataToSend.append(`images[]`, file);
      }
    });
    
    // 6. Existing images IDs
    formData.existing_images.forEach((image: any) => {
      if (image.id) {
        formDataToSend.append("existing_images[]", String(image.id));
      }
    });
    
    // 7. Media URLs
    if (formData.video_url) formDataToSend.append("video_url", formData.video_url);
    if (formData.virtual_tour_url) formDataToSend.append("virtual_tour_url", formData.virtual_tour_url);
    
    // 8. Amenities
    formData.amenities.forEach((amenityId: number) => {
      formDataToSend.append("amenities[]", String(amenityId));
    });
    
    return formDataToSend;
  }, [formData]);

  const validateAllSteps = useCallback((): boolean => {
    const stepsToValidate = ["description", "location", "details"];
    let allValid = true;
    
    stepsToValidate.forEach((stepId) => {
      const step = steps.find(s => s.id === stepId);
      if (step?.ref.current?.validate) {
        const isValid = step.ref.current.validate();
        updateStepValidation(stepId, isValid);
        if (!isValid) allValid = false;
      }
    });
    
    return allValid;
  }, [steps, updateStepValidation]);

  const handleSubmit = useCallback(async () => {
    const isValid = validateAllSteps();
    
    if (!isValid) {
      const firstInvalidStep = steps.find(step => !stepValid[step.id as keyof typeof stepValid]);
      if (firstInvalidStep) {
        const stepIndex = steps.findIndex(s => s.id === firstInvalidStep.id);
        setActiveStep(stepIndex);
        setTimeout(() => {
          if (firstInvalidStep.id === "description" && descriptionRef.current?.focusFirstError) {
            descriptionRef.current.focusFirstError();
          } else if (firstInvalidStep.id === "location" && locationRef.current?.focusFirstError) {
            locationRef.current.focusFirstError();
          } else if (firstInvalidStep.id === "details" && detailsRef.current?.focusFirstError) {
            detailsRef.current.focusFirstError();
          }
        }, 150);
      }
      toast.error(t("validation.fill_all_required_fields"));
      return;
    }
    
    const formDataToSend = buildFormData();
    
    updateProperty({ id: property.id, formData: formDataToSend }, {
      onSuccess: () => {
        toast.success(t("property.updated.success"));
        router.push("/dashboard/my-properties");
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || t("property.updated.error");
        toast.error(errorMessage);
      },
    });
  }, [validateAllSteps, stepValid, steps, buildFormData, updateProperty, property.id, router, t]);

  const currentStep = steps[activeStep];
  const ActiveComponent = currentStep.component;

  return (
    <>
      {/* Progress Steps */}
      <div className="progress-steps mb-5">
        <div className="d-flex align-items-center justify-content-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div 
                className={`step-item ${activeStep === index ? "active" : ""} ${stepValid[step.id as keyof typeof stepValid] ? "completed" : ""}`}
                onClick={() => {
                  if (stepValid[step.id as keyof typeof stepValid] || activeStep === index) {
                    setActiveStep(index);
                  }
                }}
                style={{ cursor: stepValid[step.id as keyof typeof stepValid] || activeStep === index ? "pointer" : "not-allowed" }}
              >
                <div className="step-number">
                  {stepValid[step.id as keyof typeof stepValid] ? (
                    <i className="fas fa-check" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="step-label">{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-line ${stepValid[step.id as keyof typeof stepValid] ? "completed" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="step-content">
        <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
          {ActiveComponent && (
            <ActiveComponent 
              ref={currentStep.ref}
              formData={formData}
              updateFormData={updateFormData}
              onValidationChange={(isValid: boolean) => updateStepValidation(currentStep.id, isValid)}
              {...(currentStep.id === "details" && { categories })}
              {...(currentStep.id === "description" && { initialTranslations: formData.translations })}
              {...(currentStep.id === "media" && { 
                existingImages: formData.existing_images,
                maxFiles: 20,
                maxFileSize: 10
              })}
            />
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        {activeStep > 0 && (
          <button
            className="ud-btn btn-outline-secondary"
            onClick={handlePrevious}
            disabled={isUpdating}
          >
            <i className="fas fa-arrow-left me-2" />
            {t("previous")}
          </button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <button
            className={`ud-btn btn-thm ${activeStep === 0 ? "ms-auto" : ""}`}
            onClick={handleNext}
            disabled={isUpdating}
          >
            {t("next")}
            <i className="fas fa-arrow-right ms-2" />
          </button>
        ) : (
          <button
            className="ud-btn btn-thm ms-auto"
            onClick={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {t("updating")}
              </>
            ) : (
              <>
                {t("update.property")}
                <i className="fas fa-save ms-2" />
              </>
            )}
          </button>
        )}
      </div>

      <style jsx>{`
        .progress-steps {
          padding: 0 20px;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s;
        }
        .step-item.active .step-number {
          background: #eb6753;
          border-color: #eb6753;
          color: white;
        }
        .step-item.completed .step-number {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }
        .step-label {
          font-size: 12px;
          margin-top: 8px;
          color: #6b7280;
        }
        .step-item.active .step-label {
          color: #eb6753;
          font-weight: 500;
        }
        .step-item.completed .step-label {
          color: #10b981;
        }
        .step-line {
          flex: 1;
          height: 2px;
          background: #e5e7eb;
          margin: 0 10px;
        }
        .step-line.completed {
          background: #10b981;
        }
      `}</style>
    </>
  );
};

export default EditPropertyForm;