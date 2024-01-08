import {Sort, SortDirection} from "mongodb";

export type BlogQueryParams = {
    searchNameTerm?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: Sort,
    sortDirection?: SortDirection,
}
