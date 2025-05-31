export interface ApiErrorModel {
  errors: string[];
}

export function isApiError(object: any): object is ApiErrorModel {
  return typeof object == 'object' && 'errors' in object;
}
