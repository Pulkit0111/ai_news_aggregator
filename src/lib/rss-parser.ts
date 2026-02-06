import Parser from 'rss-parser';

/**
 * RSS feed parsing service
 */

export type ParsedArticle = {
  title: string;
  url: string;
  summary: string;
  publishedAt: Date;
};

const parser = new Parser({
  timeout: 10000, // 10 seconds
  headers: {
    'User-Agent': 'AI News Aggregator/1.0'
  }
});

/**
 * Fetches and parses an RSS feed from the given URL
 * @param url - RSS feed URL
 * @returns Array of parsed articles
 * @throws Error if network fails or XML is invalid
 */
export async function parseRssFeed(url: string): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(url);

    if (!feed.items || feed.items.length === 0) {
      return [];
    }

    return feed.items
      .map(item => extractArticleData(item))
      .filter((article): article is ParsedArticle => article !== null);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse RSS feed from ${url}: ${error.message}`);
    }
    throw new Error(`Failed to parse RSS feed from ${url}: Unknown error`);
  }
}

/**
 * Transforms an RSS feed item into article format
 * @param item - RSS feed item
 * @returns Parsed article or null if required fields are missing
 */
function extractArticleData(item: Parser.Item): ParsedArticle | null {
  // Validate required fields
  if (!item.title || !item.link) {
    return null;
  }

  // Extract summary from various possible fields
  const summary = item.contentSnippet || item.summary || item.content || '';

  // Parse published date
  let publishedAt = new Date();
  if (item.pubDate) {
    const parsedDate = new Date(item.pubDate);
    if (!isNaN(parsedDate.getTime())) {
      publishedAt = parsedDate;
    }
  } else if (item.isoDate) {
    const parsedDate = new Date(item.isoDate);
    if (!isNaN(parsedDate.getTime())) {
      publishedAt = parsedDate;
    }
  }

  return {
    title: item.title.trim(),
    url: item.link.trim(),
    summary: summary.trim(),
    publishedAt
  };
}
