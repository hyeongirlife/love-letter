# Love Letter MVP 액션 플랜 v2

> Stitch 생성 코드 기반 개발 | 예상 소요: 10일

---

## Phase 0: 디자인 시스템 추출 (Day 1)

### 0-1. Stitch 코드에서 공통 요소 추출
- [ ] `tailwind.config.ts` 작성
  ```ts
  colors: {
    primary: "#ff6b9c",      // 메인 핑크
    "primary-dark": "#e55a8b",
    background: "#FFF9FA",   // 크림 화이트
    "background-dark": "#230f16",
    surface: "#FFFFFF",
    "surface-dark": "#2d1b22",
  }
  fontFamily: {
    display: ["Plus Jakarta Sans", "sans-serif"],
  }
  ```

- [ ] 공통 컴포넌트 패턴 정리
  | Stitch 패턴 | 용도 |
  |------------|------|
  | `rounded-xl`, `rounded-full` | 버튼, 카드 |
  | `shadow-primary/25` | 핑크 그림자 |
  | `backdrop-blur-md` | 글래스모피즘 |
  | Material Symbols | 아이콘 |

- [ ] 커밋: `chore: Extract design system from Stitch`

---

## Phase 1: 프로젝트 세팅 + UI 이식 (Day 2-4)

### Day 2: 프로젝트 초기화

