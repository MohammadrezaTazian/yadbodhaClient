import api from './api';
import { LookupModel } from '../models/shared/LookupModel';
import { ProvinceModel } from '../models/shared/ProvinceModel';
import { CityModel } from '../models/shared/CityModel';

export const lookupServices = {

    getProvinceList: async (): Promise<LookupModel[]> => 
        await api<LookupModel[]>('get', '/api/lookup/ProvinceList', null, true),

    getCityList: async (provinceId: number): Promise<LookupModel[]> => 
        await api<LookupModel[]>('get', '/api/lookup/CityList', null, true, false, {provinceId}),

    getDefaultTextTypeList: async (languageId: number): Promise<LookupModel[]> => 
        await api<LookupModel[]>('get', '/api/lookup/DefaultTextTypeList', null, true, false, {languageId}),

    getDefaultTextList: async (languageId: number, defaultTextTypeId: number): Promise<LookupModel[]> => 
        await api<LookupModel[]>('get', '/api/lookup/DefaultTextList', null, true, false, {languageId , defaultTextTypeId}),

    getLanguageList: async (): Promise<LookupModel[]> => 
        await api<LookupModel[]>('get', '/api/lookup/LanguageList', null, true),
};
