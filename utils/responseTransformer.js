/**
 * Transforms an API list response into ReactTable-ready props.
 *
 * Supports three API response shapes:
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
 * Shape C (flat array, no pagination):
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
