import type { User } from "@shared/types/user";

export interface UserStateModel {
    user: User | null;
    isAuthenticated: boolean;
}