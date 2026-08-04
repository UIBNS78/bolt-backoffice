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

export type FilterDateWithMode = FilterDateType & {
    filter: "day" | "week" | "month" | "year";
}

export type FilterDateType = {
    date: Date;
    page?: number;
    itemsPerPage?: number;
}