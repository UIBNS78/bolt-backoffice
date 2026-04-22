import { ValueOf } from "@shared/types/owner-plan";
import { Gender } from "./user";

export const NOTIFICATION_TYPES: {
    newDelivery: 'NEW_DELIVERY';
    cancelledDelivery: 'CANCELLED_DELIVERY';
    packageDelivered: 'PACKAGE_DELIVERED';
    packageReported: 'PACKAGE_REPORTED';
    packageCancelled: 'PACKAGE_CANCELLED';
} = {
    newDelivery: 'NEW_DELIVERY',
    cancelledDelivery: 'CANCELLED_DELIVERY',
    packageDelivered: 'PACKAGE_DELIVERED',
    packageReported: 'PACKAGE_REPORTED',
    packageCancelled: 'PACKAGE_CANCELLED',
} as const;

export type NotificationType = ValueOf<typeof NOTIFICATION_TYPES>;

export type Notification = {
    id: number;
    sender: {
        id: number;
        userId: number;
        name: string;
        firstName: string;
        gender: Gender;
        profilePicture: string | null;
        commercialName: string | null;
    };
    type: NotificationType;
    targetId: number;
    recipientName: string | null;
    isRead: boolean;
    createdAt: Date;
}