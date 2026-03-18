import { DeliveryMan } from "@shared/types/delivery-men";

export type DeliveryMenOptionsResponse = Pick<DeliveryMan, "id" | "userId" | "name" | "firstName">;