import { GENDER } from "@shared/types/user";

export const DEFAULT_USER_PASSWORD: "12345678-blt" = "12345678-blt" as const;

export const genderOptions = [
    { value: GENDER.MAN, label: "Mr" },
    { value: GENDER.WOMAN, label: "Mme" }
];
