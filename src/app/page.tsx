import { prisma } from "@/lib/prisma";
import FilterBar from "@/components/FilterBar";
import ArticleList from "@/components/ArticleList";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import NewsletterSignup from "@/components/NewsletterSignup";

type PageProps = {
  searchParams: Promise<{
    source?: string;
    category?: string;
    q?: string;
    page?: string;
  }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { source, category, q, page } = params;

  // Parse page number (default to 1)
  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const itemsPerPage = 20;
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
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        AI News Aggregator
      </h1>

      <SearchBar />

      <FilterBar sources={sources} categories={categories} />

      <ArticleList articles={articles} />

      <Pagination currentPage={currentPage} totalPages={totalPages} />

      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </main>
  );
}
