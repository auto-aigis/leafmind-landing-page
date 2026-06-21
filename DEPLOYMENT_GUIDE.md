# LeafMind Landing Page - Deployment Guide

## Overview
This document provides instructions for deploying the LeafMind landing page with the fixed Supabase waitlist integration, Twitter source attribution, and Vercel Analytics.

## What Was Fixed/Added

### 1. Supabase Waitlist Capture ✅
- **File**: `frontend/app/page.tsx` (lines 19-62)
- **Implementation**:
  - Direct Supabase client integration using `@supabase/supabase-js`
  - Inserts records to `waitlist` table with columns: `email`, `first_name`, `source`, `created_at`
  - Graceful duplicate email handling (unique constraint error code 23505)
  - Environment variables required:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Twitter Source Attribution ✅
- **File**: `frontend/app/page.tsx` (lines 19-23)
- **Implementation**:
  - Detects `?source=twitter` OR `?utm_source=twitter` query parameters
  - Tags Supabase record with `source: 'twitter'` (defaults to `'organic'`)
  - **Required**: Update your 3 scripted tweet CTAs to include `?source=twitter`:
    - Tweet 1: `https://leafmind-landing-page.onrender.com?source=twitter`
    - Tweet 2: `https://leafmind-landing-page.onrender.com?source=twitter`
    - Tweet 3: `https://leafmind-landing-page.onrender.com?source=twitter`

### 3. Post-Submission Confirmation UX ✅
- **File**: `frontend/app/page.tsx` (lines 81-111)
- **Implementation**:
  - Shows inline green success message: *"You're on the list! 🌿 We'll reach out when early access opens."*
  - Message auto-dismisses after 5 seconds
  - Form clears on successful submission
  - Error messages shown inline for duplicate emails or API failures
  - **No page reload or redirect** — UX remains on landing page

### 4. Vercel Analytics Instrumentation ✅
- **Files**:
  - `frontend/app/layout.tsx` - imports `<Analytics />` component
  - `frontend/app/page.tsx` (line 5, 52) - imports and calls `track()`
- **Implementation**:
  - `<Analytics />` component added to root layout (auto-collects page views, unique visitors)
  - Custom `waitlist_signup` event fired on successful form submission
  - Event includes: `{ email, source }` properties for attribution analysis
  - Environment variable required:
    - `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` (auto-set by Vercel)

### 5. Authenticated App Routes ✅
- `/login` - Login form with email verification support
- `/register` - Registration form  
- `/verify-email` - Email verification handler
- `/(app)/dashboard` - Main authenticated dashboard
- `/(app)/pricing` - Three-tier Paddle pricing page
- `/(app)/settings` - Account settings and subscription management

## Environment Variables Required

Create a `.env.local` file in `frontend/` with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Backend API
NEXT_PUBLIC_API_URL=https://api.leafmind.app
# OR for local dev: http://localhost:8000

# Paddle (if using paid plans)
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_token
NEXT_PUBLIC_PADDLE_PRICE_ID_PRO=pri_xxx
NEXT_PUBLIC_PADDLE_PRICE_ID_PLUS=pri_yyy

