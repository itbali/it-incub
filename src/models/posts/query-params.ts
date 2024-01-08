import {Sort, SortDirection} from "mongodb";

export type PostQueryParams = {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: Sort,
    sortDirection?: SortDirection,
}