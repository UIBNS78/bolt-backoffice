import type { Package } from "@shared/types/package";

export type DeliveryForm = {
    ownerId: number;
    deliveryDate: Date;
    recuperationPlace: string;
    deliveryManId: number;
    packages: Package[];
}