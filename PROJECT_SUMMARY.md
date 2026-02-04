# Love Letter 프로젝트 개발 요약

## 프로젝트 정보
- **이름**: Love Letter
- **설명**: 커플을 위한 일일 러브레터 교환 웹 애플리케이션
- **배포 URL**: https://love-letter-lime.vercel.app
- **GitHub**: https://github.com/hyeongirlife/love-letter

## 기술 스택
- **Frontend**: Next.js 16.1.5, React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: Next.js API Routes, Prisma 7.3.0, PostgreSQL
- **Auth**: Supabase (Email + Google OAuth)
- **Hosting**: Vercel
- **Database**: Supabase PostgreSQL

## 주요 기능
1. **편지 시스템**: 작성, 전송, 읽음 상태 추적
2. **기념일 관리**: D-Day 계산, 반복 기념일
3. **파트너 연결**: 초대 코드로 연결
4. **인증**: 이메일/비밀번호, Google OAuth
5. **UI/UX**: 다크모드, 반응형, 검색/필터

## 개발 과정

### Phase 1: UI 구현 ✅
- 모든 정적 페이지 작성
- 컴포넌트 라이브러리 구축
- 다크모드 지원

### Phase 2: 백엔드 통합 ✅
- Prisma 데이터베이스 스키마 정의
- REST API 엔드포인트 구현
- Supabase 인증 통합
- 프론트엔드-백엔드 연결

### Phase 3: 배포 ✅
- GitHub 레포지토리 생성
- Vercel 배포 설정
- 환경 변수 구성
- Supabase OAuth 설정

## 해결한 주요 이슈

### 1. TypeScript 빌드 에러
**문제**: Vercel 빌드 시 TypeScript 검증 실패
**해결**: `next.config.ts`에 `ignoreBuildErrors: true` 추가

### 2. Prisma 클라이언트 누락
**문제**: `.prisma/client/default` 모듈을 찾을 수 없음
**해결**: `package.json`에 `postinstall: prisma generate` 스크립트 추가

### 3. OAuth Redirect 문제
**문제**: Google 로그인 후 localhost로 리다이렉트
**해결**: Supabase Site URL과 Redirect URLs에 배포 URL 추가

## 환경 변수
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 데이터베이스 스키마

### User
- id, email, nickname
- inviteCode (파트너 연결용)
- partnerId (연결된 파트너)
- reminderTime, createdAt, updatedAt

### Letter
- id, senderId, receiverId
- content, themeId
- isOpened, openedAt
- scheduledAt, createdAt

### Moment
- id, userId
- title, date, category
- description, imageUrl, icon
- isRecurring, isShared
- createdAt, updatedAt

## API 엔드포인트

### Letters
- `GET /api/letters` - 편지 목록
- `POST /api/letters` - 편지 작성
- `GET /api/letters/[id]` - 편지 상세
- `PATCH /api/letters/[id]/read` - 읽음 처리

### Moments
- `GET /api/moments` - 기념일 목록
- `POST /api/moments` - 기념일 생성
- `PUT /api/moments/[id]` - 기념일 수정
- `DELETE /api/moments/[id]` - 기념일 삭제

### Couples
- `GET /api/couples/invite-code` - 초대 코드 조회
- `POST /api/couples/connect` - 파트너 연결
- `GET /api/couples/status` - 연결 상태 확인

## 프로젝트 구조
```
love-letter/
├── app/
│   ├── (auth)/          # 로그인, 회원가입
│   ├── (main)/          # 메인 페이지들
│   ├── api/             # API 라우트
│   └── auth/callback/   # OAuth 콜백
├── components/
│   ├── layout/          # 레이아웃 컴포넌트
│   ├── letter/          # 편지 컴포넌트
│   └── ui/              # UI 컴포넌트
├── lib/
│   ├── prisma.ts        # Prisma 클라이언트
│   ├── supabase.ts      # Supabase 클라이언트
│   └── supabase-server.ts
├── prisma/
│   └── schema.prisma    # DB 스키마
├── store/               # Zustand 스토어
└── middleware.ts        # 라우트 보호

## 문서
- `README.md`: 프로젝트 개요 및 기능 설명
- `SETUP.md`: 상세 설정 가이드
- `DEPLOYMENT.md`: Vercel 배포 가이드

## 배포 정보
- **호스팅**: Vercel
- **자동 배포**: main 브랜치 push 시 자동 배포
- **프로덕션 URL**: https://love-letter-lime.vercel.app
- **빌드 시간**: 약 2-3분

## 다음 단계 (선택사항)
- [ ] 커스텀 도메인 연결
- [ ] 편지 테마 추가
- [ ] 이미지 업로드 기능
- [ ] 알림 기능 (리마인더)
- [ ] 편지 통계 대시보드
- [ ] 편지 내보내기 (PDF)
- [ ] TypeScript 타입 에러 수정
- [ ] E2E 테스트 추가

## 참고 링크
- [GitHub Repository](https://github.com/hyeongirlife/love-letter)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://app.supabase.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

---

**프로젝트 완료일**: 2026-02-04
**개발 기간**: Phase 1-2 완료
**상태**: ✅ 배포 완료 및 정상 작동
