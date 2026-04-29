import { ValueOf } from "./owner-plan";

export const GENDER: {
    MAN: "male";
    WOMAN: "female";
} = {
    MAN: "male",
    WOMAN: "female"
} as const;
export type Gender = ValueOf<typeof GENDER>;

export const USER_STATE: {
    pending: 'PENDING';
    confirmed: 'CONFIRMED';
    rejected: 'REJECTED';
} = {
    pending: 'PENDING',
    confirmed: 'CONFIRMED',
    rejected: 'REJECTED'
} as const;
export type UserState = ValueOf<typeof USER_STATE>;

export type User = {
    id: number;
    name: string;
    firstName: string;
    gender: Gender;
    email: string;
    phone: string;
    profilePicture?: string;
    state: UserState;
    createdAt: Date;
    modifiedAt: Date;
}