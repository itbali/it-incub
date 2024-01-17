import {Sort, SortDirection} from "mongodb";

export type CommentsQueryParams = {
    postId: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: Sort,
    sortDirection?: SortDirection,
}
