import Link from "next/link";

interface LetterCardProps {
  id: string;
  senderName: string;
  title: string;
  time: string;
  isNew?: boolean;
  isRead?: boolean;
}

export function LetterCard({ id, senderName, title, time, isNew, isRead }: LetterCardProps) {
  return (
    <Link href={`/letter/${id}`}>
      <div className={`group flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm border transition-all cursor-pointer ${
        isNew 
          ? "border-primary/30 hover:border-primary" 
          : "border-transparent hover:border-border"
      }`}>
        {/* Icon Box */}
        <div className={`shrink-0 h-14 w-14 flex items-center justify-center rounded-xl transition-colors duration-300 relative ${
          isNew 
            ? "bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground" 
            : "bg-muted text-muted-foreground group-hover:text-primary"
        }`}>
          <span className={`material-symbols-outlined ${isNew ? "icon-filled" : ""}`}>
            {isRead ? "drafts" : "mail"}
          </span>
          {/* Notification Dot */}
          {isNew && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive border-2 border-card rounded-full"></span>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className="text-foreground text-base font-bold truncate pr-4 group-hover:text-primary transition-colors">
              {title}
            </h4>
            {isNew && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                새 편지
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{senderName}</span>
            <span className="text-[10px] opacity-60">•</span>
            <span>{time}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="shrink-0 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all">
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
    </Link>
  );
}
