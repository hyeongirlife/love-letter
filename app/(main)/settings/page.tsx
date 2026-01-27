import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <main className="flex-1 flex justify-center py-10 px-4 md:px-10">
        <div className="flex flex-col max-w-[800px] w-full gap-8">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-end gap-3 px-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] font-bold leading-tight tracking-tight text-foreground">설정</h1>
              <p className="text-muted-foreground text-base font-normal">프로필, 알림, 연결된 연인을 관리하세요.</p>
            </div>
          </div>

          {/* Profile Header Card */}
          <section className="bg-card rounded-xl shadow-sm border border-border p-6 overflow-hidden relative">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
              <div className="relative group cursor-pointer">
                <div className="bg-primary/20 rounded-full size-24 md:size-32 flex items-center justify-center border-4 border-background shadow-md">
                  <span className="material-symbols-outlined text-primary text-5xl">favorite</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white">edit</span>
                </div>
              </div>
              <div className="flex flex-col flex-1 text-center md:text-left justify-center h-full py-2">
                <h2 className="text-2xl font-bold leading-tight mb-1 text-foreground">민수 & 영희</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-[20px] icon-filled">favorite</span>
                  <p className="text-muted-foreground font-medium">2021년 10월 14일부터 함께</p>
                </div>
                <div className="inline-flex items-center gap-2 self-center md:self-start bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  Premium Member
                </div>
              </div>
              <Button variant="outline" className="shrink-0">
                <span className="material-symbols-outlined text-[18px] mr-2">edit</span>
                프로필 수정
              </Button>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold px-4 text-foreground">알림 설정</h3>
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden divide-y divide-border">
              {/* Item 1 */}
              <div className="flex items-center justify-between p-4 md:px-6 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base text-foreground">새 편지 알림</p>
                    <p className="text-sm text-muted-foreground">연인이 편지를 보내면 알림을 받아요</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-4 md:px-6 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0">
                    <span className="material-symbols-outlined">cake</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base text-foreground">기념일 알림</p>
                    <p className="text-sm text-muted-foreground">기념일 1주일 전에 알림을 받아요</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between p-4 md:px-6 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base text-foreground">매일 리마인더</p>
                    <p className="text-sm text-muted-foreground">설정한 시간에 편지 쓰기 알림</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Theme Preferences */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold px-4 text-foreground">테마</h3>
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden p-6 flex flex-col gap-6">
              {/* Theme Mode */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0">
                    <span className="material-symbols-outlined">contrast</span>
                  </div>
                  <div>
                    <p className="font-medium text-base text-foreground">앱 테마</p>
                    <p className="text-sm text-muted-foreground">원하는 모드를 선택하세요</p>
                  </div>
                </div>
                <div className="flex bg-background rounded-lg p-1 self-start md:self-auto w-full md:w-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-card shadow-sm text-sm font-medium transition-all">
                    <span className="material-symbols-outlined text-[18px]">light_mode</span>
                    Light
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-muted-foreground hover:text-foreground text-sm font-medium transition-all">
                    <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                    Dark
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-muted-foreground hover:text-foreground text-sm font-medium transition-all">
                    <span className="material-symbols-outlined text-[18px]">settings_system_daydream</span>
                    System
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border w-full"></div>

              {/* Accent Color */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0">
                    <span className="material-symbols-outlined">palette</span>
                  </div>
                  <div>
                    <p className="font-medium text-base text-foreground">강조 색상</p>
                    <p className="text-sm text-muted-foreground">메인 색상을 변경하세요</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="size-8 rounded-full bg-[#ff6b9c] ring-2 ring-offset-2 ring-[#ff6b9c] ring-offset-card"></button>
                  <button className="size-8 rounded-full bg-[#3d7af5] ring-0 hover:ring-2 ring-offset-2 ring-[#3d7af5] ring-offset-card transition-all"></button>
                  <button className="size-8 rounded-full bg-[#7af53d] ring-0 hover:ring-2 ring-offset-2 ring-[#7af53d] ring-offset-card transition-all"></button>
                  <button className="size-8 rounded-full bg-[#f5a33d] ring-0 hover:ring-2 ring-offset-2 ring-[#f5a33d] ring-offset-card transition-all"></button>
                  <button className="size-8 rounded-full bg-[#a33df5] ring-0 hover:ring-2 ring-offset-2 ring-[#a33df5] ring-offset-card transition-all"></button>
                </div>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section className="flex flex-col gap-4 mb-10">
            <h3 className="text-lg font-bold px-4 text-foreground">계정</h3>
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden divide-y divide-border">
              <Link href="#" className="flex items-center justify-between p-4 md:px-6 hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <p className="font-medium text-base group-hover:text-primary transition-colors text-foreground">비밀번호 변경</p>
                </div>
                <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
              </Link>
              <Link href="#" className="flex items-center justify-between p-4 md:px-6 hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0">
                    <span className="material-symbols-outlined">card_membership</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base group-hover:text-primary transition-colors text-foreground">구독 플랜</p>
                    <p className="text-sm text-muted-foreground">Love Letter Premium</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
              </Link>
              <Link href="#" className="flex items-center justify-between p-4 md:px-6 hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-10 shrink-0">
                    <span className="material-symbols-outlined">policy</span>
                  </div>
                  <p className="font-medium text-base group-hover:text-primary transition-colors text-foreground">개인정보 처리방침</p>
                </div>
                <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
              </Link>
            </div>
            <div className="mt-4 px-4">
              <button className="w-full md:w-auto text-muted-foreground hover:text-destructive text-sm font-bold py-2 px-4 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                로그아웃
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
