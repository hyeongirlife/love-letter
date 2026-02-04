# Love Letter - Deployment Guide

Complete guide for deploying Love Letter to Vercel.

## Prerequisites

Before deploying:
- ✅ GitHub repository created and pushed
- ✅ Supabase project set up
- ✅ Database schema deployed (Prisma)
- ✅ Environment variables ready

## Deployment Steps

### Step 1: Prepare Environment Variables

Have these ready from your `.env.local`:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx..."
```

### Step 2: Deploy to Vercel (Web Dashboard)

#### 2.1 Sign Up / Login
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. **Login with GitHub** (recommended)
4. Authorize Vercel to access your repositories

#### 2.2 Import Project
1. Click **"Add New..." → "Project"**
2. Find `love-letter` repository
3. Click **"Import"**

#### 2.3 Configure Project
**Framework Preset**: Next.js (auto-detected)

**Build Settings** (keep defaults):
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

#### 2.4 Add Environment Variables
Click **"Environment Variables"** and add all four:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | ✓ Production ✓ Preview ✓ Development |
| `DIRECT_URL` | Same as DATABASE_URL | ✓ Production ✓ Preview ✓ Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✓ Production ✓ Preview ✓ Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | ✓ Production ✓ Preview ✓ Development |

#### 2.5 Deploy
1. Click **"Deploy"**
2. Wait 2-5 minutes for build to complete
3. Your site will be live at: `https://love-letter-xxxxx.vercel.app`

### Step 3: Update Supabase Settings

After deployment, update Supabase with your new URLs:

#### 3.1 Update Site URL
1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL**:
   ```
   https://love-letter-xxxxx.vercel.app
   ```

#### 3.2 Add Redirect URLs
Add to **Redirect URLs** (comma-separated):
```
http://localhost:3000/auth/callback,
https://love-letter-xxxxx.vercel.app/auth/callback
```

#### 3.3 Update Google OAuth (if using)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add to **Authorized redirect URIs**:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

### Step 4: Test Your Deployment

1. Visit your deployed site
2. Test registration:
   - Email/password signup
   - Email confirmation (check inbox)
   - Google OAuth login
3. Test core features:
   - Generate invite code
   - Connect with partner (use different browser/incognito)
   - Send a letter
   - Create a moment

### Step 5: Custom Domain (Optional)

#### Add Custom Domain
1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `loveletter.yourdomain.com`)
4. Follow Vercel's DNS instructions

#### Update Supabase URLs
After adding custom domain:
1. Update **Site URL** in Supabase to your custom domain
2. Add custom domain to **Redirect URLs**
3. Update Google OAuth URIs if applicable

## Alternative: Deploy with Vercel CLI

### Install Vercel CLI
```bash
npm i -g vercel
```

### Login
```bash
vercel login
```

### Deploy
```bash
# First deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - What's your project's name? love-letter
# - In which directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

### Add Environment Variables via CLI
```bash
vercel env add DATABASE_URL
# Paste value when prompted
# Select: Production, Preview, Development

vercel env add DIRECT_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Redeploy with New Env Vars
```bash
vercel --prod
```

## Database Hosting Options

### Option 1: Supabase (Recommended ⭐)
- Includes PostgreSQL + Authentication
- Free tier: 500MB database, 50,000 monthly active users
- Connection pooling included
- Automatic backups

**Setup:**
1. Already set up from development
2. Use connection string in Vercel env vars
3. Done!

### Option 2: Railway
- Easy PostgreSQL hosting
- $5/month for 8GB storage
- Simple setup

