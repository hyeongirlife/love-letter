# Love Letter MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 연인 간 텍스트 편지 교환이 가능한 MVP 구현

**Architecture:** Next.js 15 App Router + Prisma + Supabase (Auth, DB, Storage)

**Tech Stack:** Next.js, TypeScript, Prisma, Supabase, Tailwind CSS, shadcn/ui, Zustand

---

## Phase 1: 프로젝트 초기 설정

### Task 1: Next.js 프로젝트 생성

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`

**Step 1: 프로젝트 생성**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

**Step 2: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 3: 커밋**
```bash
git add .
git commit -m "chore: Initialize Next.js 15 project"
```

---

### Task 2: shadcn/ui 설정

**Files:**
- Create: `components.json`
- Create: `components/ui/button.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/card.tsx`
- Create: `lib/utils.ts`

**Step 1: shadcn/ui 초기화**
```bash
npx shadcn@latest init -d
```

**Step 2: 기본 컴포넌트 설치**
```bash
npx shadcn@latest add button input card textarea label toast
```

**Step 3: 빌드 확인**
```bash
npm run build
```
Expected: 성공

**Step 4: 커밋**
```bash
git add .
git commit -m "chore: Add shadcn/ui components"
```

---

### Task 3: Prisma & Supabase 설정

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`
- Create: `lib/supabase.ts`
- Create: `.env.local`

**Step 1: 패키지 설치**
```bash
npm install prisma @prisma/client @supabase/supabase-js
```

**Step 2: Prisma 초기화**
```bash
npx prisma init
```

**Step 3: schema.prisma 작성**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  nickname      String
  inviteCode    String   @unique @default(cuid())
  partnerId     String?  @unique
  partner       User?    @relation("Couple", fields: [partnerId], references: [id])
  partnerOf     User?    @relation("Couple")
  sentLetters     Letter[] @relation("Sender")
  receivedLetters Letter[] @relation("Receiver")
  reminderTime  String   @default("21:00")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Letter {
  id          String   @id @default(cuid())
  senderId    String
  receiverId  String
  sender      User     @relation("Sender", fields: [senderId], references: [id])
  receiver    User     @relation("Receiver", fields: [receiverId], references: [id])
  content     String   @db.Text
  themeId     String   @default("default")
  scheduledAt DateTime?
  isOpened    Boolean  @default(false)
  openedAt    DateTime?
  createdAt   DateTime @default(now())
}
```

**Step 4: 환경 변수 설정**
```env
# .env.local
DATABASE_URL="your-supabase-connection-string"
DIRECT_URL="your-supabase-direct-string"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

**Step 5: Prisma 클라이언트 생성**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Step 6: Supabase 클라이언트 생성**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Step 7: 타입 체크**
```bash
npm run build
```
Expected: 성공

**Step 8: 커밋**
```bash
git add .
git commit -m "chore: Add Prisma and Supabase configuration"
```

---

## Phase 2: 인증 구현

### Task 4: 회원가입 API

**Files:**
- Create: `app/api/auth/register/route.ts`
- Test: `__tests__/api/auth/register.test.ts`

**Step 1: 테스트 설정**
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react
```

**Step 2: 실패하는 테스트 작성**
```typescript
// __tests__/api/auth/register.test.ts
import { describe, it, expect } from 'vitest'

