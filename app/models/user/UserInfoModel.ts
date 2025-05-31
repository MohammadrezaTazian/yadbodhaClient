export interface UserInfoModel {
    userId: number;
    nationalCode: string | undefined;
    fullName: string | undefined;
    mobile: string;
    isActive: boolean | undefined;
}