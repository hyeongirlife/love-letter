"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: API 연결
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <div className="relative w-full max-w-[480px] rounded-2xl bg-card shadow-xl ring-1 ring-border p-8 sm:p-12 transition-all duration-200">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="mx-auto h-12 w-12 text-primary bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[28px] icon-filled">favorite</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Welcome Back
        </h2>
        <p className="text-base text-muted-foreground">
          로그인하고 편지를 확인하세요
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <Label htmlFor="email">이메일</Label>
          <div className="mt-2">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="h-12"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">비밀번호</Label>
            <div className="text-sm">
              <Link href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                비밀번호 찾기
              </Link>
            </div>
          </div>
          <div className="mt-2">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="h-12"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-card px-6 text-muted-foreground">
            또는
          </span>
        </div>
      </div>

      {/* Social Logins */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-card px-3 py-2.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-accent transition-colors">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>
        <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-3 py-2.5 text-sm font-semibold text-[#191919] shadow-sm hover:bg-[#FEE500]/90 transition-colors">
          <svg className="h-5 w-5 fill-[#3C1E1E]" viewBox="0 0 24 24">
            <path d="M12 3C7.58 3 4 5.79 4 9.24c0 1.95 1.16 3.69 2.97 4.81-.1.35-.37 1.34-.42 1.55-.07.28-.27 1.07.25.75l.13-.08 3.12-2.07c.63.09 1.28.14 1.95.14 4.42 0 8-2.79 8-6.24S16.42 3 12 3z"/>
          </svg>
        </button>
        <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#03C75A] px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#03C75A]/90 transition-colors">
          <span className="font-bold text-lg">N</span>
        </button>
      </div>

      {/* Footer Sign up link */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="/register" className="font-semibold leading-6 text-primary hover:text-primary/80 transition-colors">
          회원가입
        </Link>
      </p>
    </div>
  );
}
