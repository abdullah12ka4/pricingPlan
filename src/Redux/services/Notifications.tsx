import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: header,
  tagTypes: ["notification"],
  endpoints: (builder) => ({
    getNotification: builder.query<any, boolean | undefined>({
      query: (isRead) =>
        isRead !== undefined
          ? `api/v1/notifications?isRead=${isRead}`
          : `api/v1/notifications`,
      providesTags: ["notification"],
    }),

  }),
})



export
  const { useGetNotificationQuery } = notificationApi