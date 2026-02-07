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

    if (!source.rssUrl) {
      result.errors.push(`Source ${source.name} has no RSS URL`);
      return result;
    }

    // Fetch all categories once to avoid N+1 queries
    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map(allCategories.map(c => [c.slug, c]));

    // Parse RSS feed
    const articles = await parseRssFeed(source.rssUrl);

    // Process each article
    for (const article of articles) {
      try {
        // Check if article already exists (deduplication by URL)
        const existingArticle = await prisma.article.findUnique({
          where: { url: article.url }
        });

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

    // Fetch from each source
    for (const source of sources) {
      const result = await fetchArticlesForSource(source.id);
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
