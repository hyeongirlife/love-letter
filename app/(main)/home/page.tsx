import Link from "next/link";
import { LetterCard } from "@/components/letter/LetterCard";

// 임시 데이터
const letters = [
  { id: "1", senderName: "영희", title: "To my favorite person...", time: "오전 10:30", isNew: true, isRead: false },
  { id: "2", senderName: "영희", title: "About our dinner plans", time: "어제 오후 8:00", isNew: false, isRead: true },
  { id: "3", senderName: "영희", title: "A song that reminds me of you", time: "어제 오전 9:15", isNew: false, isRead: true },
];

export default function HomePage() {
  const unreadCount = letters.filter(l => !l.isRead).length;

  return (
    <>
      {/* Top Bar / Header */}
      <header className="w-full px-10 py-8 flex items-end justify-between z-10 shrink-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight">민수의 우편함 💕</h2>
          <p className="text-muted-foreground font-medium">
            {unreadCount > 0 ? (
              <>읽지 않은 편지 <span className="text-primary font-bold">{unreadCount}통</span>이 있어요.</>
            ) : (
              "모든 편지를 읽었어요."
            )}
          </p>
        </div>
        {/* Quick Action */}
        <button className="bg-card text-foreground shadow-sm hover:shadow-md border border-border h-12 w-12 rounded-full flex items-center justify-center transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Scrollable Feed Area */}
      <div className="flex-1 overflow-y-auto px-10 pb-10 z-10">
        <div className="max-w-[960px] mx-auto flex flex-col gap-8">
          {/* Hero Card: New Letter */}
          {unreadCount > 0 && (
            <Link href={`/letter/${letters[0].id}`}>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg group cursor-pointer transform hover:scale-[1.01] transition-all duration-300">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70"></div>
                {/* Content */}
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full border border-white/30">
                      <span className="material-symbols-outlined text-white text-sm icon-filled">mark_email_unread</span>
                      <span className="text-white text-xs font-bold uppercase tracking-wider">방금 도착</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white leading-tight drop-shadow-sm">
                      영희님의 새 편지!
                    </h3>
                    <p className="text-white/90 font-medium text-lg">지금 확인해보세요...</p>
                  </div>
                  <button className="bg-white text-primary hover:bg-white/90 active:scale-95 transition-all h-12 px-8 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 whitespace-nowrap">
                    <span>확인하기</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            </Link>
          )}

          {/* Feed Lists */}
          <div className="flex flex-col gap-6">
            {/* Today Section */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-foreground px-1">오늘</h3>
              {letters.filter(l => l.time.includes("오전") || l.time.includes("오후")).slice(0, 1).map((letter) => (
                <LetterCard key={letter.id} {...letter} />
              ))}
            </div>

            {/* Yesterday Section */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-foreground px-1">어제</h3>
              {letters.filter(l => l.time.includes("어제")).map((letter) => (
                <LetterCard key={letter.id} {...letter} />
              ))}
            </div>

            {/* View Archive */}
            <div className="flex justify-center py-6">
              <Link href="/archive" className="text-sm font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                <span>보관함 보기</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-10 right-10 z-30">
        <Link href="/write">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl p-4 shadow-lg shadow-primary/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group">
            <span className="material-symbols-outlined text-2xl">edit_note</span>
            <span className="font-bold pr-1">편지 쓰기</span>
          </button>
        </Link>
      </div>
    </>
  );
}
