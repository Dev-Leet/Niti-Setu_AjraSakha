export interface ValidationConstraint {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean;
}

export interface FieldValidation {
  field: string;
  constraints: ValidationConstraint;
  errorMessage?: string;
}
 
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}