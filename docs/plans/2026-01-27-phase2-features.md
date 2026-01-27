# Love Letter Phase 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 미디어 첨부, 테마, 기념일 관리, 보관함 기능 구현

**Prerequisites:** Phase 1 (MVP) 완료

**Tech Stack:** Supabase Storage, Vercel Cron, Web Push API

---

## Phase 2: 핵심 기능 확장

### Task 1: 이미지 업로드 설정

**Files:**
- Create: `app/api/upload/image/route.ts`
- Modify: `lib/supabase.ts`

**Step 1: Supabase Storage 버킷 생성**
Supabase 대시보드에서:
- `letters` 버킷 생성
- Public access 비활성화
- 허용 MIME types: image/jpeg, image/png, image/gif, image/webp

**Step 2: 업로드 API 구현**
```typescript
// app/api/upload/image/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const fileName = `${session.user.id}/${uuidv4()}.${ext}`

  const { data, error } = await supabase.storage
    .from('letters')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('letters')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
```

**Step 3: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 4: 커밋**
```bash
git add .
git commit -m "feat: Add image upload API"
```

---

### Task 2: 편지에 미디어 첨부 UI

**Files:**
- Modify: `components/letter/LetterEditor.tsx`
- Create: `components/letter/MediaUploader.tsx`

**Step 1: MediaUploader 컴포넌트**
```typescript
// components/letter/MediaUploader.tsx
'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface MediaUploaderProps {
  onUpload: (url: string) => void
}

export function MediaUploader({ onUpload }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const { url } = await res.json()
      onUpload(url)
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? '업로드 중...' : '📷 사진'}
      </Button>
    </div>
  )
}
```

**Step 2: LetterEditor 수정**
```typescript
// components/letter/LetterEditor.tsx 수정 부분
import { MediaUploader } from './MediaUploader'

// state 추가
const [mediaUrls, setMediaUrls] = useState<string[]>([])

// handleSend 수정
body: JSON.stringify({
  content,
  mediaUrls,
  scheduledAt: isScheduled ? scheduledAt : null,
}),

// 미디어 추가 함수
function handleMediaUpload(url: string) {
  setMediaUrls(prev => [...prev, url])
}

// JSX에 미디어 영역 추가
{mediaUrls.length > 0 && (
  <div className="flex gap-2 flex-wrap">
    {mediaUrls.map((url, i) => (
      <div key={i} className="relative">
        <img src={url} alt="" className="w-20 h-20 object-cover rounded" />
        <button
          onClick={() => setMediaUrls(prev => prev.filter((_, idx) => idx !== i))}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}

<MediaUploader onUpload={handleMediaUpload} />
```

**Step 3: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 4: 커밋**
```bash
git add .
git commit -m "feat: Add media upload to letter editor"
```

---

### Task 3: Letter 모델에 mediaUrls 추가

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `app/api/letters/route.ts`

**Step 1: 스키마 수정**
```prisma
model Letter {
  // ... 기존 필드
  mediaUrls   String[] @default([])  // 추가
}
```

**Step 2: 마이그레이션**
```bash
npx prisma migrate dev --name add_media_urls
```

**Step 3: API 수정**
```typescript
// app/api/letters/route.ts POST 부분
const { content, mediaUrls, themeId, scheduledAt } = await request.json()

const letter = await prisma.letter.create({
  data: {
    senderId: session.user.id,
    receiverId: user.partnerId,
    content,
    mediaUrls: mediaUrls || [],
    themeId: themeId || 'default',
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
  },
})
```

**Step 4: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 5: 커밋**
```bash
git add .
git commit -m "feat: Add mediaUrls to Letter model"
```

---

### Task 4: 편지 뷰어에 미디어 표시

**Files:**
- Modify: `components/letter/LetterViewer.tsx`

**Step 1: 미디어 표시 추가**
```typescript
// components/letter/LetterViewer.tsx
interface Letter {
  // ... 기존 필드
  mediaUrls: string[]
}

// JSX에 미디어 영역 추가
{letter.mediaUrls.length > 0 && (
  <div className="my-4 space-y-2">
    {letter.mediaUrls.map((url, i) => (
      <img
        key={i}
        src={url}
        alt=""
        className="w-full rounded-lg"
      />
    ))}
  </div>
)}
```

