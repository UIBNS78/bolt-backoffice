import { InputSelectOptions } from "@shared/components/types/input-select-options";
import { ValueOf } from "./owner-plan";
import { LoadingState } from "./loading-state";

export const deliveryLocationObj: {
    centerCity: 1;
    city: 2;
    peripheral: 3
} = {
    centerCity: 1,
    city: 2,
    peripheral: 3
}
export type DeliveryLocation = ValueOf<typeof deliveryLocationObj>;

export const deliveryLocationOptions: InputSelectOptions[] = [
    { id: deliveryLocationObj.centerCity, label: "Center ville" },
    { id: deliveryLocationObj.city, label: "Banlieue" },
    { id: deliveryLocationObj.peripheral, label: "Périphérique" },
]

export type DeliveryPricePlace = {
    id: number;
    name: string;
}

export type DeliveryPriceCity = {
    id: number;
    price: number;
    promotion: number;
    location: string;
    places: DeliveryPricePlace[];
} & Pick<LoadingState, "isUpdating">

export type DeliveryPriceProvince = {
    id: number;
    price: number;
    promotion: number;
    location: string;
    cooperatives: DeliveryPricePlace[];
} & Pick<LoadingState, "isUpdating">

export type DeliveryPriceCityUpdateForm = Omit<DeliveryPriceCity, "places"> & {
    placesToAdd: string[];
    placesToRemove: number[];
}

export type DeliveryPriceProvinceUpdateForm = Omit<DeliveryPriceProvince, "cooperatives"> & {
    cooperativesToAdd: string[];
    cooperativesToRemove: number[];
}