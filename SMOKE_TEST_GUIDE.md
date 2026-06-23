# LeafMind Waitlist Smoke Test Guide

**Goal**: Verify Supabase → Waitlist integration before June 20, 2026 Twitter campaign.

## Pre-Smoke Test Setup (15 min)

### 1. Create Supabase Project
- Go to https://supabase.com, sign in
- Create new project
- Save Project URL and Anon Key

### 2. Create Waitlist Table
- Go to SQL Editor in Supabase
- New Query
- Copy/paste from `frontend/supabase-migrations/001-waitlist-table.sql`
- Run
- Verify table appears in Table Editor

### 3. Configure Environment Variables
Set these on Render (Environment tab):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com (or http://localhost:8000 for local)
```

### 4. Deploy Frontend (if not already)
```bash
git push  # Render auto-deploys on push
```
Wait for build to complete. You'll get a URL like:
```
https://leafmind-xxxxx.onrender.com
```

## Smoke Test Steps (5 min)

### Step 1: Access Landing Page
```
https://leafmind-xxxxx.onrender.com?source=twitter
```
You should see:
- ✓ LeafMind header with "Sign In" and "Sign Up" links
- ✓ Waitlist form with email input and "Join Waitlist" button
- ✓ Feature cards below
- ✓ Pricing preview

### Step 2: Submit Test Email
1. Enter any email in the form, e.g., `test@example.com`
2. Click "Join Waitlist"
3. You should see: **"You're on the list! We'll be in touch soon 🌿"**

Expected inline alert:
- Green background
- Green checkmark icon
- Success message

### Step 3: Verify in Supabase
1. Go to Supabase dashboard
2. Select your project
3. Click **Table Editor** (left sidebar)
4. Click **waitlist** table
5. You should see a new row:
   - `email`: test@example.com
   - `source`: twitter
   - `submitted_at`: (current timestamp)

### Step 4: Test Duplicate Prevention
1. Submit the same email again: `test@example.com`
2. You should see: **"You're already on the list!"**
3. No new row added to Supabase

### Step 5: Test Different Source (Optional)
1. Visit without `?source=twitter`
2. Submit another email
3. In Supabase, verify `source` = "direct" (default)

## Success Criteria ✓

All of these must pass:

- [ ] Landing page loads without errors
- [ ] Waitlist form is visible
- [ ] First submission shows success message
- [ ] Supabase has 1 row with `source='twitter'` and test email
- [ ] Duplicate submission shows "already on list" message
- [ ] Browser console has no errors (F12)

## Failure Troubleshooting

### Form doesn't submit / "Submission failed" error
**Check**:
1. Browser console (F12) → Network tab
2. Are CORS errors appearing?
3. Is the Supabase insert request being sent?

**Fix**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Ensure `waitlist` table exists in Supabase
- Check Supabase RLS policies allow public inserts

### Table not visible in Supabase
**Fix**:
1. Run SQL migration again (copy/paste from 001-waitlist-table.sql)
2. Refresh Supabase dashboard
3. Check "No rows" message — table was created but empty

### Duplicate handling broken (shows error instead of friendly message)
**Fix**:
1. Check if unique constraint exists on `email` column
2. In Supabase SQL Editor, run:
   ```sql
   ALTER TABLE waitlist ADD CONSTRAINT waitlist_email_unique UNIQUE(email);
   ```

### Analytics not tracking
- Check Vercel dashboard (no immediate update, can take 5-10 min)
- Ensure `@vercel/analytics` is installed (already in package.json)

## Post-Smoke Test

### If PASS ✓
1. Clear test records: `DELETE FROM waitlist WHERE email = 'test@example.com';`
2. Confirm production URL works
3. Campaign is GO for June 20, 2026

### If FAIL ✗
1. Debug using troubleshooting section above
2. Re-run smoke test
3. Campaign is NO-GO until fixed

## Quick Deployment Recap

If you haven't deployed yet:

```bash
cd frontend

# Install dependencies
npm install

# Add to .env.local (local only)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

# Test locally
npm run dev  # http://localhost:3000

# Build and push to GitHub
git add -A
git commit -m "LeafMind v1: waitlist + auth + payments"
git push

# Render auto-deploys from main branch
# Monitor build: https://render.com/
```

## Key URLs

| Component | URL |
|-----------|-----|
| Landing | `https://leafmind-xxxxx.onrender.com` |
| Smoke Test | `https://leafmind-xxxxx.onrender.com?source=twitter` |
| Supabase | https://supabase.com/dashboard |
| Render | https://render.com/dashboard |
| Vercel Analytics | https://vercel.com/ |

## Expected Metrics Post-Campaign

- **Page views**: Tracked in Vercel Analytics
- **Signups**: Count rows in Supabase `waitlist` table
- **Conversion rate**: (waitlist rows / page views) × 100%
- **Source breakdown**: `SELECT source, COUNT(*) FROM waitlist GROUP BY source;`

## Emergency Contacts

- **Supabase**: https://supabase.com/support
- **Render**: https://render.com/help
- **Vercel**: https://vercel.com/help

---

**Campaign Launch**: June 20, 2026
**Go-No-Go Gate**: Smoke test confirms ≥1 Supabase record with `source='twitter'`
