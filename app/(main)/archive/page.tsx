import Link from "next/link";
import { Input } from "@/components/ui/input";

// 임시 데이터
const letters = [
  { id: "1", title: "Happy Anniversary! 💖", preview: "I can't believe it's been another year...", sender: "Jun", date: "Jan 14", isNew: true, isSent: false },
  { id: "2", title: "Thinking of you", preview: "Just wanted to say good luck with your presentation...", sender: "Minji", date: "Jan 10", isNew: false, isSent: true },
  { id: "3", title: "Happy New Year!! 🎆", preview: "New year, same us. Let's make 2026 the best one yet...", sender: "Jun", date: "Jan 01", isNew: false, isSent: false },
  { id: "4", title: "Merry Christmas 🎄", preview: "I loved the gift you got me! It was exactly what I wanted...", sender: "Minji", date: "Dec 25", isNew: false, isSent: true },
  { id: "5", title: "The first snow", preview: "Look outside! It's snowing! Makes me think of that trip...", sender: "Jun", date: "Dec 12", isNew: false, isSent: false },
];

export default function ArchivePage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:px-12 scroll-smooth">
        <div className="mx-auto max-w-5xl flex flex-col gap-6 pb-24">
          {/* Page Heading */}
          <div className="flex flex-col gap-1 pt-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">보관함</h1>
            <p className="text-muted-foreground text-base">주고받은 모든 편지를 모아봤어요.</p>
          </div>

          {/* Search and Filters */}
          <div className="sticky top-0 z-10 -mx-4 bg-background/95 backdrop-blur-md px-4 py-4 md:mx-0 md:bg-transparent md:px-0 md:backdrop-filter-none">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {/* SearchBar */}
              <div className="w-full md:max-w-md">
                <label className="relative flex w-full items-center">
                  <span className="absolute left-4 text-primary material-symbols-outlined">search</span>
                  <Input
                    className="h-12 w-full rounded-full pl-12 pr-4"
                    placeholder="편지 검색..."
                  />
                </label>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 shadow-lg shadow-primary/20">
                  <p className="text-sm font-bold text-primary-foreground">전체</p>
                </button>
                <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-card px-6 ring-1 ring-border hover:bg-accent transition-colors">
                  <p className="text-sm font-medium text-muted-foreground">보낸 편지</p>
                </button>
                <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-card px-6 ring-1 ring-border hover:bg-accent transition-colors">
                  <p className="text-sm font-medium text-muted-foreground">받은 편지</p>
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Content */}
          <div className="flex flex-col gap-8">
            {/* Section: January 2026 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-foreground tracking-tight">2026년 1월</h3>
                <div className="h-[1px] flex-1 bg-border"></div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {letters.slice(0, 3).map((letter) => (
                  <Link key={letter.id} href={`/letter/${letter.id}`}>
                    <div className="group relative flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {letter.isNew ? (
                            <>
                              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                              <span className="text-xs font-semibold text-primary uppercase tracking-wider">New</span>
                            </>
                          ) : (
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              {letter.isSent && <span className="material-symbols-outlined text-[14px]">check</span>}
                              읽음
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{letter.date}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {letter.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {letter.preview}
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-sm">person</span>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {letter.isSent ? `To: ${letter.sender}` : `From: ${letter.sender}`}
                          </span>
                        </div>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Section: December 2025 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-foreground tracking-tight">2025년 12월</h3>
                <div className="h-[1px] flex-1 bg-border"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {letters.slice(3).map((letter) => (
                  <Link key={letter.id} href={`/letter/${letter.id}`}>
                    <div className="group relative flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          {letter.isSent && <span className="material-symbols-outlined text-[14px]">check</span>}
                          읽음
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">{letter.date}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {letter.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {letter.preview}
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-sm">person</span>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {letter.isSent ? `To: ${letter.sender}` : `From: ${letter.sender}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link href="/write" className="absolute bottom-8 right-8 z-20">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:scale-110 active:scale-95 group">
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">edit</span>
        </button>
      </Link>
    </div>
  );
}
