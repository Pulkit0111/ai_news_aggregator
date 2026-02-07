import { Article, Source, Category } from '@prisma/client';

type ArticleWithRelations = Article & {
  source: Source;
  categories: Category[];
};

type ArticlePreviewCardProps = {
  article: ArticleWithRelations;
};

/**
 * Compact version of ArticleCard for hero preview
 */
export default function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  return (
    <article className="group bg-white border-4 border-black transition-all duration-200 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      {/* Accent bar */}
      <div className="h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"></div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Categories */}
        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.categories.slice(0, 2).map((category, index) => (
              <span
                key={category.id}
                className={`px-2 py-1 text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  index === 0 ? 'bg-yellow-300' : 'bg-cyan-300'
                }`}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-sm font-black mb-2 line-clamp-2 flex-grow text-black">
          {article.title}
        </h2>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-400 border-2 border-black flex items-center justify-center text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {article.source.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-black truncate max-w-[100px]">
                {article.source.name}
              </span>
            </div>
          </div>

          <div className="px-2 py-1 bg-cyan-400 text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Read
          </div>
        </div>
      </div>
    </article>
  );
}
