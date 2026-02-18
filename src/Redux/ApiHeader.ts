import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";


export const header = fetchBaseQuery({ 
    // baseUrl: 'https://barely-jokes-involve-apr.trycloudflare.com',
    baseUrl: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_LOCAL_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
})