describe('POST /api/auth/register', () => {
  it('should create a new user', async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        nickname: '테스트',
        password: 'password123'
      })
    })
    expect(res.status).toBe(201)
  })
})
```

**Step 3: 테스트 실행하여 실패 확인**
```bash
npm run test
```
Expected: FAIL

**Step 4: API 구현**
```typescript
// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, nickname, password } = await request.json()

    // Supabase Auth에 사용자 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // DB에 사용자 프로필 저장
    const user = await prisma.user.create({
      data: {
        id: authData.user!.id,
        email,
        nickname,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
```

**Step 5: 테스트 통과 확인**
```bash
npm run test
```
Expected: PASS

**Step 6: 커밋**
```bash
git add .
git commit -m "feat: Add user registration API"
```

---

### Task 5: 로그인 API

**Files:**
- Create: `app/api/auth/login/route.ts`
- Test: `__tests__/api/auth/login.test.ts`

**Step 1: 실패하는 테스트 작성**
```typescript
// __tests__/api/auth/login.test.ts
import { describe, it, expect } from 'vitest'

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.session).toBeDefined()
  })
})
```

**Step 2: 테스트 실행하여 실패 확인**
```bash
npm run test -- login
```
Expected: FAIL

**Step 3: API 구현**
```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ session: data.session }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
```

**Step 4: 테스트 통과 확인**
```bash
npm run test -- login
```
Expected: PASS

**Step 5: 커밋**
```bash
git add .
git commit -m "feat: Add login API"
```

---

### Task 6: 회원가입 UI

**Files:**
- Create: `app/(auth)/register/page.tsx`
- Create: `components/auth/RegisterForm.tsx`

**Step 1: RegisterForm 컴포넌트 작성**
```typescript
// components/auth/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const nickname = formData.get('nickname') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nickname, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="nickname">닉네임</Label>
            <Input id="nickname" name="nickname" required />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '가입 중...' : '가입하기'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

**Step 2: 페이지 작성**
```typescript
// app/(auth)/register/page.tsx
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9FA]">
      <RegisterForm />
    </div>
  )
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
git commit -m "feat: Add registration UI"
```

---

### Task 7: 로그인 UI

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `components/auth/LoginForm.tsx`

**Step 1: LoginForm 컴포넌트 작성**
```typescript
// components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      router.push('/home')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/register" className="text-sm text-gray-500 hover:underline">
          계정이 없으신가요? 회원가입
        </Link>
      </CardFooter>
    </Card>
  )
}
```

**Step 2: 페이지 작성**
```typescript
// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9FA]">
      <LoginForm />
    </div>
  )
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
git commit -m "feat: Add login UI"
```

---

## Phase 3: 커플 연결

### Task 8: 커플 연결 API

**Files:**
- Create: `app/api/couples/connect/route.ts`
- Create: `app/api/couples/invite-code/route.ts`

**Step 1: 초대 코드 조회 API**
```typescript
// app/api/couples/invite-code/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { inviteCode: true },
  })

  return NextResponse.json({ inviteCode: user?.inviteCode })
}
```

**Step 2: 커플 연결 API**
```typescript
// app/api/couples/connect/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { inviteCode } = await request.json()

  // 초대 코드로 상대방 찾기
  const partner = await prisma.user.findUnique({
    where: { inviteCode },
  })

  if (!partner) {
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
  }

  if (partner.id === session.user.id) {
    return NextResponse.json({ error: 'Cannot connect to yourself' }, { status: 400 })
  }

  if (partner.partnerId) {
    return NextResponse.json({ error: 'User already connected' }, { status: 400 })
  }

  // 양쪽 모두 연결
  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { partnerId: partner.id },
    }),
    prisma.user.update({
      where: { id: partner.id },
      data: { partnerId: session.user.id },
    }),
  ])

  return NextResponse.json({ success: true, partner: { nickname: partner.nickname } })
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
git commit -m "feat: Add couple connection API"
```

---

### Task 9: 커플 연결 UI

**Files:**
- Create: `app/connect/page.tsx`
- Create: `components/couple/CoupleConnector.tsx`

**Step 1: CoupleConnector 컴포넌트**
```typescript
// components/couple/CoupleConnector.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CoupleConnector() {
  const router = useRouter()
  const [myCode, setMyCode] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/couples/invite-code')
      .then(res => res.json())
      .then(data => setMyCode(data.inviteCode))
  }, [])

  async function handleConnect() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/couples/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: inputCode }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      router.push('/home')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>내 초대 코드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={myCode} readOnly className="font-mono" />
            <Button onClick={() => navigator.clipboard.writeText(myCode)}>
              복사
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            이 코드를 연인에게 공유하세요
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>초대 코드 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="연인의 초대 코드 입력"
            className="font-mono"
          />
          <Button onClick={handleConnect} className="w-full" disabled={loading}>
            {loading ? '연결 중...' : '연결하기'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 2: 페이지 작성**
```typescript
// app/connect/page.tsx
import { CoupleConnector } from '@/components/couple/CoupleConnector'

