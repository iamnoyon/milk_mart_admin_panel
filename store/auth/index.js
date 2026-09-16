import { apiSlice } from "../apiSlice";

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query({
      query: (token) => ({
        url: "/auth/me",
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/change-password",
        method: "PUT",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/forget-password",
        method: "PUT",
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data)=>({
        url: "/auth/profile",
        method: "PATCH",
        body: data
      })
    }),
    sendLoginOTP: builder.mutation({
      query: (data)=>({
        url: "/auth/resend-otp",
        method: "POST",
        body: data
      })
    })
  }),
  overrideExisting: true,
});

export const {
  useProfileQuery,
  useLogoutMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useSendLoginOTPMutation
} = authSlice;
