import { apiSlice } from "../../apiSlice";
import { transformListResponse } from "@/utils/responseTransformer";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryList: builder.query({
      query: (params) => ({
        url: "/categories/list",
        method: "GET",
        params,
      }),
      providesTags: ["Categories"],
      transformResponse: (response) => transformListResponse(response),
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategoryInfoById: builder.query({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
    }),
    updateCategoryInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetCategoryListQuery,
  useGetCategoryListQuery,
  useCreateCategoryMutation,
  useGetCategoryInfoByIdQuery,
  useUpdateCategoryInfoMutation,
} = categoryApiSlice;
