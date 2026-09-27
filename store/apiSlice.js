import { siteConfig } from "@/config/siteConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: siteConfig?.baseUrl,
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    let token = getState()?.user?.token;

    if (!token) {
      const session = await getSession();
      token = session?.user?.backendToken;
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
  tagTypes: ["userlist", "Categories", "Products", "tables", "expenses", "Orders", "OrderAssignment", "Deliverymen", "Packages", "Business", "Payments", "health"]
});