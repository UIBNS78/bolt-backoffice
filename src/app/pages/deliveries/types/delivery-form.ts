import { Delivery } from "@shared/types/delivery";
import type { PackageForm } from "@shared/types/package";

export type DeliveryForm =
    Omit<Delivery, "owner" | "deliveryMan" | "createdAt" | "isDeleting"> & {
        ownerId: number;
        deliveryManId: number;
        packages: PackageForm[];
    };