**Setup:**
1. Go to [railway.app](https://railway.app)
2. Create new project → PostgreSQL
3. Copy connection string
4. Add to Vercel env vars

### Option 3: Neon
- Serverless PostgreSQL
- Free tier: 10GB storage
- Good for auto-scaling

**Setup:**
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to Vercel env vars

### Option 4: Vercel Postgres
- Integrated with Vercel
- Serverless PostgreSQL
- Pay per use

**Setup:**
1. In Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Connection string automatically added to env vars

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

### Production Deployments
```bash
git push origin main
```
→ Deploys to production URL

### Preview Deployments
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```
→ Creates preview URL for testing

## Monitoring & Logs

### View Logs
1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Click on a deployment
4. View:
   - Build logs
   - Runtime logs
   - Function logs

### Analytics
1. Go to **"Analytics"** tab
2. View:
   - Page views
   - Top pages
   - Visitors

### Performance
1. Go to **"Speed Insights"** (optional add-on)
2. See Core Web Vitals

## Troubleshooting

### Build Failed
**Error**: `Module not found` or dependency errors

**Solution**:
```bash
# Locally test build
npm run build

# If successful, delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Update package lock"
git push
```

### Environment Variables Not Working
**Error**: `process.env.XXX is undefined`

**Solution**:
1. Check env var names match exactly (case-sensitive)
2. Ensure `NEXT_PUBLIC_*` prefix for client-side vars
3. Redeploy after adding env vars
4. Clear browser cache

### Database Connection Error
**Error**: `Can't reach database server`

**Solution**:
1. Check `DATABASE_URL` in Vercel is correct
2. Verify Supabase allows connections (it should by default)
3. Try using `DIRECT_URL` for connection pooling issues
4. Check Prisma schema is deployed: `npx prisma db push`

### OAuth Redirect Error
**Error**: `redirect_uri_mismatch`

**Solution**:
1. Check Supabase **Redirect URLs** includes your Vercel URL
2. Verify Google OAuth authorized URIs
3. Clear browser cookies and try again

### 404 on Page Refresh
**Error**: Routes work on navigation but 404 on refresh

**Solution**:
- This shouldn't happen with Next.js on Vercel
- Check Vercel **Project Settings** → **Domains** is set up correctly
- Verify `vercel.json` isn't overriding routes

## Environment-Specific Configuration

### Development
```bash
npm run dev
# Uses .env.local
```

### Preview (Staging)
- Automatic on PR/branch push
- Uses Preview environment variables
- URL: `https://love-letter-git-branch-name-user.vercel.app`

### Production
- Deployed from `main` branch
- Uses Production environment variables
- URL: `https://love-letter.vercel.app` or custom domain

## Security Checklist

Before going live:
- [ ] All environment variables set in Vercel
- [ ] No secrets in code or committed files
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] CORS configured in Supabase
- [ ] Rate limiting considered (Vercel Edge Config)
- [ ] Email confirmation enabled in Supabase
- [ ] Strong password requirements enforced

## Performance Optimization

### Enable Caching
Add `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Optimize Images
- Next.js Image component handles optimization automatically
- Vercel serves optimized images via Edge Network

### Database Query Optimization
- Use Prisma's `select` to limit fields
- Add indexes in Prisma schema for frequently queried fields
- Use connection pooling (already configured)

## Costs

### Free Tier (Hobby)
- 100GB bandwidth/month
- Unlimited deployments
- Unlimited preview deployments
- Edge Network
- **Perfect for personal projects**

### Pro Tier ($20/month)
- 1TB bandwidth
- More team members
- Better analytics
- Priority support

### Database Costs
- **Supabase Free**: Up to 500MB (enough for thousands of letters)
- **Supabase Pro**: $25/month for 8GB
- **Railway**: $5/month for 8GB
- **Neon**: Free tier 10GB

## Next Steps After Deployment

1. **Test everything**:
   - User registration
   - Partner connection
   - Letter creation
   - Moments/anniversaries

2. **Monitor**:
   - Check Vercel analytics
   - Review error logs
   - Monitor Supabase usage

3. **Share**:
   - Share the URL with your partner
   - Add to your portfolio
   - Share on social media

4. **Iterate**:
   - Collect feedback
   - Fix bugs
   - Add features
   - Push to GitHub → auto-deploy!

---

🎉 Your Love Letter app is now live!

Need help? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)
