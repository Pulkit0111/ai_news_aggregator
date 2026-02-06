'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Source, Category } from '@prisma/client';

type FilterBarProps = {
  sources: Source[];
  categories: Category[];
};

export default function FilterBar({ sources, categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSource = searchParams.get('source') || '';
  const currentCategory = searchParams.get('category') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Filter */}
        <div>
          <label
            htmlFor="source-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Filter by Source
          </label>
          <select
            id="source-filter"
            value={currentSource}
            onChange={(e) => updateFilter('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={currentCategory}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(currentSource || currentCategory) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {currentSource && (
            <button
              onClick={() => updateFilter('source', '')}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Source: {sources.find((s) => s.id === currentSource)?.name || 'Unknown'}
              <span className="ml-1">×</span>
            </button>
          )}
          {currentCategory && (
            <button
              onClick={() => updateFilter('category', '')}
              className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-1 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              Category: {categories.find((c) => c.id === currentCategory)?.name || 'Unknown'}
              <span className="ml-1">×</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
