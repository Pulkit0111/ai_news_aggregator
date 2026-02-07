import Link from 'next/link';
import Logo from '@/components/Logo';
import ArticlePreviewCard from '@/components/ArticlePreviewCard';
import { prisma } from '@/lib/prisma';

export default async function LandingPage() {
  // Get stats for the hero section
  const [articleCount, sourceCount, categoryCount] = await Promise.all([
    prisma.article.count(),
    prisma.source.count(),
    prisma.category.count(),
  ]);

  // Get latest articles for preview
  const latestArticles = await prisma.article.findMany({
    take: 3,
    orderBy: { publishedAt: 'desc' },
    include: {
      source: true,
      categories: true,
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b-4 border-black sticky top-0 z-50 shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo />
            <div className="flex items-center gap-4">
              <Link
                href="/news"
                className="px-6 py-2 bg-cyan-400 border-4 border-black font-black text-black uppercase text-sm hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                Browse News
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-100 via-cyan-100 to-purple-100 border-b-4 border-black overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400 border-4 border-black opacity-20 rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-400 border-4 border-black opacity-20 -rotate-12"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-300 border-4 border-black font-black text-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span>⚡ AI-Powered News Aggregation</span>
                <span className="px-2 py-1 bg-green-400 border-2 border-black text-xs">100% FREE</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-black text-black leading-tight">
                Stay Ahead of the{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-white">AI Wave</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-2"></span>
                </span>
              </h1>

              <p className="text-xl font-bold text-gray-900 leading-relaxed">
                Your intelligent AI news aggregator that curates, categorizes, and analyzes the latest developments in artificial intelligence. Never miss what matters. <span className="text-green-600">Completely free, forever.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/news"
                  className="px-8 py-4 bg-cyan-400 border-4 border-black font-black text-black uppercase text-lg hover:bg-yellow-400 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none text-center"
                >
                  🚀 Explore News
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 bg-white border-4 border-black font-black text-black uppercase text-lg hover:bg-purple-200 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none text-center"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="bg-white border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-3xl font-black text-cyan-500">{articleCount.toLocaleString()}</div>
                  <div className="text-xs font-bold text-black uppercase">Articles</div>
                </div>
                <div className="bg-white border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-3xl font-black text-purple-500">{sourceCount}</div>
                  <div className="text-xs font-bold text-black uppercase">Sources</div>
                </div>
                <div className="bg-white border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-3xl font-black text-pink-500">{categoryCount}</div>
                  <div className="text-xs font-bold text-black uppercase">Categories</div>
                </div>
              </div>
            </div>

            {/* Right: Visual/Preview */}
            <div className="relative">
              <div className="space-y-4">
                {latestArticles.slice(0, 3).map((article) => (
                  <ArticlePreviewCard key={article.id} article={article} />
                ))}

                <div className="text-center pt-2">
                  <div className="inline-block px-4 py-2 bg-yellow-300 border-4 border-black font-black text-xs text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    ⚡ LIVE UPDATES - ALWAYS FREE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              Powered by Intelligence
            </h2>
            <p className="text-xl font-bold text-gray-700 max-w-2xl mx-auto">
              AI-driven features that transform how you consume AI news
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-cyan-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
              <div className="w-16 h-16 bg-cyan-400 border-4 border-black flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                🤖
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">AI Summarization</h3>
              <p className="text-black font-bold leading-relaxed">
                Get instant AI-powered summaries with key insights and significance analysis for every article.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-yellow-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
              <div className="w-16 h-16 bg-yellow-400 border-4 border-black flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                🔥
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">Top Stories</h3>
              <p className="text-black font-bold leading-relaxed">
                AI analyzes weekly trends and identifies the most impactful stories you need to know about.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
              <div className="w-16 h-16 bg-purple-400 border-4 border-black flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                🏷️
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">Smart Categories</h3>
              <p className="text-black font-bold leading-relaxed">
                Automatic categorization into LLMs, Research, Ethics, Tools, and more for easy filtering.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-pink-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
              <div className="w-16 h-16 bg-pink-400 border-4 border-black flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                🔍
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">Powerful Search</h3>
              <p className="text-black font-bold leading-relaxed">
                Semantic search across thousands of articles to find exactly what you're looking for instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-green-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
              <div className="w-16 h-16 bg-green-400 border-4 border-black flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                📡
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">Multi-Source</h3>
              <p className="text-black font-bold leading-relaxed">
                Aggregates from trusted AI news sources including research labs, tech blogs, and industry leaders.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-orange-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
              <div className="w-16 h-16 bg-orange-400 border-4 border-black flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                📬
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">Newsletter</h3>
              <p className="text-black font-bold leading-relaxed">
                Subscribe to curated weekly digests delivered straight to your inbox with top highlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 to-purple-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              How It Works
            </h2>
            <p className="text-xl font-bold text-gray-700 max-w-2xl mx-auto">
              Simple, smart, and automated
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-cyan-400 border-4 border-black w-20 h-20 mx-auto flex items-center justify-center font-black text-4xl text-black mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                1
              </div>
              <h3 className="font-black text-xl mb-2 text-black uppercase">Aggregate</h3>
              <p className="font-bold text-gray-700">
                Automatically fetch latest AI news from trusted sources
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-yellow-400 border-4 border-black w-20 h-20 mx-auto flex items-center justify-center font-black text-4xl text-black mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                2
              </div>
              <h3 className="font-black text-xl mb-2 text-black uppercase">Analyze</h3>
              <p className="font-bold text-gray-700">
                AI categorizes and extracts key insights from each article
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-purple-400 border-4 border-black w-20 h-20 mx-auto flex items-center justify-center font-black text-4xl text-black mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                3
              </div>
              <h3 className="font-black text-xl mb-2 text-black uppercase">Curate</h3>
              <p className="font-bold text-gray-700">
                Identify trending topics and most significant stories
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-pink-400 border-4 border-black w-20 h-20 mx-auto flex items-center justify-center font-black text-4xl text-black mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                4
              </div>
              <h3 className="font-black text-xl mb-2 text-black uppercase">Deliver</h3>
              <p className="font-bold text-gray-700">
                Browse, search, and get personalized insights instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              Coverage Areas
            </h2>
            <p className="text-xl font-bold text-gray-700 max-w-2xl mx-auto">
              Comprehensive AI news across all major categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'LLMs & Foundation Models', color: 'bg-cyan-300' },
              { name: 'Open Source', color: 'bg-yellow-300' },
              { name: 'AI Tools & APIs', color: 'bg-purple-300' },
              { name: 'Computer Vision', color: 'bg-pink-300' },
              { name: 'NLP & Embeddings', color: 'bg-green-300' },
              { name: 'Research Papers', color: 'bg-orange-300' },
              { name: 'AI Ethics & Safety', color: 'bg-red-300' },
              { name: 'Industry News', color: 'bg-blue-300' },
            ].map((category, index) => (
              <div
                key={index}
                className={`${category.color} border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all cursor-pointer`}
              >
                <div className="font-black text-black uppercase text-sm">
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-yellow-100 via-cyan-100 to-purple-100 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-6">
            Ready to Stay Informed?
          </h2>
          <p className="text-xl font-bold text-gray-900 mb-4">
            Join thousands staying ahead of AI developments
          </p>
          <p className="text-2xl font-black text-green-600 mb-12">
            🎉 100% FREE • No Signup Required • Unlimited Access
          </p>
          <Link
            href="/news"
            className="inline-block px-12 py-6 bg-black text-yellow-300 border-4 border-black font-black uppercase text-xl hover:bg-cyan-500 hover:text-black transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-3 hover:translate-y-3 hover:shadow-none"
          >
            🚀 Start Exploring Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-400 border-4 border-white"></div>
                  <div>
                    <div className="font-black text-2xl">
                      <span className="text-cyan-400">AI</span>BUZZ
                    </div>
                    <div className="text-xs font-bold opacity-80">NEWS INTELLIGENCE</div>
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold opacity-80">
                Your AI-powered news aggregator for staying ahead in the world of artificial intelligence.
              </p>
            </div>

            <div>
              <h3 className="font-black text-lg mb-4 text-cyan-400">FEATURES</h3>
              <ul className="space-y-2 text-sm font-bold">
                <li>AI Summarization</li>
                <li>Top Stories Detection</li>
                <li>Smart Categorization</li>
                <li>Semantic Search</li>
                <li>Weekly Newsletter</li>
              </ul>
            </div>

            <div>
              <h3 className="font-black text-lg mb-4 text-yellow-400">QUICK LINKS</h3>
              <ul className="space-y-2 text-sm font-bold">
                <li>
                  <Link href="/news" className="hover:text-cyan-400 transition-colors">
                    Browse News
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-cyan-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-gray-700 text-center space-y-2">
            <p className="text-sm font-bold opacity-80">
              &copy; 2026 AIBUZZ. Powered by Intelligence.
            </p>
            <p className="text-sm font-bold text-cyan-400">
              Made with ❤️ by Pulkit
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
