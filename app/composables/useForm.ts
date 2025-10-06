import { ref, reactive, computed } from "vue";

export interface FormField {
  name: string;
  value: any;
  required?: boolean;
  validator?: (value: any) => string | null;
  type?: string;
  label?: string;
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
}

export interface FormConfig {
  fields: Record<string, Partial<FormField>>;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  resetOnSuccess?: boolean;
  autoValidate?: boolean;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  message: string;
  messageType: "success" | "error" | "";
}

export function useForm(config: FormConfig) {
  // Initialize form state
  const state = reactive<FormState>({
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false,
    isDirty: false,
    isValid: false,
    message: "",
    messageType: "",
  });

  // Initialize field values from config
  Object.entries(config.fields).forEach(([name, field]) => {
    state.values[name] = field.value ?? "";
    state.touched[name] = false;
    state.errors[name] = "";
  });

  // Computed properties
  const isDirty = computed(() => {
    return Object.values(state.touched).some((touched) => touched);
  });

  const isValid = computed(() => {
    return Object.keys(state.errors).every((key) => !state.errors[key]);
  });

  // Field validation
  const validateField = (fieldName: string, value: any): string => {
    const field = config.fields[fieldName];
    if (!field) return "";

    // Required validation
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label || fieldName} is required`;
    }

    // Custom validator
    if (field.validator && value) {
      const error = field.validator(value);
      if (error) return error;
    }

    // Type-specific validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    return "";
  };

  // Validate all fields
  const validate = (): boolean => {
    let hasErrors = false;

    Object.keys(config.fields).forEach((fieldName) => {
      const error = validateField(fieldName, state.values[fieldName]);
      state.errors[fieldName] = error;
      if (error) hasErrors = true;
    });

    return !hasErrors;
  };

  // Update field value
  const setFieldValue = (fieldName: string, value: any) => {
    if (!(fieldName in state.values)) return;

    state.values[fieldName] = value;
    state.touched[fieldName] = true;
    state.isDirty = isDirty.value;

    // Auto-validate if enabled
    if (config.autoValidate) {
      state.errors[fieldName] = validateField(fieldName, value);
    }
  };

  // Set field error
  const setFieldError = (fieldName: string, error: string) => {
    state.errors[fieldName] = error;
  };

  // Touch field (mark as interacted with)
  const touchField = (fieldName: string) => {
    state.touched[fieldName] = true;
  };

  // Reset form
  const reset = () => {
    Object.keys(config.fields).forEach((fieldName) => {
      state.values[fieldName] = config.fields[fieldName].value ?? "";
      state.errors[fieldName] = "";
      state.touched[fieldName] = false;
    });
    state.isSubmitting = false;
    state.message = "";
    state.messageType = "";
    state.isDirty = false;
  };

  // Show message
  const showMessage = (text: string, type: "success" | "error") => {
    state.message = text;
    state.messageType = type;

    // Auto-clear message after 5 seconds
    setTimeout(() => {
      state.message = "";
      state.messageType = "";
    }, 5000);
  };

  // Submit form
  const submit = async (event?: Event) => {
    if (event) {
      event.preventDefault();
    }

    // Mark all fields as touched
    Object.keys(config.fields).forEach((fieldName) => {
      state.touched[fieldName] = true;
    });

    // Validate form
    if (!validate()) {
      showMessage(
        config.errorMessage || "Please fix the errors below",
        "error"
      );
      return false;
    }

    state.isSubmitting = true;
    state.message = "";

    try {
      let response;

      if (config.endpoint) {
        // Submit to API endpoint
        response = await $fetch(config.endpoint, {
          method: config.method || "POST",
          body: state.values,
        });
      } else {
        // Custom submission logic
        response = await config.onSuccess?.(state.values);
      }

      // Handle success
      if (response?.success !== false) {
        showMessage(
          config.successMessage || "Form submitted successfully!",
          "success"
        );

        if (config.resetOnSuccess !== false) {
          reset();
        }

        config.onSuccess?.(response);
        return true;
      }
    } catch (error: any) {
      console.error("Form submission error:", error);

      // Handle API errors
      let errorMessage =
        config.errorMessage || "Something went wrong. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showMessage(errorMessage, "error");
      config.onError?.(error);
      return false;
    } finally {
      state.isSubmitting = false;
    }

    return false;
  };

  // Get field props for easy binding
  const getFieldProps = (fieldName: string) => {
    return {
      value: state.values[fieldName],
      error: state.errors[fieldName],
      touched: state.touched[fieldName],
      "onUpdate:value": (value: any) => setFieldValue(fieldName, value),
      onBlur: () => touchField(fieldName),
    };
  };

  return {
    // State
    state: readonly(state),
    values: readonly(toRefs(state.values)),
    errors: readonly(toRefs(state.errors)),
    touched: readonly(toRefs(state.touched)),

    // Computed
    isDirty,
    isValid,
    isSubmitting: readonly(toRef(state.isSubmitting)),
    message: readonly(toRef(state.message)),
    messageType: readonly(toRef(state.messageType)),

    // Methods
    setFieldValue,
    setFieldError,
    touchField,
    validate,
    reset,
    submit,
    showMessage,
    getFieldProps,
  };
}
