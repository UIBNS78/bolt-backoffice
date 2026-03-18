export type User = {
    id: number;
    name: string;
    firstName: string;
    email: string;
    phone: string;
    profilePicture?: string;
    createdAt: Date;
    modifiedAt: Date;
}