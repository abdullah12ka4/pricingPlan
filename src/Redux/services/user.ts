import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: header,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" }
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }]
    }),

    getUser: builder.query<any, void>({
      query: () => `/api/v1/auth/me`,
      providesTags: [{ type: "User", id: "CURRENT" }]
    }),

    addUser: builder.mutation({
      query: (body) => ({
        url: `/api/v1/users`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }]
    })
  }),
});


export const { useLoginMutation, useGetUserQuery, useAddUserMutation } = userApi