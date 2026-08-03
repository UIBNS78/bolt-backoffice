import { DeliveryMan } from "@shared/types/delivery-men";

export type DMRewardPackagesList = {
    deliveryMenRewards: DMRewardPackage[];
    totalItems: number;
}

export type DMRewardPackage = {
    id: number;
    deliveryId: number;
    countReached: number;
    packageRewarded: number;
    reward: number;
    deliveryMan: DeliveryMan;
    createdAt: Date | null;
}

export type RewardPackage = {
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

export type RewardPackageForm = Omit<RewardPackage, "id" | "active" | "applyAt" | "modifiedAt" | "createdAt">;