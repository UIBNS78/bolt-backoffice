import type { DeliveryByDate } from "@shared/types/delivery";

export type DeliveryList = {
    deliveries: DeliveryByDate[];
    totalItems: number;
}