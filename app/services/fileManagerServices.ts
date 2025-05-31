import { PicFileModel } from '../models/Deceased/picFileModel';
import api from './api';

export const fileManagerServices = {

  getDeceasedPicsList: async (deceasedId: number): Promise<PicFileModel[]> => {
    const res: PicFileModel[] = await api('get', '/api/fileManager/DeceasedPicsList', null, true, false, {deceasedId});
    return res;
  },

  DeceasedPicDelete: async (fileId: number) => {
    await api('post', '/api/fileManager/DeceasedPicDelete', null, true, true, {fileId});
  },

  // ProfileUpdate: async (data: FormData, removePic: boolean) => {
  //   await api('post', '/api/User/ProfileUpdate', data, true, true, {removePic});
  // },

  // getProfileInfo: async (): Promise<ProfileModel> => {
  //   const res: ProfileModel = await api('get', '/api/User/ProfileInfo', null, true);
  //   return res;
  // },


};
