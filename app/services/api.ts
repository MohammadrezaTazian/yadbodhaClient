import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { authenticateServices } from './authenticateServices';

function isAxiosError(object: any): object is AxiosError {
  return typeof object == 'object' && 'message' in object && 'code' in object;
}

export const getAccessToken = (): string => {
  return Cookies.get('access-token') ?? '';
};

export const getUrlToken = (): string => {
  return Cookies.get('url-token') ?? '';
};

export const baseUrl = (): string => {
  return 'http://localhost:7210';
};

export default async function api<resultType>(
  method: 'get' | 'post' | 'delete' | 'put',
  path: string,
  data: unknown,
  needAuthenticated: boolean,
  needContent?: boolean,
  params?: object,
  otherOptions?: object,
  retry?: boolean
): Promise<resultType> {
  if (needAuthenticated && getAccessToken() === '') {
    Cookies.remove('access-token');
    Cookies.remove('refresh-token');
    Cookies.remove('url-token');
    window.location.reload();
    return Promise.reject({ errors: ['برای استفاده از سیستم وارد شوید '] });
  }
  const headers = (needContent && needContent === true) ?
    {
        Authorization: 'Bearer ' + getAccessToken(),
    }
    : 
    needAuthenticated
      ? {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + getAccessToken(),
        }
      : { 'content-type': 'application/json' };

  try {
    const response = await axios({
      url: baseUrl() + path,
      method: method,
      headers: headers,
      data: data,
      params: params,
      ...otherOptions,
    });
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject({
        errors: ['خطائی در فراخوانی سرویس به وجود آمده است'],
      });
    }
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.code && axiosError.code === 'ERR_NETWORK')
        return Promise.reject({ errors: ['مشکلی در ارتباط  شبکه شما وجود دارد'] });
      else if (axiosError.response && axiosError.response.status === 401) {
        if (retry) {
          
          Cookies.remove('access-token');
          Cookies.remove('refresh-token');
          Cookies.remove('url-token');
          window.location.reload();
          return Promise.reject({
            errors: ['برای استفاده از سیستم وارد شوید و یا ثبت نام کنید'],
          });
        }
        try {
          const user = await authenticateServices.refreshToken();
          if (user) {
            return api(method, path, data, needAuthenticated, needContent, params, otherOptions, true);
          } else {
            Cookies.remove('access-token');
            Cookies.remove('refresh-token');
            Cookies.remove('url-token');
            window.location.reload();
            return Promise.reject({
              errors: ['برای استفاده از سیستم وارد شوید و یا ثبت نام کنید'],
            });
          }
        } catch {
          Cookies.remove('access-token');
          Cookies.remove('refresh-token');
          Cookies.remove('url-token');
          window.location.reload();
        }
      } else if (axiosError.response && axiosError.response.status === 403) {
        return Promise.reject({ errors: ['شما مجوز استفاده از این سرویس را ندارید'] });
      } else if (axiosError.response && axiosError.response.status === 520) {
        return Promise.reject({ errors: axiosError.response.data });
      } else if (
        axiosError.code &&
        axiosError.code === 'ERR_BAD_RESPONSE' &&
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === 'string'
      ) {
        console.error(error);
        if (axiosError.response.data.startsWith('Proxy error:'))
          return Promise.reject({ errors: ['مشکلی در ارتباط با سرویس دهنده وجود دارد'] });
        else
          return Promise.reject({
            errors: ['مشکلی ناشناخته ای در ارتباط با سرویس دهنده وجود دارد'],
          });
      } else if (
        axiosError.code &&
        (axiosError.code === 'ERR_BAD_REQUEST' || axiosError.code === 'ERR_BAD_RESPONSE') &&
        axiosError.response &&
        axiosError.response.data
      )
        return Promise.reject({ errors: axiosError.response.data });
    }
    console.error(error); 
    return Promise.reject({ errors: ['مشکلی در فراخوانی سرویس به وجود آمده است'] });
  }
}
