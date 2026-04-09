import type { InputSelectOptions } from "@shared/components/types/input-select-options";
import { ValueOf } from "@shared/types/owner-plan";

export const deliveryTypeObj: {
    inCity: 1;
    toCooperative: 2;
} = {
    inCity: 1,
    toCooperative: 2
};
export type DeliveryType = ValueOf<typeof deliveryTypeObj>;

export const deliveryTypeOptions: InputSelectOptions[] = [
    { id: deliveryTypeObj.inCity, label: "Livraison sur ville" },
    { id: deliveryTypeObj.toCooperative, label: "Livraison en province" }
];