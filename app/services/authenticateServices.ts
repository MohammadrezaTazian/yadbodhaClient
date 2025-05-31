import React from 'react';
import {jwtDecode} from 'jwt-decode';
import api from './api';
import { UserLoginModel } from '../models/authentication/UserLoginModel';
import { UserTokenModel } from '../models/authentication/UserTokenModel';
import { AuthResultModel } from '../models/authentication/AuthResultModel';
import { RefreshTokenModel } from '../models/authentication/RefereshToken';
import { UserInfoModel } from '../models/user/UserInfoModel';
import Cookies from 'js-cookie';
import { ActivateRequestModel } from '../models/authentication/ActivateRequestModel';

export const authenticateServices = {
  authenticate: (res: AuthResultModel) => {
    if (res.accessToken !== undefined)
    {
      Cookies.set('access-token', res.accessToken)
      Cookies.set('refresh-token', res.refreshToken)
      Cookies.set('url-token', res.urlToken)
    }
    
    return authenticateServices.userToken(res.accessToken);
  },
  login: async (data: ActivateRequestModel): Promise<boolean | undefined> => {
    const res = await api<AuthResultModel>(
      'post',
      '/api/authentication/Authenticate/Activate',
      data,
      false
    );
    if (res) {authenticateServices.authenticate(res); return true}
    else 
    return false;
  },

  logout: async () => {
    try {
      await api('post', '/api/authentication/authenticate/logout', null, true);
    } catch (error) {
      console.log('error', error);
    }
    localStorage.clear();
    window.location.reload();
  },

  userToken: (accessToken: string): UserTokenModel | undefined => {

    function parseJwt (accessToken: string) {
      var base64Url = accessToken.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
      
    }    

    if (accessToken === 'undefined' || accessToken === null)
      return undefined;

    const jwt = parseJwt(accessToken);
    return {
      userId: jwt.userId,
    };
    // return {
    //   userName: '',
    //   departmentId: 0,
    //   title: '',
    //   chartTitle: '',
    //   postCode: '',
    //   firstName: '',
    //   lastName: '',
    //   eID: 0,
    //   userId: 0,
    //   employeeID: 0,
    // };
  },
  refreshToken: async (): Promise<UserTokenModel | undefined> => {
    
    function parseJwt (accessToken: string) {
      var base64Url = accessToken.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      console.log('parseJwt', JSON.parse(jsonPayload));
      return JSON.parse(jsonPayload);
      
    }  
    const accessToken = Cookies.get('access-token');
    const refreshToken = Cookies.get('refresh-token');
    if (accessToken == null || refreshToken == null) return undefined;
    const jwt = parseJwt(accessToken);
    const data: RefreshTokenModel = {
      userId: jwt.UserId,
      refreshToken: refreshToken,
    };
    const res = await api<AuthResultModel>(
      'post',
      '/api/authentication/authenticate/refreshToken',
      data,
      false
    );
    if (res) return authenticateServices.authenticate(res);
    else 
    return undefined;
  },

  getActivationCode: async (mobile: string) =>
    api<ActivateRequestModel>('get', '/api/authentication/authenticate/ActivationCode', null, false, false, {mobile}),
};
