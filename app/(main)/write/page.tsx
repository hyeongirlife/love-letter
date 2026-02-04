"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function WritePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [partnerNickname, setPartnerNickname] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/couples/status")
      .then((res) => res.json())
      .then((data) => setPartnerNickname(data.partnerNickname));
  }, []);

  async function handleSend() {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to send");
        return;
      }

      router.push("/archive");
    } catch {
      alert("Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f5f6] dark:bg-[#221016]">
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#f4e7eb] dark:border-[#4a2330] bg-white/90 dark:bg-[#331821]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-slate-500 hover:text-[#f20d59] transition-colors">
              <Image src="/icons/arrow-back.svg" alt="back" width={24} height={24} className="opacity-70 hover:opacity-100" />
            </Link>
            <h1 className="text-xl font-bold text-[#1c0d12] dark:text-white">Write a Letter</h1>
          </div>
          <p className="text-sm text-slate-400">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 w-full max-w-5xl mx-auto overflow-y-auto">
        {/* To Header */}
        <div className="w-full mb-6">
          <h2 className="text-3xl font-bold text-[#1c0d12] dark:text-white flex items-center gap-2">
            To: {partnerNickname || "My Love"} <span className="text-[#f20d59]">💕</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Express your feelings in words...</p>
        </div>

        {/* Letter Paper */}
        <div className="w-full flex-1 flex flex-col">
          <div className="relative w-full bg-white dark:bg-[#331821] rounded-2xl shadow-lg border border-[#f4e7eb] dark:border-[#4a2330] flex flex-col min-h-[450px] overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f20d59]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            
            {/* Paper lines decoration */}
            <div className="absolute inset-x-0 top-20 bottom-0 pointer-events-none opacity-[0.03]">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="h-8 border-b border-slate-900 dark:border-white mx-8"></div>
              ))}
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dear love, I wanted to tell you..."
              className="w-full h-full flex-1 resize-none bg-transparent border-0 p-8 md:p-12 text-xl leading-8 text-[#1c0d12] dark:text-white placeholder:text-slate-400/50 focus-visible:ring-0 min-h-[450px] relative z-10"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {content.length} characters
            </p>
            <Button
              onClick={handleSend}
              disabled={loading || !content.trim()}
              className="h-12 px-8 bg-[#f20d59] hover:bg-[#d61a56] text-white font-bold rounded-xl shadow-lg shadow-[#f20d59]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Sending..." : "Send Letter"}</span>
              <Image src="/icons/send.svg" alt="send" width={18} height={18} className="ml-2 invert" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
