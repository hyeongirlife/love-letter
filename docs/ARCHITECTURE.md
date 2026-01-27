# Love Letter - 아키텍처 문서

> 시스템 구조 및 기술 설계

## 1. 기술 스택

### 1.1 프론트엔드
| 기술 | 선택 이유 |
|------|----------|
| **Next.js 15** | App Router, Server Components, 빠른 페이지 로드 |
| **React 19** | UI 컴포넌트, hooks |
| **TypeScript** | 타입 안정성 |
| **Tailwind CSS** | 빠른 스타일링 |
| **shadcn/ui** | 접근성 좋은 컴포넌트 |
| **Zustand** | 가벼운 상태 관리 |
| **React Hook Form** | 폼 관리 |
| **Zod** | 스키마 검증 |

### 1.2 백엔드
| 기술 | 선택 이유 |
|------|----------|
| **Next.js API Routes** | 서버리스 API |
| **Prisma** | Type-safe ORM |
| **Supabase** | Postgres + Auth + Storage + Realtime |

### 1.3 인프라
| 기술 | 용도 |
|------|------|
| **Vercel** | 호스팅, Edge Functions, Cron Jobs |
| **Supabase** | 데이터베이스, 파일 스토리지 |
| **Resend** | 이메일 발송 |

---

## 2. 시스템 아키텍처

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                        클라이언트                            │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │  Components │  │   Stores (Zustand)  │  │
│  │  (App Dir)  │  │  (shadcn)   │  │                     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │            │
│         └────────────────┼─────────────────────┘            │
│                          │                                  │
│                    React Query                              │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Vercel    │
                    │  (Edge)     │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
   ┌─────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐
   │  API      │    │   Cron      │   │   Edge      │
   │  Routes   │    │   Jobs      │   │   Functions │
   └─────┬─────┘    └──────┬──────┘   └──────┬──────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Prisma    │
                    │   Client    │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
   ┌─────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐
   │ Supabase  │    │  Supabase   │   │  Supabase   │
   │ Postgres  │    │  Storage    │   │  Realtime   │
   └───────────┘    └─────────────┘   └─────────────┘
```

### 2.2 디렉토리 구조

```
love-letter/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 페이지
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (main)/                   # 메인 앱 페이지
│   │   ├── home/
│   │   ├── write/
│   │   ├── letter/[id]/
│   │   ├── archive/
│   │   ├── anniversary/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── connect/                  # 커플 연결
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── letters/
│   │   ├── couples/
│   │   ├── anniversaries/
│   │   ├── upload/
│   │   └── cron/
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   ├── letter/                   # 편지 관련
│   │   ├── LetterCard.tsx
│   │   ├── LetterEditor.tsx
│   │   ├── LetterViewer.tsx
│   │   └── EnvelopeAnimation.tsx
│   ├── couple/                   # 커플 관련
│   │   └── CoupleConnector.tsx
│   ├── anniversary/              # 기념일 관련
│   │   └── AnniversaryCard.tsx
│   └── layout/                   # 레이아웃
│       ├── Header.tsx
│       ├── BottomNav.tsx
│       └── Sidebar.tsx
├── lib/                          # 유틸리티
│   ├── prisma.ts                 # Prisma 클라이언트
│   ├── supabase.ts               # Supabase 클라이언트
│   ├── auth.ts                   # 인증 헬퍼
│   └── utils.ts                  # 공통 유틸
├── store/                        # Zustand 스토어
│   ├── userStore.ts
│   └── letterStore.ts
├── types/                        # TypeScript 타입
│   └── index.ts
├── prisma/                       # Prisma 스키마
│   └── schema.prisma
├── public/                       # 정적 파일
│   ├── themes/                   # 편지지 테마
│   └── icons/
├── docs/                         # 문서
│   ├── PLANNING.md
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   └── plans/
└── package.json
```

---

## 3. 데이터 모델

### 3.1 ERD

```
┌──────────────────┐       ┌──────────────────┐
│      User        │       │     Letter       │
├──────────────────┤       ├──────────────────┤
│ id          PK   │◄──────│ senderId    FK   │
│ email            │       │ receiverId  FK   │───►│
│ nickname         │       │ id          PK   │    │
│ phone            │       │ content          │    │
│ inviteCode       │       │ mediaUrls[]      │    │
│ partnerId   FK   │◄──┐   │ themeId          │    │
│ reminderTime     │   │   │ scheduledAt      │    │
│ createdAt        │   │   │ isOpened         │    │
│ updatedAt        │   │   │ openedAt         │    │
└──────────────────┘   │   │ createdAt        │    │
         │             │   └──────────────────┘    │
         │             │                           │
         │             └───────────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐       ┌──────────────────┐
