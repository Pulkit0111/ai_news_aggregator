import type { Category, Source } from '@prisma/client';
import { prisma } from './prisma';
import { parseRssFeed } from './rss-parser';
import { categorizeArticle } from './categorizer';

/**
 * Main orchestration logic for fetching and storing articles
 */

export type FetchResult = {
  added: number;
  updated: number;
  errors: string[];
};

const DEFAULT_SOURCE_FETCH_CONCURRENCY = 3;
const MIN_SOURCE_FETCH_CONCURRENCY = 1;
const MAX_SOURCE_FETCH_CONCURRENCY = 10;

function getSourceFetchConcurrency(): number {
  const rawConcurrency = process.env.RSS_FETCH_CONCURRENCY;

  if (!rawConcurrency) {
    return DEFAULT_SOURCE_FETCH_CONCURRENCY;
  }

  const parsedConcurrency = Number.parseInt(rawConcurrency, 10);

  if (Number.isNaN(parsedConcurrency)) {
    return DEFAULT_SOURCE_FETCH_CONCURRENCY;
  }

  return Math.min(
    MAX_SOURCE_FETCH_CONCURRENCY,
    Math.max(MIN_SOURCE_FETCH_CONCURRENCY, parsedConcurrency)
  );
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function runNext(): Promise<void> {
    const currentIndex = nextIndex;
    nextIndex++;

    if (currentIndex >= items.length) {
      return;
    }

    results[currentIndex] = await worker(items[currentIndex], currentIndex);
    await runNext();
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => runNext()
  );

  await Promise.all(workers);

  return results;
}

async function fetchArticlesForSourceWithCategories(
  source: Source,
  categoryMap: Map<string, Category>
): Promise<FetchResult> {
  const result: FetchResult = {
    added: 0,
    updated: 0,
    errors: []
  };

  try {
    if (!source.rssUrl) {
      result.errors.push(`Source ${source.name} has no RSS URL`);
      return result;
    }

    // Parse RSS feed
    const articles = await parseRssFeed(source.rssUrl);
    const uniqueArticles = Array.from(
      new Map(articles.map(article => [article.url, article])).values()
    );
    const articleUrls = uniqueArticles.map(article => article.url);

    const existingArticles = articleUrls.length > 0
      ? await prisma.article.findMany({
          where: {
            url: {
              in: articleUrls
            }
          },
          select: {
            id: true,
            url: true
          }
        })
      : [];
    const existingArticleMap = new Map(
      existingArticles.map(article => [article.url, article])
    );

    // Process each article
    for (const article of uniqueArticles) {
      try {
        // Check if article already exists (deduplication by URL)
        const existingArticle = existingArticleMap.get(article.url);

        if (existingArticle) {
          // Update existing article if needed
          await prisma.article.update({
            where: { id: existingArticle.id },
            data: {
              title: article.title,
              summary: article.summary,
              publishedAt: article.publishedAt
            }
          });
          result.updated++;
        } else {
          // Auto-categorize the article
          const categorySlugs = categorizeArticle(article.title, article.summary);

          // Get category IDs from slugs using the pre-fetched map (avoids N+1 query)
          const categories = categorySlugs
            .map(slug => categoryMap.get(slug))
            .filter((cat): cat is NonNullable<typeof cat> => cat !== undefined);

          // Create new article
          await prisma.article.create({
            data: {
              title: article.title,
              url: article.url,
              summary: article.summary,
              publishedAt: article.publishedAt,
              sourceId: source.id,
              categories: {
                connect: categories.map(cat => ({ id: cat.id }))
              }
            }
          });
          result.added++;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Failed to process article "${article.title}": ${errorMsg}`);
      }
    }

    // Update source lastFetchedAt
    await prisma.source.update({
      where: { id: source.id },
      data: { lastFetchedAt: new Date() }
    });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Failed to fetch from source: ${errorMsg}`);
  }

  return result;
}

/**
 * Fetches and stores articles from a single source
 * @param sourceId - Database ID of the source
 * @returns Result with counts and errors
 */
export async function fetchArticlesForSource(sourceId: string): Promise<FetchResult> {
  const result: FetchResult = {
    added: 0,
    updated: 0,
    errors: []
  };

  try {
    // Get source with RSS URL
    const source = await prisma.source.findUnique({
      where: { id: sourceId }
    });

    if (!source) {
      result.errors.push(`Source ${sourceId} not found`);
      return result;
    }

    // Fetch all categories once to avoid N+1 queries
    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map(allCategories.map(c => [c.slug, c]));

    return fetchArticlesForSourceWithCategories(source, categoryMap);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Failed to fetch from source: ${errorMsg}`);
  }

  return result;
}

/**
 * Fetches articles from all sources with RSS URLs
 * @returns Combined result from all sources
 */
export async function fetchAllSources(): Promise<FetchResult> {
  const combinedResult: FetchResult = {
    added: 0,
    updated: 0,
    errors: []
  };

  try {
    // Get all sources with RSS URLs
    const sources = await prisma.source.findMany({
      where: {
        rssUrl: {
          not: null
        }
      }
    });

    // Fetch all categories once to avoid N+1 queries
    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map(allCategories.map(c => [c.slug, c]));

    // Fetch from each source with bounded concurrency
    const results = await runWithConcurrency(
      sources,
      getSourceFetchConcurrency(),
      source => fetchArticlesForSourceWithCategories(source, categoryMap)
    );

    for (const result of results) {
      combinedResult.added += result.added;
      combinedResult.updated += result.updated;
      combinedResult.errors.push(...result.errors);
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    combinedResult.errors.push(`Failed to fetch all sources: ${errorMsg}`);
  }

  return combinedResult;
}
