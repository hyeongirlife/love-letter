"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/home", label: "Home", icon: "/icons/home.svg" },
  { href: "/archive", label: "Archive", icon: "/icons/inventory.svg" },
  { href: "/anniversary", label: "Moments", icon: "/icons/favorite.svg" },
  { href: "/settings", label: "Settings", icon: "/icons/settings.svg" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setNickname(user.user_metadata?.nickname || user.user_metadata?.full_name || user.email?.split("@")[0] || "User");
        setEmail(user.email || "");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col px-3 pt-2">
          <div className="flex items-center gap-2 mb-1">
            <Image src="/icons/favorite.svg" alt="heart" width={28} height={28} style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }} />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Love Letter</h1>
          </div>
          <p className="text-[#f20d59] text-sm font-medium pl-1">Days Together: 1,024</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors group ${
                  isActive
                    ? "bg-[#f20d59]/10 text-[#f20d59]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-[#f20d59]/5 hover:text-[#f20d59]"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className={isActive ? "" : "opacity-60 group-hover:opacity-100"}
                  style={isActive ? { filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" } : {}}
                />
                <p className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>{item.label}</p>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-4 border-t border-slate-100 dark:border-slate-800/50">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-200 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-500">{nickname?.charAt(0) || "U"}</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{nickname || "Loading..."}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{email || ""}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Open menu" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col bg-white/50 dark:bg-black/20 backdrop-blur-sm border-r border-slate-200 dark:border-slate-800">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 text-[#f20d59]">
          <Image src="/icons/favorite.svg" alt="heart" width={20} height={20} style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }} />
          <span className="font-bold text-slate-900 dark:text-white">Love Letter</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <SidebarContent />
      </aside>
    </>
  );
}