│   Anniversary    │       │      Theme       │
├──────────────────┤       ├──────────────────┤
│ id          PK   │       │ id          PK   │
│ userId      FK   │       │ name             │
│ title            │       │ bgImage          │
│ date             │       │ fontFamily       │
│ isRecurring      │       │ textColor        │
│ createdAt        │       │ isDefault        │
└──────────────────┘       └──────────────────┘
```

### 3.2 Prisma Schema

```prisma
// prisma/schema.prisma

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
  password      String?  // null if social login
  nickname      String
  phone         String?
  inviteCode    String   @unique @default(cuid())

  // Partner relation (1:1)
  partnerId     String?  @unique
  partner       User?    @relation("Couple", fields: [partnerId], references: [id])
  partnerOf     User?    @relation("Couple")

  // Letters
  sentLetters     Letter[] @relation("Sender")
  receivedLetters Letter[] @relation("Receiver")

  // Anniversaries
  anniversaries   Anniversary[]

  // Settings
  reminderTime  String   @default("21:00")
  pushEnabled   Boolean  @default(true)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([email])
  @@index([inviteCode])
  @@index([partnerId])
}

model Letter {
  id          String   @id @default(cuid())

  // Relations
  senderId    String
  receiverId  String
  sender      User     @relation("Sender", fields: [senderId], references: [id], onDelete: Cascade)
  receiver    User     @relation("Receiver", fields: [receiverId], references: [id], onDelete: Cascade)

  // Content
  content     String   @db.Text
  mediaUrls   String[] @default([])
  themeId     String   @default("default")

  // Delivery
  scheduledAt DateTime?  // null = 즉시 전송
  deliveredAt DateTime?

  // Read status
  isOpened    Boolean  @default(false)
  openedAt    DateTime?

  createdAt   DateTime @default(now())

  @@index([senderId])
  @@index([receiverId])
  @@index([scheduledAt])
  @@index([createdAt])
}

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

model Theme {
  id          String  @id @default(cuid())
  name        String
  bgImage     String?
  fontFamily  String  @default("default")
  textColor   String  @default("#000000")
  isDefault   Boolean @default(false)
}
```

---

## 4. API 설계

### 4.1 인증 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 현재 사용자 정보 |
| PATCH | `/api/auth/profile` | 프로필 수정 |

### 4.2 커플 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/couples/invite-code` | 내 초대 코드 조회 |
| POST | `/api/couples/connect` | 초대 코드로 연결 |
| POST | `/api/couples/invite` | 이메일로 초대 |
| GET | `/api/couples/search` | 사용자 검색 |
| DELETE | `/api/couples/disconnect` | 연결 해제 |

### 4.3 편지 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/letters` | 편지 목록 조회 |
| GET | `/api/letters/:id` | 편지 상세 조회 |
| POST | `/api/letters` | 편지 작성 |
| PATCH | `/api/letters/:id/read` | 편지 읽음 처리 |
| DELETE | `/api/letters/:id` | 편지 삭제 |

### 4.4 업로드 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/upload/image` | 이미지 업로드 |
| POST | `/api/upload/audio` | 음성 업로드 |
| POST | `/api/upload/video` | 동영상 업로드 |

### 4.5 기념일 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/anniversaries` | 기념일 목록 |
| POST | `/api/anniversaries` | 기념일 등록 |
| PATCH | `/api/anniversaries/:id` | 기념일 수정 |
| DELETE | `/api/anniversaries/:id` | 기념일 삭제 |

