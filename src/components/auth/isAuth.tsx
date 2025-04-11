"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const router = useRouter();

    // useEffect(() => {
    //   if (typeof window !== "undefined") {
    //     const token = localStorage.getItem("accessToken");
    //     setAccessToken(token);

    //     if (!token) {
    //       router.push("/sign-in");
    //     }
    //   }
    // }, [router]);

    // if (!accessToken) {
    //   return null;
    // }

    return <Component {...props} />;
  };
}
