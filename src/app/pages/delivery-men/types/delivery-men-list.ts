import type { DeliveryMan } from "@shared/types/delivery-men"

export type DeliveryMenList = {
    deliveryMen: DeliveryMan[];
    totalItems: number;
}

export type DMCounts = {
    online: number;
    rewardPackages: number;
    total: number;
}