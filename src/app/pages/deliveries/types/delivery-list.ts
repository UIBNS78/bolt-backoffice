import type { Delivery } from "@shared/types/delivery";

export type DeliveryList = {
    deliveries: Delivery[];
    totalItems: number;
}