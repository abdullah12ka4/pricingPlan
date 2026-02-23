import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

export const AuditApi = createApi({
  reducerPath: 'AuditApi',
  baseQuery: header,
  tagTypes: ["Audit"],
  endpoints: (builder) => ({    
    getAudit: builder.query<any, void>({
      query: () => '/api/v1/audit?limit=5&offset=0',
      providesTags: ["Audit"]
    }),
  }),
})



export const { useGetAuditQuery } = AuditApi