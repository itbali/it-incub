export type getUserQueryParams = {
    sortBy?: string,
    sortDirection?: 1 | -1 | "asc" | "desc" | "ascending" | "descending",
    pageNumber?: number,
    pageSize?: number,
    searchLoginTerm?: string,
    searchEmailTerm?: string
}