import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import FilterBar from "@/components/FilterBar";
import ArticleList from "@/components/ArticleList";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import NewsPageWrapper from "@/components/NewsPageWrapper";

type PageProps = {
  searchParams: Promise<{
    source?: string;
    category?: string;
    q?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const { q, category, source } = params;

  let title = 'AI News - AIBUZZ';
  let description = 'Browse the latest AI news with smart filtering, categorization, and AI-powered insights.';

  if (q) {
    title = `Search: "${q}" - AIBUZZ`;
    description = `Search results for "${q}" in AI news articles.`;
  } else if (category) {
    title = `${category} News - AIBUZZ`;
    description = `Latest AI news in ${category} category with smart categorization and insights.`;
  } else if (source) {
    title = `${source} Articles - AIBUZZ`;
    description = `Latest AI news articles from ${source}.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { source, category, q, page } = params;

  // Parse page number (default to 1)
  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const itemsPerPage = 12;
  const skip = (currentPage - 1) * itemsPerPage;

  // Build Prisma where clause based on filters
  const where: any = {};

  if (source) {
    where.sourceId = source;
  }

  if (category) {
    where.categories = {
      some: {
        id: category,
      },
    };
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
    ];
  }

  // Fetch total count and paginated articles
  const [totalCount, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      include: {
        source: true,
        categories: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: itemsPerPage,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Fetch all sources and categories for filter options
  const [sources, categories] = await Promise.all([
    prisma.source.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <NewsPageWrapper>
      <Suspense fallback={<div className="h-16" />}>
        <Navbar />
      </Suspense>

      <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <Suspense fallback={<div className="h-20 animate-pulse bg-white/50 border-4 border-black rounded-lg" />}>
            <FilterBar sources={sources} categories={categories} />
          </Suspense>

          <ArticleList articles={articles} />

          <Suspense fallback={<div className="h-12 animate-pulse bg-white/50 border-4 border-black rounded-lg mt-8" />}>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </div>
      </main>
    </NewsPageWrapper>
  );
}
