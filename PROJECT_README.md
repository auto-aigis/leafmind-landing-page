# LeafMind - AI-Powered Plant Care SaaS

A fullstack Next.js + FastAPI SaaS application with waitlist capture, user authentication, subscription management via Paddle, and AI-powered plant care insights.

## Project Structure

```
frontend/
├── app/
│   ├── (app)/                          # Authenticated app routes
│   │   ├── layout.tsx                  # Auth guard + shell
│   │   ├── dashboard/page.tsx          # Main dashboard
│   │   ├── plants/page.tsx             # Plant list
│   │   ├── pricing/page.tsx            # Subscription pricing
│   │   └── settings/page.tsx           # Account settings
│   ├── (auth)/                         # Public auth routes
│   │   ├── layout.tsx                  # Auth page layout
│   │   ├── login/page.tsx              # Login form
│   │   ├── register/page.tsx           # Registration form
│   │   └── verify-email/page.tsx       # Email verification
│   ├── _components/
│   │   ├── AuthProvider.tsx            # Auth context + session
│   │   └── AppShell.tsx                # Sidebar + navbar
│   ├── _lib/
│   │   ├── types.ts                    # TypeScript interfaces
│   │   ├── api.ts                      # API client (FastAPI + Supabase)
│   │   └── hooks.tsx                   # Custom hooks (useAuth)
│   ├── page.tsx                        # Landing page with waitlist form
│   ├── layout.tsx                      # Root layout with Analytics
│   └── globals.css                     # Tailwind + global styles
├── supabase-migrations/
│   └── 001-waitlist-table.sql          # Waitlist table schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── SUPABASE_SETUP.md                   # Supabase configuration guide
└── DEPLOYMENT_GUIDE.md                 # Full deployment instructions

backend/
├── main.py                             # FastAPI app
├── models.py                           # SQLAlchemy models
├── routers/
│   ├── auth.py                         # Auth endpoints
│   ├── core.py                         # Plant management
│   └── payments.py                     # Paddle webhooks
└── requirements.txt
```

## Quick Start

### Local Development

1. **Clone the repo**:
   ```bash
   git clone <repo-url>
   cd leafmind
   ```

2. **Frontend setup**:
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local  # Configure with your values
   npm run dev
   ```
   Open http://localhost:3000

3. **Backend setup** (see backend/README.md or backend/.env.example)

4. **Supabase setup** (see frontend/SUPABASE_SETUP.md)

### Deploy to Production

See `frontend/DEPLOYMENT_GUIDE.md` for Render deployment steps.

## Key Features

### 1. Waitlist Form → Supabase Integration
- Landing page email capture
- Automatic source tracking (?source=twitter, ?utm_source=...)
- Duplicate email handling with friendly UX
- Inline confirmation messages

### 2. User Authentication
- Register/Login with email verification
- Session-based auth (FastAPI backend)
- Protected app routes with automatic redirect
- Logout with session clearing

### 3. Subscription Management (Paddle)
- Three-tier pricing: Free / Grower ($12/mo) / Botanist ($29/mo)
- Paddle checkout overlay
- Transaction verification
- Tier-based feature limits

### 4. Analytics
- Vercel Analytics for page views & unique visitors
- Custom `waitlist_signup` event tracking
- Campaign source attribution

### 5. Plant Tracking
- Create/edit/delete plants
- Tier-limited: Free=0, Grower=10, Botanist=unlimited
- AI insights for Botanist tier

## Environment Variables

See `frontend/DEPLOYMENT_GUIDE.md` for complete setup.

**Critical for waitlist**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**For backend API**:
- `NEXT_PUBLIC_API_URL`

**For payments**:
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `NEXT_PUBLIC_PADDLE_PRICE_ID_GROWER`
- `NEXT_PUBLIC_PADDLE_PRICE_ID_BOTANIST`

## Testing

### Smoke Test (Waitlist Verification)

1. Deploy frontend to Render
2. Visit: `https://leafmind-xxxxx.onrender.com?source=twitter`
3. Submit test email via form
4. Verify in Supabase: `SELECT * FROM waitlist WHERE source = 'twitter';`
5. Expect: Row with test email and source='twitter'

### Full Flow Test

1. Sign up → email verification
2. Log in → dashboard
3. Upgrade plan → Paddle checkout
4. Create plant → plant list
5. Access insights (Botanist only)

## Tech Stack

**Frontend**: Next.js 16 (App Router, TypeScript), React 19, Tailwind v4, shadcn/ui, Vercel Analytics
**Backend**: FastAPI, SQLAlchemy, Pydantic
**Database**: Supabase Postgres (waitlist only), backend PostgreSQL (users/plants)
**Payments**: Paddle (billing only)
**Hosting**: Render (frontend + backend), Supabase (waitlist)

## API Reference

See `api-spec.md` for complete endpoint documentation.

**Key endpoints**:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/plants
- POST /api/plants
- GET /api/plants/{id}/insights (Botanist only)
- POST /api/payments/verify-transaction

## Troubleshooting

### Waitlist form not working
- Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Ensure waitlist table exists in Supabase
- Check browser console for CORS/auth errors

### Auth not working
- Verify NEXT_PUBLIC_API_URL points to running backend
- Check backend is accessible from browser
- Check session cookie settings

### Paddle checkout not opening
- Verify NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is set
- Check price IDs match Paddle dashboard
- Open browser console for JavaScript errors

## Support

Check the relevant guide:
- **Supabase issues**: `frontend/SUPABASE_SETUP.md`
- **Deployment**: `frontend/DEPLOYMENT_GUIDE.md`
- **API errors**: `api-spec.md`
