"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Moment {
  id: string;
  title: string;
  date: string;
  category: string;
  description?: string;
  imageUrl?: string;
  icon: string;
  isRecurring: boolean;
  isShared: boolean;
  userId: string;
}

const CATEGORIES = [
  { value: "milestone", label: "Milestone" },
  { value: "anniversary", label: "Anniversary" },
  { value: "travel", label: "Travel" },
  { value: "celebration", label: "Celebration" },
];

const ICONS = ["favorite", "diamond", "cake", "flight", "calendar"];

const iconMap: Record<string, string> = {
  favorite: "/icons/favorite.svg",
  diamond: "/icons/diamond.svg",
  cake: "/icons/cake.svg",
  flight: "/icons/flight.svg",
  calendar: "/icons/calendar.svg",
};

const categoryColors: Record<string, string> = {
  milestone: "bg-rose-50 dark:bg-rose-900/20",
  anniversary: "bg-blue-50 dark:bg-blue-900/20",
  travel: "bg-amber-50 dark:bg-amber-900/20",
  celebration: "bg-purple-50 dark:bg-purple-900/20",
};

function calcDDay(dateStr: string, isRecurring: boolean): { text: string; days: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  if (isRecurring) {
    const thisYear = new Date(today.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const nextYear = new Date(today.getFullYear() + 1, targetDate.getMonth(), targetDate.getDate());
    targetDate = thisYear >= today ? thisYear : nextYear;
  }

  const diff = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return { text: "D-Day", days: 0 };
  if (diff > 0) return { text: `D-${diff}`, days: -diff };
  return { text: `D+${Math.abs(diff)}`, days: Math.abs(diff) };
}

export default function AnniversaryPage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    category: "milestone",
    description: "",
    imageUrl: "",
    icon: "favorite",
    isRecurring: false,
    isShared: false,
  });

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    const res = await fetch("/api/moments");
    if (res.ok) {
      const data = await res.json();
      setMoments(data.moments || []);
    }
    setLoading(false);
  };

  const openModal = (moment?: Moment) => {
    if (moment) {
      setEditingMoment(moment);
      setForm({
        title: moment.title,
        date: moment.date.split("T")[0],
        category: moment.category,
        description: moment.description || "",
        imageUrl: moment.imageUrl || "",
        icon: moment.icon,
        isRecurring: moment.isRecurring,
        isShared: moment.isShared,
      });
    } else {
      setEditingMoment(null);
      setForm({ title: "", date: "", category: "milestone", description: "", imageUrl: "", icon: "favorite", isRecurring: false, isShared: false });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date) return;

    if (editingMoment) {
      await fetch(`/api/moments/${editingMoment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/moments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setModalOpen(false);
    fetchMoments();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/moments/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchMoments();
  };

  // 가장 가까운 미래 기념일 찾기
  const upcomingMoment = moments
    .map(m => ({ ...m, dday: calcDDay(m.date, m.isRecurring) }))
    .filter(m => m.dday.days <= 0)
    .sort((a, b) => b.dday.days - a.dday.days)[0];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f5f6] dark:bg-[#221016]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f5f6] dark:bg-[#221016]">
      <div className="flex-1 p-4 md:p-8 lg:px-12">
        <div className="mx-auto max-w-5xl flex flex-col gap-8 pb-24">
          {/* Header */}
          <div className="flex flex-col gap-1 pt-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Our Precious Moments 💕</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">Celebrating every step of our beautiful journey together.</p>
          </div>

          {/* Hero Banner */}
          {upcomingMoment ? (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f20d59] to-[#fb7185] p-6 md:p-8 text-white shadow-xl shadow-[#f20d59]/20">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Next Anniversary</span>
                  <h2 className="text-2xl md:text-4xl font-black">{upcomingMoment.title}</h2>
                  <p className="text-white/90 font-medium">
                    {new Date(upcomingMoment.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/30">
                  <Image src="/icons/calendar.svg" alt="calendar" width={32} height={32} className="invert" />
                  <div className="flex flex-col">
                    <span className="text-3xl font-black">{upcomingMoment.dday.text}</span>
                    <span className="text-xs font-bold uppercase">Until</span>
                  </div>
                </div>
              </div>
              <Image src="/icons/favorite.svg" alt="" width={180} height={180} className="absolute -bottom-4 -right-4 opacity-10 rotate-12 invert" />
            </div>
          ) : moments.length > 0 ? (
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">No upcoming anniversaries. Add a future date to celebrate! 🎉</p>
            </div>
          ) : null}

          {/* Memory Timeline */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Memory Timeline</h3>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 bg-[#f20d59] hover:bg-[#d61a56] text-white rounded-xl h-10 px-4 shadow-lg shadow-[#f20d59]/20 transition-all font-bold text-sm"
              >
                <Image src="/icons/add.svg" alt="add" width={18} height={18} className="invert" />
                Add New
              </button>
            </div>

            {/* Empty State */}
            {moments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-20 h-20 rounded-full bg-[#f20d59]/10 flex items-center justify-center">
                  <Image src="/icons/favorite.svg" alt="heart" width={40} height={40} style={{ filter: "invert(20%) sepia(90%) saturate(5000%) hue-rotate(330deg) brightness(90%) contrast(100%)" }} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No moments yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center">Start capturing your precious memories together!</p>
                <button
                  onClick={() => openModal()}
                  className="flex items-center gap-2 bg-[#f20d59] hover:bg-[#d61a56] text-white rounded-xl h-12 px-6 shadow-lg shadow-[#f20d59]/20 transition-all font-bold"
                >
                  <Image src="/icons/add.svg" alt="add" width={20} height={20} className="invert" />
                  Add First Moment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moments.map(moment => (
                  <MomentCard
                    key={moment.id}
                    moment={moment}
                    onEdit={() => openModal(moment)}
                    onDelete={() => setDeleteConfirm(moment.id)}
                  />
                ))}
                {/* Add Card */}
                <button
                  onClick={() => openModal()}
                  className="group flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 hover:border-[#f20d59] hover:bg-[#f20d59]/5 transition-all h-[360px]"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-[#f20d59]/20 flex items-center justify-center transition-colors">
                    <Image src="/icons/add.svg" alt="add" width={32} height={32} className="opacity-40 group-hover:opacity-100" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-900 dark:text-white">Add New Moment</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Keep track of our future adventures</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => openModal()}
        className="fixed bottom-8 right-8 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#f20d59] text-white shadow-lg shadow-[#f20d59]/40 transition-transform hover:scale-110 active:scale-95"
      >
        <Image src="/icons/add.svg" alt="add" width={28} height={28} className="invert" />
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingMoment ? "Edit Moment" : "Add Moment"}</h2>
            
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none"
            />
            
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            
            {/* Icon Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Icon</label>
              <div className="flex gap-2">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${form.icon === icon ? "ring-2 ring-[#f20d59] bg-[#f20d59]/10" : "bg-slate-100 dark:bg-slate-700"}`}
                  >
                    <Image src={iconMap[icon]} alt={icon} width={20} height={20} />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Toggles */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Repeat every year</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isRecurring: !form.isRecurring })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isRecurring ? "bg-[#f20d59]" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isRecurring ? "translate-x-5" : ""}`} />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Share with partner</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isShared: !form.isShared })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isShared ? "bg-[#f20d59]" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isShared ? "translate-x-5" : ""}`} />
                </button>
              </label>
            </div>
            
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-12 rounded-xl bg-[#f20d59] text-white font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Image src="/icons/favorite.svg" alt="delete" width={20} height={20} className="opacity-60" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete this moment?</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400">This moment will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-10 rounded-xl bg-red-500 text-white font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MomentCard({ moment, onEdit, onDelete }: { moment: Moment; onEdit: () => void; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dday = calcDDay(moment.date, moment.isRecurring);
  const formattedDate = new Date(moment.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image/Icon Area */}
      <div className={`relative h-48 w-full ${categoryColors[moment.category] || "bg-slate-100"} flex items-center justify-center overflow-hidden`}>
        {moment.imageUrl ? (
          <img src={moment.imageUrl} alt={moment.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <Image src={iconMap[moment.icon] || iconMap.favorite} alt={moment.icon} width={64} height={64} className="opacity-40" />
        )}
        {/* D-Day Badge */}
        <span className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${dday.days <= 0 ? "bg-[#f20d59]" : "bg-[#fb7185]"}`}>
          {dday.text}
        </span>
        {/* More Menu */}
        <div ref={menuRef} className="absolute top-4 left-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Image src="/icons/more-horiz.svg" alt="more" width={20} height={20} className="invert" />
          </button>
          {menuOpen && (
            <div className="absolute top-10 left-0 bg-white dark:bg-slate-700 rounded-lg shadow-lg overflow-hidden min-w-[100px]">
              <button onClick={() => { setMenuOpen(false); onEdit(); }} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2">
                <Image src="/icons/edit.svg" alt="edit" width={16} height={16} /> Edit
              </button>
              <button onClick={() => { setMenuOpen(false); onDelete(); }} className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2">
                <Image src="/icons/favorite.svg" alt="delete" width={16} height={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-[#f20d59] uppercase tracking-widest">{moment.category}</span>
          <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{moment.title}</h4>
          <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
            <Image src="/icons/calendar.svg" alt="calendar" width={14} height={14} className="opacity-60" />
            {formattedDate}
          </p>
        </div>
        {moment.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{moment.description}</p>
        )}
      </div>
    </div>
  );
}
