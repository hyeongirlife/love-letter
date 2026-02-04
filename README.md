# Love Letter 💌

A romantic web application for couples to exchange daily love letters and celebrate their shared memories together.

## Overview

Love Letter is a full-stack Next.js application that allows couples to:
- Send and receive heartfelt love letters
- Create and track special moments and anniversaries
- Connect with their partner through a unique invite code
- Enjoy a beautiful, responsive interface with dark mode support

## Tech Stack

### Frontend
- **Next.js 16.1.5** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **Radix UI** - Accessible components
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma 7.3.0** - ORM
- **PostgreSQL** - Database
- **Supabase** - Authentication & real-time features

## Features

### 📬 Letter System
- Write and send love letters to your partner
- View received and sent letters with timeline grouping
- Search and filter letters by content
- Mark letters as read with timestamp tracking
- Beautiful themes for letters

### 🎉 Moments & Anniversaries
- Create memorable moments with dates, titles, and descriptions
- D-Day calculation (countdown/countup)
- Icon and category selection
- Recurring anniversary support
- Share moments with your partner
- Edit and delete your moments

### 💑 Partner Connection
- Generate unique invitation codes
- Connect with your partner securely
- Two-way relationship linking
- Connection status verification

### 🔐 Authentication
- Email/password registration
- Google OAuth login
- Email confirmation flow
- Protected routes with middleware

### 🎨 UI/UX
- Beautiful gradient backgrounds (rose/pink theme)
- Dark mode support
- Fully responsive design
- Smooth animations and transitions
- Toast notifications
- Loading states and error handling

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (or Supabase account)
- Supabase account for authentication

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd love-letter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL="postgresql://user:password@host:5432/love_letter"
DIRECT_URL="postgresql://user:password@host:5432/love_letter"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

4. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
love-letter/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── (main)/              # Main application pages
│   │   ├── home/            # Letter inbox
│   │   ├── write/           # Write new letter
│   │   ├── archive/         # Letter archive
│   │   ├── anniversary/     # Moments timeline
│   │   ├── letter/[id]/     # Letter detail
│   │   └── settings/        # User settings
│   ├── api/                 # API routes
│   │   ├── letters/         # Letter endpoints
│   │   ├── moments/         # Moment endpoints
│   │   └── couples/         # Partner connection endpoints
│   ├── connect/             # Partner connection page
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── letter/             # Letter components
│   └── ui/                 # Reusable UI components
├── lib/                     # Utility libraries
│   ├── prisma.ts           # Prisma client
│   ├── supabase.ts         # Client-side Supabase
│   └── supabase-server.ts  # Server-side Supabase
├── prisma/                  # Database schema
│   └── schema.prisma       # Prisma schema
├── store/                   # Zustand stores
│   ├── useAuthStore.ts     # Auth state
│   └── types.ts            # TypeScript types
└── middleware.ts            # Route protection
```

## API Endpoints

### Letters
- `GET /api/letters` - Get all letters (sent + received)
- `POST /api/letters` - Create new letter
- `GET /api/letters/[id]` - Get letter by ID
- `PATCH /api/letters/[id]/read` - Mark letter as read

### Moments
- `GET /api/moments` - Get all moments (user + partner shared)
- `POST /api/moments` - Create new moment
- `PUT /api/moments/[id]` - Update moment
- `DELETE /api/moments/[id]` - Delete moment

### Couples
- `GET /api/couples/invite-code` - Get user's invite code
- `POST /api/couples/connect` - Connect with partner
- `GET /api/couples/status` - Get partner connection status

## Database Schema

### User
- Unique invite code for partner connection
- Partner relationship (one-to-one)
- Reminder time settings
- Connection timestamp

### Letter
- Sender and receiver references
- Content and theme
- Opened status and timestamp
- Optional scheduled delivery

### Moment
- Title, date, category, description
- Icon and image URL
- Recurring anniversary flag
- Share with partner flag
- User ownership

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (for migrations)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Database Hosting Options

- **Supabase** - Includes PostgreSQL + Auth (recommended)
- **Railway** - Easy PostgreSQL hosting
- **Neon** - Serverless PostgreSQL
- **Vercel Postgres** - Integrated with Vercel

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

Made with ❤️ for couples who love to share their feelings
