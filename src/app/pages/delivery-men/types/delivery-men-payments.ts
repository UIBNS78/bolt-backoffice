import { DeliveryMan } from "@shared/types/delivery-men";
import { ValueOf } from "@shared/types/owner-plan";

export type DMPaymentsList = {
    payments: DMPayment[];
    totalItems: number;
}

export type DMPayment = {
    id: number;
    deliveryMan: DeliveryMan;
    salary: number;
    rewardPackages: number;
    rewardRates: number;
    paymentMode: PaymentMode;
    status: PaymentStatus;
    pendingAt: Date | null;
    processingAt: Date | null;
    paidAt: Date | null;
    failedAt: Date | null;
    onHoldAt: Date | null;
    createdAt: Date;
}

export const PAYMENT_STATUS: {
    pending: 'PENDING';
    processing: 'PROCESSING';
    paid: 'PAID';
    failed: 'FAILED';
    onHold: 'ON_HOLD';
} = {
    pending: 'PENDING',
    processing: 'PROCESSING',
    paid: 'PAID',
    failed: 'FAILED',
    onHold: 'ON_HOLD',
} as const;
export type PaymentStatus = ValueOf<typeof PAYMENT_STATUS>;

export const PAYMENT_MODE: {
    cash: 'CASH';
    mobileMoney: 'MOBILE_MONEY';
    bank: 'BANK';
} = {
    cash: 'CASH',
    mobileMoney: 'MOBILE_MONEY',
    bank: 'BANK',
} as const;
export type PaymentMode = ValueOf<typeof PAYMENT_MODE>;

export type UpdatePaymentStatusType = {
    status: PaymentStatus,
    paymentMode: PaymentMode,
}