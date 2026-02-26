// src/Redux/services/SalesAgent.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { header } from '../ApiHeader'

interface getSubscriptionArgs {
    agentId?: string;
    id?: string;
}
export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: header,
  tagTypes: ['subscription'],
  endpoints: (builder) => ({  
    getSubscription: builder.query<any, getSubscriptionArgs| void>({
      query: (args)=> {
        if(!args){
          return '/api/v1/api/subscriptions'
        }
        const {agentId, id} = args
        let url = id ? `/api/v1/api/subscriptions/${id}` : `/api/v1/api/subscriptions`
        if(agentId){
           url += `?agentId=${agentId}`
        } 
        return url;    
      },
      providesTags: ["subscription"],
    }), 
    addSubscription: builder.mutation<any, any>({
      query: (body) => ({
        url: '/api/v1/api/subscriptions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['subscription'],
    }),
    getSubscriptionByOrg: builder.query<any, string>({
      query: (orgId)=> `/api/v1/api/subscriptions/organization/${orgId}`,
      providesTags: ["subscription"],
    }),
    updateSubscription: builder.mutation<any, any>({
      query: ({id, body})=> ({
        url: `api/v1/api/subscriptions/${id}`,
        method: `PATCH`,
        body
      }),
      invalidatesTags: ["subscription"],
    }),
    upgradeSubscription: builder.mutation<any, any>({
      query: ({id, payload})=> ({
        url: `api/v1/api/subscriptions/${id}/upgrade`,
        method: `POST`,
        body: payload
      }),
      invalidatesTags: ["subscription"],
    }),
    downgradeSubscription: builder.mutation<any, any>({
      query: ({id, payload})=> ({
        url: `api/v1/api/subscriptions/${id}/downgrade`,
        method: `POST`,
        body: payload
      }),
      invalidatesTags: ["subscription"],
    })
  })
}) 

export const {
    useGetSubscriptionQuery ,
    useAddSubscriptionMutation,
    useGetSubscriptionByOrgQuery,
    useUpdateSubscriptionMutation,
    useUpgradeSubscriptionMutation,
    useDowngradeSubscriptionMutation
} = subscriptionApi