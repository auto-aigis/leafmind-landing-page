# LeafMind Full Deployment Guide

## Prerequisites

- Supabase project created with `waitlist` table (see `SUPABASE_SETUP.md`)
- FastAPI backend deployed and accessible
- Paddle account with product IDs configured
- Render account for hosting
- GitHub repo with this code

## Environment Variables Setup

### Production (Render)

Add these to your Render deployment environment variables:

#### Backend API
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

#### Paddle Payments
```
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ID_GROWER=prc_xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ID_BOTANIST=prc_xxxxx
NEXT_PUBLIC_PADDLE_SANDBOX=false
```

#### Vercel Analytics
```
(No setup needed — automatically enabled via @vercel/analytics package)
```

### Local Development (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ID_GROWER=prc_xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ID_BOTANIST=prc_xxxxx
NEXT_PUBLIC_PADDLE_SANDBOX=true
```

## Deploy to Render

1. Fork/Clone the repo (if not already done)
2. Connect to Render:
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Select your GitHub repo
   - Name: leafmind
   - Environment: Node
   - Build Command: npm ci && npm run build
   - Start Command: npm run start
   - Instance Type: "Free" or paid as needed

3. Add Environment Variables:
   - Go to Environment tab
   - Add all variables from the Production section above

4. Deploy:
   - Click Create Web Service
   - Wait for build to complete
   - Once live, you get a URL like https://leafmind-xxxxx.onrender.com

## Verify Deployment

### 1. Landing Page

Visit: https://leafmind-xxxxx.onrender.com

Expect: HTML with LeafMind landing page

### 2. Waitlist Form

Manually test:
1. Visit https://leafmind-xxxxx.onrender.com?source=twitter
2. Submit test email
3. Expect inline message: "You're on the list! We'll be in touch soon 🌿"

### 3. Supabase Verification

In Supabase dashboard, run:
```sql
SELECT * FROM waitlist WHERE source = 'twitter';
```

Expect: At least 1 row with the test email

### 4. Analytics

1. Visit Vercel dashboard: https://vercel.com/
2. Find your project
3. Go to Analytics
4. Verify page views and custom waitlist_signup events appear

## Smoke Test Checklist

- [ ] Landing page loads with Sign In / Sign Up links
- [ ] Waitlist form visible on landing page
- [ ] Test email submits without error
- [ ] Confirmation message appears: "You're on the list!"
- [ ] Supabase has test record with source='twitter'
- [ ] Duplicate submission shows: "You're already on the list!"
- [ ] Sign Up link redirects to /register
- [ ] Sign In link redirects to /login
- [ ] Register page works
- [ ] Login page works
- [ ] Analytics events firing (check Vercel dashboard)

## Go-No-Go Gate

SUCCESS: Supabase waitlist table contains at least 1 row with source='twitter' from the smoke test.

FAILURE: If row is not present, check:
1. Supabase credentials correct?
2. Waitlist table exists?
3. Browser console for errors (F12)
4. Network tab: Is the insert request being sent?
5. Supabase RLS policies allow public inserts?

## Twitter Campaign Setup

1. Campaign URL: https://leafmind-xxxxx.onrender.com?source=twitter
2. Share via tweet: Include link with ?source=twitter
3. Track conversion: Monitor Supabase growth and Vercel Analytics CTR
4. Expected metrics:
   - Page views tracked in Vercel Analytics
   - Unique visitors per campaign source
   - Conversion rate (signups / views)

## Post-Deployment

### Monitor
- Render: Check logs for errors
- Supabase: Monitor row count growth
- Vercel Analytics: Track page views and signup events

### Scale (if needed)
- Render: Upgrade instance type
- Supabase: Upgrade plan for higher limits

### Troubleshooting

Form submissions not working:
- Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Check RLS policies on waitlist table
- Check browser console for CORS errors

Paddle checkout not opening:
- Verify NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is set
- Verify NEXT_PUBLIC_PADDLE_PRICE_ID_* match actual Paddle price IDs
- Check for JavaScript errors in browser console

Auth not working:
- Verify NEXT_PUBLIC_API_URL is correct and backend is running
- Check backend logs for API errors
- Verify session cookie handling (should be secure in production)
