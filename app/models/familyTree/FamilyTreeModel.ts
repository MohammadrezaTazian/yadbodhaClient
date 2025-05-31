export interface FamilyTreeModel {
  familyTreeId?: number;
  familyTreeName: string;
  description?: string | null;
  displayStatus: boolean;
  isActive: boolean;
  deleteDate?: string | null;
}
