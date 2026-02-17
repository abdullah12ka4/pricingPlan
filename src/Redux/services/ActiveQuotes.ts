import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";
type GenerateLinkPayload = {
  id: string;
  body: {
    expiryDays: number;
    sendEmail: boolean;
    link?: string;
  };
};

export const activeQuotesApi = createApi({
  reducerPath: 'activeQuotesApi',
  baseQuery: header,
  tagTypes: ["quotes"],
  endpoints: (builder) => ({
    getQuotes: builder.query<any, string | void>({
      query: (id) => `/api/v1/quotes?agentId=${id}`,
      providesTags: (id) => [{ type: 'quotes', id }],
    }),
    addQuotes: builder.mutation({
      query: (body) => ({
        url: '/api/v1/quotes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["quotes"]
    }),
    getSpecificQuotes: builder.query<any, string>({
      query: (id: string) => `/api/v1/quotes/${id}`,
      providesTags: (result, error, id) => [{ type: 'quotes', id }],
    }),

    generateLink: builder.mutation<any, GenerateLinkPayload>({
      query: ({ id, body }) => ({
        url: `/api/v1/quotes/${id}/send`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'quotes', id: arg.id }],
    }),
    viewQuotes: builder.mutation<any, any>({
      query: (body) => `/api/v1/quotes/${body.id}/view/${body.token}`,
      invalidatesTags: ['quotes'],
    }),
    approveQuotes: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/api/v1/quotes/${id}/approve`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['quotes'],
    }),
  }),
})



export const { useAddQuotesMutation,
  useGetQuotesQuery,
  useGetSpecificQuotesQuery,
  useGenerateLinkMutation,
  useApproveQuotesMutation,
  useViewQuotesMutation,
} = activeQuotesApi