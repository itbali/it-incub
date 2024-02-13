export type PostQueryParams = {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: 1 | -1 | "asc" | "desc" | "ascending" | "descending",
}