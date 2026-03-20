/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import clsx from "clsx";
import React, { forwardRef, InputHTMLAttributes, useId, useState } from "react";
import { useTranslation } from "react-i18next";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  label?: string;
  error?: string;
  rightIcon?: React.ReactElement<any> | null;
  leftIcon?: React.ReactElement<any> | null;
  status?: "default" | "error" | "success";
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      fullWidth,
      label,
      type,
      className,
      error,
      rightIcon,
      status = "default",
      autoComplete,
      placeholder,
      leftIcon,
      containerClassName,
      required,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [inputType, setInputType] = useState(type || "text");
    const { t } = useTranslation();
    const inputId = useId();

    const handleChangeType = () => {
      setInputType(prev => prev === "password" ? "text" : "password");
    };

    // Determine input class based on status
    const getInputClass = () => {
      const baseClass = "form-control";
      if (error || status === "error") return `${baseClass} is-invalid`;
      if (status === "success") return `${baseClass} is-valid`;
      return baseClass;
    };

    return (
      <div
        className={clsx(
          "position-relative",
          fullWidth && "w-100",
          containerClassName
        )}
      >
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="form-label fw600 dark-color">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}

        {/* Input wrapper for icons */}
        <div className="position-relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="position-absolute top-50 start-0 translate-middle-y ms-3 z-1">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            autoComplete={autoComplete || "off"}
            placeholder={placeholder || " "}
            disabled={disabled}
            className={clsx(
              getInputClass(),
              leftIcon && "ps-5", // Padding left for left icon
              rightIcon && "pe-5", // Padding right for right icon
              className
            )}
            {...props}
          />

          {/* Password Toggle Icon */}
          {type === "password" && (
            <button
              type="button"
              onClick={handleChangeType}
              className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent z-1"
              style={{ cursor: 'pointer' }}
            >
              <i className={inputType === "password" ? "ri-eye-line" : "ri-eye-close-line"} />
            </button>
          )}

          {/* Right Icon (if not password) */}
          {rightIcon && type !== "password" && (
            <div className="position-absolute top-50 end-0 translate-middle-y me-3 z-1">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="invalid-feedback d-block" role="alert">
            {t(error)}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";