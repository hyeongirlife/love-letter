"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/home");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="relative w-full max-w-[480px] rounded-2xl bg-white dark:bg-[#331821] shadow-xl ring-1 ring-[#f4e7eb] dark:ring-[#4a2330] p-8 sm:p-12 transition-all duration-200">
      <div className="text-center mb-10">
        <div className="mx-auto h-12 w-12 bg-[#f20d59]/10 rounded-full flex items-center justify-center mb-4">
          <Image 
            src="/icons/favorite.svg" 
            alt="heart" 
            width={28} 
            height={28}
            style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }}
          />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#1c0d12] dark:text-white mb-2">Welcome Back</h2>
        <p className="text-base text-[#9c4965] dark:text-[#d1a3b1]">Sign in to check your letters</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1c0d12] dark:text-white mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full h-12 px-4 rounded-xl border border-[#f4e7eb] dark:border-[#4a2330] bg-[#f8f5f6] dark:bg-[#221016] text-[#1c0d12] dark:text-white placeholder-[#9c4965]/50 focus:outline-none focus:ring-2 focus:ring-[#f20d59] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#1c0d12] dark:text-white mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full h-12 px-4 rounded-xl border border-[#f4e7eb] dark:border-[#4a2330] bg-[#f8f5f6] dark:bg-[#221016] text-[#1c0d12] dark:text-white placeholder-[#9c4965]/50 focus:outline-none focus:ring-2 focus:ring-[#f20d59] focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#f20d59] hover:bg-[#d61a56] text-white font-bold text-sm shadow-lg shadow-[#f20d59]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-[#f4e7eb] dark:bg-[#4a2330]" />
        <span className="text-sm text-[#9c4965]">or</span>
        <div className="flex-1 h-px bg-[#f4e7eb] dark:bg-[#4a2330]" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full h-12 rounded-xl border border-[#f4e7eb] dark:border-[#4a2330] bg-white dark:bg-[#221016] text-[#1c0d12] dark:text-white font-medium text-sm hover:bg-[#f8f5f6] dark:hover:bg-[#331821] transition-all flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-[#9c4965] dark:text-[#d1a3b1]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#f20d59] hover:text-[#d61a56] transition-colors">Sign Up</Link>
      </p>
    </div>
  );
}
