"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";

interface UploadMediaProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export interface UploadMediaRef {
  focusFirstError: () => boolean;
  validate: () => boolean;
}

const UploadMedia = forwardRef<UploadMediaRef, UploadMediaProps>(
  ({ formData, updateFormData, onValidationChange }, ref) => {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadAreaRef = useRef<HTMLDivElement>(null);

    // Validate form
    const validate = () => {
      const newErrors: Record<string, string> = {};
      let firstErrorField: string | null = null;
      
      // Check if at least one image is uploaded
      if (formData.images.length === 0) {
        newErrors.images = t("validation.images.required");
        if (!firstErrorField) firstErrorField = "images";
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
      
      if (firstErrorField === "images") {
        uploadAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        uploadAreaRef.current?.classList.add("shake");
        setTimeout(() => {
          uploadAreaRef.current?.classList.remove("shake");
        }, 500);
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
    }, [formData.images.length]);

    const handleUpload = (files: FileList | null) => {
      if (!files) return;
      
      const newImages = [...formData.images];
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setErrors(prev => ({ ...prev, images: t("validation.images.invalid_type") }));
          return;
        }
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, images: t("validation.images.too_large", { size: 10 }) }));
          return;
        }
        newImages.push(file);
      }
      updateFormData("images", newImages);
      setTouched(prev => ({ ...prev, images: true }));
      // Clear error if images exist
      if (newImages.length > 0) {
        setErrors(prev => ({ ...prev, images: undefined }));
      }
    };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      handleUpload(event.dataTransfer.files);
    };

    const handleDelete = (index: number) => {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      updateFormData("images", newImages);
      if (newImages.length === 0) {
        setTouched(prev => ({ ...prev, images: true }));
        validate();
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleUpload(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    return (
      <form className="form-style1">
        <h4 className="title fz17 mb30">{t("upload.photos")}</h4>
        
        <div className="row">
          <div className="col-lg-12">
            <div
              ref={uploadAreaRef}
              className={`upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2 ${
                errors.images && touched.images ? "border-danger" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{
                border: errors.images && touched.images ? "2px dashed #dc3545" : "2px dashed #e5e7eb",
                background: errors.images && touched.images ? "rgba(220,53,69,0.05)" : "transparent"
              }}
            >
              <div className="icon mb30">
                <span className="flaticon-upload" />
              </div>
              <h4 className="title fz17 mb10">{t("upload.drag")}</h4>
              <p className="text mb25">
                {t("upload.photos.format")}
              </p>
              <button
                type="button"
                className="ud-btn btn-white"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("browse.files")}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="d-none"
                onChange={handleFileInputChange}
              />
              {errors.images && touched.images && (
                <div className="text-danger small mt-2">{errors.images}</div>
              )}
            </div>

            {/* Preview uploaded images */}
            {formData.images.length > 0 && (
              <div className="row profile-box position-relative d-md-flex align-items-end mb50">
                <div className="col-12 mb-3">
                  <span className="text-success">
                    <i className="fas fa-check-circle me-1" />
                    {t("uploaded.count", { count: formData.images.length })}
                  </span>
                </div>
                {formData.images.map((image: File, index: number) => (
                  <div className="col-2" key={index}>
                    <div className="profile-img mb20 position-relative">
                      <Image
                        width={212}
                        height={194}
                        className="w-100 bdrs12 cover"
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded Image ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="tag-del"
                        onClick={() => handleDelete(index)}
                        data-tooltip-id={`delete-${index}`}
                      >
                        <span className="fas fa-trash-can" />
                      </button>
                      <ReactTooltip
                        id={`delete-${index}`}
                        place="right"
                        content={t("delete.image")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Option */}
        <h4 className="title fz17 mb30 mt-4">{t("video.option")}</h4>
        <div className="row">
          <div className="col-sm-6 col-xl-12">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">
                {t("video.url")}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.video_url}
                onChange={(e) => updateFormData("video_url", e.target.value)}
              />
              <small className="text-muted">{t("video.help")}</small>
            </div>
          </div>
        </div>

        {/* Virtual Tour */}
        <h4 className="title fz17 mb30 mt-4">{t("virtual.tour")}</h4>
        <div className="row">
          <div className="col-sm-6 col-xl-12">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">
                {t("virtual.tour.url")}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="https://my.matterport.com/show/?m=..."
                value={formData.virtual_tour_url}
                onChange={(e) => updateFormData("virtual_tour_url", e.target.value)}
              />
              <small className="text-muted">{t("virtual.tour.help")}</small>
            </div>
          </div>
        </div>

        <style jsx>{`
          .upload-img {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .upload-img:hover {
            border-color: #eb6753 !important;
            background: rgba(235, 103, 83, 0.05);
          }
          .border-danger {
            border-color: #dc3545 !important;
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

UploadMedia.displayName = "UploadMedia";

export default UploadMedia;