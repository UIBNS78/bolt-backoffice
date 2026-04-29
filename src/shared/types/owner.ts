import type { LoadingState } from "./loading-state";
import type { OwnerPlan, ValueOf } from "./owner-plan";
import type { User } from "./user";

export const OWNER_STATE: {
    inactive: 0;
    active: 1;
} = {
    inactive: 0,
    active: 1,
} as const;
export type OwnerState = ValueOf<typeof OWNER_STATE>;

export type Owner = 
    Omit<User, "id" | "modifiedAt"> & 
    {
        id: number;
        userId: number;
        commercialName: string;
        totalPackages: number;
        planId: OwnerPlan;
    } & { isStateChanging?: boolean } 
    & Pick<LoadingState, "isDeleting">