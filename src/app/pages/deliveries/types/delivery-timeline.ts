import { DeliveryStatus } from "@shared/types/delivery";

export type DeliveryTimeline = { 
    status: DeliveryStatus; 
    date: Date | null; 
    icon: string 
}