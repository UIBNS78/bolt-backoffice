export type DeliveryCount = {
    monthlyAmount: number;
    package: {
        total: number;
        delivered: number;
        cancelled: number;
    }
}