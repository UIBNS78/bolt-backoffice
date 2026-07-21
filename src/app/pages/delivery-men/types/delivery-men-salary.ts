import { DeliveryMan } from "@shared/types/delivery-men";

export type DeliveryManSalary = {
    id: number;
    deliveryMan: DeliveryMan;
    amount: number;
    isCurrent: boolean;
    modifiedAt?: Date | null;
    createdAt: Date;
}

export type DeliveryMenSalaryList = {
    salaries: DeliveryManSalary[];
    totalItems: number;
}