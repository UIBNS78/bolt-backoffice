export type Package = {
    id: number;
    customer: string;
    phone: string;
    place: string;
    precision: string;
    price: number;
    deliveryPrice: number;
    isFragile: boolean;
    fixedTime?: string;
    description?: string;
}