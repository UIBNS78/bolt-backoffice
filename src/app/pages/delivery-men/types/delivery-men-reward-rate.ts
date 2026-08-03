import { DeliveryMan } from "@shared/types/delivery-men";

export type DMRewardRatesList = {
    dmRewardRates: DMRewardRate[];
    totalItems: number;
}

export type DMRewardRate = {
    id: number;
    rate: number;
    totalRating: number;
    reward: number;
    deliveryMan: DeliveryMan;
}

export type RewardRate = {
    id: number;
    reward: number;
    active: boolean;
    modifiedAt: Date | null;
    createdAt: Date;
}