// src/Redux/services/SalesAgent.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { header } from '../ApiHeader'

interface paymentIntent {
  quoteId: string;
}

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: header,
  tagTypes: ['payment'],
  endpoints: (builder) => ({
    getPayment: builder.query<void, void>({
      query: () => '/api/payments',
      providesTags: ['payment'],
    }),
    addPayment: builder.mutation<any, any>({
      query: (body) => ({
        url: '/api/v1/payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['payment'],
    }),
    paymentIntent: builder.mutation<any, paymentIntent>({
      query: (body) => ({
        url: '/api/v1/payments/stripe/payment-intent',
        method: 'POST',
        body
      }),
      invalidatesTags: ['payment'],
    }),
  })
})

export const {
  useGetPaymentQuery,
  useAddPaymentMutation,
  usePaymentIntentMutation
} = paymentApi