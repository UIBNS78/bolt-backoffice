import { DeliveryMan } from "./delivery-men";
import { ValueOf } from "./owner-plan";

export const PACKAGE_STATUS: {
    inProgress: 1;
    delivered: 2;
    reported: 3;
    cancelled: 4;
} = {
    inProgress: 1,
    delivered: 2,
    reported: 3,
    cancelled: 4,
} as const;
export type PackageStatus = ValueOf<typeof PACKAGE_STATUS>;

export type Package = {
    id: number;
    customer: string;
    phone: string;
    place: string;
    precision: string;
    price: number;
    deliveryPrice: number;
    isFragile: 0 | 1;
    fixedTime?: string;
    description?: string;
    status: PackageStatus;
    deliveryMan: Pick<DeliveryMan, "id" | "name" | "firstName">;
}