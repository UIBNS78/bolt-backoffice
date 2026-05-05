import { User, USER_STATE } from "@shared/types/user";

export const mockUser: User = {
    id: 1,
    name: "RAZAFINDRAIBE",
    firstName: "Lova",
    gender: "male",
    email: "lova.razaf@example.mg",
    phone: "+261 34 00 000 00",
    profilePicture: {
        publicId: "publicId",
        thumbnail: "https://api.boltmg.mg/uploads/profiles/lova_1.jpg",
        original: "https://api.boltmg.mg/uploads/profiles/lova_1.jpg",
        download: "https://api.boltmg.mg/uploads/profiles/lova_1.jpg"
    },
    state: USER_STATE.confirmed,
    isOnline: true,
    createdAt: new Date("2024-01-15T08:30:00Z"),
    modifiedAt: new Date()
};

export const mockToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIml";
export const mockRefreshToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIml";