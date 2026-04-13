import { Customer } from "./customer";
import { DeliveryMan } from "./delivery-men";
import { LoadingState } from "./loading-state";
import { ValueOf } from "./owner-plan";
import { Gender } from "./user";

export const packageTypeObj: {
    inCity: 1;
    outCity: 2;
} = {
    inCity: 1,
    outCity: 2
};
export type PackageType = ValueOf<typeof packageTypeObj>;

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
    type: PackageType;
    customer: Customer;
    price: number;
    deliveryPrice: number;
    isFragile: boolean;
    fixedTime?: string;
    description?: string;
    status: PackageStatus;
    deliveryMan: Pick<DeliveryMan, "id" | "name" | "firstName" | "gender">;
} & { isStatusChanging?: boolean } & Pick<LoadingState, "isDeleting">

export type PackageForm = {
    deliveryId: number;
    type: PackageType;
    gender: Gender;
    customer: string;
    phone: string;
    placeId?: number;
    precision?: string;
    destination?: string;
    cooperativeId?: number;
    price: number;
    deliveryPrice: number;
    isFragile: 0 | 1;
    status: PackageStatus;
}