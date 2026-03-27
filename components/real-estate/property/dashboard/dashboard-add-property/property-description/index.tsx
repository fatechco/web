"use client";

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import Select from "react-select";
import { useCategories } from "@/hook/use-categories";
import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";

interface PropertyDescriptionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
  onFocusField?: (fieldId: string) => void;
  initialTranslations?: Record<string, { title: string; description: string }>;
}

export interface PropertyDescriptionRef {
  focusFirstError: () => boolean;
}

const PropertyDescription = forwardRef<PropertyDescriptionRef, PropertyDescriptionProps>(
  ({ 
    formData, 
    updateFormData, 
    onValidationChange,
    initialTranslations, 
  }, ref) => {
    const { t } = useTranslation();
    const { categories } = useCategories();
    const { languages } = useSettings();
    const [activeLanguages, setActiveLanguages] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    
    // Refs cho các input
    const titleInputRef = useRef<HTMLInputElement>(null);
    const descTextareaRef = useRef<HTMLTextAreaElement>(null);
    const categoryRef = useRef<any>(null);
    const typeRef = useRef<any>(null);
    const priceInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (languages?.length) {
        const active = languages.filter((lang: any) => lang.active !== false);
        setActiveLanguages(active);
        if (active.length > 0 && !activeTab) {
          setActiveTab(active[0].locale);
        }
      }
    }, [languages]);

    // Initialize translations
    // Initialize translations - ƯU TIÊN initialTranslations
    useEffect(() => {
      // Nếu có initialTranslations từ API, sử dụng nó
      if (initialTranslations && Object.keys(initialTranslations).length > 0) {
        // Kiểm tra xem formData đã có translations chưa
        if (!formData.translations || Object.keys(formData.translations).length === 0) {
          updateFormData("translations", initialTranslations);
        }
      } 
      // Nếu không có initialTranslations, tạo translations rỗng
      else if (activeLanguages.length > 0 && !formData.translations) {
        const translations: Record<string, { title: string; description: string }> = {};
        activeLanguages.forEach((lang) => {
          translations[lang.locale] = { title: "", description: "" };
        });
        updateFormData("translations", translations);
      }
    }, [activeLanguages, initialTranslations]);
    
    const defaultLanguage = activeLanguages.find(l => l.default) || activeLanguages[0];
    const defaultLangCode = defaultLanguage?.locale;

    // Validate form và trả về danh sách lỗi
    const validate = () => {
      const newErrors: Record<string, string> = {};
      let firstErrorField: string | null = null;
      
      // Check default language title
      if (!formData.translations?.[defaultLangCode]?.title?.trim()) {
        newErrors[`title_${defaultLangCode}`] = t("validation.title.required");
        if (!firstErrorField) firstErrorField = `title_${defaultLangCode}`;
      }
      
      // Check default language description
      if (!formData.translations?.[defaultLangCode]?.description?.trim()) {
        newErrors[`description_${defaultLangCode}`] = t("validation.description.required");
        if (!firstErrorField) firstErrorField = `description_${defaultLangCode}`;
      }
      
      // Check category
      if (!formData.category_id) {
        newErrors.category = t("validation.category.required");
        if (!firstErrorField) firstErrorField = "category";
      }
      
      // Check type
      if (!formData.type) {
        newErrors.type = t("validation.type.required");
        if (!firstErrorField) firstErrorField = "type";
      }
      
      // Check price
      if (!formData.price || parseFloat(formData.price) <= 0) {
        newErrors.price = t("validation.price.required");
        if (!firstErrorField) firstErrorField = "price";
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
      if (firstErrorField === "category") {
        categoryRef.current?.focus();
      } else if (firstErrorField === "type") {
        typeRef.current?.focus();
      } else if (firstErrorField === "price") {
        priceInputRef.current?.focus();
      } else if (firstErrorField === `title_${activeTab}`) {
        titleInputRef.current?.focus();
      } else if (firstErrorField === `description_${activeTab}`) {
        descTextareaRef.current?.focus();
      } else if (firstErrorField?.startsWith("title_")) {
        // Nếu lỗi ở title của ngôn ngữ khác, chuyển sang tab đó
        const langCode = firstErrorField.replace("title_", "");
        if (langCode && langCode !== activeTab) {
          setActiveTab(langCode);
          setTimeout(() => titleInputRef.current?.focus(), 100);
        }
      } else if (firstErrorField?.startsWith("description_")) {
        const langCode = firstErrorField.replace("description_", "");
        if (langCode && langCode !== activeTab) {
          setActiveTab(langCode);
          setTimeout(() => descTextareaRef.current?.focus(), 100);
        }
      }
      
      return true;
    };

    // Expose focusFirstError method to parent via ref
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
    }, [formData.translations, formData.category_id, formData.type, formData.price]);

    const handleFieldBlur = (field: string) => {
      setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getTranslation = (locale: string, field: string): string => {
      return formData.translations?.[locale]?.[field] || "";
    };

    const setTranslation = (locale: string, field: string, value: string) => {
      const currentTranslations = formData.translations || {};
      updateFormData("translations", {
        ...currentTranslations,
        [locale]: {
          ...currentTranslations[locale],
          [field]: value,
        },
      });
    };

    const getLanguageName = (locale: string): string => {
      const lang = activeLanguages.find((l) => l.locale === locale);
      return lang?.title || locale.toUpperCase();
    };

    const isDefaultLanguage = (locale: string): boolean => {
      return locale === defaultLangCode;
    };

    const categoryOptions = categories?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

    const typeOptions = [
      { value: "sale", label: t("for.sale") },
      { value: "rent", label: t("for.rent") },
    ];

    const customStyles = {
      option: (styles: any, { isSelected, isHovered }: any) => ({
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
          ? "#eb675312"
          : undefined,
      }),
      control: (styles: any, { isFocused }: any) => ({
        ...styles,
        borderColor: errors.category && touched.category ? "#dc3545" : isFocused ? "#eb6753" : "#e5e7eb",
        boxShadow: errors.category && touched.category ? "0 0 0 0.2rem rgba(220,53,69,0.25)" : "none",
        "&:hover": {
          borderColor: errors.category && touched.category ? "#dc3545" : "#eb6753",
        },
      }),
    };

    const currentTranslation = formData.translations?.[activeTab] || { title: "", description: "" };
    const titleError = touched[`title_${activeTab}`] ? errors[`title_${activeTab}`] : null;
    const descError = touched[`description_${activeTab}`] ? errors[`description_${activeTab}`] : null;

    return (
      <div>
        {/* Language Tabs */}
        <div className="language-tabs mb-4">
          <ul className="nav nav-tabs border-0 gap-2">
            {activeLanguages.map((lang) => {
              const hasError = errors[`title_${lang.locale}`] || errors[`description_${lang.locale}`];
              const isDefault = isDefaultLanguage(lang.locale);
              
              return (
                <li key={lang.locale} className="nav-item">
                  <button
                    className={`nav-link fw500 ${activeTab === lang.locale ? "active" : ""} ${hasError ? "error" : ""}`}
                    onClick={() => setActiveTab(lang.locale)}
                    type="button"
                  >
                    {getLanguageName(lang.locale)}
                    {isDefault && <span className="badge bg-primary ms-1">Default</span>}
                    {hasError && <i className="fas fa-exclamation-circle text-danger ms-1" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Language Content */}
        <div className="language-content">
          <div className="row">
            {/* Title */}
            <div className="col-sm-12">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  {t("title")} ({getLanguageName(activeTab)})
                  {isDefaultLanguage(activeTab) && <span className="text-danger ms-1">*</span>}
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  className={`form-control ${titleError ? "is-invalid" : ""}`}
                  placeholder={`${t("enter.property.title")} (${getLanguageName(activeTab)})`}
                  value={currentTranslation.title}
                  onChange={(e) => setTranslation(activeTab, "title", e.target.value)}
                  onBlur={() => handleFieldBlur(`title_${activeTab}`)}
                />
                {titleError && (
                  <div className="invalid-feedback">{titleError}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="col-sm-12">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  {t("description")} ({getLanguageName(activeTab)})
                  {isDefaultLanguage(activeTab) && <span className="text-danger ms-1">*</span>}
                </label>
                <textarea
                  ref={descTextareaRef}
                  cols={30}
                  rows={5}
                  className={`form-control ${descError ? "is-invalid" : ""}`}
                  placeholder={`${t("enter.property.description")} (${getLanguageName(activeTab)})`}
                  value={currentTranslation.description}
                  onChange={(e) => setTranslation(activeTab, "description", e.target.value)}
                  onBlur={() => handleFieldBlur(`description_${activeTab}`)}
                />
                {descError && (
                  <div className="invalid-feedback">{descError}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Common Fields */}
        <div className="common-fields mt-4 pt-3 border-top">
          <div className="row">
            {/* Category */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  {t("category")} <span className="text-danger">*</span>
                </label>
                <Select
                  ref={categoryRef}
                  value={categoryOptions.find((opt) => opt.value === formData.category_id)}
                  onChange={(opt: any) => updateFormData("category_id", opt?.value)}
                  options={categoryOptions}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder={t("select.category")}
                  onBlur={() => handleFieldBlur("category")}
                />
                {errors.category && touched.category && (
                  <div className="text-danger small mt-1">{errors.category}</div>
                )}
              </div>
            </div>

            {/* Type (Sale/Rent) */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  {t("property.type")} <span className="text-danger">*</span>
                </label>
                <Select
                  ref={typeRef}
                  value={typeOptions.find((opt) => opt.value === formData.type)}
                  onChange={(opt: any) => updateFormData("type", opt?.value)}
                  options={typeOptions}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  onBlur={() => handleFieldBlur("type")}
                />
                {errors.type && touched.type && (
                  <div className="text-danger small mt-1">{errors.type}</div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb30">
                <label className="heading-color ff-heading fw600 mb10">
                  {t("price")} ($) <span className="text-danger">*</span>
                </label>
                <input
                  ref={priceInputRef}
                  type="number"
                  className={`form-control ${errors.price && touched.price ? "is-invalid" : ""}`}
                  placeholder={t("enter.price")}
                  value={formData.price}
                  onChange={(e) => updateFormData("price", e.target.value)}
                  onBlur={() => handleFieldBlur("price")}
                />
                {errors.price && touched.price && (
                  <div className="invalid-feedback">{errors.price}</div>
                )}
              </div>
            </div>

            {/* Is Negotiable */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb30">
                <div className="checkbox-style1">
                  <label className="custom_checkbox">
                    {t("price.negotiable")}
                    <input
                      type="checkbox"
                      checked={formData.is_negotiable}
                      onChange={(e) => updateFormData("is_negotiable", e.target.checked)}
                    />
                    <span className="checkmark" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .language-tabs .nav-tabs .nav-link {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 8px 16px;
            color: #374151;
            background: white;
            transition: all 0.2s;
          }
          .language-tabs .nav-tabs .nav-link:hover {
            border-color: #eb6753;
            color: #eb6753;
          }
          .language-tabs .nav-tabs .nav-link.active {
            background: #eb6753;
            border-color: #eb6753;
            color: white;
          }
          .language-tabs .nav-tabs .nav-link.error {
            border-color: #dc3545;
            color: #dc3545;
          }
          .language-tabs .nav-tabs .nav-link.active.error {
            background: #dc3545;
            border-color: #dc3545;
            color: white;
          }
          .badge {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 20px;
          }
        `}</style>
      </div>
    );
  }
);

PropertyDescription.displayName = "PropertyDescription";

export default PropertyDescription;