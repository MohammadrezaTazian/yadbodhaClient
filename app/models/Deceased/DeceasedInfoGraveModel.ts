export interface DeceasedInfoGraveModel {
    deceasedId: number;
    userId: number;
    block: number;
    row: number;
    number: number;
    phase?: number | null;
    deceasedFullName: string;
    birthDate: string;
    deathDate: string;
    deceasedFatherName?: string | null;
    deceasedMotherName?: string | null;
    remark?: string | null;
    longitude?: number | null; // طول جغرافیایی  
    latitude?: number | null;  // عرض جغرافیایی  
    deceasedProfileFileName: string | null;
    imageUrl?: string | null;
    text1: string | null;
    text2: string | null;
    text3: string | null;
    text4: string | null;
}