import type { DeliveryType } from "@shared/constants/delivery-type"
import type { Package } from "@shared/types/package";

export type DeliveryForm = {
    type: DeliveryType;
    ownerId: number;
    deliveryDate: Date;
    recuperationPlace: string;
    deliveryManId: number;
    packages: Package[];
}