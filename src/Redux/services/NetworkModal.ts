import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

type consumeProps = {
  orgId: string,
  payload: any
}
export const networkApi = createApi({
  reducerPath: 'networkApi',
  baseQuery: header,
  tagTypes: ["network"],
  endpoints: (builder) => ({
    addNetwork: builder.mutation({
      query: (body) => ({
        url: '/api/v1/credits/packages',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["network"]
    }),
    getNetwork: builder.query<any, void>({
      query: () => '/api/v1/credits/packages',
      providesTags: ['network']
    }),
    editNetwork: builder.mutation<any, any>({
      query: ({ id, editPayload }) => ({
        url: `/api/v1/credits/packages/${id}`,
        method: 'PATCH',
        body: editPayload,
      }),
      invalidatesTags: ['network'],
    }),
    deleteNetwork: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/credits/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['network'],
    }),
    getOrgBalance: builder.query<any, string>({
      query: (orgId) => `/api/v1/credits/balance/${orgId}`,
      providesTags: ['network']
    }),
    consumeCredit: builder.mutation<any, consumeProps>({
      query: ({ orgId, payload }) => ({
        url: `/api/v1/credits/consume/${orgId}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['network']
    }),
    usageCredit: builder.query<any,{orgId: string; limit: number; page: number;fromDate: string; toDate: string}>({
      query: ({ orgId, limit, page, fromDate, toDate }) => ({
        url: `/api/v1/credits/history/${orgId}`,
        params: {
          limit,
          page,
          from_date: fromDate,
          to_date: toDate,
        },
      }),
      providesTags: ['network'],
    })
  }),
})



export const { useAddNetworkMutation, useUsageCreditQuery, useConsumeCreditMutation, useGetOrgBalanceQuery, useGetNetworkQuery, useDeleteNetworkMutation, useEditNetworkMutation } = networkApi