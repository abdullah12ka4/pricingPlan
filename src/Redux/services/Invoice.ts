import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

type invoiceProps = {
  id?: string,
  userId?: string,
  orgId?:string,
  
}

export const InvoiceApi = createApi({
  reducerPath: 'InvoiceApi',
  baseQuery: header,
  tagTypes: ["Invoice"],
  endpoints: (builder) => ({
    getInvoice: builder.query<any, invoiceProps | void>({
      query: (args) => {
        if (!args) {
          return `/api/v1/invoices`
        }

        const { id, userId } = args

        // base URL
        let url = id
          ? `/api/v1/invoices/${id}`
          : `/api/v1/invoices`

        // append userId if present
        if (userId) {
          url += `?userId=${userId}`
        }

        return url
      },
      providesTags: ["Invoice"],
    }),
    getInvoiceByOrgId: builder.query<any, string>({
      query:(orgId)=> `/api/v1/invoices/organizations/${orgId}`,
      providesTags: ["Invoice"],
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


export const { useGetInvoiceQuery, useCreataInvoiceMutation, useGetInvoiceByOrgIdQuery } = InvoiceApi