import {Sort, SortDirection} from "mongodb";

export type getUserQueryParams = {
    sortBy?: Sort,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
    searchLoginTerm?: string,
    searchEmailTerm?: string
}