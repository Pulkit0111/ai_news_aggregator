import { Article, Source, Category } from '@prisma/client';

type ArticleWithRelations = Article & {
  source: Source;
  categories: Category[];
};

type ArticleCardProps = {
  article: ArticleWithRelations;
};

/**
 * Formats a date to relative time (e.g., "2 days ago")
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Gets a color class for category badges
 */
function getCategoryColor(slug: string): string {
  const colors: Record<string, string> = {
    'llms': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'open-source': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'ai-tools': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'computer-vision': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'nlp': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'research-papers': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'ai-ethics': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'industry-news': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return colors[slug] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const MAX_SUMMARY_LENGTH = 200;
  const shouldTruncate = article.summary && article.summary.length > MAX_SUMMARY_LENGTH;
  const displaySummary = shouldTruncate
    ? article.summary!.substring(0, MAX_SUMMARY_LENGTH) + '...'
    : article.summary || '';

  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {article.title}
        </a>
      </h2>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">{article.source.name}</span>
        {article.publishedAt && (
          <>
            <span>•</span>
            <time dateTime={article.publishedAt.toISOString()}>
              {getRelativeTime(article.publishedAt)}
            </time>
          </>
        )}
      </div>

      {/* Categories */}
      {article.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {article.categories.map((category) => (
            <span
              key={category.id}
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.slug)}`}
            >
              {category.name}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {displaySummary && (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {displaySummary}
          {shouldTruncate && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Read more
            </a>
          )}
        </p>
      )}
    </article>
  );
}
