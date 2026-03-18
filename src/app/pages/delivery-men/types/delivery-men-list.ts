import type { DeliveryMan } from "@shared/types/delivery-men"

export type DeliveryMenList = {
    deliveryMen: DeliveryMan[];
    totalItems: number;
}