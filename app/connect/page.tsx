"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ConnectPage() {
  const [myCode] = useState("LOVE-842");
  const [inputCode, setInputCode] = useState("");
  const [activeTab, setActiveTab] = useState<"generate" | "enter">("generate");

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col">
      {/* TopNavBar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-border bg-card px-6 py-3 lg:px-10">
        <div className="flex items-center gap-4 text-foreground">
          <div className="size-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl icon-filled">favorite</span>
          </div>
          <h2 className="text-foreground text-xl font-bold leading-tight tracking-[-0.015em]">Love Letter</h2>
        </div>
        <div className="flex items-center justify-end gap-4 lg:gap-8">
          <button className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
            <span className="truncate">Sign Out</span>
          </button>
          <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-8 px-4 lg:px-0">
        <div className="w-full max-w-[960px] flex flex-col gap-8">
          {/* Hero Section */}
          <div className="rounded-xl overflow-hidden shadow-sm">
            <div className="flex flex-col gap-6 bg-gradient-to-r from-primary to-primary/70 items-center justify-center p-8 lg:p-12 text-center relative">
              <div className="flex flex-col gap-2 z-10 max-w-2xl">
                <h1 className="text-white text-3xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
                  연인과 연결하기
                </h1>
                <h2 className="text-white/90 text-sm lg:text-lg font-medium leading-normal">
                  초대 코드를 공유하거나 입력해서 연인과 연결하세요. 매일 편지를 주고받을 수 있어요.
                </h2>
              </div>
            </div>
          </div>

          {/* Main Interaction Card */}
          <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("generate")}
                className={`flex-1 flex flex-col items-center justify-center border-b-[3px] pb-4 pt-5 transition-colors ${
                  activeTab === "generate"
                    ? "border-b-primary bg-primary/5 text-primary"
                    : "border-b-transparent hover:bg-accent text-muted-foreground"
                }`}
              >
                <span className="text-base font-bold leading-normal tracking-[0.015em]">코드 생성</span>
              </button>
              <button
                onClick={() => setActiveTab("enter")}
                className={`flex-1 flex flex-col items-center justify-center border-b-[3px] pb-4 pt-5 transition-colors ${
                  activeTab === "enter"
                    ? "border-b-primary bg-primary/5 text-primary"
                    : "border-b-transparent hover:bg-accent text-muted-foreground"
                }`}
              >
                <span className="text-base font-bold leading-normal tracking-[0.015em]">코드 입력</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Left Panel: Generate Code */}
              <div className={`flex-1 p-6 lg:p-10 flex flex-col gap-8 ${activeTab !== "generate" ? "hidden lg:flex opacity-50" : ""}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">mark_email_unread</span>
                    <h1 className="text-foreground text-2xl font-bold leading-tight">
                      내 초대 코드
                    </h1>
                  </div>
                  <p className="text-muted-foreground text-base font-normal leading-relaxed">
                    이 코드를 연인에게 공유하세요. 24시간 동안 유효합니다.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Code Display Card */}
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-accent p-8">
                    <h2 className="text-foreground text-4xl font-black tracking-widest leading-tight">{myCode}</h2>
                    <p className="text-muted-foreground text-sm font-medium">23:58:12 후 만료</p>
                  </div>
                  <Button
                    onClick={() => navigator.clipboard.writeText(myCode)}
                    className="w-full h-12"
                  >
                    <span className="material-symbols-outlined text-[20px] mr-2">content_copy</span>
                    <span>코드 복사</span>
                  </Button>
                  <div className="flex justify-center gap-4 pt-2">
                    <button className="size-10 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-border transition-colors">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </button>
                    <button className="size-10 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-border transition-colors">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel: Enter Code */}
              <div className={`flex-1 p-6 lg:p-10 flex flex-col justify-center bg-accent/50 ${activeTab !== "enter" ? "hidden lg:flex opacity-50" : ""}`}>
                <div className="flex flex-col gap-6 max-w-[400px] mx-auto w-full">
                  <div className="text-center lg:text-left">
                    <h3 className="text-foreground text-lg font-bold leading-tight mb-2">
                      초대 코드가 있나요?
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      연인에게 받은 코드를 입력해서 연결하세요.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="예: LOVE-842"
                        className="h-12 pl-11"
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <span className="material-symbols-outlined text-[20px]">key</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-12">
                      <span>연결하기</span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <span className="material-symbols-outlined text-muted-foreground text-sm">info</span>
                    <p className="text-muted-foreground text-xs">대소문자를 구분합니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Help */}
          <div className="text-center pb-8">
            <p className="text-muted-foreground text-sm">
              연결에 문제가 있나요? <span className="text-primary font-bold hover:underline cursor-pointer">도움말 보기</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
