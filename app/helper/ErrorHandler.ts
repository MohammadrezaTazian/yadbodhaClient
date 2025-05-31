"useClient";
import { message } from "antd";
import { ApiErrorModel, isApiError } from "../models/view/ApiErrorModel";
import { isFormValidationError } from "../models/view/FormValidationErrorModel";
//import { MessageInstance } from 'antd/es/message/interface';

export function errorByMessage(error: any) {
  if (isApiError(error)) {
    const apiError = error as ApiErrorModel;
    //console.log("apiError", apiError.errors[0]);
    apiError.errors.length > 1
      ? apiError.errors.forEach((error) => message.error(error))
      : message.error(apiError.errors);
  } else if (!isFormValidationError(error)) {
    message.error("مشکلی در فراخوانی سرویس به وجود آمده است");
    console.error(error);
  }
}

// export function errorByMessage(error: unknown, message: MessageInstance) {
//   if (isApiError(error)) {
//     console.log('error', error)
//     const apiError = error as ApiErrorModel;
//         apiError.errors.length > 1
//       ? apiError.errors.forEach((error) => message.error(error))
//       : message.error(apiError.errors[0]);
//     ////apiError.errors.forEach((error) => message.error(error));
//   } else if (!isFormValidationError(error)) {
//     message.error('مشکلی در فراخوانی سرویس به وجود آمده است');
//     console.error(error);
//   }
// }


export function errorResult(error: any) {
  if (isApiError(error)) {
    const apiError = error as ApiErrorModel;
    return apiError.errors;
  } else if (!isFormValidationError(error)) {
    console.error(error);
    return ["مشکلی در فراخوانی سرویس به وجود آمده است"];
  }
  return [];
}
