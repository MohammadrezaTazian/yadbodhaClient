export interface ProfileModel {
    nationalCode?: string | null;
    fullName: string;
    mobile?: string | null;
    mobile1?: string | null;
    provinceId?: number | null;
    cityId?: number | null;
    profilePictureName?: File | null;
    imageUrl?: string | null;
    profilePictureFile?: File | null;
}