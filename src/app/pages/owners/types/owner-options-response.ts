import type { Owner } from "@shared/types/owner";

export type OwnerOptionsResponse = Pick<Owner, "id" | "userId" | "name" | "firstName" | "commercialName">;