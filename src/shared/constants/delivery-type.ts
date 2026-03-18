import type { InputSelectOptions } from "@shared/components/types/input-select-options";
import { ValueOf } from "@shared/types/owner-plan";

export const deliveryTypeObj: {
    delivery: 1;
    fromCooperative: 2;
} = {
    delivery: 1,
    fromCooperative: 2
};
export type DeliveryType = ValueOf<typeof deliveryTypeObj>;

export const deliveryTypeOptions: InputSelectOptions[] = [
    { id: deliveryTypeObj.delivery, label: "Livraison" },
    { id: deliveryTypeObj.fromCooperative, label: "Récupération depuis une coopérative" }
];