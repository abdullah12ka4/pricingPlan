import { createApi } from "@reduxjs/toolkit/query/react";
import { header } from "../ApiHeader";
type GetNotificationArgs = {
  userId: string
  isRead?: boolean | undefined;
}

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: header,
  tagTypes: ["notification"],
  endpoints: (builder) => ({
    getNotification: builder.query<any, GetNotificationArgs>({
      query: ({ userId, isRead }) => {
        let url = `api/v1/notifications?userId=${userId}`

        if (isRead !== undefined) {
          url += `&isRead=${isRead}`
        }

        return url
      },
      providesTags: ["notification"],
    }),
    readNotification: builder.mutation<any, string>({
      query: (id) => ({
        url: `api/v1/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),

  }),
})



export
  const { useGetNotificationQuery, useReadNotificationMutation } = notificationApi