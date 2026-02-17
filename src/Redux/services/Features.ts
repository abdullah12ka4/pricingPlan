import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

export const FeaturesApi = createApi({
  reducerPath: 'FeaturesApi',
  baseQuery: header,
  tagTypes: ["Features"],
  endpoints: (builder) => ({    
    getFeatures: builder.query<any, void>({
      query: () => '/api/v1/features',
      providesTags: ["Features"]
    }),
    addFeatures: builder.mutation({
      query: (body) => ({
        url: '/api/v1/features',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Features"]
    }),
    deleteFeatures: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `/api/v1/features/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Features"]
    }),
    editFeatures: builder.mutation<any, any>({
      query: ({id, editPayload}) => ({
        url: `/api/v1/features/${id}`,
        method: 'PATCH',
        body: editPayload,
      }),
      invalidatesTags: ["Features"]
    }),
  }),
})



export const { useAddFeaturesMutation, useGetFeaturesQuery, useDeleteFeaturesMutation, useEditFeaturesMutation } = FeaturesApi