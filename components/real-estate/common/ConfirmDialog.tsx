"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  warning?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary" | "warning";
  icon?: "delete" | "warning" | "info" | "success";
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  warning,
  confirmText,
  cancelText,
  confirmVariant = "danger",
  icon = "delete",
  onConfirm,
  onCancel,
  isConfirming,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (icon) {
      case "delete":
        return (
          <div className="confirm-icon confirm-icon-danger">
            <i className="fas fa-trash-alt" />
          </div>
        );
      case "warning":
        return (
          <div className="confirm-icon confirm-icon-warning">
            <i className="fas fa-exclamation-triangle" />
          </div>
        );
      case "info":
        return (
          <div className="confirm-icon confirm-icon-info">
            <i className="fas fa-info-circle" />
          </div>
        );
      case "success":
        return (
          <div className="confirm-icon confirm-icon-success">
            <i className="fas fa-check-circle" />
          </div>
        );
      default:
        return null;
    }
  };

  const getConfirmButtonClass = () => {
    switch (confirmVariant) {
      case "danger":
        return "confirm-btn confirm-btn-danger";
      case "primary":
        return "confirm-btn confirm-btn-primary";
      case "warning":
        return "confirm-btn confirm-btn-warning";
      default:
        return "confirm-btn confirm-btn-danger";
    }
  };

  return (
    <>
      <div className="confirm-modal">
        <div className="confirm-overlay" onClick={onCancel} />
        <div className="confirm-container">
            <div className="confirm-content">
            <div className="confirm-header">
                {getIcon()}
                <h3 className="confirm-title">{title}</h3>
            </div>
            
            <div className="confirm-body">
                <p className="confirm-message">{message}</p>
                {warning && (
                <div className="confirm-warning">
                    <i className="fas fa-exclamation-circle" />
                    <span>{warning}</span>
                </div>
                )}
            </div>

            <div className="confirm-footer">
                <button
                type="button"
                className="confirm-btn confirm-btn-secondary"
                onClick={onCancel}
                disabled={isConfirming}
                >
                {cancelText || t("cancel")}
                </button>
                <button
                type="button"
                className={getConfirmButtonClass()}
                onClick={onConfirm}
                disabled={isConfirming}
                >
                {isConfirming ? (
                    <>
                    <i className="fas fa-spinner fa-spin" />
                    {t("processing")}
                    </>
                ) : (
                    confirmText || t("confirm")
                )}
                </button>
            </div>
            </div>
        </div>
      </div>  
    </>
  );
};

export default ConfirmDialog;