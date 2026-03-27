"use client";

import React, { useState, useRef, useEffect } from "react";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsField from "./details-field";
import Amenities from "./Amenities";
import { useCreateProperty } from "@/hook/use-properties";
import { useCategories } from "@/hook/use-categories";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddPropertyTabContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { categories } = useCategories();
  const [activeStep, setActiveStep] = useState(0);
  const descriptionRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const detailsRef = useRef<any>(null);
  const amenitiesRef = useRef<any>(null);
  
  const [stepValid, setStepValid] = useState({
    description: false,
    media: false,
    location: false,
    details: false,
    amenities: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    translations: {} as Record<string, { title: string; description: string }>,
    category_id: null as number | null,
    type: "sale" as "sale" | "rent",
    status: "pending" as "pending" | "available" | "sold" | "rented",
    price: "",
    is_negotiable: false,
    
    // Details
    area: "",
    land_area: "",
    built_area: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    garages: "",
    year_built: "",
    furnishing: "",
    legal_status: "",
    ownership_type: "",
    
    // Location
    country_id: null as number | null,
    province_id: null as number | null,
    district_id: null as number | null,
    ward_id: null as number | null,
    street: "",
    street_number: "",
    building_name: "",
    full_address: "",
    latitude: "",
    longitude: "",
    
    // Media
    images: [] as File[],
    video_url: "",
    virtual_tour_url: "",
    
    // Amenities
    amenities: [] as number[],
  });

  const { createProperty, isCreating } = useCreateProperty();

  const steps = [
    { id: "description", label: t("1.description"), component: PropertyDescription, ref: descriptionRef },
    { id: "media", label: t("2.media"), component: UploadMedia, ref: mediaRef },
    { id: "location", label: t("3.location"), component: LocationField, ref: locationRef },
    { id: "details", label: t("4.details"), component: DetailsField, ref: detailsRef },
    { id: "amenities", label: t("5.amenities"), component: Amenities, ref: amenitiesRef },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateStepValidation = (step: string, isValid: boolean) => {
    setStepValid(prev => ({ ...prev, [step]: isValid }));
  };

  // Khi category thay đổi, kiểm tra nếu là land thì reset các field không liên quan
  useEffect(() => {
    if (formData.category_id && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);
      if (selectedCategory?.slug === 'land') {
        updateFormData("bedrooms", "");
        updateFormData("bathrooms", "");
        updateFormData("floors", "");
        updateFormData("garages", "");
        updateFormData("year_built", "");
        updateFormData("furnishing", "");
      }
    }
  }, [formData.category_id, categories]);

  const revalidateCurrentStep = () => {
    const currentStepId = steps[activeStep].id;
    const currentRef = steps[activeStep].ref;
    
    if (currentStepId === "description" && currentRef.current?.validate) {
      const isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    } else if (currentStepId === "media" && currentRef.current?.validate) {
      const isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    } else if (currentStepId === "location" && currentRef.current?.validate) {
      const isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    } else if (currentStepId === "details" && currentRef.current?.validate) {
      const isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    } else if (currentStepId === "amenities" && currentRef.current?.validate) {
      const isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      revalidateCurrentStep();
    }, 50);
  }, [activeStep]);

  const focusCurrentStepError = () => {
    const currentStepId = steps[activeStep].id;
    const currentRef = steps[activeStep].ref;
    
    if (currentStepId === "description" && currentRef.current?.focusFirstError) {
      currentRef.current.focusFirstError();
    } else if (currentStepId === "media" && currentRef.current?.focusFirstError) {
      currentRef.current.focusFirstError();
    } else if (currentStepId === "location" && currentRef.current?.focusFirstError) {
      currentRef.current.focusFirstError();
    } else if (currentStepId === "details" && currentRef.current?.focusFirstError) {
      currentRef.current.focusFirstError();
    } else if (currentStepId === "amenities" && currentRef.current?.focusFirstError) {
      currentRef.current.focusFirstError();
    }
  };

  const handleNext = () => {
    const currentStepId = steps[activeStep].id;
    const currentRef = steps[activeStep].ref;
    
    let isValid = stepValid[currentStepId as keyof typeof stepValid];
    
    if (currentStepId === "description" && currentRef.current?.validate) {
      isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    } else if (currentStepId === "media" && currentRef.current?.validate) {
      isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    } else if (currentStepId === "location" && currentRef.current?.validate) {
      isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    } else if (currentStepId === "details" && currentRef.current?.validate) {
      isValid = currentRef.current.validate();
      updateStepValidation(currentStepId, isValid);
    } else if (currentStepId === "amenities" && currentRef.current?.validate) {
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
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  /**
   * Build FormData from form state
   */
  const buildFormData = (): FormData => {
    const formDataToSend = new FormData();
    
    // 1. Add translations
    Object.entries(formData.translations).forEach(([locale, data]) => {
      formDataToSend.append(`translations[${locale}][title]`, data.title);
      formDataToSend.append(`translations[${locale}][description]`, data.description);
    });
    
    // 2. Add basic info
    if (formData.category_id) {
      formDataToSend.append("category_id", formData.category_id.toString());
    }
    formDataToSend.append("type", formData.type);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("is_negotiable", formData.is_negotiable ? "1" : "0");
    
    // 3. Add details
    if (formData.area) formDataToSend.append("area", formData.area);
    if (formData.land_area) formDataToSend.append("land_area", formData.land_area);
    if (formData.built_area) formDataToSend.append("built_area", formData.built_area);
    if (formData.bedrooms) formDataToSend.append("bedrooms", formData.bedrooms);
    if (formData.bathrooms) formDataToSend.append("bathrooms", formData.bathrooms);
    if (formData.floors) formDataToSend.append("floors", formData.floors);
    if (formData.garages) formDataToSend.append("garages", formData.garages);
    if (formData.year_built) formDataToSend.append("year_built", formData.year_built);
    if (formData.furnishing) formDataToSend.append("furnishing", formData.furnishing);
    if (formData.legal_status) formDataToSend.append("legal_status", formData.legal_status);
    if (formData.ownership_type) formDataToSend.append("ownership_type", formData.ownership_type);
    
    // 4. Add location
    if (formData.country_id) formDataToSend.append("country_id", formData.country_id.toString());
    if (formData.province_id) formDataToSend.append("province_id", formData.province_id.toString());
    if (formData.district_id) formDataToSend.append("district_id", formData.district_id.toString());
    if (formData.ward_id) formDataToSend.append("ward_id", formData.ward_id.toString());
    if (formData.street) formDataToSend.append("street", formData.street);
    if (formData.street_number) formDataToSend.append("street_number", formData.street_number);
    if (formData.building_name) formDataToSend.append("building_name", formData.building_name);
    if (formData.full_address) formDataToSend.append("full_address", formData.full_address);
    if (formData.latitude) formDataToSend.append("latitude", formData.latitude);
    if (formData.longitude) formDataToSend.append("longitude", formData.longitude);
    
    // 5. Add media
    formData.images.forEach((image) => {
      formDataToSend.append("images[]", image);
    });
    if (formData.video_url) formDataToSend.append("video_url", formData.video_url);
    if (formData.virtual_tour_url) formDataToSend.append("virtual_tour_url", formData.virtual_tour_url);
    
    // 6. Add amenities
    formData.amenities.forEach((amenityId) => {
      formDataToSend.append("amenities[]", amenityId.toString());
    });
    
    return formDataToSend;
  };

  /**
   * Validate all steps before submit
   */
  const validateAllSteps = (): boolean => {
    // Trigger validation for all steps
    const stepsToValidate = ["description", "media", "location", "details"];
    let allValid = true;
    
    stepsToValidate.forEach((stepId) => {
      const step = steps.find(s => s.id === stepId);
      if (step?.ref.current?.validate) {
        const isValid = step.ref.current.validate();
        updateStepValidation(stepId, isValid);
        if (!isValid) allValid = false;
      }
    });
    
    // Amenities is optional, always valid
    updateStepValidation("amenities", true);
    
    return allValid;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Prevent double submission
    if (isSubmitting || isCreating) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate all steps
      const isValid = validateAllSteps();
      
      if (!isValid) {
        // Find first invalid step and navigate to it
        const firstInvalidStep = steps.find(step => !stepValid[step.id as keyof typeof stepValid]);
        if (firstInvalidStep) {
          const stepIndex = steps.findIndex(s => s.id === firstInvalidStep.id);
          setActiveStep(stepIndex);
          // Focus on error after a short delay
          setTimeout(() => {
            if (firstInvalidStep.id === "description" && descriptionRef.current?.focusFirstError) {
              descriptionRef.current.focusFirstError();
            } else if (firstInvalidStep.id === "media" && mediaRef.current?.focusFirstError) {
              mediaRef.current.focusFirstError();
            } else if (firstInvalidStep.id === "location" && locationRef.current?.focusFirstError) {
              locationRef.current.focusFirstError();
            } else if (firstInvalidStep.id === "details" && detailsRef.current?.focusFirstError) {
              detailsRef.current.focusFirstError();
            }
          }, 100);
        }
        toast.error(t("validation.fill_all_required_fields"));
        setIsSubmitting(false);
        return;
      }
      
      // Build form data
      const formDataToSend = buildFormData();
      
      // Log form data for debugging
      console.log("Submitting property:", Object.fromEntries(formDataToSend));
      
      // Submit to API
      createProperty(formDataToSend, {
        onSuccess: (response) => {
          toast.success(t("property.created.success"));
          // Redirect to my properties after 2 seconds
          setTimeout(() => {
            router.push("/dashboard/my-properties");
          }, 2000);
        },
        onError: (error: any) => {
          console.error("Submit error:", error);
          const errorMessage = error?.response?.data?.message || error?.message || t("property.created.error");
          toast.error(errorMessage);
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(t("property.created.error"));
      setIsSubmitting(false);
    }
  };

  const currentStep = steps[activeStep];
  const ActiveComponent = currentStep.component;
  const currentStepValid = stepValid[currentStep.id as keyof typeof stepValid];

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
            disabled={isSubmitting || isCreating}
          >
            <i className="fas fa-arrow-left me-2" />
            {t("previous")}
          </button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <button
            className={`ud-btn btn-thm ${activeStep === 0 ? "ms-auto" : ""}`}
            onClick={handleNext}
            disabled={isSubmitting || isCreating}
          >
            {t("next")}
            <i className="fas fa-arrow-right ms-2" />
          </button>
        ) : (
          <button
            className="ud-btn btn-thm ms-auto"
            onClick={handleSubmit}
            disabled={isSubmitting || isCreating}
          >
            {(isSubmitting || isCreating) ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {t("publishing")}
              </>
            ) : (
              <>
                {t("publish.property")}
                <i className="fas fa-check ms-2" />
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

export default AddPropertyTabContent;