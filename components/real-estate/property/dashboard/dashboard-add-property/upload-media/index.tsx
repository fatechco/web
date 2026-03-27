"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";

interface UploadMediaProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
  maxFiles?: number;
  maxFileSize?: number; // MB
  existingImages?: any[];
}

export interface UploadMediaRef {
  focusFirstError: () => boolean;
  validate: () => boolean;
}

const UploadMedia = forwardRef<UploadMediaRef, UploadMediaProps>(
  ({ 
    formData, 
    updateFormData, 
    onValidationChange, 
    maxFiles = 20, 
    maxFileSize = 10,
    existingImages = [] 
  }, ref) => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [dragActive, setDragActive] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadAreaRef = useRef<HTMLDivElement>(null);

    // Cleanup object URLs on unmount
    useEffect(() => {
      return () => {
        Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
      };
    }, [previewUrls]);

    // Combine existing and new images
    const allImages = [...(existingImages || []), ...(formData.images || [])];
    const totalImages = allImages.length;

    // Calculate total storage used
    const totalStorageUsed = allImages.reduce((sum: number, img: any) => {
      const file = img instanceof File ? img : img?.file;
      if (file instanceof File) {
        return sum + file.size;
      }
      return sum + (img.size_bytes || 0);
    }, 0);
    
    const totalStorageMB = (totalStorageUsed / 1024 / 1024).toFixed(2);
    const maxStorageMB = maxFiles * maxFileSize;

    // Get image URL safely
    const getImageUrl = (image: any): string => {
      const file = image instanceof File ? image : image?.file;
      if (file instanceof File) {
        const key = `${file.name}-${file.size}`;
        if (!previewUrls[key]) {
          const url = URL.createObjectURL(file);
          setPreviewUrls(prev => ({ ...prev, [key]: url }));
          return url;
        }
        return previewUrls[key];
      }
      return image?.thumbnail || image?.url || "/placeholder.png";
    };

    // Validate form
    const validate = () => {
      const newErrors: Record<string, string> = {};
      let firstErrorField: string | null = null;
      
      if (totalImages === 0) {
        newErrors.images = t("validation.images.required");
        if (!firstErrorField) firstErrorField = "images";
      }
      
      if (totalImages > maxFiles) {
        newErrors.images = t("validation.images.max_files", { count: maxFiles });
        if (!firstErrorField) firstErrorField = "images";
      }
      
      if (totalStorageUsed > maxFiles * maxFileSize * 1024 * 1024) {
        newErrors.storage = t("validation.images.storage_limit", { limit: maxFiles * maxFileSize });
        if (!firstErrorField) firstErrorField = "storage";
      }
      
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (onValidationChange) onValidationChange(isValid);
      
      return { isValid, firstErrorField };
    };

    const focusFirstError = () => {
      const { firstErrorField } = validate();
      if (!firstErrorField) return false;
      if (firstErrorField === "images" || firstErrorField === "storage") {
        uploadAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        uploadAreaRef.current?.classList.add("shake");
        setTimeout(() => uploadAreaRef.current?.classList.remove("shake"), 500);
      }
      return true;
    };

    useImperativeHandle(ref, () => ({
      focusFirstError,
      validate: () => {
        const { isValid } = validate();
        return isValid;
      }
    }));

    useEffect(() => {
      validate();
    }, [totalImages, totalStorageUsed]);

    const handleUpload = (files: FileList | null) => {
      if (!files) return;
      
      if (totalImages + files.length > maxFiles) {
        setErrors(prev => ({ 
          ...prev, 
          images: t("validation.images.max_files_exceeded", { count: maxFiles, remaining: maxFiles - totalImages })
        }));
        return;
      }
      
      const newImages = [...formData.images];
      
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setErrors(prev => ({ ...prev, images: t("validation.images.invalid_type") }));
          continue;
        }
        
        const fileSizeMB = file.size / 1024 / 1024;
        if (fileSizeMB > maxFileSize) {
          setErrors(prev => ({ 
            ...prev, 
            images: t("validation.images.too_large", { size: maxFileSize, file: file.name })
          }));
          continue;
        }
        
        const newTotalStorage = totalStorageUsed + file.size;
        if (newTotalStorage > maxFiles * maxFileSize * 1024 * 1024) {
          setErrors(prev => ({ 
            ...prev, 
            storage: t("validation.images.storage_limit_exceeded", { limit: maxFiles * maxFileSize })
          }));
          break;
        }
        
        newImages.push({
          file: file,
          name: file.name,
          size: file.size,
          is_primary: false
        });
      }
      
      updateFormData("images", newImages);
      setTouched(prev => ({ ...prev, images: true }));
      
      if (newImages.length > 0) {
        setErrors(prev => ({ ...prev, images: undefined, storage: undefined }));
      }
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
      handleUpload(event.dataTransfer.files);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleUpload(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleDelete = (index: number, isExisting: boolean = false) => {
      if (isExisting) {
        const newExisting = [...existingImages];
        newExisting.splice(index, 1);
        updateFormData("existing_images", newExisting);
      } else {
        const newImages = [...formData.images];
        const removed = newImages.splice(index, 1);
        const file = removed[0] instanceof File ? removed[0] : removed[0]?.file;
        if (file instanceof File) {
          const key = `${file.name}-${file.size}`;
          if (previewUrls[key]) {
            URL.revokeObjectURL(previewUrls[key]);
            setPreviewUrls(prev => {
              const newUrls = { ...prev };
              delete newUrls[key];
              return newUrls;
            });
          }
        }
        updateFormData("images", newImages);
        if (newImages.length === 0) {
          setTouched(prev => ({ ...prev, images: true }));
          validate();
        }
      }
    };

    const setPrimaryImage = (index: number, isExisting: boolean = false) => {
      if (isExisting) {
        const newExisting = existingImages.map((img: any, i: number) => ({
          ...img,
          is_primary: i === index
        }));
        updateFormData("existing_images", newExisting);
      } else {
        if (existingImages.length > 0) {
          const newExisting = existingImages.map((img: any) => ({
            ...img,
            is_primary: false
          }));
          updateFormData("existing_images", newExisting);
        }
        
        const newImages = formData.images.map((img: any, i: number) => {
          if (img instanceof File) {
            return {
              file: img,
              name: img.name,
              size: img.size,
              is_primary: i === index
            };
          }
          return {
            ...img,
            is_primary: i === index
          };
        });
        updateFormData("images", newImages);
      }
    };

    const getStoragePercentage = () => {
      const limit = maxFiles * maxFileSize * 1024 * 1024;
      if (limit === 0) return 0;
      return (totalStorageUsed / limit) * 100;
    };

    const getStorageStatusColor = () => {
      const percentage = getStoragePercentage();
      if (percentage >= 90) return "danger";
      if (percentage >= 70) return "warning";
      return "success";
    };

    const isImagePrimary = (index: number, isExisting: boolean): boolean => {
      if (isExisting) {
        return existingImages[index]?.is_primary === true;
      }
      const newImage = formData.images[index];
      if (!newImage) return false;
      if (newImage.is_primary !== undefined) {
        return newImage.is_primary === true;
      }
      if (existingImages.length === 0 && index === 0 && formData.images[0]?.is_primary !== false) {
        return true;
      }
      return false;
    };

    return (
      <form className="form-style1">
        <div className="storage-info mb-4 p-3 bg-light rounded-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <i className="fas fa-database me-2 text-primary" />
              <strong>{t("storage.usage")}</strong>
            </div>
            <div>
              <span className={`text-${getStorageStatusColor()} fw600`}>
                {totalStorageMB} MB
              </span>
              <span className="text-muted"> / {maxFiles * maxFileSize} MB</span>
            </div>
          </div>
          <div className="progress" style={{ height: "8px" }}>
            <div 
              className={`progress-bar bg-${getStorageStatusColor()}`}
              style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
            />
          </div>
          <div className="d-flex justify-content-between mt-2 small text-muted">
            <span>{t("storage.used")}</span>
            <span>{maxFiles - totalImages} {t("storage.remaining_slots")}</span>
          </div>
          {getStoragePercentage() >= 90 && (
            <div className="alert alert-warning mt-2 mb-0 py-2 small">
              <i className="fas fa-exclamation-triangle me-1" />
              {t("storage.near_limit_warning")}
            </div>
          )}
        </div>

        <h4 className="title fz17 mb30">{t("upload.photos")}</h4>
        
        <div className="row">
          <div className="col-lg-12">
            <div
              ref={uploadAreaRef}
              className={`upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2 ${
                dragActive ? "drag-active" : ""
              } ${errors.images && touched.images ? "border-danger" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: errors.images && touched.images ? "2px dashed #dc3545" : "2px dashed #e5e7eb",
                background: dragActive ? "rgba(235, 103, 83, 0.05)" : errors.images && touched.images ? "rgba(220,53,69,0.05)" : "transparent"
              }}
            >
              <div className="icon mb30">
                <i className="fas fa-cloud-upload-alt fa-3x text-muted" />
              </div>
              <h4 className="title fz17 mb10">{t("upload.drag")}</h4>
              <p className="text mb25">
                {t("upload.photos.format")} ({maxFileSize}MB max per file)
              </p>
              <button
                type="button"
                className="ud-btn btn-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={totalImages >= maxFiles}
              >
                {totalImages >= maxFiles ? t("upload.max_files_reached") : t("browse.files")}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="d-none"
                onChange={handleFileInputChange}
                disabled={totalImages >= maxFiles}
              />
              {errors.images && touched.images && (
                <div className="text-danger small mt-2">{errors.images}</div>
              )}
            </div>

            {allImages.length > 0 && (
              <div className="image-gallery">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <i className="fas fa-images me-2" />
                    {t("images.gallery")} ({allImages.length}/{maxFiles})
                  </h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      if (window.confirm(t("confirm.clear_all_images"))) {
                        Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
                        setPreviewUrls({});
                        updateFormData("images", []);
                        updateFormData("existing_images", []);
                      }
                    }}
                  >
                    <i className="fas fa-trash-alt me-1" />
                    {t("clear_all")}
                  </button>
                </div>
                
                <div className="row g-3">
                  {existingImages.map((image: any, index: number) => (
                    <div key={`existing-${image.id}`} className="col-md-3 col-sm-4 col-6">
                      <div className="image-card position-relative">
                        <div className="image-preview">
                          <img
                            src={image.thumbnail || image.url || "/placeholder.png"}
                            alt={image.caption || "Property image"}
                            className="w-100 rounded-3"
                            style={{ height: "150px", objectFit: "cover" }}
                            onError={(e) => e.currentTarget.src = "/placeholder.png"}
                          />
                          {image.is_primary && (
                            <span className="primary-badge">
                              <i className="fas fa-crown" />
                              {t("primary")}
                            </span>
                          )}
                          <div className="image-actions">
                            <button
                              type="button"
                              className="action-btn primary-btn"
                              onClick={() => setPrimaryImage(index, true)}
                              data-tooltip-id={`primary-${image.id}`}
                              style={{ background: image.is_primary ? "#eb6753" : "rgba(0,0,0,0.7)" }}
                            >
                              <i className="fas fa-crown" />
                            </button>
                            <button
                              type="button"
                              className="action-btn delete-btn"
                              onClick={() => handleDelete(index, true)}
                              data-tooltip-id={`delete-${image.id}`}
                            >
                              <i className="fas fa-trash-alt" />
                            </button>
                          </div>
                        </div>
                        <div className="image-info mt-2">
                          <small className="text-muted d-block text-truncate">
                            {image.original_name || "Image"}
                          </small>
                          <small className="text-muted">
                            {(image.size_bytes / 1024 / 1024).toFixed(1)} MB
                          </small>
                        </div>
                        <ReactTooltip id={`primary-${image.id}`} place="top" content={t("set_as_primary")} />
                        <ReactTooltip id={`delete-${image.id}`} place="top" content={t("delete")} />
                      </div>
                    </div>
                  ))}
                  
                  {formData.images.map((item: any, index: number) => {
                    const file = item instanceof File ? item : item?.file;
                    if (!file) return null;
                    const isPrimary = isImagePrimary(index, false);
                    return (
                      <div key={`new-${index}`} className="col-md-3 col-sm-4 col-6">
                        <div className="image-card position-relative">
                          <div className="image-preview">
                            <img
                              src={getImageUrl(item)}
                              alt={file.name}
                              className="w-100 rounded-3"
                              style={{ height: "150px", objectFit: "cover" }}
                              onError={(e) => e.currentTarget.src = "/placeholder.png"}
                            />
                            {isPrimary && (
                              <span className="primary-badge">
                                <i className="fas fa-crown" />
                                {t("primary")}
                              </span>
                            )}
                            <div className="image-actions">
                              <button
                                type="button"
                                className="action-btn primary-btn"
                                onClick={() => setPrimaryImage(index, false)}
                                data-tooltip-id={`primary-new-${index}`}
                                style={{ background: isPrimary ? "#eb6753" : "rgba(0,0,0,0.7)" }}
                              >
                                <i className="fas fa-crown" />
                              </button>
                              <button
                                type="button"
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(index, false)}
                                data-tooltip-id={`delete-new-${index}`}
                              >
                                <i className="fas fa-trash-alt" />
                              </button>
                            </div>
                          </div>
                          <div className="image-info mt-2">
                            <small className="text-muted d-block text-truncate">{file.name}</small>
                            <small className="text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</small>
                          </div>
                          <ReactTooltip id={`primary-new-${index}`} place="top" content={t("set_as_primary")} />
                          <ReactTooltip id={`delete-new-${index}`} place="top" content={t("delete")} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <h4 className="title fz17 mb30 mt-4">{t("video.option")}</h4>
        <div className="row">
          <div className="col-sm-6 col-xl-12">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">{t("video.url")}</label>
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

        <h4 className="title fz17 mb30 mt-4">{t("virtual.tour")}</h4>
        <div className="row">
          <div className="col-sm-6 col-xl-12">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">{t("virtual.tour.url")}</label>
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
          .drag-active {
            border-color: #eb6753 !important;
            background: rgba(235, 103, 83, 0.1) !important;
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
          
          .image-card {
            transition: transform 0.2s;
          }
          .image-card:hover {
            transform: translateY(-4px);
          }
          .image-preview {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            background: #f3f4f6;
            min-height: 150px;
          }
          .image-actions {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            gap: 6px;
            opacity: 0;
            transition: opacity 0.2s;
          }
          .image-preview:hover .image-actions {
            opacity: 1;
          }
          .action-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          .action-btn:hover {
            transform: scale(1.05);
          }
          .primary-btn:hover {
            background: #eb6753 !important;
          }
          .delete-btn:hover {
            background: #dc2626 !important;
          }
          .primary-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .image-info {
            font-size: 12px;
          }
        `}</style>
      </form>
    );
  }
);

UploadMedia.displayName = "UploadMedia";

export default UploadMedia;