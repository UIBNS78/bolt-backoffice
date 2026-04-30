import type { LoadingState } from "./loading-state";
import type { OwnerPlan, ValueOf } from "./owner-plan";
import type { User } from "./user";

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