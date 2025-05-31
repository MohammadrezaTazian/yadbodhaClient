export interface LookupModel {
  code: string | number | null;
  name: string;
  parentCode: string | number | null;
  parentName: string | null;
  groupCode: string | number | null;
  groupName: string | null;
  description: string | null;
}