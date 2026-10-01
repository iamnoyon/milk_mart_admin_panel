import { apiSlice } from "../../apiSlice";
import { transformListResponse } from "@/utils/responseTransformer";

export const orderAssignmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDeliverymanList: builder.query({
      query: (params) => ({
        url: "/user/deliveryman",
        method: "GET",
        params,
      }),
      transformResponse: (response) => transformListResponse(response),
    }),
    getPendingOrders: builder.query({
      query: (params) => ({
        url: "/orders/list",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
      transformResponse: (response) => transformListResponse(response),
    }),
    assignOrdersToDeliveryman: builder.mutation({
      query: (data) => ({
        url: "/orders/assign-bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDeliverymanListQuery,
  useLazyGetDeliverymanListQuery,
  useGetPendingOrdersQuery,
  useLazyGetPendingOrdersQuery,
  useAssignOrdersToDeliverymanMutation,
} = orderAssignmentApiSlice;