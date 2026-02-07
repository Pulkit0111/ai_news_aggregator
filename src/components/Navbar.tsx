'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import Logo from './Logo';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [showTopStories, setShowTopStories] = useState(false);
  const [topStories, setTopStories] = useState<any>(null);
  const [loadingStories, setLoadingStories] = useState(false);

  // Update local state when URL changes (e.g., back button)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    const currentUrlQuery = searchParams.get('q') || '';

    // Only trigger navigation if query actually changed
    if (query === currentUrlQuery) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim() === '') {
        params.delete('q');
      } else {
        params.set('q', query);
      }

      // Reset to page 1 when search changes
      params.delete('page');

      router.push(`/news?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleClear = () => {
    setQuery('');
  };

  const fetchTopStories = async () => {
    setLoadingStories(true);
    setShowTopStories(true);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem('openai_api_key');

      if (!apiKey) {
        console.error('No API key found');
        setLoadingStories(false);
        return;
      }

      const response = await fetch('/api/articles/top-stories', {
        headers: {
          'x-openai-key': apiKey,
        },
      });
      const data = await response.json();

      if (data.success) {
        setTopStories(data);
      } else {
        console.error('Failed to fetch top stories:', data.error);
      }
    } catch (error) {
      console.error('Error fetching top stories:', error);
    } finally {
      setLoadingStories(false);
    }
  };


  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Logo href="/" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search AI news..."
                className="w-full px-4 py-3 bg-yellow-100 border-4 border-black text-black placeholder-gray-600 focus:outline-none focus:bg-yellow-200 font-bold transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-cyan-500 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex-shrink-0">
            {/* Top Stories Button */}
            <button
              onClick={fetchTopStories}
              className="px-4 py-2 bg-yellow-300 border-4 border-black font-black text-black uppercase text-sm hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              🔥 Top Stories
            </button>
          </div>
        </div>
      </div>

      {/* Top Stories Modal */}
      <Modal
        isOpen={showTopStories}
        onClose={() => setShowTopStories(false)}
        title="🔥 Top Stories of the Week"
      >
        {loadingStories ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
            <p className="mt-4 font-bold text-black">Analyzing top stories...</p>
          </div>
        ) : topStories && topStories.topStories ? (
          <div className="space-y-6">
            {/* Weekly Trends */}
            <div className="bg-yellow-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-lg mb-2 text-black uppercase">📊 Weekly Trends</h3>
              <p className="text-black font-medium">{topStories.weeklyTrends}</p>
            </div>

            {/* Top Stories List */}
            <div className="space-y-4">
              {topStories.topStories.map((story: any, index: number) => (
                <div
                  key={story.id}
                  className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 border-2 border-black flex items-center justify-center font-black text-black">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg mb-2 text-black">
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-cyan-600 transition-colors"
                        >
                          {story.title}
                        </a>
                      </h4>
                      <p className="text-sm font-bold text-gray-600 mb-2">
                        {story.source.name} • {new Date(story.publishedAt).toLocaleDateString()}
                      </p>
                      {story.aiExplanation && (
                        <p className="text-sm text-black font-medium bg-yellow-100 border-2 border-black p-3">
                          <strong className="text-black">Why it matters:</strong> {story.aiExplanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">No top stories available</p>
        )}
      </Modal>
    </nav>
  );
}
