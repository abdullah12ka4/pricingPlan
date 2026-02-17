import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

export const AddOnsApi = createApi({
  reducerPath: 'AddOnsApi',
  baseQuery: header,
  tagTypes: ["AddOns"],
  endpoints: (builder) => ({    
    getAddOns: builder.query<any, void>({
      query: () => '/api/v1/addons',
      providesTags: ["AddOns"]
    }),
    addOns: builder.mutation({
      query: (body) => ({
        url: '/api/v1/addons',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["AddOns"]
    }),
    deleteAddOns: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `/api/v1/addons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["AddOns"]
    }),
    editAddOns: builder.mutation<any, any>({
      query: ({id, Addpayload}) => ({
        url: `/api/v1/addons/${id}`,
        method: 'PATCH',
        body: Addpayload,
      }),
      invalidatesTags: ["AddOns"]
    }),
  }),
})



export const { useAddOnsMutation, useGetAddOnsQuery, useDeleteAddOnsMutation, useEditAddOnsMutation } = AddOnsApi