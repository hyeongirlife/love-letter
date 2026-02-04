"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type FilterType = "all" | "sent" | "received";

interface Letter {
  id: string;
  content: string;
  createdAt: string;
  isOpened: boolean;
  senderId: string;
  receiverId: string;
  sender: { nickname: string };
  receiver: { nickname: string };
}

export default function ArchivePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasPartner, setHasPartner] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const res = await fetch("/api/letters");
        if (res.ok) {
          const data = await res.json();
          setLetters(data.letters || []);
        }
        
        // Check if user has a partner
        const coupleRes = await fetch("/api/couples/status");
        if (coupleRes.ok) {
          const coupleData = await coupleRes.json();
          setHasPartner(coupleData.partnerId !== null && coupleData.partnerId !== undefined);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleWriteClick = () => {
    if (hasPartner) {
      router.push("/write");
    } else {
      router.push("/connect");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f5f6] dark:bg-[#221016]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  // Filter letters
  let filteredLetters = letters;
  if (filter === "sent") {
    filteredLetters = letters.filter(l => l.senderId === userId);
  } else if (filter === "received") {
    filteredLetters = letters.filter(l => l.receiverId === userId);
  }

  // Search filter
  if (searchQuery.trim()) {
    filteredLetters = filteredLetters.filter(l =>
      l.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 정렬
  filteredLetters = [...filteredLetters].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return sortAsc ? -diff : diff;
  });

  // Group by month
  const groupedLetters: Record<string, Letter[]> = {};
  filteredLetters.forEach(letter => {
    const date = new Date(letter.createdAt);
    const key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!groupedLetters[key]) {
      groupedLetters[key] = [];
    }
    groupedLetters[key].push(letter);
  });

  const sortedGroups = Object.entries(groupedLetters).sort((a, b) => {
    const dateA = new Date(a[1][0].createdAt).getTime();
    const dateB = new Date(b[1][0].createdAt).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f5f6] dark:bg-[#221016]">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:px-12 scroll-smooth">
        <div className="mx-auto max-w-5xl flex flex-col gap-6 pb-24">
          {/* Page Heading */}
          <div className="flex flex-col gap-1 pt-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Letter Box</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">A collection of your shared memories and heartfelt words.</p>
          </div>

          {/* Search and Filters */}
          <div className="sticky top-0 z-10 -mx-4 bg-[#f8f5f6]/95 dark:bg-[#221016]/95 backdrop-blur-md px-4 py-4 md:mx-0 md:bg-transparent md:px-0 md:backdrop-filter-none">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {/* SearchBar */}
              <div className="w-full md:max-w-md">
                <label className="relative flex w-full items-center">
                  <span className="absolute left-4">
                    <Image src="/icons/search.svg" alt="search" width={20} height={20} style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }} />
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full rounded-full bg-white dark:bg-slate-800 border-none pl-12 pr-4 text-base shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#f20d59] focus:outline-none transition-shadow"
                    placeholder="Search for a memory..."
                    type="text"
                  />
                </label>
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {(["all", "sent", "received"] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-6 transition-all active:scale-95 ${
                      filter === f
                        ? "bg-[#f20d59] shadow-lg shadow-[#f20d59]/20 text-white font-bold"
                        : "bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                    }`}
                  >
                    <p className="text-sm">{f === "all" ? "All" : f === "sent" ? "Sent" : "Received"}</p>
                  </button>
                ))}
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
                  title={sortAsc ? "Oldest first" : "Newest first"}
                >
                  <Image 
                    src="/icons/arrow-upward.svg" 
                    alt="sort" 
                    width={20} 
                    height={20} 
                    className={`transition-transform ${sortAsc ? "" : "rotate-180"}`}
                    style={{ filter: "invert(40%)" }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Content */}
          <div className="flex flex-col gap-8">
            {sortedGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Image src="/icons/inventory.svg" alt="empty" width={64} height={64} className="opacity-20 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No letters yet</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {filter === "sent" ? "You haven't sent any letters yet" : filter === "received" ? "You haven't received any letters yet" : "Start writing your first letter!"}
                </p>
              </div>
            ) : (
              sortedGroups.map(([monthKey, monthLetters]) => (
                <div key={monthKey} className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{monthKey}</h3>
                    <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {monthLetters.map((letter) => {
                      const isSent = letter.senderId === userId;
                      const otherNickname = isSent ? letter.receiver?.nickname : letter.sender?.nickname;
                      const formattedDate = new Date(letter.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <Link key={letter.id} href={`/letter/${letter.id}`}>
                          <div className="group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-xl hover:shadow-[#f20d59]/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {!letter.isOpened && !isSent ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-[#f20d59] animate-pulse"></span>
                                    <span className="text-xs font-semibold text-[#f20d59] uppercase tracking-wider">New</span>
                                  </>
                                ) : (
                                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    {isSent && <Image src="/icons/check.svg" alt="check" width={14} height={14} className="opacity-50" />}
                                    {isSent ? "Sent" : "Opened"}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-medium text-slate-400">{formattedDate}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                              <h4 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#f20d59] transition-colors">
                                {letter.content.slice(0, 25)}...
                              </h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                {letter.content.slice(0, 100)}...
                              </p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                                  <span className="text-xs font-bold text-slate-500">{(otherNickname || "?").charAt(0)}</span>
                                </div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                  {isSent ? `To: ${otherNickname || "Unknown"}` : `From: ${otherNickname || "Unknown"}`}
                                </span>
                              </div>
                              <button className="text-slate-400 hover:text-[#f20d59] transition-colors">
                                <Image src="/icons/more-horiz.svg" alt="more" width={20} height={20} className="opacity-50 hover:opacity-100" />
                              </button>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={handleWriteClick}
        className="absolute bottom-8 right-8 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#f20d59] text-white shadow-lg shadow-[#f20d59]/40 transition-transform hover:scale-110 active:scale-95 group"
      >
        <Image src="/icons/edit.svg" alt="write" width={28} height={28} className="invert group-hover:rotate-12 transition-transform" />
        <span className="sr-only">Write New Letter</span>
      </button>
    </div>
  );
}
