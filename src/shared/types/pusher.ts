
export type NotificationPusherData = {
    title: string;
    body: string;
    tag: string;
    data: {
        notificationId: number;
        deliveryId?: number;
        packageId?: number;
    }
}