**Step 2: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 3: 커밋**
```bash
git add .
git commit -m "feat: Display media in letter viewer"
```

---

### Task 5: 테마/편지지 시스템

**Files:**
- Create: `lib/themes.ts`
- Create: `components/letter/ThemePicker.tsx`
- Modify: `components/letter/LetterEditor.tsx`
- Modify: `components/letter/LetterViewer.tsx`

**Step 1: 테마 정의**
```typescript
// lib/themes.ts
export interface Theme {
  id: string
  name: string
  bgColor: string
  bgImage?: string
  textColor: string
  fontFamily: string
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: '기본',
    bgColor: '#FFFFFF',
    textColor: '#4A4A4A',
    fontFamily: 'Pretendard',
  },
  {
    id: 'pink',
    name: '핑크',
    bgColor: '#FFF0F5',
    textColor: '#4A4A4A',
    fontFamily: 'Pretendard',
  },
  {
    id: 'vintage',
    name: '빈티지',
    bgColor: '#FDF5E6',
    textColor: '#5C4033',
    fontFamily: 'NanumMyeongjo',
  },
  {
    id: 'night',
    name: '밤하늘',
    bgColor: '#1a1a2e',
    textColor: '#FFFFFF',
    fontFamily: 'Pretendard',
  },
  {
    id: 'spring',
    name: '봄',
    bgColor: '#E8F5E9',
    textColor: '#2E7D32',
    fontFamily: 'Pretendard',
  },
]

export function getTheme(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0]
}
```

**Step 2: ThemePicker 컴포넌트**
```typescript
// components/letter/ThemePicker.tsx
'use client'

import { themes, Theme } from '@/lib/themes'

interface ThemePickerProps {
  selected: string
  onSelect: (themeId: string) => void
}

export function ThemePicker({ selected, onSelect }: ThemePickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 ${
            selected === theme.id ? 'border-pink-500' : 'border-gray-200'
          }`}
          style={{ backgroundColor: theme.bgColor }}
          title={theme.name}
        />
      ))}
    </div>
  )
}
```

**Step 3: LetterEditor에 테마 선택 추가**
```typescript
// 상태 추가
const [themeId, setThemeId] = useState('default')

// ThemePicker 사용
<ThemePicker selected={themeId} onSelect={setThemeId} />

// 전송 데이터에 포함
body: JSON.stringify({
  content,
  mediaUrls,
  themeId,
  scheduledAt: isScheduled ? scheduledAt : null,
}),
```

**Step 4: LetterViewer에 테마 적용**
```typescript
import { getTheme } from '@/lib/themes'

// 편지 표시 시 테마 적용
const theme = getTheme(letter.themeId)

<Card
  className="p-6 min-h-[400px]"
  style={{
    backgroundColor: theme.bgColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
  }}
>
```

**Step 5: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 6: 커밋**
```bash
git add .
git commit -m "feat: Add theme/stationery system"
```

---

### Task 6: 기념일 모델 추가

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `app/api/anniversaries/route.ts`

**Step 1: 스키마 추가**
```prisma
model Anniversary {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  date        DateTime
  isRecurring Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([date])
}
```

**Step 2: User 모델에 관계 추가**
```prisma
model User {
  // ... 기존 필드
  anniversaries   Anniversary[]
}
```

**Step 3: 마이그레이션**
```bash
npx prisma migrate dev --name add_anniversary
```

**Step 4: API 구현**
```typescript
// app/api/anniversaries/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

// 목록 조회
export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const anniversaries = await prisma.anniversary.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json({ anniversaries })
}

