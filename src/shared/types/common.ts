export type DateRange = {
    startDate: string;
    endDate: string;
}

export type CloudinaryImage = {
    publicId: string;
    thumbnail: string;
    original: string;
    download?: string;
}

export type FilterDateType = {
    filter: "day" | "week" | "month" | "year";
    date: Date;
    page?: number;
    itemsPerPage?: number;
}