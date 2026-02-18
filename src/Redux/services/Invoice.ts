import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

export const InvoiceApi = createApi({
  reducerPath: 'InvoiceApi',
  baseQuery: header,
  tagTypes: ["Invoice"],
  endpoints: (builder) => ({
    getInvoice: builder.query<any, void>({
      query: () => '/api/v1/invoices',
      providesTags: ["Invoice"]
    }),
    creataInvoice: builder.mutation({
      query: (body) => ({
        url: `api/v1/invoices`,
        method: "POST",
        body
      }),
      invalidatesTags: ["Invoice"]
    })
  }),
})


export const { useGetInvoiceQuery, useCreataInvoiceMutation } = InvoiceApi