export type ValueOf<T> = T[keyof T];

export const planObj: {
    simple: 1;
    premium: 2;
} = {
    simple: 1,
    premium: 2
};
export type OwnerPlan = ValueOf<typeof planObj>;