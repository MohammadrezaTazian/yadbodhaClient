
export interface DailyVacationModel {
    id: number;
    eID: number;
    vacationDate: Date;
    startTime: Date;
    endTime: Date;
    vacationType: number; //0: personal, 1: oficial
    regulatorEID?: number | null;
    confirmEID?: number | null;
    securityEID?: number | null;
}