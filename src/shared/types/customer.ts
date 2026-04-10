import { Gender } from "./user";

export type Customer = {
    name: string;
    gender: Gender;
    phone: string;
    inCity: {
        place: {
            id: number;
            name: string;
        };
        precision: string;
    } | null;
    outCity: {
        destination: string;
        cooperative: {
            id: number;
            name: string;
        };
    } | null;
};