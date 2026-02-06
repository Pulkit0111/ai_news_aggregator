import { Article, Source, Category } from '@prisma/client';
import ArticleCard from './ArticleCard';

type ArticleWithRelations = Article & {
  source: Source;
  categories: Category[];
};

type ArticleListProps = {
  articles: ArticleWithRelations[];
};

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No articles found. Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