// 등록
export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, date, isRecurring } = await request.json()

  const anniversary = await prisma.anniversary.create({
    data: {
      userId: session.user.id,
      title,
      date: new Date(date),
      isRecurring: isRecurring || false,
    },
  })

  return NextResponse.json({ anniversary }, { status: 201 })
}
```

**Step 5: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 6: 커밋**
```bash
git add .
git commit -m "feat: Add anniversary API"
```

---

### Task 7: 기념일 UI

**Files:**
- Create: `app/(main)/anniversary/page.tsx`
- Create: `components/anniversary/AnniversaryCard.tsx`
- Create: `components/anniversary/AnniversaryForm.tsx`

**Step 1: AnniversaryCard 컴포넌트**
```typescript
// components/anniversary/AnniversaryCard.tsx
import { Card } from '@/components/ui/card'
import { differenceInDays, format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface AnniversaryCardProps {
  id: string
  title: string
  date: Date
  isRecurring: boolean
}

export function AnniversaryCard({ title, date, isRecurring }: AnniversaryCardProps) {
  const today = new Date()
  const targetDate = new Date(date)
  const daysLeft = differenceInDays(targetDate, today)

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{isRecurring ? '🎂' : '💝'} {title}</p>
          <p className="text-sm text-gray-500">
            {format(targetDate, 'yyyy.MM.dd', { locale: ko })}
            {isRecurring && ' (매년)'}
          </p>
        </div>
        <div className="text-right">
          {daysLeft === 0 ? (
            <span className="text-pink-500 font-bold">D-Day!</span>
          ) : daysLeft > 0 ? (
            <span className="text-gray-600">D-{daysLeft}</span>
          ) : (
            <span className="text-gray-400">D+{Math.abs(daysLeft)}</span>
          )}
        </div>
      </div>
    </Card>
  )
}
```

**Step 2: AnniversaryForm 컴포넌트**
```typescript
// components/anniversary/AnniversaryForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AnniversaryFormProps {
  onSubmit: () => void
}

export function AnniversaryForm({ onSubmit }: AnniversaryFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await fetch('/api/anniversaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          date: formData.get('date'),
          isRecurring: formData.get('isRecurring') === 'on',
        }),
      })

      onSubmit()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">기념일 이름</Label>
        <Input id="title" name="title" placeholder="예: 100일" required />
      </div>
      <div>
        <Label htmlFor="date">날짜</Label>
        <Input id="date" name="date" type="date" required />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="isRecurring" />
        <span>매년 반복</span>
      </label>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}
```

**Step 3: 기념일 페이지**
```typescript
// app/(main)/anniversary/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AnniversaryCard } from '@/components/anniversary/AnniversaryCard'

export default async function AnniversaryPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const anniversaries = await prisma.anniversary.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'asc' },
  })

  return (
    <div className="min-h-screen bg-[#FFF9FA] pb-20">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">기념일</h1>
      </header>

      <main className="p-4 space-y-4">
        <p className="text-lg">💕 우리의 기념일</p>

        <div className="space-y-3">
          {anniversaries.map((ann) => (
            <AnniversaryCard
              key={ann.id}
              id={ann.id}
              title={ann.title}
              date={ann.date}
              isRecurring={ann.isRecurring}
            />
          ))}
        </div>

        {anniversaries.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            등록된 기념일이 없어요
          </p>
        )}
      </main>
    </div>
  )
}
```

**Step 4: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 5: 커밋**
```bash
git add .
git commit -m "feat: Add anniversary management UI"
```

---

### Task 8: 보관함 페이지

**Files:**
- Create: `app/(main)/archive/page.tsx`

**Step 1: 보관함 페이지**
```typescript
// app/(main)/archive/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LetterCard } from '@/components/letter/LetterCard'

