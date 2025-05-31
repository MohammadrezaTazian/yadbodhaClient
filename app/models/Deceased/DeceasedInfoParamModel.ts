export interface DeceasedInfoParamModel {
    deceasedId: number;
    deceasedFullName: string;
    deceasedFatherName?: string | null;
    deceasedMotherName?: string | null;
    displayStatus: boolean;
    imageUrl?: string | null;
    deceasedProfileFileName?: string | null;
    isActive: boolean;
}