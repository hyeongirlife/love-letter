"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 임시 데이터
const letterData = {
  id: "1",
  sender: { nickname: "영희" },
  receiver: { nickname: "민수" },
  content: `오늘 하루 어땠어?

나는 오늘 맛있는 케이크를 먹었어! 네가 좋아하는 딸기 케이크였는데, 먹으면서 네 생각이 났어.

우리 처음 만났던 카페 기억나? 그때 네가 케이크 크림을 코에 묻히고도 모르고 있었잖아. 그때부터 네가 좋았던 것 같아.

내일 만나자~ 💕`,
  createdAt: "2026.01.27",
};

export default function LetterPage() {
  const [isOpened, setIsOpened] = useState(false);

  // 봉투 열기 전 화면
  if (!isOpened) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="w-full flex justify-between items-center px-8 py-6 z-10">
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">mail</span>
            </div>
            <h1 className="text-foreground text-lg font-bold tracking-tight">Love Letter</h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>

          <div className="relative flex flex-col items-center max-w-3xl w-full">
            {/* Envelope Container */}
            <div
              onClick={() => setIsOpened(true)}
              className="group relative w-full max-w-[500px] aspect-[1.5/1] cursor-pointer transition-transform hover:scale-[1.02]"
            >
              {/* Envelope Body */}
              <div className="absolute inset-0 bg-card rounded-xl shadow-xl overflow-hidden border border-border">
                {/* Envelope Flap (Top Triangle) */}
                <div className="absolute top-0 left-0 w-full h-[55%] z-20">
                  <svg className="w-full h-full drop-shadow-md fill-card" preserveAspectRatio="none" viewBox="0 0 100 50">
                    <path d="M0,0 L50,50 L100,0 Z" />
                  </svg>
                </div>

                {/* Envelope Body Folds */}
                <div className="absolute bottom-0 left-0 w-full h-full z-10 pointer-events-none">
                  <div className="absolute bottom-0 left-0 w-1/2 h-full bg-muted rounded-bl-xl" style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}></div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-full bg-accent rounded-br-xl" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[45%] bg-muted z-0 rounded-b-xl" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}></div>
                </div>

                {/* Sender Name Label */}
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 z-20 text-center w-full px-8 pointer-events-none">
                  <div className="inline-block px-6 py-2 bg-card/60 backdrop-blur-sm rounded-lg border border-border shadow-sm">
                    <p className="text-foreground text-lg md:text-xl font-medium tracking-wide">
                      From. {letterData.sender.nickname}
                    </p>
                  </div>
                </div>

                {/* Wax Seal (The Button) */}
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:scale-110 transition-transform duration-300">
                  <div className="size-16 md:size-20 bg-primary rounded-full flex items-center justify-center border-4 border-primary/80 shadow-lg">
                    <span className="material-symbols-outlined text-primary-foreground drop-shadow-sm text-3xl md:text-4xl icon-filled">
                      favorite
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructional Text */}
            <div className="mt-12 text-center animate-pulse">
              <p className="text-primary text-sm font-medium tracking-widest uppercase mb-2">
                편지가 도착했어요
              </p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <span className="material-symbols-outlined text-lg">touch_app</span>
                <span>봉인을 눌러 열어보세요</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 봉투 열린 후 - 편지 내용
  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <Link href="/home" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-semibold">우편함으로</span>
        </Link>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground shadow-sm hover:shadow-md transition-all">
          <span className="material-symbols-outlined text-[20px]">archive</span>
          <span className="text-sm font-bold">보관</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-24 pt-4">
        {/* Stationery Card */}
        <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
          {/* Decorative Top Border */}
          <div className="h-3 w-full bg-primary/80"></div>

          {/* Floral Accent Header */}
          <div className="relative w-full h-32 overflow-hidden flex justify-center items-center bg-gradient-to-b from-primary/10 to-transparent">
            <span className="material-symbols-outlined text-6xl text-primary/20">local_florist</span>
            <span className="material-symbols-outlined text-4xl text-primary/30 absolute left-1/4 top-4 rotate-[-15deg]">local_florist</span>
            <span className="material-symbols-outlined text-4xl text-primary/30 absolute right-1/4 top-8 rotate-[15deg]">spa</span>
          </div>

          {/* Card Content Wrapper */}
          <div className="px-8 pb-12 pt-2 md:px-16 flex flex-col items-center text-center relative z-0">
            {/* Letter Body */}
            <div className="w-full text-left space-y-6">
              <h1 className="text-2xl font-bold text-foreground mb-6">{letterData.receiver.nickname}에게 💕</h1>

              <div className="text-lg leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                {letterData.content}
              </div>

              {/* Signature */}
              <div className="pt-10 flex flex-col items-end gap-1">
                <p className="text-primary text-xl font-bold">From. {letterData.sender.nickname} 💌</p>
                <p className="text-muted-foreground text-sm font-medium tracking-wide">{letterData.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Decorative Bottom Border */}
          <div className="h-2 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-1"></div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pointer-events-none flex justify-center z-20 h-32 items-end">
        <Link href="/write">
          <Button className="pointer-events-auto shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transform hover:-translate-y-1 transition-all duration-300 h-14 px-8 text-lg font-bold rounded-full">
            <span className="material-symbols-outlined icon-filled mr-2">favorite</span>
            <span>{letterData.sender.nickname}에게 답장하기</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
