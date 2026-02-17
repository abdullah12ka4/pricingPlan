import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

type GetOrganizationArgs = {
  id?: string
  userId?: string
}

type updateOrganizationArgs = {
  id: string
  payload: any
}
export const OrganizationApi = createApi({
  reducerPath: 'OrganizationApi',
  baseQuery: header,
  tagTypes: ["Organization"],
  endpoints: (builder) => ({
    getOrganization: builder.query<any, GetOrganizationArgs | void>({
      query: (args) => {
        // no args → current user's organizations
        if (!args) {
          return `/api/v1/organizations`
        }

        const { id, userId } = args

        // base URL
        let url = id
          ? `/api/v1/organizations/${id}`
          : `/api/v1/organizations`

        // append userId if present
        if (userId) {
          url += `?userId=${userId}`
        }

        return url
      },
      providesTags: ["Organization"],
    }),

    addOrganization: builder.mutation({
      query: (body) => ({
        url: '/api/v1/organizations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Organization"]
    }),
    updateOrganization: builder.mutation<any, updateOrganizationArgs>({
      query: ({ id, payload }) => ({
        url: `/api/v1/organizations/${id}`,
        method: 'PATCH',
        body: payload,
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
      query: ({ id, Addpayload }) => ({
        url: `/api/v1/organizations/${id}`,
        method: 'PATCH',
        body: Addpayload,
      }),
      invalidatesTags: ["Organization"]
    }),
  }),
})



export const { useAddOrganizationMutation, useUpdateOrganizationMutation, useGetOrganizationQuery, useDeleteOrganizationMutation, useEditOrganizationMutation } = OrganizationApi