# Vercel Analytics (auto-configured on Vercel, optional locally)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_id_here
```

## Deployment Steps

### Step 1: Push to GitHub
```bash
cd frontend
git add .
git commit -m "fix: supabase waitlist, add twitter attribution, vercel analytics"
git push origin main
```

### Step 2: Deploy on Render
1. Navigate to your Render dashboard: https://dashboard.render.com
2. Select your LeafMind deployment
3. Go to **Settings** → **Environment**
4. Add/update the required environment variables (see above)
5. Click **Deploy** or wait for auto-deployment on push
6. Monitor build logs in the **Logs** tab

### Step 3: Verify Deployment
1. Open https://leafmind-landing-page.onrender.com
2. **Test 1 - Organic source**:
   - Fill the waitlist form with test email
   - Verify record appears in Supabase with `source: 'organic'`
   - Confirm inline success message appears
3. **Test 2 - Twitter source**:
   - Visit `?source=twitter`
   - Fill the waitlist form with test email
   - Verify record appears in Supabase with `source: 'twitter'`
4. **Test 3 - Analytics**:
   - Go to Vercel dashboard → your project → Analytics
   - Verify page view is recorded
   - Confirm `waitlist_signup` custom event appears

### Step 4: Update Tweet CTAs
Update your scripted tweets to include the source param. Example:

**Before**:
> 🌿 Join the LeafMind waitlist: leafmind-landing-page.onrender.com

**After**:
> 🌿 Join the LeafMind waitlist: leafmind-landing-page.onrender.com?source=twitter

## File Structure

```
frontend/
├── app/
│   ├── (app)/                          # Auth-required route group
│   │   ├── dashboard/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── _components/
│   │   ├── AuthProvider.tsx            # Auth context
│   │   └── AppShell.tsx                # Sidebar + nav
│   ├── _lib/
│   │   ├── api.ts                      # API client
│   │   ├── hooks.tsx                   # useAuth hook
│   │   └── types.ts                    # TypeScript interfaces
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── verify-email/page.tsx
│   ├── page.tsx                        # 🌿 Landing page with waitlist
│   ├── layout.tsx                      # Root layout + Analytics
│   └── globals.css
├── components/ui/                      # shadcn components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── label.tsx
├── lib/utils.ts
├── package.json
├── deps.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── tailwind.config.ts
```

## Key Features

### Waitlist Form
- ✅ Supabase integration (direct client)
- ✅ Duplicate email handling (graceful error)
- ✅ Source attribution (?source=twitter, ?utm_source=twitter)
- ✅ Inline success confirmation (no reload)
- ✅ Vercel Analytics tracking

### Authentication System
- ✅ Register → verify email → login flow
- ✅ Session-based auth (HTTP-only cookies)
- ✅ Protected routes via (app) layout group
- ✅ Auto-logout on 401 from API

### Pricing & Subscription
- ✅ Three tiers (Free, Pro $12/mo, Plus $29/mo)
- ✅ Paddle Billing integration
- ✅ Post-checkout transaction verification
- ✅ Polling fallback for subscription activation

### UI/UX
- ✅ Light theme throughout (no dark modes)
- ✅ Responsive design (mobile + desktop)
- ✅ shadcn/ui components (Button, Card, Input, Label)
- ✅ Lucide React icons
- ✅ Tailwind v4

## Smoke Test Checklist

- [ ] Landing page loads without errors
- [ ] Waitlist form submits successfully
- [ ] Supabase record appears with correct columns (email, first_name, source, created_at)
- [ ] Success message displays inline (no reload)
- [ ] ?source=twitter parameter tags record correctly
- [ ] Duplicate email shows error gracefully
- [ ] Vercel Analytics dashboard shows page views
- [ ] Vercel Analytics shows waitlist_signup custom events
- [ ] Login/Register pages work (if testing auth)
- [ ] Mobile responsive (test on iPhone/Android)

## Troubleshooting

### Supabase insert fails
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that `waitlist` table exists with columns: email (unique), first_name, source, created_at
- Verify RLS policies allow anonymous inserts (if using row-level security)

### Analytics not recording
- Confirm `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` is set (auto on Vercel, manual elsewhere)
- Check browser DevTools → Network → look for `https://vitals.vercel-analytics.com` requests
- Custom events require `track()` import from `@vercel/analytics`

### API calls fail with CORS
- Verify `NEXT_PUBLIC_API_URL` matches backend origin
- Check backend CORS config includes frontend URL
- For local dev, use `http://localhost:8000` or run Render build locally

## Support

For issues, check:
1. **Render logs**: https://dashboard.render.com → your service → Logs
2. **Vercel Analytics**: https://vercel.com → your project → Analytics
3. **Supabase dashboard**: https://app.supabase.com → your project → Data → waitlist table
