# Pre-Deployment Verification Checklist

## File Structure Verification

### Root Config Files
- [x] `frontend/package.json` — includes Supabase, Vercel Analytics, Paddle
- [x] `frontend/tsconfig.json` — baseUrl and @/* alias configured
- [x] `frontend/tailwind.config.ts` — Tailwind v4 configured
- [x] `frontend/postcss.config.mjs` — Postcss configured
- [x] `frontend/next.config.mjs` — Next.js config with rewrites for /api/*

### TypeScript & Types
- [x] `frontend/app/_lib/types.ts` — User, Plant, Subscription, Auth interfaces
- [x] `frontend/app/_lib/api.ts` — apiFetch + authApi, plantsApi, paymentsApi
- [x] `frontend/app/_lib/hooks.tsx` — useAuth hook with AuthContext

### Components
- [x] `frontend/app/_components/AuthProvider.tsx` — Auth context with refresh/logout
- [x] `frontend/app/_components/AppShell.tsx` — Sidebar + mobile nav

### Layouts
- [x] `frontend/app/layout.tsx` — Root layout with Vercel Analytics
- [x] `frontend/app/(auth)/layout.tsx` — Auth page layout
- [x] `frontend/app/(app)/layout.tsx` — Authenticated routes with AuthProvider + AppShell

### Auth Pages
- [x] `frontend/app/(auth)/login/page.tsx` — Login form with email verification handling
- [x] `frontend/app/(auth)/register/page.tsx` — Register form → verify-email redirect
- [x] `frontend/app/(auth)/verify-email/page.tsx` — Token verification + resend

### App Pages (Authenticated)
- [x] `frontend/app/(app)/dashboard/page.tsx` — Main dashboard with plants list
- [x] `frontend/app/(app)/plants/page.tsx` — Plants list
- [x] `frontend/app/(app)/pricing/page.tsx` — Paddle checkout integration
- [x] `frontend/app/(app)/settings/page.tsx` — Account settings

### Landing Page & Waitlist
- [x] `frontend/app/page.tsx` — Landing page with Supabase waitlist form + Vercel Analytics
- [x] `frontend/app/globals.css` — Tailwind imports

### Supabase & Deployment
- [x] `frontend/supabase-migrations/001-waitlist-table.sql` — Waitlist table schema
- [x] `frontend/SUPABASE_SETUP.md` — Supabase configuration guide
- [x] `frontend/DEPLOYMENT_GUIDE.md` — Full deployment instructions
- [x] `frontend/PROJECT_README.md` — Project overview and structure
- [x] `frontend/deps.json` — Extra dependencies (Supabase, Vercel Analytics)

## Import Resolution Verification

### Critical Imports
- [x] `frontend/app/_lib/hooks.tsx` imports `AuthContext` from `@/_components/AuthProvider` ✓
- [x] `frontend/app/_components/AuthProvider.tsx` exports `AuthContext` ✓
- [x] `frontend/app/(app)/layout.tsx` imports `AuthProvider` and `AppShell` ✓
- [x] `frontend/app/(app)/dashboard/page.tsx` imports `useAuth` from `@/_lib/hooks` ✓
- [x] All pages import shadcn/ui components from `@/components/ui/*` ✓

### Supabase Client
- [x] `frontend/app/page.tsx` imports `createClient` from `@supabase/supabase-js` ✓
- [x] Uses `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓

### Vercel Analytics
- [x] `frontend/app/layout.tsx` imports `Analytics` from `@vercel/analytics/react` ✓
- [x] `frontend/app/page.tsx` imports `analytics` from `@vercel/analytics` ✓

### Lucide Icons
- [x] All icon imports from `lucide-react` ✓

## "use client" Verification

- [x] `frontend/app/page.tsx` — "use client" for Supabase + useSearchParams
- [x] `frontend/app/(app)/dashboard/page.tsx` — "use client" for useEffect + hooks
- [x] `frontend/app/(app)/plants/page.tsx` — "use client" for useEffect
- [x] `frontend/app/(app)/pricing/page.tsx` — "use client" for Paddle.js + useSearchParams
- [x] `frontend/app/(app)/settings/page.tsx` — "use client" for useAuth
- [x] `frontend/app/(auth)/login/page.tsx` — "use client" for form handling
- [x] `frontend/app/(auth)/register/page.tsx` — "use client" for form handling
- [x] `frontend/app/(auth)/verify-email/page.tsx` — "use client" + Suspense wrapper
- [x] `frontend/app/_components/AuthProvider.tsx` — "use client" for context
- [x] `frontend/app/_components/AppShell.tsx` — "use client" for hooks + nav
- [x] `frontend/app/_lib/hooks.tsx` — "use client" for useContext

## Route Files (Default Exports)

- [x] `frontend/app/layout.tsx` — default export RootLayout
- [x] `frontend/app/page.tsx` — default export Page
- [x] `frontend/app/(auth)/layout.tsx` — default export AuthLayout
- [x] `frontend/app/(auth)/login/page.tsx` — default export LoginPage
- [x] `frontend/app/(auth)/register/page.tsx` — default export RegisterPage
- [x] `frontend/app/(auth)/verify-email/page.tsx` — default export VerifyEmailPage
- [x] `frontend/app/(app)/layout.tsx` — default export AppLayout
- [x] `frontend/app/(app)/dashboard/page.tsx` — default export DashboardPage
- [x] `frontend/app/(app)/plants/page.tsx` — default export PlantsPage
- [x] `frontend/app/(app)/pricing/page.tsx` — default export PricingPage
- [x] `frontend/app/(app)/settings/page.tsx` — default export SettingsPage

## Component Exports (Named or Default)

- [x] `frontend/app/_components/AuthProvider.tsx` — exports AuthProvider and AuthContext
- [x] `frontend/app/_components/AppShell.tsx` — exports AppShell (named)
- [x] `frontend/app/_lib/hooks.tsx` — exports useAuth (named)
- [x] `frontend/app/_lib/types.ts` — exports interfaces (named)
- [x] `frontend/app/_lib/api.ts` — exports apiFetch, authApi, plantsApi, paymentsApi (named)

## No Unused Imports

- [x] All React imports used
- [x] All lucide-react imports used
- [x] All shadcn/ui imports used
- [x] No unused variables in event handlers

## Tailwind & CSS

- [x] `frontend/app/globals.css` — imports `@import 'tailwindcss';` (Tailwind v4)
- [x] No dark mode classes used (light theme only)
- [x] No `--spacing()` patterns that break Turbopack
- [x] All backgrounds use light colors: `bg-white`, `bg-gray-50`, `bg-gray-100`
- [x] All text uses light-appropriate colors: `text-gray-900`, `text-gray-700`
- [x] No `dark:` variants

## Environment Variables Required

### Supabase (Landing Page Waitlist)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

### Backend API
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Paddle Payments
```
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ID_GROWER=prc_xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ID_BOTANIST=prc_xxxxx
NEXT_PUBLIC_PADDLE_SANDBOX=false
```

## Functionality Checklist

### Landing Page
- [x] Header with Sign In / Sign Up links
- [x] Waitlist email form
- [x] Source parameter tracking (?source=twitter, ?utm_source=...)
- [x] Inline success message: "You're on the list! We'll be in touch soon 🌿"
- [x] Inline duplicate message: "You're already on the list!"
- [x] Vercel Analytics tracking with `analytics.track('waitlist_signup', {source})`
- [x] Feature cards and pricing preview

### Auth Pages
- [x] Login form with email/password
- [x] Email verification error handling (403 email_not_verified)
- [x] Resend verification button
- [x] Register form with name/email/password
- [x] Register redirects to verify-email?email=...
- [x] Verify email page with token parameter handling
- [x] Verify email POST endpoint (not GET)
- [x] Resend verification email functionality

### Authenticated App
- [x] Dashboard with user greeting and tier badge
- [x] Plant list with loading states
- [x] Sidebar nav (desktop) with active link highlighting
- [x] Mobile hamburger menu with backdrop
- [x] Logout button clears session
- [x] Protected routes redirect to /login if unauthenticated

### Pricing Page
- [x] Three tiers displayed (Free, Grower, Botanist)
- [x] Paddle.js loaded dynamically
- [x] Checkout overlay triggered on upgrade
- [x] Transaction ID handling after checkout
- [x] Polling fallback for payment verification
- [x] URL params cleaned after verification

## Build & Lint Checks

- [x] No TypeScript errors (strict mode)
- [x] No ESLint errors (unused vars/imports)
- [x] All files under 150 lines (or properly extracted sub-components)
- [x] No console.error without handling

## Go-No-Go Gate

### To Pass
1. Deploy frontend to Render
2. Create Supabase project with waitlist table (use 001-waitlist-table.sql)
3. Set environment variables
4. Visit: https://leafmind-xxxxx.onrender.com?source=twitter
5. Submit test email
6. Verify in Supabase: `SELECT * FROM waitlist WHERE source = 'twitter';`
7. Confirm row exists with test email and source='twitter'

### Success Criteria
- [ ] Landing page loads
- [ ] Waitlist form submits without error
- [ ] Inline confirmation message displays
- [ ] Supabase has 1+ rows with source='twitter'
- [ ] No errors in browser console
- [ ] Duplicate submission handled gracefully

## Next Steps (Post-Deployment)

1. Configure backend API (FastAPI) on Render
2. Set NEXT_PUBLIC_API_URL to backend URL
3. Create Paddle products and get price IDs
4. Set Paddle environment variables
5. Monitor Vercel Analytics dashboard
6. Track waitlist growth in Supabase
7. Launch Twitter campaign on June 20, 2026
