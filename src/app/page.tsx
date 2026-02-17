'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // optional loading state

  useEffect(() => {
 
      const token = Cookies.get('accessToken');
        if (!token) {
      // if no token, redirect to login
      router.push('/login');
    } else {
      // if token exists, stop loading
      setLoading(false);
      router.push('/home')
    }  

  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>; // optional loading placeholder
  }

 
}
