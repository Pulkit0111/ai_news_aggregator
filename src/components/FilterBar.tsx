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
    <div className="bg-white border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Filter */}
        <div>
          <label
            htmlFor="source-filter"
            className="block text-sm font-black text-black mb-3 uppercase"
          >
            📰 Source
          </label>
          <select
            id="source-filter"
            value={currentSource}
            onChange={(e) => updateFilter('source', e.target.value)}
            className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:bg-yellow-100 bg-white text-black font-bold transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
            className="block text-sm font-black text-black mb-3 uppercase"
          >
            🏷️ Category
          </label>
          <select
            id="category-filter"
            value={currentCategory}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:bg-yellow-100 bg-white text-black font-bold transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t-4 border-black">
          <span className="text-sm font-black text-black uppercase">Active:</span>
          {currentSource && (
            <button
              onClick={() => updateFilter('source', '')}
              className="px-4 py-2 bg-cyan-300 text-black border-4 border-black text-sm font-black uppercase flex items-center gap-2 hover:bg-yellow-300 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {sources.find((s) => s.id === currentSource)?.name || 'Unknown'}
              <span className="text-lg">×</span>
            </button>
          )}
          {currentCategory && (
            <button
              onClick={() => updateFilter('category', '')}
              className="px-4 py-2 bg-purple-300 text-black border-4 border-black text-sm font-black uppercase flex items-center gap-2 hover:bg-yellow-300 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {categories.find((c) => c.id === currentCategory)?.name || 'Unknown'}
              <span className="text-lg">×</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
