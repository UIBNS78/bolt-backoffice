import { ValueOf } from "./owner-plan";

export const SOCKET_EVENT: {
    userConnectivity: 'USER_CONNECTIVITY';
    newNotification: 'NEW_NOTIFICATION';
    newOwner: 'NEW_OWNER';
    newDelivery: 'NEW_DELIVERY';
    newDeliveryMan: 'NEW_DELIVERY_MAN';
    newPackage: 'NEW_PACKAGE';
} = {
    userConnectivity: 'USER_CONNECTIVITY',
    newNotification: 'NEW_NOTIFICATION',
    newOwner: 'NEW_OWNER',
    newDelivery: 'NEW_DELIVERY',
    newDeliveryMan: 'NEW_DELIVERY_MAN',
    newPackage: 'NEW_PACKAGE',
} as const;
export type SocketEvent = ValueOf<typeof SOCKET_EVENT>;

export type NotificationSocketData = {
    title: string;
    body: string;}