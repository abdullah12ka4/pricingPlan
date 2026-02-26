import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";


export const header = fetchBaseQuery({ 
    // baseUrl: 'https://barely-jokes-involve-apr.trycloudflare.com',
    baseUrl: "http://192.168.1.39:3000",
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
