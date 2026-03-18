import type { User } from "@shared/types/user";

export type SigninResponse = {
    user: User;
    token: string;
    refreshToken: string;
}