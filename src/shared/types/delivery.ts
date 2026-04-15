import { DeliveryMan } from "./delivery-men";
import type { LoadingState } from "./loading-state";
import type { Owner } from "./owner";
import { ValueOf } from "./owner-plan";

export const deliveryStatusObj: {
    pending: 1;
    recovery: 2;
    delivery: 3;
    finished: 4;
} = {
    pending: 1,
    recovery: 2,
    delivery: 3,
    finished: 4,
}
export type DeliveryStatus = ValueOf<typeof deliveryStatusObj>;

export type DeliveryOwner = Pick<Owner, "id" | "name" | "firstName" | "gender" | "commercialName" | "profilePicture">

export type DeiveryRecuperator = Pick<DeliveryMan, "id" | "name" | "firstName" | "gender">;

export type Delivery = {
    id: number;
    owner: DeliveryOwner;
    packageNumber: number;
    payment: number;
    deliveryMan: DeiveryRecuperator;
    deliveryDate: Date;
    createdAt: Date;
    status: DeliveryStatus;
} & Pick<LoadingState, "isDeleting">

export type DeliveryByDate = {
    date: Date;
    deliveries: Delivery[];
}

export type DeliveryDrawerForm = 
    Omit<Delivery, "owner" | "deliveryMan" | "createdAt"> & {
        id: number;
        ownerId: number;
        deliveryManId: number;
    }