export default function ConnectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9FA] p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">커플 연결</h1>
        <CoupleConnector />
      </div>
    </div>
  )
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
git commit -m "feat: Add couple connection UI"
```

---

## Phase 4: 편지 기능

### Task 10: 편지 작성 API

**Files:**
- Create: `app/api/letters/route.ts`

**Step 1: API 구현**
```typescript
// app/api/letters/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

// 편지 목록 조회
export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const letters = await prisma.letter.findMany({
    where: {
      receiverId: session.user.id,
      OR: [
        { scheduledAt: null },
        { scheduledAt: { lte: new Date() } },
      ],
    },
    include: {
      sender: { select: { nickname: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ letters })
}

// 편지 작성
export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content, themeId, scheduledAt } = await request.json()

  // 파트너 확인
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { partnerId: true },
  })

  if (!user?.partnerId) {
    return NextResponse.json({ error: 'No partner connected' }, { status: 400 })
  }

  const letter = await prisma.letter.create({
    data: {
      senderId: session.user.id,
      receiverId: user.partnerId,
      content,
      themeId: themeId || 'default',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
  })

  return NextResponse.json({ letter }, { status: 201 })
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
git commit -m "feat: Add letter creation API"
```

---

### Task 11: 편지 읽기 API

**Files:**
- Create: `app/api/letters/[id]/route.ts`
- Create: `app/api/letters/[id]/read/route.ts`

**Step 1: 편지 상세 조회 API**
```typescript
// app/api/letters/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const letter = await prisma.letter.findFirst({
    where: {
      id: params.id,
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    include: {
      sender: { select: { nickname: true } },
      receiver: { select: { nickname: true } },
    },
  })

  if (!letter) {
    return NextResponse.json({ error: 'Letter not found' }, { status: 404 })
  }

  return NextResponse.json({ letter })
}
```

**Step 2: 편지 읽음 처리 API**
```typescript
// app/api/letters/[id]/read/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const letter = await prisma.letter.updateMany({
    where: {
      id: params.id,
      receiverId: session.user.id,
      isOpened: false,
    },
    data: {
      isOpened: true,
      openedAt: new Date(),
    },
  })

  return NextResponse.json({ success: true })
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
git commit -m "feat: Add letter reading API"
```

---

### Task 12: 홈 화면 (우편함)

**Files:**
- Create: `app/(main)/home/page.tsx`
- Create: `components/letter/LetterCard.tsx`
- Create: `components/layout/BottomNav.tsx`

**Step 1: LetterCard 컴포넌트**
```typescript
// components/letter/LetterCard.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface LetterCardProps {
  id: string
  senderName: string
  createdAt: Date
  isOpened: boolean
}

