import type { User } from "@shared/types/user";

export class SetUserAction {
    static readonly type = "[User] set user";
    constructor(public user: User | null) {}
}

export class SetAuthenticatedAction {
    static readonly type = "[User] set authenticated";
    constructor(public isAuthenticated: boolean) {}
}