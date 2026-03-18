import type { InputSelectOptions } from "@shared/components/types/input-select-options";


export const languageObj: {
    ml: 1;
    fr: 2;
    en: 3;
} = {
    ml: 1,
    fr: 2,
    en: 3
};

// LANGUAGE
export const languageOptions: InputSelectOptions[] = [
    { id: languageObj.ml, label: "Malagasy" },
    { id: languageObj.fr, label: "Français" },
    { id: languageObj.en, label: "Anglais" }
];

// THEME
export const themeObj: {
    dark: "dark";
    light: "light";
} = {
    dark: "dark",
    light: "light"
}
export type ThemeType = keyof typeof themeObj;