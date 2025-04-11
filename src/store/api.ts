import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiEndpoints } from './apiEndpoints'
import { setUser } from "./Slices/userSlice";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (body) => ({
        url: apiEndpoints.signIn.url,
        method: apiEndpoints.signIn.method,
        body,
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: apiEndpoints.signup.url,
        method: apiEndpoints.signup.method,
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: apiEndpoints.forgotPassword.url,
        method: apiEndpoints.forgotPassword.method,
        body,
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: (params) => ({
        url: `/api/auth/resendVerificationEmail/${params}`,
        method: apiEndpoints.resendVerificationEmail.method,
      }),
    }),
    getAds: builder.query({
      query: () => ({
        url: apiEndpoints.getAds.url,
        method: apiEndpoints.getAds.method,
      }),
    }),
    fetchPopularCategories: builder.query({
      query: () => ({
        url: apiEndpoints.fetchPopularCategories.url,
        method: apiEndpoints.fetchPopularCategories.method,
      }),
    }),
    fetchNormalCategories: builder.query({
      query: () => ({
        url: apiEndpoints.fetchNormalCategories.url,
        method: apiEndpoints.fetchNormalCategories.method,
      }),
    }),
    searchByCategory: builder.query({
      query: (params) => ({
        url: `${apiEndpoints.searchByCategory.url}/${params}`,
        method: apiEndpoints.searchByCategory.method,
        // params,
      }),
    }),
    fetchAllListings: builder.query({
      query: () => ({
        url: apiEndpoints.fetchAllListings.url,
        method: apiEndpoints.fetchAllListings.method,
      }),
    }),
    getListingDetails: builder.query({
      query: (slug) => ({
        url: `${apiEndpoints.getListingDetails.url}/${slug}`,
        method: apiEndpoints.getListingDetails.method,
      }),
    }),
    getListingMessagesByUserId: builder.query({
      query: (userId: number) => ({
        url: `${apiEndpoints.getListingMessagesByUserId.url}/${userId}`,
        method: apiEndpoints.getListingMessagesByUserId.method,
      }),
    }),
    getMessagesConversationSeller: builder.query({
      query: (messageId: string) => ({
        url: `${apiEndpoints.getMessagesConversationSeller.url}/${messageId}`,
        method: apiEndpoints.getMessagesConversationSeller.method,
      }),
    }),
    getMessagesConversationBuyer: builder.query({
      query: (messageId: string) => ({
        url: `${apiEndpoints.getMessagesConversationBuyer.url}/${messageId}`,
        method: apiEndpoints.getMessagesConversationBuyer.method,
      }),
    }),
    updateShippingAddress: builder.mutation({
      query: (values) => ({
        url:apiEndpoints.updateUserInfo.url,
        method: apiEndpoints.updateUserInfo.method,
        body:values
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser({ user: data.user, accessToken: data.accessToken })); // Update user in Redux
        } catch (error) {
          console.error("Failed to update shipping address:", error);
        }
      },
    }),
    updateContactInformation: builder.mutation({
      query: (values) => ({
        url:apiEndpoints.updateUserContactInfo.url,
        method: apiEndpoints.updateUserContactInfo.method,
        body:values
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser({ user: data.user, accessToken: data.accessToken })); // Update user in Redux
        } catch (error) {
          console.error("Failed to update shipping address:", error);
        }
      },
    }),
  
    getSavedListings: builder.query({
      query: () => "/api/listings/fetchSavedListings",
    }),
     
    // getAllAdminOrders: builder.query({
    //   query: () => "/api/admin/fetchAllInvoice",
    // }),
    getAllAdminOrders: builder.query({
      query: ({ page = 1, limit = 10 }) => `/api/admin/fetchAllInvoice?page=${page}&limit=${limit}`,
    }),
    
    getSingleAdminOrder: builder.query({
      query: (params) => ({
        url: `/api/payments/fetchInvoice/${params}`,
        method: 'GET',
      }),
    }),

    getStripeBalance: builder.query({
      query: () => ({
        url: `/api/payments/platform-balance`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResendVerificationEmailMutation,
  useGetAdsQuery,
  useFetchPopularCategoriesQuery,
  useFetchNormalCategoriesQuery,
  useSearchByCategoryQuery,
  useFetchAllListingsQuery,
  useGetListingDetailsQuery,
  useGetListingMessagesByUserIdQuery,
  useGetMessagesConversationSellerQuery,
  useGetMessagesConversationBuyerQuery,
  useLazyGetMessagesConversationSellerQuery,
  useLazyGetMessagesConversationBuyerQuery,
  useUpdateShippingAddressMutation,
  useUpdateContactInformationMutation,
  useGetSavedListingsQuery,
  useGetAllAdminOrdersQuery,
  useGetSingleAdminOrderQuery,
  useGetStripeBalanceQuery
} = api;
