"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

export default function ConnectPage() {
  const router = useRouter();
  const [myCode, setMyCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [activeTab, setActiveTab] = useState<"generate" | "enter">("generate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/couples/invite-code")
      .then((res) => res.json())
      .then((data) => setMyCode(data.inviteCode || ""));
  }, []);

  async function handleConnect() {
    if (!inputCode.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/couples/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inputCode.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "연결에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-[#f8f5f6] dark:bg-[#221016]">
      {/* TopNavBar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[#e8ced7] dark:border-neutral-800 bg-white dark:bg-[#2a121b] px-6 py-3 lg:px-10">
        <Link href="/home" className="flex items-center gap-4">
          <h2 className="text-[#1c0d12] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Love Letter</h2>
        </Link>
        <div className="flex items-center justify-end gap-4 lg:gap-8">
          <button 
            onClick={handleLogout}
            className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f4256a]/10 hover:bg-[#f4256a]/20 text-[#f4256a] text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
          >
            <span className="truncate">Log Out</span>
          </button>
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#f4256a]/20"
            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1OZuzoIRpGOZppANAmbW8tCoDaA5KcY8y71mCJ4KcQfZoWpV3MItbxaLrNkTLOaQAkLSAlhGTc0aC-YwDdc4lJeH-OLjcj0HHrd_ghsx3PUbuEHV5tChTltDT41UvIO5PGxkeYyOAo6XJhcRnfVXGgFHpK9R2YAX-_PnaLtZt6dQViRtMQlwuVTf8kJ4Rgo6RZ3o8YcjsKgMAQ9elgH1uLtlTARzMrm_ekXbswjoNMdqx8aJ1i48crSWObeEAnBsI0U_VmJhXETg7")` }}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-8 px-4 lg:px-0">
        <div className="w-full max-w-[960px] flex flex-col gap-8">
          {/* Hero Section */}
          <div className="rounded-xl overflow-hidden shadow-sm">
            <div
              className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 lg:p-12 text-center relative"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUv39NBXxsCohVHElzWAcbBYr_JWlL8FPAeLMEQz8SF5zYRN57aTkKl2h2ZSX7_fNsPCLPb6Hk8NrXRihBlg4bjnSD76vU_HZWmMVRRCJAKdKm1DIQzomm4YAqHqQgqZhi9X8xStCzJdjL_LahKzfvtm4N-OhBqA6KxYQT1KGZR7XDh2R9zmAPcRlzfKQghj2anM2kL6co7efshTPFH9oqjMLdXqAPOpLHVoikiE2B-PvuR_ksr1ENEoj3hCGrULKouGsbmmMbxOol")`,
              }}
            >
              <div className="flex flex-col gap-2 z-10 max-w-2xl">
                <h1 className="text-white text-3xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
                  Connect with your Partner
                </h1>
                <h2 className="text-white/90 text-sm lg:text-lg font-medium leading-normal">
                  Link your accounts to start writing your story together. Exchange daily letters, mood updates, and build your shared timeline.
                </h2>
              </div>
            </div>
          </div>

          {/* Main Interaction Card */}
          <div className="bg-white dark:bg-[#2a121b] rounded-xl shadow-lg border border-[#e8ced7] dark:border-neutral-800 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-[#e8ced7] dark:border-neutral-800">
              <button
                onClick={() => setActiveTab("generate")}
                className={`flex-1 flex flex-col items-center justify-center border-b-[3px] pb-4 pt-5 transition-colors ${
                  activeTab === "generate"
                    ? "border-b-[#f4256a] bg-[#f4256a]/5 text-[#f4256a]"
                    : "border-b-transparent hover:bg-neutral-50 dark:hover:bg-white/5 text-[#9c4965] dark:text-neutral-400"
                }`}
              >
                <span className="text-base font-bold leading-normal tracking-[0.015em]">I need a code</span>
              </button>
              <button
                onClick={() => setActiveTab("enter")}
                className={`flex-1 flex flex-col items-center justify-center border-b-[3px] pb-4 pt-5 transition-colors ${
                  activeTab === "enter"
                    ? "border-b-[#f4256a] bg-[#f4256a]/5 text-[#f4256a]"
                    : "border-b-transparent hover:bg-neutral-50 dark:hover:bg-white/5 text-[#9c4965] dark:text-neutral-400"
                }`}
              >
                <span className="text-base font-bold leading-normal tracking-[0.015em]">I have a code</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#e8ced7] dark:divide-neutral-800">
              {/* Left Panel: Generate Code */}
              {activeTab === "generate" && (
                <div className="flex-1 p-6 lg:p-10 flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Image src="/icons/mark-email-unread.svg" alt="email" width={30} height={30} className="text-[#f4256a]" style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
                      <h1 className="text-[#1c0d12] dark:text-white text-2xl font-bold leading-tight">
                        Your Invitation Code
                      </h1>
                    </div>
                    <p className="text-[#1c0d12]/70 dark:text-white/70 text-base font-normal leading-relaxed">
                      Share this unique code with your partner so they can link their account to yours. This code is valid for 24 hours.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#e8ced7] dark:border-neutral-700 bg-[#fcf8f9] dark:bg-white/5 p-8">
                      <h2 className="text-[#1c0d12] dark:text-white text-4xl font-black tracking-widest leading-tight">
                        {myCode || "Loading..."}
                      </h2>
                      <p className="text-[#9c4965] dark:text-pink-300 text-sm font-medium">Expires in 23:58:12</p>
                    </div>
                    <Button
                      onClick={() => navigator.clipboard.writeText(myCode)}
                      className="w-full h-12 bg-[#f4256a] hover:bg-[#f4256a]/90 text-white font-bold"
                      disabled={!myCode}
                    >
                      <Image src="/icons/content-copy.svg" alt="copy" width={20} height={20} className="mr-2 invert" />
                      Copy Code
                    </Button>
                    <div className="flex justify-center gap-4 pt-2">
                      <button className="size-10 rounded-full bg-[#fcf8f9] dark:bg-white/10 flex items-center justify-center hover:bg-[#e8ced7] dark:hover:bg-white/20 transition-colors">
                        <Image src="/icons/share.svg" alt="share" width={20} height={20} className="dark:invert" />
                      </button>
                      <button className="size-10 rounded-full bg-[#fcf8f9] dark:bg-white/10 flex items-center justify-center hover:bg-[#e8ced7] dark:hover:bg-white/20 transition-colors">
                        <Image src="/icons/mail.svg" alt="mail" width={20} height={20} className="dark:invert" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Panel: Enter Code */}
              {activeTab === "enter" && (
                <div className="flex-1 p-6 lg:p-10 flex flex-col justify-center bg-[#fcf8f9]/50 dark:bg-black/20">
                  <div className="flex flex-col gap-6 max-w-[400px] mx-auto w-full">
                    <div className="text-center lg:text-left">
                      <h3 className="text-[#1c0d12] dark:text-white text-lg font-bold leading-tight mb-2">
                        Already have a code?
                      </h3>
                      <p className="text-[#1c0d12]/60 dark:text-white/60 text-sm">
                        If your partner sent you a code, enter it below to complete the connection.
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="flex flex-col gap-2">
                        <span className="text-[#1c0d12] dark:text-white text-sm font-semibold">Partner&apos;s Invitation Code</span>
                        <div className="relative">
                          <Input
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="w-full rounded-xl border border-[#e8ced7] dark:border-neutral-600 bg-white dark:bg-neutral-800 h-12 pl-11 pr-4 text-[#1c0d12] dark:text-white placeholder:text-[#9c4965]/50 focus:ring-2 focus:ring-[#f4256a]/20 focus:border-[#f4256a]"
                            placeholder="e.g. LOVE-842"
                          />
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            <Image src="/icons/key.svg" alt="key" width={20} height={20} className="opacity-50 dark:invert" />
                          </div>
                        </div>
                      </label>
                      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                      <Button
                        onClick={handleConnect}
                        variant="outline"
                        className="w-full h-12 rounded-xl border-[#e8ced7] dark:border-neutral-600 text-[#1c0d12] dark:text-white hover:bg-neutral-50 dark:hover:bg-white/5 font-bold"
                        disabled={loading || !inputCode.trim()}
                      >
                        {loading ? "Connecting..." : "Connect Partner"}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <Image src="/icons/info.svg" alt="info" width={14} height={14} className="opacity-50" />
                      <p className="text-[#9c4965] text-xs">Codes are case-sensitive.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer / Help */}
          <div className="text-center pb-8">
            <p className="text-[#1c0d12]/50 dark:text-white/40 text-sm">
              Having trouble connecting? <a className="text-[#f4256a] font-bold hover:underline" href="#">View Help Guide</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
