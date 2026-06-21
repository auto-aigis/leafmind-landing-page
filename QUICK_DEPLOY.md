# Push to GitHub & Deploy to Render

## Quick Deploy Instructions

### Step 1: Verify All Files Exist
```bash
# From project root
ls frontend/app/page.tsx              # Landing page with waitlist
ls frontend/app/login/page.tsx        # Login
ls frontend/app/register/page.tsx     # Register
ls frontend/app/verify-email/page.tsx # Verify email
ls frontend/app/(app)/dashboard/page.tsx  # Authenticated dashboard
ls frontend/app/(app)/pricing/page.tsx    # Pricing page
ls frontend/app/_lib/api.ts           # API client
ls frontend/deps.json                 # Extra dependencies
```

### Step 2: Update Git Config (if needed)
```bash
git config user.email "your-email@example.com"
git config user.name "Your Name"
```

### Step 3: Push to GitHub
```bash
cd frontend  # If not already there
git add .
git commit -m "feat: supabase waitlist, twitter attribution, vercel analytics, auth system"
git push origin main
```

### Step 4: Trigger Render Deployment
1. Go to https://dashboard.render.com
2. Select your **leafmind-landing-page** service
3. Click **Manual Deploy** or wait for auto-trigger (if webhook set up)
4. Monitor deployment in **Logs** tab

### Step 5: Set Environment Variables on Render
1. In Render dashboard → your service → **Settings** → **Environment**
2. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_API_URL=https://api.leafmind.app
   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_token
   NEXT_PUBLIC_PADDLE_PRICE_ID_PRO=pri_xxx
   NEXT_PUBLIC_PADDLE_PRICE_ID_PLUS=pri_yyy
   ```
3. Click **Save Changes**
4. Redeploy if needed

### Step 6: Verify Live Deployment
```bash
# Check deployment status
curl https://leafmind-landing-page.onrender.com -I
# Expected: HTTP/1.1 200 OK

# Test waitlist form
# 1. Visit https://leafmind-landing-page.onrender.com
# 2. Submit test email
# 3. Check Supabase for new record
```

### Step 7: Update Tweet CTAs
Replace landing page URLs in your 3 scripted tweets:
```
BEFORE: leafmind-landing-page.onrender.com
AFTER:  leafmind-landing-page.onrender.com?source=twitter
```

### Step 8: Monitor Analytics
1. Go to Vercel dashboard → your project → **Analytics**
2. You should see:
   - Page views increasing
   - `waitlist_signup` custom events appearing
   - Source attribution tracking (`organic` vs `twitter`)

---

## Files Summary

### Core Pages (all under 150 lines each)
- `frontend/app/page.tsx` (135 lines) - Landing + waitlist form
- `frontend/app/login/page.tsx` (139 lines) - Login form
- `frontend/app/register/page.tsx` (117 lines) - Registration form
- `frontend/app/verify-email/page.tsx` (139 lines) - Email verification

### Protected Routes
- `frontend/app/(app)/dashboard/page.tsx` - Dashboard
- `frontend/app/(app)/pricing/page.tsx` - Pricing with Paddle
- `frontend/app/(app)/settings/page.tsx` - Settings + logout

### Components & Libraries
- `frontend/app/_components/AuthProvider.tsx` - Auth context
- `frontend/app/_components/AppShell.tsx` - Sidebar + nav
- `frontend/app/_lib/api.ts` - API client
- `frontend/app/_lib/hooks.tsx` - useAuth hook
- `frontend/app/_lib/types.ts` - Types

### Configuration
- `frontend/package.json` - Dependencies
- `frontend/tsconfig.json` - TypeScript
- `frontend/tailwind.config.ts` - Tailwind v4
- `frontend/next.config.mjs` - Next.js config

---

## What Each Deliverable Does

### 1. Supabase Waitlist ✅
- Submits email to Supabase `waitlist` table
- Columns: email (unique), first_name, source, created_at
- Error handling for duplicates
- No backend required

### 2. Twitter Attribution ✅
- Detects `?source=twitter` URL parameter
- Tags Supabase record with `source: 'twitter'`
- Defaults to `'organic'` if no param
- Enables campaign measurement

### 3. Confirmation UX ✅
- Shows inline success message
- No page reload or redirect
- Auto-dismisses after 5 seconds
- Error messages also shown inline

### 4. Vercel Analytics ✅
- Tracks page views (automatic)
- Tracks unique visitors (automatic)
- Fires custom `waitlist_signup` event with email + source
- Dashboard at vercel.com → your project → Analytics

### 5. Authentication System ✅
- Register → verify email → login flow
- Protected routes with session auth
- Subscription tier display
- Logout functionality

---

## Build & Test Locally (Optional)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local with your secrets
echo "NEXT_PUBLIC_SUPABASE_URL=..." > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=..." >> .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" >> .env.local

# Build
npm run build

# Run locally
npm run dev
# Visit http://localhost:3000

# Test waitlist form
# 1. Visit http://localhost:3000
# 2. Fill and submit form
# 3. Check Supabase for record
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails on deploy | Check Render logs, verify all env vars set |
| Waitlist not saving | Verify Supabase URL/key, check table exists |
| Analytics not showing | Verify `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` set |
| API calls fail | Check `NEXT_PUBLIC_API_URL` matches backend |
| Auth not working | Verify backend is running at API_URL |

---

## Support Links

- **Render Logs**: https://dashboard.render.com → your service → Logs
- **Supabase Dashboard**: https://app.supabase.com → your project → Data
- **Vercel Analytics**: https://vercel.com → your project → Analytics
- **GitHub**: https://github.com/auto-aigis/leafmind-landing-page

---

**Ready to deploy!** 🚀
