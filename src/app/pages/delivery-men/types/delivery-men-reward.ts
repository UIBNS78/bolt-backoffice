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

export type PackageReward = {
    id: number;
    title: string;
    motivation: string;
    minPackages: number;
    reward: number;
    active: boolean;
    applyAt: Date | null;
    modifiedAt: Date | null;
    createdAt: Date;
}

export type PackageRewardForm = Omit<PackageReward, "id" | "active" | "applyAt" | "modifiedAt" | "createdAt">;