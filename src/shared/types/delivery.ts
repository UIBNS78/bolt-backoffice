import { DeliveryMan } from "./delivery-men";
import type { LoadingState } from "./loading-state";
import type { Owner } from "./owner";
import { ValueOf } from "./owner-plan";

export const deliveryStatusObj: {
    cancelled: 0;
    pending: 1;
    recovery: 2;
    delivery: 3;
    finished: 4;
} = {
    cancelled: 0,
    pending: 1,
    recovery: 2,
    delivery: 3,
    finished: 4,
}
export type DeliveryStatus = ValueOf<typeof deliveryStatusObj>;

export type DeliveryOwner = Pick<Owner, "id" | "name" | "firstName" | "gender" | "commercialName" | "profilePicture" | "planId">

export type DeiveryRecuperator = Pick<DeliveryMan, "id" | "name" | "firstName" | "gender">;

export type Delivery = {
    id: number;
    name: string;
    owner: DeliveryOwner;
    packageNumber: number;
    payment: number;
    deliveryMan: DeiveryRecuperator;
    collectPlace: string;
    collectDate: Date;
    deliveryDate: Date;
    createdAt: Date;
    status: DeliveryStatus;
    paidAt: Date | null;
    published: boolean;
    publishedAt: Date | null;
} & Pick<LoadingState, "isDeleting">

export type DeliveryByDate = {
    date: Date;
    deliveries: Delivery[];
}