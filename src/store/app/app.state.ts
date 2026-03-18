import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AppStateModel } from "./app.model";
import { Injectable } from "@angular/core";
import { SetBusyAction, SetPageTitleAction, SetRefreshTokenAction, SetTokenAction } from './app.action';

const defaults: AppStateModel = {
    isBusy: false,
    pageTitle: "",
    token: null,
    refreshToken: null
}

@State<AppStateModel>({
    name: "app",
    defaults
})
@Injectable()
export class AppState {
    @Selector()
    static isBusy(state: AppStateModel): boolean {
        return state.isBusy;
    }
    
    @Selector()
    static pageTitle(state: AppStateModel): string {
        return state.pageTitle;
    }
    
    @Selector()
    static token(state: AppStateModel): string | null {
        return state.token;
    }
    
    @Selector()
    static refreshToken(state: AppStateModel): string | null {
        return state.refreshToken;
    }

    @Action(SetBusyAction)
    setBusy(ctx: StateContext<AppStateModel>, action: SetBusyAction) {
        ctx.patchState({
            isBusy: action.busy
        });
    }

    @Action(SetPageTitleAction)
    setPageTitle(ctx: StateContext<AppStateModel>, action: SetPageTitleAction) {
        ctx.patchState({
            pageTitle: action.title
        });
    }

    @Action(SetTokenAction)
    setToken(ctx: StateContext<AppStateModel>, action: SetTokenAction) {
        ctx.patchState({
            token: action.token
        });
    }

    @Action(SetRefreshTokenAction)
    setRefreshToken(ctx: StateContext<AppStateModel>, action: SetRefreshTokenAction) {
        ctx.patchState({
            refreshToken: action.refreshToken
        });
    }
}