import { Injectable } from "@angular/core";
import { UserStateModel } from "./user.model";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetAuthenticatedAction, SetUserAction } from "./user.action";
import { User } from "@shared/types/user";

const defaults: UserStateModel = {
    user: null,
    isAuthenticated: false
}

@State<UserStateModel>({
    name: "user",
    defaults
})
@Injectable()
export class UserState {
    @Selector()
    static user(state: UserStateModel): User | null {
        return state.user;
    }

    @Selector()
    static isAuthenticated(state: UserStateModel): boolean {
        return state.isAuthenticated
    }

    @Action(SetUserAction)
    setUser(ctx: StateContext<UserStateModel>, action: SetUserAction) {
        ctx.patchState({
            user: action.user
        });
    }

    @Action(SetAuthenticatedAction)
    setAuthenticated(ctx: StateContext<UserStateModel>, action: SetAuthenticatedAction) {
        ctx.patchState({
            isAuthenticated: action.isAuthenticated
        });
    }
}
