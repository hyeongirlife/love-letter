"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function WritePage() {
  const [content, setContent] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-foreground">편지 쓰기</h1>
          </div>
          <div className="flex items-center gap-2 text-primary/80 bg-primary/5 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-sm">cloud_done</span>
            <span className="text-xs font-semibold">자동 저장됨</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 w-full max-w-5xl mx-auto overflow-y-auto">
        {/* Page Header */}
        <div className="w-full mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">받는 사람</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
              To: 영희 <span className="text-primary">💕</span>
            </h2>
          </div>
        </div>

        {/* The "Paper" Editor */}
        <div className="w-full flex-1 flex flex-col relative group">
          {/* Paper Container */}
          <div className="relative w-full bg-card rounded-xl shadow-sm border border-border flex flex-col min-h-[60vh] md:min-h-[500px] overflow-hidden transition-all duration-300">
            {/* Date Header on Paper */}
            <div className="absolute top-6 right-8 z-10 opacity-60">
              <p className="italic text-muted-foreground text-sm">
                {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Text Area */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="사랑하는 영희에게..."
              className="w-full h-full flex-1 resize-none bg-transparent border-0 focus:ring-0 p-8 md:p-12 text-xl md:text-2xl leading-8 text-foreground placeholder:text-muted-foreground/50 focus:outline-none min-h-[400px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
          </div>

          {/* Toolbar & Actions Footer */}
          <div className="mt-6 w-full bg-card rounded-xl border border-border p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Tools */}
            <div className="flex items-center gap-1 w-full md:w-auto justify-between md:justify-start overflow-x-auto">
              {/* Theme Picker */}
              <button className="p-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">palette</span>
              </button>
              <div className="w-px h-6 bg-border mx-1"></div>
              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <button className="p-2.5 rounded-lg text-foreground hover:bg-accent transition-colors font-bold">B</button>
                <button className="p-2.5 rounded-lg text-foreground hover:bg-accent transition-colors italic">I</button>
              </div>
              <div className="w-px h-6 bg-border mx-1"></div>
              {/* Media Attachment */}
              <div className="flex items-center gap-1">
                <button className="p-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="사진 추가">
                  <span className="material-symbols-outlined">image</span>
                </button>
                <button className="p-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="음성 녹음">
                  <span className="material-symbols-outlined">mic</span>
                </button>
              </div>
            </div>

            {/* Right: Delivery & Send */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Delivery Toggle */}
              <div className="bg-background p-1 rounded-lg flex items-center w-full sm:w-auto">
                <button
                  onClick={() => setIsScheduled(false)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    !isScheduled ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  즉시 전송
                </button>
                <button
                  onClick={() => setIsScheduled(true)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isScheduled ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  예약
                </button>
              </div>

              {/* Send Button */}
              <Button className="w-full sm:w-auto h-11 px-6 shadow-md shadow-primary/30">
                <span>보내기</span>
                <span className="material-symbols-outlined text-[18px] ml-2">send</span>
              </Button>
            </div>
          </div>

          {/* Contextual Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            편지는 암호화되어 안전하게 전달됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
