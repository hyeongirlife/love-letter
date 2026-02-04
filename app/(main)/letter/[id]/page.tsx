"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Letter {
  id: string;
  content: string;
  createdAt: string;
  isOpened: boolean;
  sender: { nickname: string };
  receiver: { nickname: string };
}

export default function LetterPage() {
  const params = useParams();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch(`/api/letters/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setLetter(data.letter);
        setIsOpen(data.letter?.isOpened || false);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleOpen() {
    setIsAnimating(true);
    await fetch(`/api/letters/${params.id}/read`, { method: "PATCH" });
    setTimeout(() => {
      setIsOpen(true);
    }, 800);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f5f6] dark:bg-[#221016]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#f8f5f6] dark:bg-[#221016]">
        <p className="text-slate-500">Letter not found</p>
        <Link href="/home">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    );
  }

  // Envelope view (not opened yet)
  if (!isOpen) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f5f6] dark:bg-[#221016] transition-colors duration-300">
        {/* Top Navigation */}
        <header className="w-full flex justify-between items-center px-8 py-6 z-10 absolute top-0 left-0">
          <Link href="/home" className="flex items-center gap-3">
            <div className="size-8 text-[#f4256a] flex items-center justify-center">
              <Image src="/icons/mail.svg" alt="mail" width={28} height={28} style={{ filter: "invert(27%) sepia(89%) saturate(2186%) hue-rotate(331deg) brightness(97%) contrast(95%)" }} />
            </div>
            <h1 className="text-[#1c0d12] dark:text-white text-lg font-bold tracking-tight">Love Letter</h1>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f4256a]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#f4256a]/10 rounded-full blur-3xl -z-10"></div>

          <div className="relative flex flex-col items-center max-w-3xl w-full">
            {/* Envelope Container */}
            <div 
              onClick={handleOpen}
              className={`group relative w-full max-w-[600px] aspect-[1.6/1] cursor-pointer transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'hover:-translate-y-1'}`}
              style={{ 
                boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Envelope Back Layer */}
              <div className="absolute inset-0 bg-[#fcfcfc] dark:bg-neutral-800 rounded-xl overflow-hidden flex items-end justify-center border border-[#e3dbde]/30 dark:border-neutral-700">
                {/* Letter Preview (shows on hover) */}
                <div className={`w-[95%] h-[90%] bg-white dark:bg-neutral-100 rounded-t-lg shadow-sm transition-all duration-500 ease-out flex flex-col p-8 items-center ${isAnimating ? 'mb-0 opacity-100' : 'mb-[-10%] opacity-0 group-hover:opacity-100 group-hover:mb-0'}`}>
                  <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-300 mb-4 rounded-full"></div>
                  <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-300 mb-4 rounded-full"></div>
                  <div className="w-2/3 h-1 bg-neutral-200 dark:bg-neutral-300 mb-4 rounded-full self-start"></div>
                </div>
              </div>

              {/* Envelope Flap (Top Triangle) */}
              <div className={`absolute top-0 left-0 w-full h-[55%] z-20 origin-top transition-transform duration-500 ${isAnimating ? 'rotate-x-180' : ''}`}>
                <svg className="w-full h-full drop-shadow-md text-[#fcfcfc] dark:text-neutral-800 fill-current" preserveAspectRatio="none" viewBox="0 0 100 50">
                  <path d="M0,0 L50,50 L100,0 Z"></path>
                </svg>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                  <svg className="w-full h-full stroke-black fill-none stroke-[0.2]" preserveAspectRatio="none" viewBox="0 0 100 50">
                    <path d="M0,0 L50,50 L100,0"></path>
                  </svg>
                </div>
              </div>

              {/* Envelope Body (Bottom Pockets) */}
              <div className="absolute bottom-0 left-0 w-full h-full z-10 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#f7f3f5] dark:bg-neutral-700 rounded-bl-xl shadow-[inset_-1px_1px_4px_rgba(0,0,0,0.05)]" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[#f2ecf0] dark:bg-neutral-700 rounded-br-xl shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[45%] bg-[#f7f3f5] dark:bg-neutral-700 z-0 rounded-b-xl" style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}></div>
              </div>

              {/* Sender Name Label */}
              <div className="absolute top-[75%] left-1/2 -translate-x-1/2 z-20 text-center w-full px-8 pointer-events-none">
                <div className="inline-block px-6 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm">
                  <p className="text-neutral-700 dark:text-neutral-200 text-lg md:text-xl font-medium tracking-wide">
                    From. {letter.sender.nickname}
                  </p>
                </div>
              </div>

              {/* Wax Seal Button */}
              <button 
                aria-label="Open Letter" 
                className={`absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-300 outline-none focus:ring-4 focus:ring-[#f4256a]/30 rounded-full ${isAnimating ? 'scale-0' : 'group-hover:scale-110'}`}
              >
                <div className="size-16 md:size-20 bg-[#f4256a] rounded-full flex items-center justify-center border-4 border-[#d61a56] relative" style={{ boxShadow: 'inset 2px 2px 4px rgba(255, 255, 255, 0.3), inset -2px -2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]"></div>
                  <Image src="/icons/favorite.svg" alt="heart" width={32} height={32} className="invert drop-shadow-sm" />
                </div>
              </button>
            </div>

            {/* Instructional Text */}
            <div className="mt-12 text-center animate-pulse">
              <p className="text-[#f4256a] dark:text-[#f4256a]/80 text-sm font-medium tracking-widest uppercase mb-2">
                A letter has arrived
              </p>
              <div className="flex items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
                <Image src="/icons/touch-app.svg" alt="touch" width={18} height={18} className="opacity-60" />
                <span>Click the seal to open</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-neutral-400 dark:text-neutral-600 text-xs">
          <p>© 2024 Love Letter. Secure & Private.</p>
        </footer>
      </div>
    );
  }

  // Opened letter view
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5f6] dark:bg-[#221016]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#f4e7eb] dark:border-[#4a2330] bg-white/90 dark:bg-[#331821]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#f4256a] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span className="font-medium">Back</span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date(letter.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </header>

      {/* Letter Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          {/* Letter Paper */}
          <div className="bg-white dark:bg-[#331821] rounded-2xl shadow-lg border border-[#f4e7eb] dark:border-[#4a2330] p-8 md:p-12 min-h-[500px] relative overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f4256a]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            {/* To */}
            <div className="mb-8">
              <p className="text-lg font-medium text-[#1c0d12] dark:text-white">
                Dear {letter.receiver.nickname} 💕
              </p>
            </div>

            {/* Content */}
            <div className="whitespace-pre-wrap leading-relaxed text-[#1c0d12] dark:text-white/90 text-lg min-h-[200px]">
              {letter.content}
            </div>

            {/* From */}
            <div className="mt-12 text-right">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                {new Date(letter.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
              <p className="text-[#1c0d12] dark:text-white font-medium text-lg">
                With love, {letter.sender.nickname} 💌
              </p>
            </div>
          </div>

          {/* Reply Button */}
          <div className="mt-8">
            <Link href="/write">
              <Button className="w-full h-14 bg-[#f4256a] hover:bg-[#d61a56] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#f4256a]/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Image src="/icons/edit.svg" alt="edit" width={24} height={24} className="mr-2 invert" />
                Write a Reply
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
