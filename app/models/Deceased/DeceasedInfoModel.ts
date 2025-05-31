export interface DeceasedInfoModel {
    deceasedId: number;
    block: number;
    row: number;
    number: number;
    phase?: number | null;
    deceasedFullName: string;
    birthDate: string;
    deathDate: string;
    provinceId?: number | null;
    cityId?: number | null;
    graveyardName?: string | null;
    deceasedFatherName?: string | null;
    deceasedMotherName?: string | null;
    remark?: string | null;
    defaultTextId?: number | null;
    displayStatus: boolean;
    longitude?: number | null; // طول جغرافیایی  
    latitude?: number | null;  // عرض جغرافیایی  
    qrCode?: string | null;
    imageUrl?: string | null;
    deceasedProfileFileName?: string | null;
    deceasedProfileFile?: File | null;
    languageId?: number | null;
    defaultTextTypeId?: number | null;
    isActive: boolean;
    subscription: boolean;
}