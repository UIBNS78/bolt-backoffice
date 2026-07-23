import { DeliveryMan } from "@shared/types/delivery-men";

export type DeliveryMenRewardsList = {
    deliveryMenRewards: DeliveryManReward[];
    totalItems: number;
}

export type DeliveryManReward = {
    id: number;
    deliveryId: number;
    countReached: number;
    packageRewarded: number;
    reward: number;
    deliveryMan: DeliveryMan;
    createdAt: Date | null;
}