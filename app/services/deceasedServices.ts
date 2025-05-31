import api from './api';
import { DefaultTextModel } from '../models/DefaultText/DefaultTextModel';
import { DeceasedInfoModel } from '../models/Deceased/DeceasedInfoModel';
import { DeceasedInfoParamModel } from '../models/Deceased/DeceasedInfoParamModel';
import { DeceasedInfoGraveModel } from '../models/Deceased/DeceasedInfoGraveModel';
import { DeceasedPersonsAccessModel } from '../models/Deceased/DeceasedPersonsAccessModel';
import { PicFileModel } from '../models/Deceased/picFileModel';

export const deceasedServices = {

  DeceasedAdd: async (data: FormData) => {
    await api('post', '/api/Deceased/DeceasedAdd', data, true, true);
  },

  DeceasedUpdate: async (data: FormData, deceasedId: number) => {
    await api('post', '/api/Deceased/DeceasedUpdate', data, true, true, {deceasedId});
  },

  getDefaultText: async (defaultTextId: number): Promise<DefaultTextModel> => {
    const res: DefaultTextModel = await api('get', '/api/Deceased/DefaultText', null, true, false,{defaultTextId});
    return res;
  },

  getDeceasedInfo: async (deceasedId: number): Promise<DeceasedInfoModel> => {
    const res: DeceasedInfoModel = await api('get', '/api/Deceased/DeceasedInfo', null, true, false, {deceasedId});
    return res;
  },
  
  getDeceasedInfoList: async (): Promise<DeceasedInfoModel[]> => {
    const res: DeceasedInfoModel[] = await api('get', '/api/Deceased/DeceasedInfoList', null, true);
    return res;
  },

  deceasedActivate: async (isActive: boolean, deceasedId: number) => {
    await api('post', '/api/Deceased/deceasedActivate', null, true, false, {isActive, deceasedId});
  },

  deceasedDelete: async (deceasedId: number) => {
    await api('post', '/api/Deceased/deceasedDelete', null, true, false, {deceasedId});
  },

  getDeceasedInfoWithParamList: async (displayParam: string): Promise<DeceasedInfoParamModel[]> => {
    const res: DeceasedInfoParamModel[] = await api('get', '/api/Deceased/DeceasedInfoWithParamList', null, true, false, {displayParam});
    return res;
  },

  getDeceasedInfoForGrave: async (deceasedId: number): Promise<DeceasedInfoGraveModel> => {
    const res: DeceasedInfoGraveModel = await api('get', '/api/Deceased/DeceasedInfoForGrave', null, true, false, {deceasedId});
    return res;
  },

  getDeceasedPersonsAccessList: async (deceasedId: number): Promise<DeceasedPersonsAccessModel[]> => {
    const res: DeceasedPersonsAccessModel[] = await api('get', '/api/Deceased/DeceasedPersonsAccessList', null, true, false, {deceasedId});
    return res;
  },
  
  personAccessAdd: async (data: DeceasedPersonsAccessModel) => {
    await api('post', '/api/Deceased/personAccessAdd', data, true, true);
  },

  personAccessUpdate: async (data: DeceasedPersonsAccessModel) => {
    await api('post', '/api/Deceased/personAccessUpdate', data, true, true);
  },

  accessDelete: async (accessId: number) => {
    await api('post', '/api/Deceased/accessDelete', null, true, false, {accessId});
  },

  DeceasedPicAddDelete: async (data: FormData, deceasedId: number, removePic: boolean) => {
    const res: PicFileModel[] = await api('post', '/api/Deceased/DeceasedPicAddDelete', data, true, true, {deceasedId, removePic});
    return res;
  },
};