### 4.6 Cron Jobs

| Schedule | Endpoint | 설명 |
|----------|----------|------|
| 매 분 | `/api/cron/deliver-scheduled` | 예약 편지 전달 |
| 매일 | `/api/cron/send-reminders` | 일일 리마인더 발송 |
| 매일 | `/api/cron/anniversary-alerts` | 기념일 알림 발송 |

---

## 5. 인증 흐름

### 5.1 이메일 인증

```
1. 회원가입
   Client → POST /api/auth/register
         → Supabase Auth 계정 생성
         → User 테이블에 프로필 저장
         → JWT 토큰 반환

2. 로그인
   Client → POST /api/auth/login
         → Supabase Auth 인증
         → JWT 토큰 반환 (httpOnly cookie)

3. 세션 확인
   Client → GET /api/auth/me
         → 쿠키의 JWT 검증
         → 사용자 정보 반환
```

### 5.2 소셜 로그인 (OAuth)

```
1. OAuth 시작
   Client → Supabase OAuth URL로 리다이렉트
         → Google/Kakao/Naver 인증

2. 콜백
   Provider → /api/auth/callback
            → Supabase가 세션 생성
            → User 테이블 동기화
            → 홈으로 리다이렉트
```

---

## 6. 실시간 기능

### 6.1 Supabase Realtime

```typescript
// 새 편지 실시간 구독
const subscription = supabase
  .channel('letters')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'Letter',
      filter: `receiverId=eq.${userId}`
    },
    (payload) => {
      // 새 편지 알림 표시
      showNotification(payload.new)
    }
  )
  .subscribe()
```

### 6.2 푸시 알림

```
1. 서비스 워커 등록
2. Push 구독 생성 (Web Push API)
3. 구독 정보 서버에 저장
4. Cron Job이 적절한 시점에 푸시 발송
```

---

## 7. 파일 업로드

### 7.1 Supabase Storage 구조

```
storage/
├── avatars/              # 프로필 이미지
│   └── {userId}/
├── letters/              # 편지 첨부파일
│   └── {letterId}/
│       ├── images/
│       ├── audio/
│       └── video/
└── themes/               # 커스텀 테마 (미래)
```

### 7.2 업로드 플로우

```
1. Client → Signed URL 요청
2. Server → Supabase에서 signed URL 발급
3. Client → 직접 Supabase Storage에 업로드
4. Client → 편지 저장 시 URL 포함
```

### 7.3 파일 제한

| 타입 | 최대 크기 | 허용 형식 |
|------|---------|----------|
| 이미지 | 5MB | jpg, png, gif, webp |
| 음성 | 10MB | mp3, m4a, wav |
| 동영상 | 50MB | mp4, mov |

---

## 8. 보안

### 8.1 인증/인가

- JWT 토큰 (httpOnly 쿠키)
- CSRF 토큰
- Rate Limiting (API별)

### 8.2 데이터 보안

- 모든 통신 HTTPS
- 비밀번호 bcrypt 해싱
- SQL Injection 방지 (Prisma ORM)
- XSS 방지 (React 자동 이스케이프)

### 8.3 Row Level Security (RLS)

```sql
-- 자신의 데이터만 접근 가능
CREATE POLICY "Users can read own data"
  ON "User"
  FOR SELECT
  USING (auth.uid() = id);

-- 파트너의 편지만 읽기 가능
CREATE POLICY "Can read partner letters"
  ON "Letter"
  FOR SELECT
  USING (
    auth.uid() = "senderId"
    OR auth.uid() = "receiverId"
  );
```

---

## 9. 환경 변수

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=
DIRECT_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Email
RESEND_API_KEY=

# Push Notifications
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

---

## 10. 배포

### 10.1 Vercel 설정

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/deliver-scheduled",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/anniversary-alerts",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### 10.2 배포 파이프라인

```
1. main 브랜치 push
2. Vercel 자동 빌드
3. Prisma migrate deploy
4. Edge Functions 배포
5. 프로덕션 배포 완료
```

---

*문서 작성일: 2026-01-27*
*버전: 1.0*
