# AIBUZZ Quick Start Guide

Get AIBUZZ up and running in production in under 30 minutes.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- Node.js 18+ installed
- Neon PostgreSQL account (free tier)
- Vercel account (free tier)

### Step 1: Clone & Install (2 minutes)

```bash
git clone <your-repo-url>
cd ai_news_aggregator
npm install
```

### Step 2: Set Up Neon Database (5 minutes)

1. Create a free Neon project at https://neon.tech
2. Copy your connection strings (you'll see them after creating the project)
3. Update `.env.local` with your Neon credentials:

```env
DATABASE_URL="your-neon-pooled-connection-string"
DIRECT_URL="your-neon-direct-connection-string"
CRON_SECRET="dev-secret-change-in-production"
```

**Important:** The pooled URL has `-pooler` in the hostname, the direct URL doesn't.

### Step 3: Run Migrations (1 minute)

```bash
npx prisma migrate deploy
```

This creates all tables in your Neon database.

### Step 4: Seed Database (2 minutes)

```bash
npx prisma db seed
```

This adds default sources and categories.

### Step 5: Test Locally (3 minutes)

```bash
npm run dev
```

Visit `http://localhost:3000` and verify the app works.

### Step 6: Deploy to Vercel (5 minutes)

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts to link your project.

### Step 7: Set Environment Variables in Vercel (5 minutes)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these for **Production**, **Preview**, and **Development**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon pooled connection string |
| `DIRECT_URL` | Your Neon direct connection string |
| `CRON_SECRET` | Generate with: `openssl rand -hex 32` |
| `NODE_ENV` | `production` |

### Step 8: Deploy to Production (2 minutes)

```bash
vercel --prod
```

### Step 9: Verify Deployment (5 minutes)

Visit your Vercel URL and test:
- ✅ Landing page loads
- ✅ Click "Browse News"
- ✅ Enter OpenAI API key when prompted
- ✅ Articles display correctly
- ✅ Pagination works
- ✅ Filters work (source, category, search)
- ✅ Try "Summarize" feature
- ✅ Try "Top Stories" feature

## 🔄 Migrating Existing Data

If you have existing data in a local PostgreSQL database:

```bash
npx tsx scripts/migrate-to-neon.ts
```

This will copy all sources, categories, and articles to Neon.

## 📊 Automatic Article Fetching

Articles are automatically fetched every 6 hours via Vercel Cron.

To manually trigger:

```bash
curl -X POST https://your-domain.vercel.app/api/fetch-articles \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🛠 Troubleshooting

### Build Fails

**"useSearchParams() should be wrapped in a Suspense boundary"**
✅ Already fixed in code

**"Can't reach database server"**
- Verify DATABASE_URL and DIRECT_URL are correct
- Check Neon database is not paused (free tier auto-pauses after inactivity)

### No Articles Showing

**Empty news page**
- Run the seed script: `npx prisma db seed`
- Manually fetch articles: See "Automatic Article Fetching" above

### API Key Modal Keeps Appearing

**Modal shows on every page load**
- This is expected behavior - users need to provide their OpenAI API key
- Keys are stored in browser localStorage only
- This keeps your deployment free from OpenAI costs

## 📈 What's Included

All deployment fixes are already implemented:

✅ **Database Connection Pooling** - Using Neon pooled connections for serverless
✅ **Suspense Boundaries** - Components wrapped for Next.js 16 compatibility
✅ **API Pagination** - All endpoints support pagination to prevent memory issues
✅ **CRON Authentication** - Secure automated fetching with secret token
✅ **N+1 Query Fix** - Optimized database queries for better performance
✅ **Error Boundaries** - Graceful error handling throughout the app
✅ **SEO Files** - robots.txt and sitemap.xml for search engines
✅ **Enhanced Metadata** - OpenGraph and Twitter cards for social sharing
✅ **Cache Headers** - Optimized caching for faster load times
✅ **Security Headers** - XSS protection, frame options, content type sniffing prevention
✅ **Build Error Handling** - Graceful fallbacks when database is unavailable

## 🎯 Next Steps

After deployment:

1. **Add Custom Domain** (optional)
   - Go to Vercel Dashboard → Domains
   - Add your domain and configure DNS

2. **Monitor Performance**
   - Check Vercel logs for errors
   - Monitor Neon dashboard for database usage

3. **Add Analytics** (optional)
   ```bash
   npm install @vercel/analytics @vercel/speed-insights
   ```

4. **Customize Content**
   - Add more RSS sources via Prisma Studio
   - Adjust categories for your needs

## 💡 Tips

- **Free Tier Limits:** Neon free tier has 512MB storage and 100 hours compute/month
- **API Keys:** Users provide their own OpenAI keys - no cost to you
- **Cron Schedule:** Modify in `vercel.json` if you want more/less frequent updates
- **Scaling:** When you need more, upgrade Neon to Scale plan for better performance

## 📚 Full Documentation

For detailed deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
- Review Vercel logs in the dashboard
- Check Neon dashboard for database issues

---

**Estimated Total Time:** 30 minutes
**Cost:** $0 (using free tiers)

Enjoy your AI news aggregator! 🎉
