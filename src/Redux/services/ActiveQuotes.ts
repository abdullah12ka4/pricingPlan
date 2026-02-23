import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";
type GenerateLinkPayload = {
  id: string;
  body: {
    expiryDays: number;
    sendEmail: boolean;
    link?: string;
  };
};

type getQuotesArgs = {
  agentId?: string,
  id?:string
}
export const activeQuotesApi = createApi({
  reducerPath: 'activeQuotesApi',
  baseQuery: header,
  tagTypes: ["quotes"],
  endpoints: (builder) => ({
    getQuotes: builder.query<any, getQuotesArgs | void>({
      query: (args)=> {
        if(!args){
          return '/api/v1/quotes'
        }
        const {agentId, id} = args
        let url = id ? `/api/v1/quotes/${id}` : `/api/v1/quotes`
        if(agentId){
           url += `?agentId=${agentId}`
        } 
        return url;    
      },
      providesTags: ["quotes"],
    }),
    addQuotes: builder.mutation({
      query: (body) => ({
        url: '/api/v1/quotes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["quotes"]
    }),
    updateQuotes: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/quotes/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ["quotes"]
    }),
    getSpecificQuotes: builder.query<any, string>({
      query: (id: string) => `/api/v1/quotes/${id}`,
      providesTags: (result, error, id) => [{ type: 'quotes', id }],
    }),

    generateLink: builder.mutation<any, GenerateLinkPayload>({
      query: ({ id, body }) => ({
        url: `/api/v1/quotes/${id}/send`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'quotes', id: arg.id }],
    }),
    viewQuotes: builder.mutation<any, {id:string, token:string}>({
      query: ({id, token}) => `/api/v1/quotes/${id}/view/${token}`,
      invalidatesTags: ['quotes'],
    }),
    approveQuotes: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/api/v1/quotes/${id}/approve`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['quotes'],
    }),
  }),
})



export const { useAddQuotesMutation,
  useGetQuotesQuery,
  useUpdateQuotesMutation,
  useGetSpecificQuotesQuery,
  useGenerateLinkMutation,
  useApproveQuotesMutation,
  useViewQuotesMutation,
} = activeQuotesApi