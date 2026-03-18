export class SetBusyAction {
    static readonly type = "[App] set busy";
    constructor(public busy: boolean) {}
}

export class SetPageTitleAction {
    static readonly type = "[App] set page title";
    constructor(public title: string) {}
}

export class SetTokenAction {
    static readonly type = "[App] set token";
    constructor(public token: string | null) {}
}

export class SetRefreshTokenAction {
    static readonly type = "[App] set refresh token";
    constructor(public refreshToken: string | null) {}
}