export default async function ArchivePage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const letters = await prisma.letter.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    include: {
      sender: { select: { nickname: true } },
      receiver: { select: { nickname: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // 월별 그룹화
  const grouped = letters.reduce((acc, letter) => {
    const month = new Date(letter.createdAt).toISOString().slice(0, 7)
    if (!acc[month]) acc[month] = []
    acc[month].push(letter)
    return acc
  }, {} as Record<string, typeof letters>)

  return (
    <div className="min-h-screen bg-[#FFF9FA] pb-20">
      <header className="p-4">
        <h1 className="text-xl font-bold">보관함</h1>
      </header>

      <main className="p-4 space-y-6">
        {Object.entries(grouped).map(([month, monthLetters]) => (
          <div key={month}>
            <h2 className="text-sm text-gray-500 mb-2">
              {month.replace('-', '년 ')}월
            </h2>
            <div className="space-y-3">
              {monthLetters.map((letter) => (
                <LetterCard
                  key={letter.id}
                  id={letter.id}
                  senderName={
                    letter.senderId === session.user.id
                      ? `내가 → ${letter.receiver.nickname}`
                      : letter.sender.nickname
                  }
                  createdAt={letter.createdAt}
                  isOpened={letter.isOpened}
                />
              ))}
            </div>
          </div>
        ))}

        {letters.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            보관된 편지가 없어요
          </p>
        )}
      </main>
    </div>
  )
}
```

**Step 2: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 3: 커밋**
```bash
git add .
git commit -m "feat: Add archive page"
```

---

### Task 9: Vercel Cron - 예약 편지 전달

**Files:**
- Create: `app/api/cron/deliver-scheduled/route.ts`
- Create: `vercel.json`

**Step 1: Cron API**
```typescript
// app/api/cron/deliver-scheduled/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // 예약 시간이 지난 편지들 처리
  const result = await prisma.letter.updateMany({
    where: {
      scheduledAt: { lte: now },
      deliveredAt: null,
    },
    data: {
      deliveredAt: now,
    },
  })

  return NextResponse.json({
    success: true,
    delivered: result.count,
    timestamp: now.toISOString(),
  })
}
```

**Step 2: vercel.json 생성**
```json
{
  "crons": [
    {
      "path": "/api/cron/deliver-scheduled",
      "schedule": "* * * * *"
    }
  ]
}
```

**Step 3: 환경 변수 추가**
```env
CRON_SECRET=your-cron-secret-key
```

**Step 4: 커밋**
```bash
git add .
git commit -m "feat: Add scheduled letter delivery cron"
```

---

### Task 10: 설정 페이지

**Files:**
- Create: `app/(main)/settings/page.tsx`
- Create: `app/api/auth/profile/route.ts`

**Step 1: 프로필 수정 API**
```typescript
// app/api/auth/profile/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function PATCH(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { nickname, reminderTime } = await request.json()

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(nickname && { nickname }),
      ...(reminderTime && { reminderTime }),
    },
  })

  return NextResponse.json({ user })
}
```

**Step 2: 설정 페이지**
```typescript
// app/(main)/settings/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/settings/SettingsForm'

export default async function SettingsPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { partner: { select: { nickname: true } } },
  })

  return (
    <div className="min-h-screen bg-[#FFF9FA] pb-20">
      <header className="p-4">
        <h1 className="text-xl font-bold">설정</h1>
      </header>

      <main className="p-4 space-y-6">
        <SettingsForm user={user} />
      </main>
    </div>
  )
}
```

**Step 3: SettingsForm 컴포넌트**
```typescript
// components/settings/SettingsForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: formData.get('nickname'),
          reminderTime: formData.get('reminderTime'),
        }),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              name="nickname"
              defaultValue={user.nickname}
            />
          </div>
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-gray-100"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reminderTime">매일 리마인더 시간</Label>
            <Input
              id="reminderTime"
              name="reminderTime"
              type="time"
              defaultValue={user.reminderTime}
            />
          </div>
        </CardContent>
      </Card>

      {user.partner && (
        <Card>
          <CardHeader>
            <CardTitle>연결된 연인</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">💕 {user.partner.nickname}</p>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}
```

**Step 4: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 5: 커밋**
```bash
git add .
git commit -m "feat: Add settings page"
```

---

## 완료 체크리스트

- [ ] Task 1: 이미지 업로드 설정
- [ ] Task 2: 편지에 미디어 첨부 UI
- [ ] Task 3: Letter 모델에 mediaUrls 추가
- [ ] Task 4: 편지 뷰어에 미디어 표시
- [ ] Task 5: 테마/편지지 시스템
- [ ] Task 6: 기념일 모델 추가
- [ ] Task 7: 기념일 UI
- [ ] Task 8: 보관함 페이지
- [ ] Task 9: Vercel Cron - 예약 편지 전달
- [ ] Task 10: 설정 페이지

---

*문서 작성일: 2026-01-27*
*버전: 1.0*
