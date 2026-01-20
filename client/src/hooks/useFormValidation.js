import { useState } from "react";

const validationRules = {
  teamName: {
    required: true,
    maxLength: 100,
    message: "Team name is required (max 100 characters)",
  },
  season: {
    required: true,
    pattern: /^\d{4}\/\d{2}$/,
    message: "Season must be in format YYYY/YY (e.g., 2024/25)",
  },
  type: {
    required: true,
    enum: ["home", "away", "third", "fourth", "fifth", "goalkeeper", "special", "anniversary"],
    message: "Please select a valid shirt type",
  },
  condition: {
    required: true,
    enum: ["brandNewTags", "brandNew", "mint", "excellent", "good", "fair", "poor"],
    message: "Please select a condition",
  },
  size: {
    enum: ["", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "+4XL"],
    message: "Please select a valid size",
  },
  playerNumber: {
    min: 0,
    max: 99,
    integer: true,
    message: "Player number must be between 0-99",
  },
  purchasePrice: {
    min: 0,
    message: "Price cannot be negative",
  },
  currentValue: {
    min: 0,
    message: "Value cannot be negative",
  },
  notes: {
    maxLength: 500,
    message: "Notes cannot exceed 500 characters",
  },
};

const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    // Required check
    if (rules.required && (!value || value === "")) {
      return rules.message || `${fieldName} is required`;
    }

    // If value is empty and not required, no further validation needed
    if (!value || value === "") {
      return null;
    }

    // Pattern check (regex)
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || `${fieldName} format is invalid`;
    }

    // Enum check
    if (rules.enum && !rules.enum.includes(value)) {
      return rules.message || `${fieldName} has an invalid value`;
    }

    // Max length check
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `${fieldName} is too long`;
    }

    // Number validations
    const numValue = Number(value);

    // Integer check
    if (rules.integer && !Number.isInteger(numValue)) {
      return rules.message || `${fieldName} must be a whole number`;
    }

    // Min value check
    if (rules.min !== undefined && numValue < rules.min) {
      return rules.message || `${fieldName} must be at least ${rules.min}`;
    }

    // Max value check
    if (rules.max !== undefined && numValue > rules.max) {
      return rules.message || `${fieldName} must be at most ${rules.max}`;
    }

    return null;
  };

  const validateForm = (formData) => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setFieldError = (fieldName, error) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const clearFieldError = (fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    clearAllErrors,
  };
};

export default useFormValidation;
