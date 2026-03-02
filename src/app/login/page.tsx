"use client";

import { useLoginMutation } from "@/Redux/services/user";
import * as Label from "@radix-ui/react-label";
import Cookies from "js-cookie";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";


export default function LoginPage() {
  const [error, setError] = useState<any>("")
  const [login, { isLoading}] = useLoginMutation();
  const [isView, setIsView] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("")
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await login({ email, password }).unwrap();
  if (res?.accessToken) {
      // Set expiration date 12 hours from now
      const expires = new Date();
      expires.setHours(expires.getHours() + 12);

      Cookies.set("accessToken", res.accessToken, {
        expires,      // Date object, 12 hours from now
        secure: true,
        sameSite: "lax",
      });

      router.push('/');
    }
    } catch (err) {
      console.log("Login failed", err);
      if(err && typeof err === 'object' && 'status' in err){
        const mess = err.status
        if(err.status === 'FETCH_ERROR'){
          setError("Failed to Load Server")
        }  
        else{
          setError(mess)  
        }
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md hover:shadow-2xl backdrop-blur-3xl hover:translate-x-1 hover:-translate-y-1 transition-transform duration-300  rounded-lg bg-white shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <Label.Root htmlFor="email" className="text-sm font-medium">
              Email
            </Label.Root>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full h-10 rounded-md border px-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div className="space-y-1 relative">
            <Label.Root htmlFor="password" className="text-sm font-medium">
              Password
            </Label.Root>
            <input
              id="password"
              name="password"
              type={isView ? "text" : "password"}
              required
              className="w-full h-10 rounded-md border px-3 pr-10 outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setIsView(!isView)}
              className="absolute right-2 top-8.5 text-gray-600"
            >
              {isView ? <Eye size={18} /> : <EyeClosed size={18} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}            
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-black text-white rounded-md hover:opacity-90 transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
