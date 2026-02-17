import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: header,
  tagTypes: ["user"],
  endpoints: (builder) => ({
    login : builder.mutation({
      query: (body) => ({
        url:"/api/v1/auth/login",
        method: "POST",
        body,
        headers: {"Content-Type":"application/json"}        
      }),invalidatesTags:["user"]
    }),
    getUser: builder.query<any, void>({
      query: ()=> `/api/v1/auth/me`,
      providesTags:["user"]
    })
  }),
})



export const { useLoginMutation, useGetUserQuery } = userApi