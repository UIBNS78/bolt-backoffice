import { Delivery } from "@shared/types/delivery";

export type DeliveryDrawerForm = 
    Omit<Delivery, "owner" | "deliveryMan" | "createdAt"> & {
        id: number;
        ownerId: number;
        deliveryManId: number;
    }