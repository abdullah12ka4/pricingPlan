// src/Redux/services/SalesAgent.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { header } from '../ApiHeader'

export type AgentAnalytics = {
  totalQuotes: number
  quotesTotalValue: number
  averageQuoteValue: number
  quotesConversionRate: number
  activeCustomers: number
  monthlyRevenue: number
  activeQuotes: number
  pendingApprovals: number
}
export type SalesAgentApiUser = {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  role: string
  status: string
  lastLogin: string | null
  createdAt: string
  organization: any
}

export type Quote = {
  id: string
  customerName: string
  status: string
  value: number
  createdAt: string
  // add any other fields from your backend
}

export const salesAgentApi = createApi({
  reducerPath: 'salesAgentApi',
  baseQuery: header,
  tagTypes: ['SalesAgent', 'DashboardAnalytics', 'AgentAnalytics'],
  endpoints: (builder) => ({
    addSalesAgent: builder.mutation<any, any>({
      query: (body) => ({
        url: '/api/v1/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SalesAgent'],
    }),

    getSalesAgents: builder.query<SalesAgentApiUser[], void>({
      query: () => '/api/v1/users',
      providesTags: ['SalesAgent'],
    }),
    editSalesAgent: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['SalesAgent'],
    }),

    deleteSalesAgent: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SalesAgent'],
    }),
    getAgentAnalytics: builder.query<any, string | void>({
      query: (id) => `/api/v1/analytics/agents?agentId=${id}`,
      providesTags: (result, error, id) => id ? [{ type: 'AgentAnalytics', id }] : [],
    }),
    getDashboard: builder.query<any, void>({
      query: () => `/api/v1/analytics/metrics`,
      providesTags: ['DashboardAnalytics']
    })
  })                                                                     
})

export const {
  useAddSalesAgentMutation,
  useGetSalesAgentsQuery,
  useDeleteSalesAgentMutation,
  useEditSalesAgentMutation,
  useGetAgentAnalyticsQuery,
  useGetDashboardQuery
} = salesAgentApi