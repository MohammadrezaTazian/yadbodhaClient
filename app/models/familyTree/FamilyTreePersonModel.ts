export interface FamilyTreePersonModel {
  familyTreePersonId: number;
  familyTreeId?: number;
  parentId?: number | null;
  familyTreePersonName: string;
  isDeceased: boolean;
  wifeName?: string | null;
  isActive?: boolean;
  picName?: string | null;
  deleteDate?: string | null;
  imageUrl?: string | null;
  familyTreePersonFile?: File | null;
  deceasedRemark?: string | null;
}
