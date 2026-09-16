/**
 * Transforms an API list response into ReactTable-ready props.
 *
 * Supports four API response shapes:
 *
 * Shape A (wrapped):
 * {
 *   success: boolean,
 *   data: {
 *     content: Array,
 *     total: number,
 *     page: number,
 *     limit: number,
 *     totalPages: number
 *   }
 * }
 *
 * Shape B (flat with meta):
 * {
 *   success: boolean,
 *   data: Array,
 *   meta: {
 *     total: number,
 *     page: number,
 *     limit: number,
 *     totalPages: number
 *   }
 * }
 *
 * Shape C (flat with pagination):
 * {
 *   success: boolean,
 *   data: Array,
 *   pagination: {
 *     page: number,
 *     limit: number,
 *     total: number,
 *     total_pages: number
 *   }
 * }
 *
 * Shape D (flat array, no pagination):
 * {
 *   success: boolean,
 *   message: string,
 *   data: Array
 * }
 *
 * Returns:
 * {
 *   dataSource: Array,
 *   totalRecords: number,
 *   pageAndLimit: { page: number, limit: number },
 *   paginationOn: boolean
 * }
 */
export const transformListResponse = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
        if (response?.meta) {
            return {
                dataSource: data ?? [],
                totalRecords: response.meta?.total ?? data.length,
                pageAndLimit: {
                    page: response.meta?.page ?? 1,
                    limit: response.meta?.limit ?? (data.length || 10),
                },
                paginationOn: (response.meta?.total ?? data.length ?? 0) > (response.meta?.limit ?? data.length ?? 0),
            };
        }

        if (response?.pagination) {
            const { page, limit, total, total_pages } = response.pagination;
            const safeTotal = total ?? data.length ?? 0;
            const safeLimit = limit ?? (data.length || 10);
            return {
                dataSource: data ?? [],
                totalRecords: safeTotal,
                pageAndLimit: {
                    page: page ?? 1,
                    limit: safeLimit,
                },
                paginationOn: safeTotal > safeLimit,
                totalPages: total_pages ?? Math.ceil(safeTotal / safeLimit),
            };
        }

        return {
            dataSource: data ?? [],
            totalRecords: data.length,
            pageAndLimit: { page: 1, limit: data.length || 10 },
            paginationOn: false,
        };
    }

    return {
        dataSource: data?.content ?? [],
        totalRecords: data?.total ?? 0,
        pageAndLimit: {
            page: data?.page ?? 1,
            limit: data?.limit ?? 10,
        },
        paginationOn: (data?.total ?? 0) > 0,
    };
};
