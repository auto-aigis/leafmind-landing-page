# Supabase Setup Guide

Follow these steps to set up the Supabase database for the LeafMind waitlist.

## 1. Create a Supabase Project

1. Go to https://supabase.com and sign in or create an account
2. Click "New Project"
3. Fill in project details:
   - Name: `leafmind` (or your preference)
   - Database password: Choose a strong password
   - Region: Choose the region closest to your users
4. Click "Create new project" and wait for initialization

## 2. Get Your Credentials

1. In the Supabase dashboard, go to **Settings → API**
2. Copy and save:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon (public) Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Create the Waitlist Table

1. In the Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL from `supabase-migrations/001-waitlist-table.sql`
4. Click **Run**

The SQL creates:
- `waitlist` table with columns: `id`, `email` (unique), `source`, `submitted_at`, `created_at`
- Indexes on `source` and `submitted_at` for fast queries

## 4. Enable Row Level Security (RLS) - Optional but Recommended

1. In the Supabase dashboard, go to **Authentication → Policies**
2. Select the `waitlist` table
3. Create a policy to allow inserts from anonymous users:
   - Policy name: `Allow anonymous inserts`
   - Policy type: `INSERT`
   - Under clause: `(true)` (allows anyone to insert)
   - Click **Review** → **Save policy**

## 5. Environment Variables

Add these to your `.env.local` file (local development) or Render environment variables (production):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

For the backend API (FastAPI):
```
NEXT_PUBLIC_API_URL=http://localhost:8000  # local
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com  # production
```

For Paddle (payments):
```
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ID_GROWER=xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ID_BOTANIST=xxxxx
NEXT_PUBLIC_PADDLE_SANDBOX=false  # set to 'true' for sandbox mode
```

## 6. Verify the Setup

1. Deploy the frontend
2. Visit: `https://your-deployed-url.onrender.com?source=twitter`
3. Submit a test email via the waitlist form
4. In the Supabase dashboard, go to **Table Editor** → **waitlist**
5. Confirm a new row appears with your email and `source='twitter'`

## Debugging

### Form submissions failing silently:
- Check browser console (F12) for CORS errors
- Verify Supabase credentials are correct
- Ensure the `waitlist` table exists
- Check RLS policies allow public inserts

### Duplicate email handling:
- The frontend detects unique constraint errors and shows "You're already on the list!"
- This is expected behavior

### Analytics not tracking:
- Vercel Analytics requires the `@vercel/analytics` package (already installed)
- Events are sent automatically; check Vercel dashboard for metrics
