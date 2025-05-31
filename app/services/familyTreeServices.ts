import api from './api';
import { DefaultTextModel } from '../models/DefaultText/DefaultTextModel';
import { DeceasedInfoParamModel } from '../models/Deceased/DeceasedInfoParamModel';
import { DeceasedInfoGraveModel } from '../models/Deceased/DeceasedInfoGraveModel';
import { DeceasedPersonsAccessModel } from '../models/Deceased/DeceasedPersonsAccessModel';
import { PicFileModel } from '../models/Deceased/picFileModel';
import { FamilyTreePersonsAccessModel } from '../models/familyTree/FamilyTreePersonsAccessModel';
import { FamilyTreeModel } from '../models/familyTree/FamilyTreeModel';
import { FamilyTreePersonModel } from '../models/familyTree/FamilyTreePersonModel';

export const familyTreeServices = {

  getFamilyTreeList: async (): Promise<FamilyTreeModel[]> => {
    const res: FamilyTreeModel[] = await api('get', '/api/FamilyTree/FamilyTreeList', null, true);
    return res;
  },

  familyTreeAdd: async (data: FamilyTreeModel) => {
    await api('post', '/api/FamilyTree/familyTreeAdd', data, true, true);
  },
  
  familyTreeUpdate: async (data: FamilyTreeModel) => {
    await api('post', '/api/FamilyTree/familyTreeUpdate', data, true, true);
  },

  getFamilyTreePersonList: async (familyTreeId: number): Promise<FamilyTreePersonModel[]> => {
    const res: FamilyTreePersonModel[] = await api('get', '/api/FamilyTree/FamilyTreePersonList', null, true, false, {familyTreeId});
    return res;
  },

  familyTreePersonAdd: async (data: FormData) => {
    await api('post', '/api/FamilyTree/familyTreePersonAdd', data, true, true, {});
  },

  familyTreePersonUpdate: async (data: FormData, familyTreePersonId: number) => {
    await api('post', '/api/FamilyTree/familyTreePersonUpdate', data, true, true, {familyTreePersonId});
  },

  familyTreePersonParentAdd: async (data: FormData) => {
    await api('post', '/api/FamilyTree/familyTreePersonParentAdd', data, true, true, {});
  },

  getFamilyTreeInfo: async (familyTreeId: number): Promise<FamilyTreeModel> => {
    const res: FamilyTreeModel = await api('get', '/api/FamilyTree/FamilyTreeInfo', null, true, false, {familyTreeId});
    return res;
  },
  
  familyTreeActivate: async (isActive: boolean, familyTreeId: number) => {
    await api('post', '/api/FamilyTree/familyTreeActivate', null, true, false, {isActive, familyTreeId});
  },

  familyTreePersonActivate: async (isActive: boolean, familyTreePersonId: number) => {
    await api('post', '/api/FamilyTree/familyTreePersonActivate', null, true, false, {isActive, familyTreePersonId});
  },

  familyTreeDelete: async (familyTreeId: number) => {
    await api('post', '/api/FamilyTree/familyTreeDelete', null, true, false, {familyTreeId});
  },

  getFamilyTreePersonsAccessList: async (familyTreeId: number): Promise<FamilyTreePersonsAccessModel[]> => {
    const res: FamilyTreePersonsAccessModel[] = await api('get', '/api/FamilyTree/FamilyTreePersonsAccessList', null, true, false, {familyTreeId});
    return res;
  },
  
  familyTreePersonAccessAdd: async (data: FamilyTreePersonsAccessModel) => {
    await api('post', '/api/FamilyTree/familyTreePersonAccessAdd', data, true, true);
  },

  personAccessUpdate: async (data: DeceasedPersonsAccessModel) => {
    await api('post', '/api/Deceased/personAccessUpdate', data, true, true);
  },

  familyTreeAccessDelete: async (familyTreeAccessId: number) => {
    await api('post', '/api/FamilyTree/FamilyTreeAccessDelete', null, true, false, {familyTreeAccessId});
  },

  FamilyTreePersonDelete: async (familyTreeId: number, familyTreePersonId: number) => {
    await api('post', '/api/FamilyTree/FamilyTreePersonDelete', null, true, false, {familyTreeId, familyTreePersonId});
  },

  getFamilyTreesList: async (): Promise<FamilyTreeModel[]> => {
    const res: FamilyTreeModel[] = await api('get', '/api/FamilyTree/FamilyTreesList', null, true);
    return res;
  },

};