export function LetterCard({ id, senderName, createdAt, isOpened }: LetterCardProps) {
  return (
    <Link href={`/letter/${id}`}>
      <Card className={`p-4 hover:shadow-md transition ${!isOpened ? 'border-pink-300 bg-pink-50' : ''}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isOpened ? '📭' : '📬'}</span>
          <div className="flex-1">
            <p className="font-medium">{senderName}님의 편지</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ko })}
              {!isOpened && ' · 아직 안 읽음'}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
```

**Step 2: BottomNav 컴포넌트**
```typescript
// components/layout/BottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/home', label: '홈', icon: '📬' },
  { href: '/archive', label: '보관함', icon: '📁' },
  { href: '/anniversary', label: '기념일', icon: '💝' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center p-2 ${
              pathname === item.href ? 'text-pink-500' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
```

**Step 3: 홈 페이지**
```typescript
// app/(main)/home/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LetterCard } from '@/components/letter/LetterCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { partner: { select: { nickname: true } } },
  })

  if (!user?.partnerId) redirect('/connect')

  const letters = await prisma.letter.findMany({
    where: {
      receiverId: session.user.id,
      OR: [
        { scheduledAt: null },
        { scheduledAt: { lte: new Date() } },
      ],
    },
    include: { sender: { select: { nickname: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const unreadCount = letters.filter(l => !l.isOpened).length

  return (
    <div className="min-h-screen bg-[#FFF9FA] pb-20">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Love Letter</h1>
        <Link href="/write">
          <Button size="sm">편지 쓰기</Button>
        </Link>
      </header>

      <main className="p-4 space-y-4">
        <p className="text-lg">
          💕 {user.nickname}님의 우편함
        </p>

        {unreadCount > 0 && (
          <div className="bg-pink-100 p-3 rounded-lg text-center">
            💌 새 편지 {unreadCount}통이 도착했어요!
          </div>
        )}

        <div className="space-y-3">
          {letters.map((letter) => (
            <LetterCard
              key={letter.id}
              id={letter.id}
              senderName={letter.sender.nickname}
              createdAt={letter.createdAt}
              isOpened={letter.isOpened}
            />
          ))}
        </div>

        {letters.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            아직 받은 편지가 없어요
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
git commit -m "feat: Add home page with letter list"
```

---

### Task 13: 편지 쓰기 UI

**Files:**
- Create: `app/(main)/write/page.tsx`
- Create: `components/letter/LetterEditor.tsx`

**Step 1: LetterEditor 컴포넌트**
```typescript
// components/letter/LetterEditor.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

interface LetterEditorProps {
  partnerName: string
}

export function LetterEditor({ partnerName }: LetterEditorProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')

  async function handleSend() {
    if (!content.trim()) return

    setLoading(true)

    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          scheduledAt: isScheduled ? scheduledAt : null,
        }),
      })

      if (!res.ok) throw new Error('Failed to send')

      router.push('/home')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">To. {partnerName} 💕</p>

      <Card className="p-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="편지를 작성해주세요..."
          className="min-h-[300px] border-none resize-none focus:ring-0"
        />
      </Card>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
          />
          <span>예약 전송</span>
        </label>
        {isScheduled && (
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="border rounded px-2 py-1"
          />
        )}
      </div>

      <Button
        onClick={handleSend}
        className="w-full"
        disabled={loading || !content.trim()}
      >
        {loading ? '보내는 중...' : '보내기 💌'}
      </Button>
    </div>
  )
}
```

**Step 2: 페이지**
```typescript
// app/(main)/write/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LetterEditor } from '@/components/letter/LetterEditor'
import Link from 'next/link'

export default async function WritePage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { partner: { select: { nickname: true } } },
  })

  if (!user?.partner) redirect('/connect')

  return (
    <div className="min-h-screen bg-[#FFF9FA]">
      <header className="p-4 flex items-center gap-4">
        <Link href="/home" className="text-xl">←</Link>
        <h1 className="text-lg font-medium">편지 쓰기</h1>
      </header>

      <main className="p-4">
        <LetterEditor partnerName={user.partner.nickname} />
      </main>
    </div>
  )
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
git commit -m "feat: Add letter writing UI"
```

---

### Task 14: 편지 읽기 UI

**Files:**
- Create: `app/(main)/letter/[id]/page.tsx`
- Create: `components/letter/LetterViewer.tsx`

**Step 1: LetterViewer 컴포넌트**
```typescript
// components/letter/LetterViewer.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Letter {
  id: string
  content: string
  createdAt: Date
  sender: { nickname: string }
  receiver: { nickname: string }
}

export function LetterViewer({ letter }: { letter: Letter }) {
  const [isOpen, setIsOpen] = useState(false)

  async function handleOpen() {
    await fetch(`/api/letters/${letter.id}/read`, { method: 'PATCH' })
    setIsOpen(true)
  }

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div
          onClick={handleOpen}
          className="cursor-pointer transform hover:scale-105 transition"
        >
          <div className="text-8xl mb-4">💌</div>
          <p className="text-center">From. {letter.sender.nickname}</p>
          <p className="text-center text-sm text-gray-500">
            {format(new Date(letter.createdAt), 'yyyy.MM.dd', { locale: ko })}
          </p>
          <p className="text-center text-sm text-gray-400 mt-4">
            터치하여 열기
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 min-h-[400px]">
        <div className="mb-4">
          <p className="font-medium">{letter.receiver.nickname}에게 💕</p>
        </div>
        <div className="whitespace-pre-wrap leading-relaxed">
          {letter.content}
        </div>
        <div className="mt-8 text-right text-sm text-gray-500">
          <p>{format(new Date(letter.createdAt), 'yyyy.MM.dd', { locale: ko })}</p>
          <p>{letter.sender.nickname}가 💌</p>
        </div>
      </Card>

      <Link href="/write">
        <Button className="w-full">답장하기</Button>
      </Link>
    </div>
  )
}
```

**Step 2: 페이지**
```typescript
// app/(main)/letter/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { LetterViewer } from '@/components/letter/LetterViewer'
import Link from 'next/link'

export default async function LetterPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const letter = await prisma.letter.findFirst({
    where: {
      id: params.id,
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    include: {
      sender: { select: { nickname: true } },
      receiver: { select: { nickname: true } },
    },
  })

  if (!letter) notFound()

  return (
    <div className="min-h-screen bg-[#FFF9FA]">
      <header className="p-4 flex items-center gap-4">
        <Link href="/home" className="text-xl">←</Link>
      </header>

      <main className="p-4">
        <LetterViewer letter={letter} />
      </main>
    </div>
  )
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
git commit -m "feat: Add letter reading UI"
```

---

## Phase 5: 마무리

### Task 15: 메인 레이아웃 및 네비게이션

**Files:**
- Modify: `app/(main)/layout.tsx`

**Step 1: 레이아웃 추가**
```typescript
// app/(main)/layout.tsx
import { BottomNav } from '@/components/layout/BottomNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
      <BottomNav />
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
git commit -m "feat: Add main layout with bottom navigation"
```

---

### Task 16: 랜딩 페이지

**Files:**
- Modify: `app/page.tsx`

**Step 1: 랜딩 페이지**
```typescript
// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9FA] p-4">
      <div className="text-center space-y-6">
        <div className="text-6xl">💌</div>
        <h1 className="text-3xl font-bold text-pink-500">Love Letter</h1>
        <p className="text-gray-600">매일 주고받는 사랑의 편지</p>

        <div className="space-y-3 pt-6">
          <Link href="/login">
            <Button className="w-full" size="lg">시작하기</Button>
          </Link>
        </div>
      </div>
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
git commit -m "feat: Add landing page"
```

---

## 완료 체크리스트

- [ ] Task 1: Next.js 프로젝트 생성
- [ ] Task 2: shadcn/ui 설정
- [ ] Task 3: Prisma & Supabase 설정
- [ ] Task 4: 회원가입 API
- [ ] Task 5: 로그인 API
- [ ] Task 6: 회원가입 UI
- [ ] Task 7: 로그인 UI
- [ ] Task 8: 커플 연결 API
- [ ] Task 9: 커플 연결 UI
- [ ] Task 10: 편지 작성 API
- [ ] Task 11: 편지 읽기 API
- [ ] Task 12: 홈 화면 (우편함)
- [ ] Task 13: 편지 쓰기 UI
- [ ] Task 14: 편지 읽기 UI
- [ ] Task 15: 메인 레이아웃 및 네비게이션
- [ ] Task 16: 랜딩 페이지

---

*문서 작성일: 2026-01-27*
*버전: 1.0*
