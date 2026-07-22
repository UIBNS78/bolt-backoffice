import { DeliveryMan } from "@shared/types/delivery-men";

export type DeliveryManSalary = {
    id: number;
    deliveryMan: DeliveryMan;
    amount: number;
    applyAt: Date;
    isCurrent: boolean;
    modifiedAt?: Date | null;
    createdAt: Date;
}

export type DeliveryMenSalaryList = {
    salaries: DeliveryManSalary[];
    totalItems: number;
}

export type DeliveryManSalaryForm = {
    id?: number | null;
    userId: number;
    amount: number;
    applyAt: Date;
}