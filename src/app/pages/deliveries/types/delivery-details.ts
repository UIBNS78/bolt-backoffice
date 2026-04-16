import { Delivery } from "@shared/types/delivery"
import { DeliveryMan } from "@shared/types/delivery-men";
import { Owner } from "@shared/types/owner"

export type DeliveryDetails =
    Omit<Delivery, "owner" | "deliveryMan"> & {
    owner: Owner;
    deliveryMan: Pick<DeliveryMan, "id" | "name" | "firstName" | "email" | "gender" | "phone">;
}