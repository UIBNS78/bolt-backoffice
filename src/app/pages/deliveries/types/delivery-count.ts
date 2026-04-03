export type DeliveryCount = {
    deliveryCount: number;
    package: {
        total: number;
        delivered: number;
        cancelled: number;
    }
}