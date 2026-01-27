import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[15%] w-[200px] h-[200px] bg-secondary/60 rounded-full blur-[80px] opacity-60"></div>
      </div>

      {/* Navigation Header */}
      <header className="w-full flex items-center justify-between px-8 py-6 z-10 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 text-foreground">
          <span className="material-symbols-outlined text-primary text-3xl icon-filled">favorite</span>
          <span className="text-xl font-bold tracking-tight">Love Letter</span>
        </div>
        <Link 
          href="/login"
          className="flex items-center justify-center px-6 h-10 text-foreground text-sm font-bold hover:text-primary transition-colors"
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
            <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/70 to-accent rounded-full opacity-70 blur-xl transition-opacity group-hover:opacity-100"></div>
            {/* Image Container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 bg-card rounded-full p-2 shadow-[0_20px_40px_-12px_rgba(255,107,156,0.2)]">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center border-4 border-card">
                <span className="material-symbols-outlined text-primary text-8xl icon-filled">mail</span>
              </div>
            </div>
            {/* Floating Icon Badge */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-card p-3 rounded-full shadow-lg text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl md:text-3xl icon-filled">favorite</span>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4 mb-10">
            <h1 className="text-foreground text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Love Letter
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium tracking-wide">
              매일 주고받는 사랑의 편지
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-4 w-full">
            <Link
              href="/register"
              className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="truncate mr-2">시작하기</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              오늘부터 사랑을 전해보세요
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-6 text-center z-10">
        <div className="flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
          <span className="hover:text-primary transition-colors cursor-pointer">About</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <span className="hover:text-primary transition-colors cursor-pointer">Privacy</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <span className="hover:text-primary transition-colors cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  );
}
