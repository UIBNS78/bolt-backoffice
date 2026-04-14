import { ValueOf } from "./owner-plan";

export const GENDER: {
    MAN: "male";
    WOMAN: "female";
} = {
    MAN: "male",
    WOMAN: "female"
} as const;
export type Gender = ValueOf<typeof GENDER>;

export type User = {
    id: number;
    name: string;
    firstName: string;
    gender: Gender;
    email: string;
    phone: string;
    profilePicture?: string;
    createdAt: Date;
    modifiedAt: Date;
}