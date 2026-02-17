import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

export const tiersApi = createApi({
  reducerPath: 'tiersApi',
  baseQuery: header,
 tagTypes: ["tiers"],
  endpoints: (builder) => ({
    addPricingTiers: builder.mutation({
        query: (body)=> ({
            url: '/api/v1/pricing/tiers',
            method:'POST',
            body,
        }),
        invalidatesTags:["tiers"]
    }),
    getPricingTiers: builder.query<any, void>({
      query: ()=> '/api/v1/pricing/tiers',
      providesTags: ['tiers']
    }),
    editPricingTiers: builder.mutation<any, any>({
      query: ({id, editPayload})=>({
      url:`/api/v1/pricing/tiers/${id}`,
      method:'PATCH',
      body: editPayload,
      }),
      invalidatesTags: ['tiers'],
    }),
    deleteTiers: builder.mutation<any, string>({
      query: (id)=> ({
        url: `/api/v1/pricing/tiers/${id}`,
        method:"DELETE", 
      }),
      invalidatesTags: ['tiers'],
    })
  }),
})



export const { useAddPricingTiersMutation, useGetPricingTiersQuery, useDeleteTiersMutation, useEditPricingTiersMutation } = tiersApi