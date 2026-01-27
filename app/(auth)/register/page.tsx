"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
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
          회원가입
        </h2>
        <p className="text-base text-muted-foreground">
          사랑하는 사람에게 편지를 보내세요
        </p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nickname Input */}
        <div>
          <Label htmlFor="nickname">닉네임</Label>
          <div className="mt-2">
            <Input
              id="nickname"
              name="nickname"
              type="text"
              required
              placeholder="연인에게 보여질 이름"
              className="h-12"
            />
          </div>
        </div>

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
          <Label htmlFor="password">비밀번호</Label>
          <div className="mt-2">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="8자 이상"
              className="h-12"
            />
          </div>
        </div>

        {/* Password Confirm Input */}
        <div>
          <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
          <div className="mt-2">
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              required
              placeholder="비밀번호를 다시 입력하세요"
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
          {loading ? "가입 중..." : "가입하기"}
        </Button>
      </form>

      {/* Footer Login link */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-semibold leading-6 text-primary hover:text-primary/80 transition-colors">
          로그인
        </Link>
      </p>
    </div>
  );
}
