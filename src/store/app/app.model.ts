export interface AppStateModel {
    isBusy: boolean;
    pageTitle: string;
    token: string | null;
    refreshToken: string | null;
}