import { apiSlice } from "../../apiSlice";
import { transformListResponse } from "@/utils/responseTransformer";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductList: builder.query({
      query: (params) => ({
        url: "/products/list",
        method: "GET",
        params,
      }),
      providesTags: ["Products"],
      transformResponse: (response) => transformListResponse(response),
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getProductInfoById: builder.query({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
    }),
    updateProductInfo: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetProductListQuery,
  useGetProductListQuery,
  useCreateProductMutation,
  useGetProductInfoByIdQuery,
  useUpdateProductInfoMutation,
  useDeleteProductMutation,
} = productApiSlice;
