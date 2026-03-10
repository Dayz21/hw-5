export type PaginationResponseType = {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
};

export type PaginationType = {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
};

export const toPaginationType = (response: PaginationResponseType): PaginationType => ({
    page: response.page,
    pageSize: response.pageSize,
    pageCount: response.pageCount,
    total: response.total,
});
