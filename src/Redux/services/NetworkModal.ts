import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

export const networkApi = createApi({
  reducerPath: 'networkApi',
  baseQuery: header,
 tagTypes: ["network"],
  endpoints: (builder) => ({
    addNetwork: builder.mutation({
        query: (body)=> ({
            url: '/api/v1/credits/packages',
            method:'POST',
            body,
        }),
        invalidatesTags:["network"]
    }),
    getNetwork: builder.query<any, void>({
      query: ()=> '/api/v1/credits/packages',
      providesTags: ['network']
    }),
    editNetwork: builder.mutation<any, any>({
      query: ({id, editPayload})=>({
      url:`/api/v1/credits/packages/${id}`,
      method:'PATCH',
      body: editPayload,
      }),
      invalidatesTags: ['network'],
    }),
    deleteNetwork: builder.mutation<any, string>({
      query: (id)=> ({
        url: `/api/v1/credits/packages/${id}`,
        method:"DELETE", 
      }),
      invalidatesTags: ['network'],
    })
  }),
})



export const { useAddNetworkMutation, useGetNetworkQuery, useDeleteNetworkMutation, useEditNetworkMutation } = networkApi