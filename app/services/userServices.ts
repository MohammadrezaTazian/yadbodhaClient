import api from './api';
import { UserInfoModel } from '../models/user/UserInfoModel';
import { ProfileModel } from '../models/user/profileModel';

export const userServices = {

  userInfo: async (): Promise<UserInfoModel> => {
    const res: UserInfoModel = await api('get', '/api/User/UserInfo', null, true);
    return res;
  },

  ProfileUpdate: async (data: FormData, removePic: boolean) => {
    await api('post', '/api/User/ProfileUpdate', data, true, true, {removePic});
  },

  getProfileInfo: async (): Promise<ProfileModel> => {
    const res: ProfileModel = await api('get', '/api/User/ProfileInfo', null, true);
    return res;
  },


};
