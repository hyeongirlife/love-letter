# Love Letter - Detailed Setup Guide

This guide provides step-by-step instructions for setting up the Love Letter application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **pnpm** or **yarn** - Package manager
- **Git** - [Download](https://git-scm.com/)

## Supabase Setup

### 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 2. Create a New Project

1. Click "New Project"
2. Choose an organization (or create one)
3. Fill in project details:
   - **Project name**: love-letter (or your preferred name)
   - **Database password**: Generate a strong password (save this!)
   - **Region**: Choose the closest to your users
   - **Pricing plan**: Free tier is sufficient for development

4. Click "Create new project"
5. Wait 2-3 minutes for project to be provisioned

### 3. Get API Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** section
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

Keep these values safe - you'll need them for `.env.local`

### 4. Get Database Connection String

1. In **Project Settings**, go to **Database** section
2. Scroll to **Connection string** section
3. Copy the **Connection string** (URI format)
4. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### 5. Configure Authentication

#### Email Authentication (Default)

1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. Under **Email Auth**, configure:
   - **Enable email confirmations**: ON (recommended)
   - **Secure email change**: ON (recommended)
   - **Double confirm email**: OFF (optional)

#### Google OAuth (Optional but Recommended)

1. Go to **Authentication** → **Providers**
2. Find **Google** and click it
3. Toggle **Enable Sign in with Google**

4. **Get Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable **Google+ API**
   - Go to **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
     (Replace `your-project-ref` with your actual Supabase project reference)

5. Copy **Client ID** and **Client Secret**
6. Paste them into Supabase Google provider settings
7. Click **Save**

### 6. Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize confirmation and password reset emails
3. Use variables like `{{ .ConfirmationURL }}` and `{{ .Email }}`

## Database Setup

The database will be automatically set up using Prisma. Supabase provides a PostgreSQL database out of the box.

### Verify Database Connection

1. In Supabase dashboard, go to **Database** → **Tables**
2. You should see the default tables (no custom tables yet)
3. Note the connection string from earlier

## Environment Configuration

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd love-letter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

### 4. Edit .env.local

Open `.env.local` and fill in the values:

```env
# Database Configuration
# Use the connection string from Supabase Database Settings
# Replace [YOUR-PASSWORD] with your actual password
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# Same as DATABASE_URL for Prisma migrations
DIRECT_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# Supabase Configuration
# From Supabase Project Settings → API
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey..."
```

**Important Notes:**
- Replace `[YOUR-PASSWORD]` with your actual database password
- Don't commit `.env.local` to Git (it's already in `.gitignore`)
- `NEXT_PUBLIC_*` variables are exposed to the browser

### 5. Generate Prisma Client

```bash
npx prisma generate
```

This reads `prisma/schema.prisma` and generates the TypeScript client.

### 6. Push Database Schema

```bash
npx prisma db push
```

This creates the necessary tables in your Supabase PostgreSQL database:
- `User` - User accounts with invite codes
- `Letter` - Love letters between partners
- `Moment` - Special moments and anniversaries

### 7. Verify Database Setup

```bash
npx prisma studio
```

This opens Prisma Studio in your browser at `http://localhost:5555`.
You should see three empty tables: User, Letter, and Moment.

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `Can't reach database server at ...`

**Solutions**:
- Verify your database password is correct
- Check that the connection string format is correct
- Ensure your IP is not blocked (Supabase allows all IPs by default)
- Try using the direct connection string instead of pooler

#### 2. Supabase Auth Error

**Error**: `Invalid API key` or `401 Unauthorized`

**Solutions**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon public** key, not service role
- Check for extra spaces or quotes in `.env.local`
- Restart the dev server after changing env vars

#### 3. OAuth Redirect Error

**Error**: `redirect_uri_mismatch`

**Solutions**:
- Verify the redirect URI in Google Cloud Console matches:
  ```
  https://your-project-ref.supabase.co/auth/v1/callback
  ```
- Check that OAuth is enabled in Supabase Authentication settings
- Clear browser cookies and try again

#### 4. Prisma Generation Error

**Error**: `Environment variable not found: DATABASE_URL`

**Solutions**:
- Make sure `.env.local` exists in project root
- Verify `DATABASE_URL` is set correctly
- Try running with explicit env file:
  ```bash
  dotenv -e .env.local -- npx prisma generate
  ```

#### 5. Build Errors

**Error**: TypeScript errors during build

**Solutions**:
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild:
  ```bash
  rm -rf .next
  npm run build
  ```
- Check for missing environment variables

#### 6. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
- Kill the process using port 3000:
  ```bash
  # Mac/Linux
  lsof -ti:3000 | xargs kill

  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```
- Or use a different port:
  ```bash
  PORT=3001 npm run dev
  ```

### Getting Help

If you encounter issues not covered here:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Check the [Supabase documentation](https://supabase.com/docs)
3. Check the [Prisma documentation](https://www.prisma.io/docs)
4. Create an issue in the repository with:
   - Description of the problem
   - Error messages
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

## Next Steps

After setup is complete:

1. **Test Registration**: Create a new account at `/register`
2. **Test Login**: Login with your credentials
3. **Generate Invite Code**: Go to `/connect` and copy your invite code
4. **Test with Partner**: Have your partner register and use your invite code
5. **Send a Letter**: Go to `/write` and send your first love letter!

## Development Tips

### Database Schema Changes

When you modify `prisma/schema.prisma`:

```bash
# Push changes to database
npx prisma db push

# Generate new Prisma Client
npx prisma generate
```

### Reset Database

To reset the database (⚠️ deletes all data):

```bash
npx prisma db push --force-reset
```

### View Database

```bash
npx prisma studio
```

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

---

Happy coding! 💌
