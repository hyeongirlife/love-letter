"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="bg-[#f8f5f6] dark:bg-[#221016] flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Image 
            src="/icons/favorite.svg" 
            alt="loading" 
            width={40} 
            height={40} 
            className="animate-pulse"
            style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }}
          />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#f8f5f6] dark:bg-[#221016] flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Image 
            src="/icons/favorite.svg" 
            alt="redirecting" 
            width={40} 
            height={40}
            style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }}
          />
          <p className="text-slate-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5f6] dark:bg-[#221016] flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-14 md:pt-0">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f20d59]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        {children}
      </main>
    </div>
  );
}
