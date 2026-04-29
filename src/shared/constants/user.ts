import { GENDER, USER_STATE } from "@shared/types/user";

export const DEFAULT_USER_PASSWORD: "12345678-blt" = "12345678-blt" as const;

export const genderOptions = [
    { value: GENDER.MAN, label: "Mr" },
    { value: GENDER.WOMAN, label: "Mme" }
];

export const userStateOptions = [
    { value: USER_STATE.pending, label: "En attente" },
    { value: USER_STATE.confirmed, label: "Confirmer" },
    { value: USER_STATE.rejected, label: "Rejeter" }
];