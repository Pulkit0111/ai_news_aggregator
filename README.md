# AIBUZZ - AI News Intelligence

> 🚀 **MVP Release** - Your intelligent AI news aggregator. More features coming soon!

![AIBUZZ](https://img.shields.io/badge/Status-MVP-green) ![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

**AIBUZZ** is a modern, AI-powered news aggregator that curates, categorizes, and analyzes the latest developments in artificial intelligence. Stay ahead of the AI wave with intelligent features and a beautiful neobrutalist design.

## ✨ Features

### 🤖 **AI-Powered Intelligence**
- **Smart Summarization** - Get instant AI-generated summaries with key insights and significance analysis
- **Top Stories Detection** - AI analyzes weekly trends and identifies the most impactful stories
- **Auto-Categorization** - Automatic classification into LLMs, Research, Ethics, Tools, and more
- **Semantic Search** - Find exactly what you're looking for across thousands of articles

### 📰 **News Aggregation**
- **Multi-Source** - Aggregates from trusted AI news sources including research labs and tech blogs
- **Real-Time Updates** - Automated fetching keeps you up-to-date with the latest developments
- **Smart Filtering** - Filter by source, category, or search terms
- **Responsive Design** - Beautiful UI that works seamlessly on all devices

### 🔒 **Privacy & Security**
- **100% Free** - Completely free to use, no hidden costs
- **No Signup Required** - Start exploring immediately
- **Your API Key** - Users provide their own OpenAI API key for AI features
- **Client-Side Storage** - API keys stored only in your browser, never on servers

## 🎨 Design

AIBUZZ features a bold **neobrutalist design** with:
- Thick black borders and vibrant colors
- Bold typography and high contrast
- Smooth hover animations
- Consistent visual language throughout

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.5](https://nextjs.org/) with Turbopack
- **UI**: [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL 18](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)
- **AI**: [OpenAI API](https://openai.com/) (gpt-4o-mini, text-embedding-3-small)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 18
- OpenAI API key (users provide their own)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ai_news_aggregator
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_news_aggregator"
CRON_SECRET=your-secure-secret-here
```

> **Note**: OpenAI API key is NOT needed in `.env.local`. Users provide their own keys through the application.

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed initial data
npm run seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📚 Project Structure

```
ai_news_aggregator/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── news/                 # News browsing page
│   │   └── api/                  # API routes
│   │       ├── articles/         # Article endpoints
│   │       ├── article/          # Single article operations
│   │       └── fetch-articles/   # RSS aggregation
│   ├── components/
│   │   ├── ApiKeyModal.tsx       # API key input modal
│   │   ├── ApiKeySettings.tsx    # Key management
│   │   ├── ArticleCard.tsx       # Article display
│   │   ├── FilterBar.tsx         # Search & filter
│   │   ├── Logo.tsx              # AIBUZZ branding
│   │   └── ...
│   └── lib/
│       ├── prisma.ts             # Database client
│       ├── openai.ts             # OpenAI client
│       ├── categorizer.ts        # Auto-categorization
│       └── rss-parser.ts         # RSS feed parsing
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
└── public/                       # Static assets
```

## 🔑 API Key Setup

Users need to provide their own OpenAI API key to use AI features:

1. Visit the landing page and click **"Browse News"**
2. A modal will appear requesting your OpenAI API key
3. Get your key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Enter the key (format: `sk-...`) and continue
5. Your key is stored **only in your browser** (localStorage)

### Managing Your API Key

Click the **"🔑 API Key"** button on the news page to:
- **Change** your API key
- **Revoke** your key and return to home page
- View your masked current key

## 📊 Database Schema

### Models

- **Source** - News sources (websites, RSS feeds)
- **Category** - Article categories (LLMs, Research, Ethics, etc.)
- **Article** - News articles with metadata
- **Relations** - Many-to-many between Articles and Categories

## 🎯 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with initial data
```

## 🌐 Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
CRON_SECRET="your-secure-cron-secret"
```

### Recommended Platforms

- **Frontend**: [Vercel](https://vercel.com) (optimal for Next.js)
- **Database**: [Supabase](https://supabase.com) or [Railway](https://railway.app)
- **Domain**: Custom domain for professional appearance

### Pre-Deployment Checklist

- [ ] Update `CRON_SECRET` to a secure random string
- [ ] Set up production PostgreSQL database
- [ ] Configure environment variables on hosting platform
- [ ] Run `npm run build` to verify production build
- [ ] Test API key flow in production environment

## 🤝 Contributing

This is an MVP (Minimum Viable Product). Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Made with ❤️ by Pulkit**

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the amazing API
- [Next.js](https://nextjs.org) team for the incredible framework
- [Vercel](https://vercel.com) for hosting and deployment tools
- All the AI news sources that make this aggregator possible

---

⭐ **Star this repo** if you find it useful!

🐛 **Found a bug?** [Open an issue](issues)

💡 **Have a feature idea?** [Start a discussion](discussions)
