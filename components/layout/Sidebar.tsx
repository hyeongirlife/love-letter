"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", label: "홈", icon: "home" },
  { href: "/archive", label: "보관함", icon: "inventory_2" },
  { href: "/anniversary", label: "기념일", icon: "favorite" },
  { href: "/settings", label: "설정", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col justify-between shadow-sm z-20 transition-colors duration-300">
      {/* Top Section */}
      <div className="p-6 flex flex-col gap-8">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <span className="material-symbols-outlined icon-filled text-3xl">favorite</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Love Letter</h1>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Couples Exchange</span>
          </div>
        </div>

        {/* Profile Snippet */}
        <div className="flex items-center gap-3 p-3 bg-background rounded-2xl border border-border">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-foreground leading-none mb-1">민수</p>
            <p className="text-xs text-muted-foreground">Since 2021</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? "icon-filled" : ""}`}>
                  {item.icon}
                </span>
                <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
