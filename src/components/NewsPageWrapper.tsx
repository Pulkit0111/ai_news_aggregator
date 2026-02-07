'use client';

import { useState } from 'react';
import ApiKeyModal from './ApiKeyModal';

type NewsPageWrapperProps = {
  children: React.ReactNode;
};

export default function NewsPageWrapper({ children }: NewsPageWrapperProps) {
  const [hasApiKey, setHasApiKey] = useState(false);

  const handleKeySubmit = (apiKey: string) => {
    setHasApiKey(true);
  };

  return (
    <>
      <ApiKeyModal onKeySubmit={handleKeySubmit} />
      {hasApiKey ? children : (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin h-16 w-16 border-8 border-black border-t-transparent rounded-full mb-4"></div>
            <p className="text-2xl font-black text-black">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
