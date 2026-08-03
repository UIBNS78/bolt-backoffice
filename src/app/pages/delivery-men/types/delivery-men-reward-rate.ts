import { DeliveryMan } from "@shared/types/delivery-men";

export type DMRewardRatesList = {
    dmRewardRates: DMRewardRate[];
    totalItems: number;
}

export type DMRewardRate = {
    id: number;
    deliveryMan: DeliveryMan;
    createdAt: Date | null;
    modifiedAt: Date | null;
}