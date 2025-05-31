'use client';
import React, { useEffect } from 'react';
import { UserTokenModel } from '../models/authentication/UserTokenModel';
import { UserInfoModel } from '../models/user/UserInfoModel';
import Cookies from 'js-cookie';
//import jwt_decode from 'jsonwebtoken'
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { userServices } from '../services/userServices';
import { errorByMessage } from '../helper/ErrorHandler';
//import message from "../helper/AntdMessage";

type AuthContextModel = {
  userToken: UserTokenModel | undefined;
  userInfo: UserInfoModel | undefined;
  setUserInfo: (userInfo: UserInfoModel) => void;
  login: (userToken: UserTokenModel) => void;
  logout: () => void;
  getUserInfo: () => void;
};

export const AuthContext = React.createContext<AuthContextModel>({} as AuthContextModel);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = React.useState<UserInfoModel>();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [userToken, setUserToken] = React.useState<UserTokenModel | undefined>();
  React.useEffect(() => {
    getTokenFromLocal();
  }, []);

  const getTokenFromLocal = async () => {
    const token = Cookies.get('access-token');
    if (token !== undefined) {
      const decodedToken = await parseJwt(token);
      if (decodedToken) {
        setUserToken({
          userId: Number(decodedToken.userId),
        });
      }
    } else {
      Cookies.remove('access-token');
      messageApi.warning('از سیستم خارج شده اید دوباره وارد شوید');
      router.replace('/login');
    }
  };

  function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      if (Cookies.get('access-token')) {
        const result: UserInfoModel = await userServices.userInfo();
        if (result) {
          setUserInfo(result);
        }
      }
    } catch (error) {
      errorByMessage(error);
    }
  };

  const login = (userToken: UserTokenModel) => {
    setUserToken(userToken);
  };

  const logout = () => {
    Cookies.remove('access-token');
    window.location.reload();
    setUserToken(undefined);
    setUserInfo(undefined);
  };

  return (
    <>
      {contextHolder}
      <AuthContext.Provider
        value={{
          userToken,
          userInfo,
          setUserInfo,
          login,
          logout,
          getUserInfo,
        }}
      >
        {props.children}
      </AuthContext.Provider>
    </>
  );
};
