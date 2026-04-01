import { ValueOf } from "./owner-plan";

export const PACKAGE_STATUS: {
    inProgress: "in-progress";
    delivered: "delivered";
    reported: "reported";
    cancelled: "cancelled";
} = {
    inProgress: "in-progress",
    delivered: "delivered",
    reported: "reported",
    cancelled: "cancelled",
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
    isFragile: boolean;
    fixedTime?: string;
    description?: string;
}