export default interface FormValidationErrorModel<Type> {
  values: Type;
  errorFields: ErrorFieldModel[];
  outOfDate: boolean;
}

export interface ErrorFieldModel {
  name: string[];
  errors: string[];
  warnings: any[];
}

export function isFormValidationError<Type>(object: any): object is FormValidationErrorModel<Type> {
  return (
    typeof object == 'object' &&
    'values' in object &&
    'errorFields' in object &&
    'outOfDate' in object
  );
}
