"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import AppContainer from "@/components/AppContainer";
import { Toaster } from "sonner";
 
export default function PageLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContainer>
      <Toaster />
      {isLoading ? <Loader /> : children}
    </AppContainer>
  );

}
  