import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

export const OrganizationApi = createApi({
  reducerPath: 'OrganizationApi',
  baseQuery: header,
  tagTypes: ["Organization"],
  endpoints: (builder) => ({    
    getOrganization: builder.query<any, void>({
      query: () => '/api/v1/organizations',
      providesTags: ["Organization"]
    }),
    addOrganization: builder.mutation({
      query: (body) => ({
        url: '/api/v1/organizations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Organization"]
    }),
    deleteOrganization: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `/api/v1/organizations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Organization"]
    }),
    editOrganization: builder.mutation<any, any>({
      query: ({id, Addpayload}) => ({
        url: `/api/v1/organizations/${id}`,
        method: 'PATCH',
        body: Addpayload,
      }),
      invalidatesTags: ["Organization"]
    }),
  }),
})



export const { useAddOrganizationMutation, useGetOrganizationQuery, useDeleteOrganizationMutation, useEditOrganizationMutation } = OrganizationApi