export interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface RegisterFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  form?: string;
}

// Helper type để lấy error message
export type FormError<T> = {
  [K in keyof T]?: string;
};

// Helper type để check required fields
export type RequiredFields<T> = {
  [K in keyof T]: T[K] extends undefined | null ? never : K;
}[keyof T];

export interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
} 