'use client';

import { Article, Source, Category } from '@prisma/client';
import { useState } from 'react';
import Modal from './Modal';

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
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const MAX_SUMMARY_LENGTH = 150;
  const shouldTruncate = article.summary && article.summary.length > MAX_SUMMARY_LENGTH;
  const displaySummary = shouldTruncate
    ? article.summary!.substring(0, MAX_SUMMARY_LENGTH) + '...'
    : article.summary || '';

  const handleAISummary = async () => {
    setShowSummary(true);
    setLoadingSummary(true);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem('openai_api_key');

      if (!apiKey) {
        console.error('No API key found');
        setLoadingSummary(false);
        return;
      }

      const response = await fetch('/api/article/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          url: article.url,
          summary: article.summary,
          apiKey: apiKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiSummary(data.analysis);
      } else {
        console.error('Failed to get AI summary:', data.error);
      }
    } catch (error) {
      console.error('Error getting AI summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <>
      <article className="group bg-white border-4 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 flex flex-col h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Accent bar */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"></div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Categories */}
        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.categories.slice(0, 2).map((category, index) => (
              <span
                key={category.id}
                className={`px-3 py-1 text-black text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  index === 0 ? 'bg-yellow-300' : 'bg-cyan-300'
                }`}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-black mb-3 line-clamp-2 flex-grow">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-cyan-600 transition-colors"
          >
            {article.title}
          </a>
        </h2>

        {/* Summary */}
        {displaySummary && (
          <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3 font-medium">
            {displaySummary}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-400 border-2 border-black flex items-center justify-center text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {article.source.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-black truncate max-w-[120px]">
                {article.source.name}
              </span>
              {article.publishedAt && (
                <time className="text-xs text-gray-600 font-bold" dateTime={article.publishedAt.toISOString()}>
                  {getRelativeTime(article.publishedAt)}
                </time>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Summary Button */}
            <button
              onClick={handleAISummary}
              className="p-2 bg-purple-400 border-2 border-black hover:bg-yellow-300 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              title="AI Summary"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-cyan-400 text-black font-black text-xs uppercase hover:bg-yellow-300 transition-colors border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              Read →
            </a>
          </div>
        </div>
      </div>
    </article>

    {/* AI Summary Modal */}
    <Modal
      isOpen={showSummary}
      onClose={() => setShowSummary(false)}
      title="🤖 AI Analysis"
    >
      {loadingSummary ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
          <p className="mt-4 font-bold text-black">Analyzing article...</p>
        </div>
      ) : aiSummary ? (
        <div className="space-y-6">
          {/* Article Title */}
          <div>
            <h3 className="font-black text-xl mb-2 text-black">{article.title}</h3>
            <p className="text-sm font-bold text-gray-600">
              {article.source.name} • {article.publishedAt && new Date(article.publishedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-cyan-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="font-black text-lg mb-2 text-black uppercase">📝 Summary</h4>
            <p className="text-black font-medium">{aiSummary.summary}</p>
          </div>

          {/* Key Insights */}
          <div className="bg-yellow-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="font-black text-lg mb-3 text-black uppercase">💡 Key Insights</h4>
            <ul className="space-y-2">
              {aiSummary.insights?.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-black text-yellow-300 border-2 border-black flex items-center justify-center font-black text-xs">
                    {index + 1}
                  </span>
                  <span className="text-black font-medium">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Significance */}
          <div className="bg-purple-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="font-black text-lg mb-2 text-black uppercase">🎯 Why It Matters</h4>
            <p className="text-black font-medium">{aiSummary.significance}</p>
          </div>

          {/* Read Full Article Button */}
          <div className="text-center">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-cyan-400 text-black font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Read Full Article →
            </a>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 py-8">Failed to load AI summary</p>
      )}
    </Modal>
  </>
  );
}
