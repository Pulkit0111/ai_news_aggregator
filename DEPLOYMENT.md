# AIBUZZ Deployment Guide

This guide walks you through deploying AIBUZZ to Vercel with Neon PostgreSQL.

## Prerequisites

- [x] Neon account created
- [x] Neon connection strings obtained
- [x] Vercel account (free tier is sufficient)
- [x] Git repository

## Phase 0: Neon Database Setup (Local Testing)

### Step 1: Update Environment Variables

Your `.env.local` has already been updated with Neon connection strings:

```env
DATABASE_URL="postgresql://neondb_owner:npg_jAeUHsCh20la@ep-floral-pine-aickbfci-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:npg_jAeUHsCh20la@ep-floral-pine-aickbfci.us-east-1.aws.neon.tech/neondb?sslmode=require"
CRON_SECRET=dev-secret-change-in-production
```

### Step 2: Run Migrations on Neon

Apply your Prisma schema to the Neon database:

```bash
npx prisma migrate deploy
```

This will create all tables (Source, Category, Article, etc.) in your Neon database.

### Step 3: Migrate Local Data to Neon

Run the migration script to copy data from your local PostgreSQL to Neon:

```bash
npx tsx scripts/migrate-to-neon.ts
```

This will migrate:
- All sources (RSS feeds)
- All categories
- All articles with their relationships

### Step 4: Verify Migration

Open Prisma Studio to verify data was migrated successfully:

```bash
npx prisma studio
```

Check that all your sources, categories, and articles are present.

### Step 5: Test Locally with Neon

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` and verify:
- Landing page loads correctly
- News page shows articles from Neon database
- Filtering and pagination work
- API endpoints respond correctly

## Phase 1: Deploy to Vercel

### Step 1: Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Your Project

```bash
vercel
```

Follow the prompts to link or create a new Vercel project.

### Step 4: Set Environment Variables in Vercel

Go to your Vercel Dashboard → Project Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_jAeUHsCh20la@ep-floral-pine-aickbfci-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | `postgresql://neondb_owner:npg_jAeUHsCh20la@ep-floral-pine-aickbfci.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `CRON_SECRET` | Generate a secure random string (see below) |
| `NODE_ENV` | `production` |

**To generate a secure CRON_SECRET:**

```bash
openssl rand -hex 32
```

Copy the output and use it as your `CRON_SECRET`.

### Step 5: Test Production Build Locally

Before deploying, test that your build works:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` and verify everything works.

### Step 6: Deploy to Production

```bash
vercel --prod
```

Vercel will build and deploy your application. Wait for the deployment to complete.

### Step 7: Verify Deployment

Once deployed, Vercel will provide a URL. Visit it and test:

1. **Landing page** - Should load with stats and article previews
2. **Browse News** - Click button and enter API key
3. **Article listing** - Verify articles load from Neon database
4. **Pagination** - Test page navigation
5. **Filtering** - Test source and category filters
6. **Search** - Test search functionality
7. **AI Features** - Test summarization and top stories

### Step 8: Set Up Cron Job (Automatic Article Fetching)

The cron job is configured in `vercel.json` to run every 6 hours:

```json
{
  "crons": [{
    "path": "/api/fetch-articles",
    "schedule": "0 */6 * * *"
  }]
}
```

To manually trigger article fetching, use:

```bash
curl -X POST https://your-domain.vercel.app/api/fetch-articles \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Post-Deployment Checklist

After deployment, verify these items:

- [ ] Landing page loads correctly
- [ ] News page shows articles
- [ ] Pagination works
- [ ] Filtering by source and category works
- [ ] Search functionality works
- [ ] API key modal appears when needed
- [ ] Article summarization works (with API key)
- [ ] Top stories feature works (with API key)
- [ ] Error boundaries display on errors
- [ ] Check `/robots.txt` - Should load correctly
- [ ] Check `/sitemap.xml` - Should show pages
- [ ] Check Vercel logs for any errors
- [ ] Verify cron job runs (check Vercel cron logs after 6 hours)

## Monitoring & Maintenance

### View Logs

Check Vercel dashboard → Your Project → Logs to monitor:
- API requests
- Errors
- Cron job executions

### Database Monitoring

Check Neon dashboard to monitor:
- Connection count
- Query performance
- Storage usage

### Performance Monitoring

Consider adding (optional):
- Vercel Analytics: `npm install @vercel/analytics`
- Vercel Speed Insights: `npm install @vercel/speed-insights`

## Troubleshooting

### Build Fails

**Error: "useSearchParams() should be wrapped in a Suspense boundary"**
- ✅ Fixed: Components are wrapped in Suspense boundaries

**Error: "Prisma schema not found"**
- Run: `npx prisma generate`

### Database Connection Issues

**Error: "Too many connections"**
- ✅ Fixed: Using Neon pooled connection with `-pooler` endpoint

**Error: "SSL connection required"**
- ✅ Fixed: Connection strings include `?sslmode=require`

### Cron Job Not Running

**Articles not updating automatically**
- Verify `CRON_SECRET` is set in Vercel environment variables
- Check Vercel cron logs in dashboard
- Manually trigger: `curl -X POST https://your-domain/api/fetch-articles -H "Authorization: Bearer YOUR_CRON_SECRET"`

### API Timeout Errors

**Error: "Function execution timeout"**
- ✅ Fixed: Added `maxDuration = 60` to `/api/fetch-articles`
- Vercel Hobby plan has 60s limit, Pro plan has 300s

## Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `aibuzz.com`)
3. Follow Vercel's DNS configuration instructions
4. Update `robots.ts` and `sitemap.ts` with your custom domain

## Scaling Considerations

### Current Limits (Neon Free Tier)

- 512MB storage
- 0.5 GB RAM
- 100 hours compute/month

### When to Upgrade

Consider upgrading Neon when:
- Storage exceeds 400MB (80% of limit)
- Compute hours approach 80+ hours/month
- Need more concurrent connections

### Performance Optimization

Already implemented:
- ✅ Connection pooling (Neon pooler)
- ✅ Pagination on all endpoints
- ✅ Cache headers on API routes
- ✅ N+1 query fix in article fetcher
- ✅ Database indexes on frequently queried fields

## Summary

Your AIBUZZ application is now production-ready and deployed on Vercel with:

✅ Neon PostgreSQL with connection pooling
✅ Automatic article fetching via cron (every 6 hours)
✅ Error boundaries for graceful error handling
✅ SEO optimization (metadata, robots.txt, sitemap.xml)
✅ Cache headers for performance
✅ Security headers (XSS, frame options)
✅ Serverless function timeout protection

**Next Steps:**
1. Test all features in production
2. Monitor Vercel logs for errors
3. Optionally add custom domain
4. Optionally add analytics

Enjoy your deployed AI news aggregator! 🚀
