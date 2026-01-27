# Love Letter 💌

연인끼리 매일 편지를 주고받는 서비스

## Overview

Love Letter는 연인 간의 소통을 더 깊고 의미있게 만드는 디지털 편지 교환 플랫폼입니다.

### 핵심 기능

- **편지 작성**: 텍스트, 사진, 음성, 동영상 첨부 가능
- **즉시/예약 전송**: 바로 보내거나 특정 시간에 공개
- **커플 연결**: 초대 코드로 연인과 연결
- **편지 보관함**: 주고받은 모든 편지 아카이브
- **기념일 알림**: 중요한 날 알림
- **매일 리마인더**: 편지 쓰기 알림

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase 계정

### Installation

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 편집

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

### Environment Variables

```env
DATABASE_URL="your-supabase-connection-string"
DIRECT_URL="your-supabase-direct-string"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Documentation

- [기획 문서](./docs/PLANNING.md) - 프로젝트 목표, 기능 정의
- [디자인 문서](./docs/DESIGN.md) - UI/UX 설계, 와이어프레임
- [아키텍처 문서](./docs/ARCHITECTURE.md) - 시스템 구조, 데이터 모델
- [구현 계획](./docs/plans/) - 단계별 구현 태스크

## Project Structure

```
love-letter/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 페이지
│   ├── (main)/            # 메인 앱 페이지
│   └── api/               # API Routes
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── letter/           # 편지 관련
│   ├── couple/           # 커플 관련
│   └── layout/           # 레이아웃
├── lib/                   # 유틸리티
├── prisma/               # Prisma 스키마
└── docs/                 # 문서
```

## License

MIT

---

Made with 💕
