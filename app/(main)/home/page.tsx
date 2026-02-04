"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

interface Letter {
  id: string;
  content: string;
  createdAt: string;
  isOpened: boolean;
  senderId: string;
  receiverId: string;
  sender: { nickname: string };
}

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      const res = await fetch("/api/letters");
      if (res.ok) {
        const data = await res.json();
        setLetters(data.letters || []);
      }
      setLoading(false);
    };
    init();
  }, []);

  // 필터링
  let filteredLetters = letters;
  if (filter === "sent") filteredLetters = letters.filter(l => l.senderId === userId);
  else if (filter === "received") filteredLetters = letters.filter(l => l.receiverId === userId);

  // 검색
  if (searchQuery.trim()) {
    filteredLetters = filteredLetters.filter(l => l.content.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  // 정렬
  filteredLetters = [...filteredLetters].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return sortAsc ? -diff : diff;
  });

  // Group letters by month
  const groupByMonth = (letters: Letter[]) => {
    const groups: { [key: string]: Letter[] } = {};
    letters.forEach((letter) => {
      const date = new Date(letter.createdAt);
      const key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!groups[key]) groups[key] = [];
      groups[key].push(letter);
    });
    return groups;
  };

  const groupedLetters = groupByMonth(filteredLetters);
  const sortedGroupEntries = Object.entries(groupedLetters).sort((a, b) => {
    const dateA = new Date(a[1][0].createdAt).getTime();
    const dateB = new Date(b[1][0].createdAt).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Scrollable Area */}
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

              {/* Chips / Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setFilter("all")}
                  className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-6 transition-all active:scale-95 ${
                    filter === "all"
                      ? "bg-[#f20d59] shadow-lg shadow-[#f20d59]/20 text-white font-bold"
                      : "bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                  }`}
                >
                  <p className="text-sm">All</p>
                </button>
                <button
                  onClick={() => setFilter("sent")}
                  className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-6 transition-all active:scale-95 ${
                    filter === "sent"
                      ? "bg-[#f20d59] shadow-lg shadow-[#f20d59]/20 text-white font-bold"
                      : "bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                  }`}
                >
                  <p className="text-sm">Sent</p>
                </button>
                <button
                  onClick={() => setFilter("received")}
                  className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-6 transition-all active:scale-95 ${
                    filter === "received"
                      ? "bg-[#f20d59] shadow-lg shadow-[#f20d59]/20 text-white font-bold"
                      : "bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                  }`}
                >
                  <p className="text-sm">Received</p>
                </button>
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
            {sortedGroupEntries.map(([month, monthLetters]) => (
              <div key={month} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{month}</h3>
                  <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {monthLetters.map((letter) => (
                    <LetterCard key={letter.id} letter={letter} />
                  ))}
                </div>
              </div>
            ))}

            {filteredLetters.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-400 dark:text-slate-500">No letters yet. Write one to your partner!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link href="/write">
        <button className="absolute bottom-8 right-8 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#f20d59] text-white shadow-lg shadow-[#f20d59]/40 transition-transform hover:scale-110 active:scale-95 group">
          <Image src="/icons/edit.svg" alt="write" width={28} height={28} className="invert group-hover:rotate-12 transition-transform" />
          <span className="sr-only">Write New Letter</span>
        </button>
      </Link>
    </div>
  );
}

function LetterCard({ letter }: { letter: Letter }) {
  const isUnread = !letter.isOpened;
  const date = new Date(letter.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Link href={`/letter/${letter.id}`}>
      <div className="group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-xl hover:shadow-[#f20d59]/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUnread ? (
              <>
                <span className="h-2 w-2 rounded-full bg-[#f20d59] animate-pulse"></span>
                <span className="text-xs font-semibold text-[#f20d59] uppercase tracking-wider">New</span>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Image src="/icons/check.svg" alt="check" width={14} height={14} className="opacity-50" />
                Opened
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
              <span className="text-xs font-bold text-slate-500">{letter.sender.nickname.charAt(0)}</span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">From: {letter.sender.nickname}</span>
          </div>
          <button className="text-slate-400 hover:text-[#f20d59] transition-colors">
            <Image src="/icons/more-horiz.svg" alt="more" width={20} height={20} className="opacity-50 hover:opacity-100" />
          </button>
        </div>
      </div>
    </Link>
  );
}
