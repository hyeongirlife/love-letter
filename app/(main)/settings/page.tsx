"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

interface UserData {
  nickname: string;
  email: string;
  reminderTime: string;
  partnerId: string | null;
  partnerNickname?: string;
  connectedDate?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState({
    newLetter: true,
    anniversary: true,
    weeklyRecap: false,
  });

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          nickname: user.user_metadata?.nickname || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          reminderTime: "21:00",
          partnerId: null,
        });

        // 파트너 정보 fetch
        const res = await fetch("/api/couples/status");
        if (res.ok) {
          const data = await res.json();
          setUserData(prev => prev ? {
            ...prev,
            partnerId: data.partnerId,
            partnerNickname: data.partnerNickname,
            connectedDate: data.connectedAt 
              ? new Date(data.connectedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : undefined
          } : null);
        }
      }

      // 테마 복원
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }

      setLoading(false);
    };
    init();
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f5f6] dark:bg-[#221016]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f5f6] dark:bg-[#221016]">
      <main className="flex-1 flex justify-center py-10 px-4 md:px-10">
        <div className="flex flex-col max-w-[800px] w-full gap-8">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-end gap-3 px-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#1c0d12] dark:text-white">Settings</h1>
              <p className="text-[#9c4965] dark:text-[#d1a3b1] text-base font-normal">Manage your profile, preferences, and connected partner.</p>
            </div>
          </div>

          {/* Profile Header Card */}
          <section className="bg-white dark:bg-[#331821] rounded-xl shadow-sm border border-[#f4e7eb] dark:border-[#4a2330] p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f53d7a]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
              {/* Profile Image */}
              <div className="relative group cursor-pointer">
                <div className="bg-gradient-to-br from-[#f53d7a]/20 to-[#f53d7a]/40 rounded-full size-24 md:size-32 flex items-center justify-center border-4 border-[#f8f5f6] dark:border-[#221016] shadow-md">
                  <span className="text-4xl md:text-5xl">{userData.nickname.charAt(0)}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Image src="/icons/edit.svg" alt="edit" width={24} height={24} className="invert" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col flex-1 text-center md:text-left justify-center h-full py-2">
                <h2 className="text-2xl font-bold leading-tight mb-1 text-[#1c0d12] dark:text-white">
                  {userData.nickname} {userData.partnerNickname ? `& ${userData.partnerNickname}` : ""}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Image src="/icons/favorite.svg" alt="heart" width={20} height={20} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  <p className="text-[#9c4965] dark:text-[#d1a3b1] font-medium">
                    {userData.partnerId ? `Connected since ${userData.connectedDate}` : "Connect with your partner"}
                  </p>
                </div>
                {!userData.partnerId && (
                  <Link href="/connect" className="inline-flex items-center gap-2 self-center md:self-start bg-[#f53d7a]/10 dark:bg-[#f53d7a]/20 text-[#f53d7a] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-[#f53d7a]/20 transition-colors">
                    <Image src="/icons/stars.svg" alt="stars" width={16} height={16} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                    Connect Partner
                  </Link>
                )}
              </div>

              {/* Edit Button */}
              <button className="shrink-0 flex items-center justify-center gap-2 px-6 h-10 bg-[#f8f5f6] dark:bg-[#4a2330] hover:bg-[#f4e7eb] dark:hover:bg-[#5a2e3d] text-[#1c0d12] dark:text-white rounded-lg text-sm font-bold transition-colors border border-transparent hover:border-[#f53d7a]/20">
                <Image src="/icons/edit.svg" alt="edit" width={18} height={18} className="dark:invert" />
                Edit Profile
              </button>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold px-4 text-[#1c0d12] dark:text-white">Notification Settings</h3>
            <div className="bg-white dark:bg-[#331821] rounded-xl shadow-sm border border-[#f4e7eb] dark:border-[#4a2330] overflow-hidden divide-y divide-[#f4e7eb] dark:divide-[#4a2330]">
              {/* New Letter Alerts */}
              <div className="flex items-center justify-between p-4 md:px-6 hover:bg-[#f8f5f6]/50 dark:hover:bg-[#4a2330]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-[#f53d7a]/10 text-[#f53d7a] size-10 shrink-0">
                    <Image src="/icons/mail.svg" alt="mail" width={24} height={24} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base text-[#1c0d12] dark:text-white">New Letter Alerts</p>
                    <p className="text-sm text-[#9c4965] dark:text-[#d1a3b1]">Get notified when your partner writes a letter</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, newLetter: !prev.newLetter }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.newLetter ? 'bg-[#f53d7a]' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white border border-gray-300 transition-transform ${notifications.newLetter ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Anniversary Reminders */}
              <div className="flex items-center justify-between p-4 md:px-6 hover:bg-[#f8f5f6]/50 dark:hover:bg-[#4a2330]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-[#f53d7a]/10 text-[#f53d7a] size-10 shrink-0">
                    <Image src="/icons/cake.svg" alt="cake" width={24} height={24} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base text-[#1c0d12] dark:text-white">Anniversary Reminders</p>
                    <p className="text-sm text-[#9c4965] dark:text-[#d1a3b1]">Receive reminders 1 week before key dates</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, anniversary: !prev.anniversary }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.anniversary ? 'bg-[#f53d7a]' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white border border-gray-300 transition-transform ${notifications.anniversary ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Weekly Recap */}
              <div className="flex items-center justify-between p-4 md:px-6 hover:bg-[#f8f5f6]/50 dark:hover:bg-[#4a2330]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-[#f53d7a]/10 text-[#f53d7a] size-10 shrink-0">
                    <Image src="/icons/calendar.svg" alt="calendar" width={24} height={24} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base text-[#1c0d12] dark:text-white">Weekly Recap</p>
                    <p className="text-sm text-[#9c4965] dark:text-[#d1a3b1]">A summary of your shared moments</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, weeklyRecap: !prev.weeklyRecap }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.weeklyRecap ? 'bg-[#f53d7a]' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white border border-gray-300 transition-transform ${notifications.weeklyRecap ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Theme Preferences */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold px-4 text-[#1c0d12] dark:text-white">Appearance</h3>
            <div className="bg-white dark:bg-[#331821] rounded-xl shadow-sm border border-[#f4e7eb] dark:border-[#4a2330] overflow-hidden p-6 flex flex-col gap-6">
              {/* Theme Mode */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-[#f53d7a]/10 text-[#f53d7a] size-10 shrink-0">
                    <Image src="/icons/contrast.svg" alt="contrast" width={24} height={24} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  </div>
                  <div>
                    <p className="font-medium text-base text-[#1c0d12] dark:text-white">App Theme</p>
                    <p className="text-sm text-[#9c4965] dark:text-[#d1a3b1]">Choose your preferred visual mode</p>
                  </div>
                </div>
                <div className="flex bg-[#f8f5f6] dark:bg-[#4a2330] rounded-lg p-1 self-start md:self-auto w-full md:w-auto">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${theme === "light" ? "bg-white dark:bg-[#331821] shadow-sm" : "text-[#9c4965] dark:text-[#d1a3b1] hover:text-[#1c0d12] dark:hover:text-white"}`}
                  >
                    <Image src="/icons/light-mode.svg" alt="light" width={18} height={18} className={theme === "light" ? "" : "opacity-60"} />
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${theme === "dark" ? "bg-white dark:bg-[#331821] shadow-sm" : "text-[#9c4965] dark:text-[#d1a3b1] hover:text-[#1c0d12] dark:hover:text-white"}`}
                  >
                    <Image src="/icons/dark-mode.svg" alt="dark" width={18} height={18} className={theme === "dark" ? "" : "opacity-60"} />
                    Dark
                  </button>
                </div>
              </div>

              <div className="h-px bg-[#f4e7eb] dark:bg-[#4a2330] w-full"></div>

              {/* Accent Color */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-[#f53d7a]/10 text-[#f53d7a] size-10 shrink-0">
                    <Image src="/icons/palette.svg" alt="palette" width={24} height={24} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  </div>
                  <div>
                    <p className="font-medium text-base text-[#1c0d12] dark:text-white">Accent Color</p>
                    <p className="text-sm text-[#9c4965] dark:text-[#d1a3b1]">Customize the main brand color</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button aria-label="Rose Pink" className="size-8 rounded-full bg-[#f53d7a] ring-2 ring-offset-2 ring-[#f53d7a] ring-offset-white dark:ring-offset-[#331821]"></button>
                  <button aria-label="Blue" className="size-8 rounded-full bg-[#3d7af5] ring-0 hover:ring-2 ring-offset-2 ring-[#3d7af5] ring-offset-white dark:ring-offset-[#331821] transition-all"></button>
                  <button aria-label="Green" className="size-8 rounded-full bg-[#7af53d] ring-0 hover:ring-2 ring-offset-2 ring-[#7af53d] ring-offset-white dark:ring-offset-[#331821] transition-all"></button>
                  <button aria-label="Orange" className="size-8 rounded-full bg-[#f5a33d] ring-0 hover:ring-2 ring-offset-2 ring-[#f5a33d] ring-offset-white dark:ring-offset-[#331821] transition-all"></button>
                  <button aria-label="Purple" className="size-8 rounded-full bg-[#a33df5] ring-0 hover:ring-2 ring-offset-2 ring-[#a33df5] ring-offset-white dark:ring-offset-[#331821] transition-all"></button>
                </div>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section className="flex flex-col gap-4 mb-10">
            <h3 className="text-lg font-bold px-4 text-[#1c0d12] dark:text-white">Account</h3>
            <div className="bg-white dark:bg-[#331821] rounded-xl shadow-sm border border-[#f4e7eb] dark:border-[#4a2330] overflow-hidden divide-y divide-[#f4e7eb] dark:divide-[#4a2330]">
              <Link href="#" className="flex items-center justify-between p-4 md:px-6 hover:bg-[#f8f5f6]/50 dark:hover:bg-[#4a2330]/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-[#f53d7a]/10 text-[#f53d7a] size-10 shrink-0">
                    <Image src="/icons/lock.svg" alt="lock" width={24} height={24} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  </div>
                  <p className="font-medium text-base group-hover:text-[#f53d7a] transition-colors text-[#1c0d12] dark:text-white">Change Password</p>
                </div>
                <Image src="/icons/chevron-right.svg" alt="arrow" width={24} height={24} className="opacity-40" />
              </Link>

              <Link href="#" className="flex items-center justify-between p-4 md:px-6 hover:bg-[#f8f5f6]/50 dark:hover:bg-[#4a2330]/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-[#f53d7a]/10 text-[#f53d7a] size-10 shrink-0">
                    <Image src="/icons/card.svg" alt="card" width={24} height={24} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base group-hover:text-[#f53d7a] transition-colors text-[#1c0d12] dark:text-white">Subscription Plan</p>
                    <p className="text-sm text-[#9c4965] dark:text-[#d1a3b1]">Love Letter Free</p>
                  </div>
                </div>
                <Image src="/icons/chevron-right.svg" alt="arrow" width={24} height={24} className="opacity-40" />
              </Link>

              <Link href="#" className="flex items-center justify-between p-4 md:px-6 hover:bg-[#f8f5f6]/50 dark:hover:bg-[#4a2330]/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-[#f53d7a]/10 text-[#f53d7a] size-10 shrink-0">
                    <Image src="/icons/policy.svg" alt="policy" width={24} height={24} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                  </div>
                  <p className="font-medium text-base group-hover:text-[#f53d7a] transition-colors text-[#1c0d12] dark:text-white">Privacy Policy</p>
                </div>
                <Image src="/icons/chevron-right.svg" alt="arrow" width={24} height={24} className="opacity-40" />
              </Link>
            </div>

            <div className="mt-4 px-4">
              <button
                onClick={handleLogout}
                className="w-full md:w-auto text-[#9c4965] hover:text-red-500 dark:text-[#d1a3b1] dark:hover:text-red-400 text-sm font-bold py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center md:justify-start gap-2"
              >
                <Image src="/icons/logout.svg" alt="logout" width={18} height={18} className="opacity-70" />
                Log Out
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-[#9c4965] dark:text-[#d1a3b1] border-t border-[#f4e7eb] dark:border-[#4a2330] bg-white dark:bg-[#331821]">
        <p className="flex items-center justify-center gap-1">
          © 2024 Love Letter. Made with 
          <Image src="/icons/favorite.svg" alt="heart" width={16} height={16} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
          for couples everywhere.
        </p>
      </footer>
    </div>
  );
}
