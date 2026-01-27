import Link from "next/link";

// 임시 데이터
const anniversaries = [
  { id: "1", title: "결혼기념일", date: "2024-12-01", icon: "diamond", color: "primary", daysLeft: 12 },
  { id: "2", title: "영희 생일", date: "2025-01-15", icon: "cake", color: "purple", daysLeft: 57 },
  { id: "3", title: "1000일", date: "2025-03-03", icon: "favorite", color: "primary", daysLeft: 104 },
  { id: "4", title: "첫 크리스마스", date: "2024-12-25", icon: "forest", color: "green", daysLeft: 36 },
  { id: "5", title: "파리 여행", date: "2024-10-10", icon: "flight", color: "blue", daysLeft: -20 },
];

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  purple: "bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-300",
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  blue: "bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-300",
};

const badgeColorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
  green: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
};

export default function AnniversaryPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col h-full max-w-[1200px] mx-auto px-4 md:px-10 py-8">
        {/* Page Heading */}
        <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <p className="text-primary text-sm font-bold uppercase tracking-wider">Milestones</p>
            <h1 className="text-foreground text-3xl md:text-4xl font-black leading-tight tracking-tight">
              우리의 기념일 💕
            </h1>
          </div>
          <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="text-sm font-bold tracking-wide">추가하기</span>
          </button>
        </header>

        {/* Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          {anniversaries.map((ann) => (
            <div
              key={ann.id}
              className="group relative flex flex-col justify-between h-48 rounded-2xl bg-card border border-border p-5 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Background Decoration */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 ${colorMap[ann.color].split(" ")[0]} rounded-full blur-xl group-hover:scale-110 transition-transform`}></div>

              <div className="flex justify-between items-start">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${colorMap[ann.color]}`}>
                  <span className="material-symbols-outlined text-[24px] icon-filled">{ann.icon}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${badgeColorMap[ann.color]}`}>
                  {ann.daysLeft > 0 ? `D-${ann.daysLeft}` : ann.daysLeft === 0 ? "D-Day!" : "지남"}
                </span>
              </div>

              <div className="flex flex-col gap-1 z-10">
                <h2 className="text-foreground text-lg font-bold leading-tight">{ann.title}</h2>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <p className="text-sm font-medium">{ann.date}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Placeholder Card */}
          <button className="group flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 p-5 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-secondary/20 group-hover:bg-primary/20 flex items-center justify-center transition-colors mb-3">
              <span className="material-symbols-outlined text-secondary group-hover:text-primary text-[24px]">add</span>
            </div>
            <span className="text-muted-foreground group-hover:text-primary font-bold text-sm">기념일 추가</span>
          </button>
        </div>

        {/* Tip Card */}
        <div className="mt-4 p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground">알고 계셨나요?</h3>
              <p className="text-sm text-muted-foreground">설정에서 Google 캘린더와 동기화할 수 있어요.</p>
            </div>
          </div>
          <Link href="/settings" className="text-sm font-bold text-primary hover:text-primary/80 whitespace-nowrap">
            동기화하기
          </Link>
        </div>
      </div>
    </div>
  );
}
