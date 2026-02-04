import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-[#f8f5f6] dark:bg-[#221016] min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#f20d59]/5 rounded-full blur-[120px] dark:bg-[#f20d59]/10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#f20d59]/10 rounded-full blur-[100px] dark:bg-[#f20d59]/15"></div>
        <div className="absolute top-[20%] right-[15%] w-[200px] h-[200px] bg-[#f20d59]/10 rounded-full blur-[80px] opacity-60 dark:opacity-10"></div>
      </div>

      {/* Navigation Header */}
      <header className="w-full flex items-center justify-between px-8 py-6 z-10 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 text-[#1c0d12] dark:text-white">
          <Image 
            src="/icons/favorite.svg" 
            alt="heart" 
            width={28} 
            height={28}
            style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }}
          />
          <span className="text-xl font-bold tracking-tight">Love Letter</span>
        </div>
        <Link
          href="/login"
          className="flex items-center justify-center px-6 h-10 text-[#1c0d12] dark:text-white text-sm font-bold hover:text-[#f20d59] transition-colors"
        >
          Login
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full max-w-[1200px] mx-auto pb-12">
        <div className="flex flex-col items-center max-w-[640px] w-full text-center">
          {/* Hero Visual */}
          <div className="relative mb-8 group cursor-default">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#f20d59]/10 to-[#f20d59]/5 rounded-full opacity-70 blur-xl dark:opacity-20 transition-opacity group-hover:opacity-100"></div>
            {/* Image Container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white dark:bg-[#331821] rounded-full p-2 shadow-[0_20px_40px_-12px_rgba(242,13,89,0.2)]">
              <div
                className="w-full h-full rounded-full bg-cover bg-center overflow-hidden border-4 border-white dark:border-[#4a2330]"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUqY2AZSUWnFD2GA2QzY7GQ4-ImOSKZ2-RZ6wOwptWpSHFlrml8vpX1rKunFQ_D_AYL65kbkyp4fCFabqHF597FZpTqvS7sUOOjyi_Cb4Q_Zh-0N_vKKmyXCTbIGk-Fn15r-fAWbvmcYceGQVGwRl6bw5GTFslGH5XlJGRcBicRKPKtL9Az5gFevtOCORZ6EwyYx0uq_R2RMxWomepD7mrTdzxUuUgxzcMZk1sRbXCLo88mn5KWVh0wyrnx5bZbyHqsEVIHY3tNy_5')",
                }}
              />
            </div>
            {/* Floating Icon Badge */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white dark:bg-[#4a2330] p-3 rounded-full shadow-lg flex items-center justify-center">
              <Image 
                src="/icons/mail.svg" 
                alt="mail" 
                width={28} 
                height={28}
                style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }}
              />
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4 mb-10">
            <h1 className="text-[#1c0d12] dark:text-white text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Love Letter
            </h1>
            <p className="text-[#1c0d12]/70 dark:text-white/70 text-lg md:text-xl font-medium tracking-wide">
              A daily letter of love
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-4 w-full">
            <Link
              href="/register"
              className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-[#f20d59] hover:bg-[#d61a56] text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#f20d59]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="truncate mr-2">Get Started</span>
              <Image src="/icons/chevron-right.svg" alt="arrow" width={20} height={20} className="invert" />
            </Link>
            <p className="text-sm text-[#1c0d12]/50 dark:text-white/40 mt-2">
              Start your journey of appreciation today
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-6 text-center z-10">
        <div className="flex items-center justify-center gap-6 text-sm font-medium text-[#1c0d12]/40 dark:text-white/30">
          <span className="hover:text-[#f20d59] transition-colors cursor-pointer">About</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <span className="hover:text-[#f20d59] transition-colors cursor-pointer">Privacy</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <span className="hover:text-[#f20d59] transition-colors cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  );
}