#### 1-1. Next.js + 기본 설정
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
npx shadcn@latest init -d
npx shadcn@latest add button input card textarea label toast
```

#### 1-2. 디자인 시스템 적용
- [ ] `tailwind.config.ts`에 Stitch 색상/폰트 적용
- [ ] `app/globals.css`에 Material Symbols 폰트 추가
- [ ] 커밋: `chore: Setup project with design system`

---

### Day 3: 정적 페이지 이식 (인증 + 연결)

#### 1-3. 랜딩 페이지
- [ ] `app/page.tsx` ← `love_letter_onboarding_splash/code.html`
- [ ] 커밋: `feat: Add landing page`

#### 1-4. 로그인/회원가입
- [ ] `app/(auth)/login/page.tsx` ← `love_letter_login/code.html`
- [ ] `app/(auth)/register/page.tsx` (로그인 변형)
- [ ] `components/auth/AuthForm.tsx` (공통 폼)
- [ ] 커밋: `feat: Add auth pages`

#### 1-5. 커플 연결
- [ ] `app/connect/page.tsx` ← `love_letter_couple_connection/code.html`
- [ ] 커밋: `feat: Add couple connection page`

---

### Day 4: 정적 페이지 이식 (메인 기능)

#### 1-6. 홈 (우편함)
- [ ] `app/(main)/home/page.tsx` ← `love_letter_home_mailbox/code.html`
- [ ] `components/layout/Sidebar.tsx` (사이드바 추출)
- [ ] `components/letter/LetterCard.tsx` (편지 카드 추출)
- [ ] 커밋: `feat: Add home mailbox page`

#### 1-7. 편지 쓰기/읽기
- [ ] `app/(main)/write/page.tsx` ← `love_letter_editor/code.html`
- [ ] `app/(main)/letter/[id]/page.tsx` ← `love_letter_envelope_opening` + `love_letter_viewer`
- [ ] 커밋: `feat: Add letter write/read pages`

#### 1-8. 보관함/기념일/설정 (Phase 2용 스텁)
- [ ] `app/(main)/archive/page.tsx` ← `love_letter_archive/code.html`
- [ ] `app/(main)/anniversary/page.tsx` ← `love_letter_anniversaries/code.html`
- [ ] `app/(main)/settings/page.tsx` ← `love_letter_settings/code.html`
- [ ] 커밋: `feat: Add archive, anniversary, settings pages`

---

## Phase 2: 백엔드 연결 (Day 5-8)

### Day 5: DB 설정

#### 2-1. Supabase + Prisma
- [ ] Supabase 프로젝트 생성
- [ ] `.env.local` 설정
  ```env
  DATABASE_URL=
  DIRECT_URL=
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  ```
- [ ] `prisma/schema.prisma` 작성
- [ ] `npx prisma migrate dev --name init`
- [ ] `lib/prisma.ts`, `lib/supabase.ts` 생성
- [ ] 커밋: `chore: Setup Supabase and Prisma`

---

### Day 6: 인증 API 연결

#### 2-2. 인증 API
- [ ] `app/api/auth/register/route.ts`
- [ ] `app/api/auth/login/route.ts`
- [ ] `lib/auth.ts` (세션 헬퍼)

#### 2-3. 인증 UI 동적 연결
- [ ] `components/auth/AuthForm.tsx` → API 연결
- [ ] 로그인 성공 → `/home` 리다이렉트
- [ ] 커밋: `feat: Connect auth API`

---

### Day 7: 커플 + 편지 API

#### 2-4. 커플 연결 API
- [ ] `app/api/couples/invite-code/route.ts`
- [ ] `app/api/couples/connect/route.ts`
- [ ] UI 동적 연결
- [ ] 커밋: `feat: Connect couple API`

#### 2-5. 편지 API
- [ ] `app/api/letters/route.ts` (GET, POST)
- [ ] `app/api/letters/[id]/route.ts` (GET)
- [ ] `app/api/letters/[id]/read/route.ts` (PATCH)
- [ ] 커밋: `feat: Add letter APIs`

---

### Day 8: 편지 UI 동적 연결

#### 2-6. 홈 페이지 동적화
- [ ] 편지 목록 서버 컴포넌트로 fetch
- [ ] 읽지 않은 편지 카운트

#### 2-7. 편지 쓰기 동적화
- [ ] 폼 제출 → API 호출
- [ ] 전송 성공 → `/home` 리다이렉트

#### 2-8. 편지 읽기 동적화
- [ ] 편지 데이터 fetch
- [ ] 읽음 처리 API 호출
- [ ] 커밋: `feat: Connect letter UI to API`

---

## Phase 3: 테스트 + 배포 (Day 9-10)

### Day 9: 통합 테스트

#### 3-1. E2E 플로우 테스트
- [ ] 회원가입 → 로그인 → 커플 연결 → 편지 작성 → 편지 읽기
- [ ] 버그 수정

#### 3-2. 반응형 확인
- [ ] 모바일 (375px)
- [ ] 태블릿 (768px)
- [ ] 데스크톱 (1024px+)

---

### Day 10: 배포

#### 3-3. Vercel 배포
- [ ] GitHub 연결
- [ ] 환경변수 설정
- [ ] 배포 확인
- [ ] 커밋: `chore: Prepare for production`

---

## 📁 Stitch 코드 → 컴포넌트 매핑

| Stitch 파일 | → | 컴포넌트/페이지 |
|------------|---|----------------|
| `love_letter_onboarding_splash` | → | `app/page.tsx` |
| `love_letter_login` | → | `app/(auth)/login/page.tsx` |
| `love_letter_couple_connection` | → | `app/connect/page.tsx` |
| `love_letter_home_mailbox` | → | `app/(main)/home/page.tsx` |
| `love_letter_envelope_opening` | → | `components/letter/EnvelopeOpening.tsx` |
| `love_letter_viewer` | → | `components/letter/LetterViewer.tsx` |
| `love_letter_editor` | → | `app/(main)/write/page.tsx` |
| `love_letter_archive` | → | `app/(main)/archive/page.tsx` |
| `love_letter_anniversaries` | → | `app/(main)/anniversary/page.tsx` |
| `love_letter_settings` | → | `app/(main)/settings/page.tsx` |

---

## ✅ MVP 완료 기준

- [ ] 회원가입/로그인 동작
- [ ] 초대 코드로 커플 연결
- [ ] 편지 작성 및 전송
- [ ] 편지 목록 확인
- [ ] 편지 열기 및 읽기
- [ ] Vercel 배포 완료

---

*작성일: 2026-01-27*
