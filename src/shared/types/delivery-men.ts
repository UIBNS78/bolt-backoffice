import { InputSelectOptions } from "@shared/components/types/input-select-options";
import { ValueOf } from "./owner-plan";
import { User } from "./user";
import { LoadingState } from "./loading-state";
import { CloudinaryImage } from "./common";

export const transportOptions: InputSelectOptions[] = [
    { id: 1, label: "A pied" },
    { id: 2, label: "Vélo" },
    { id: 3, label: "Moto" },
];

export const transportObj: {
    foot: 1;
    bicyle: 2;
    motorcycle: 3;
} = {
    foot: 1,
    bicyle: 2,
    motorcycle: 3
};
export type DeliveryManTransport = ValueOf<typeof transportObj>;

export type DeliveryMan = 
    Omit<User, "id" | "modifiedAt"> & 
    {
        id: number;
        userId: number;
        birthday: Date;
        address: string;
        totalPackages: number;
        transport: DeliveryManTransport;
        cin: CloudinaryImage | null;
        residence: CloudinaryImage | null;
        isActive: boolean;
    } &
    Pick<LoadingState, "isUpdating" | "isDeleting">

export type DeliveryManDetailsData = {
    delivered: {
        total: number;
        totalPercent: number;
        price: number;
        pricePercent: number;
    };
    chart: any;
}
    
export type DeliveryManDetails = {
    about: DeliveryMan;
    data: DeliveryManDetailsData;
    history: any;
}