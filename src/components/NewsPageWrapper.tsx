'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiKeySettings from './ApiKeySettings';

type NewsPageWrapperProps = {
  children: React.ReactNode;
};

export default function NewsPageWrapper({ children }: NewsPageWrapperProps) {
  const router = useRouter();
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has API key
    const apiKey = localStorage.getItem('openai_api_key');

    if (!apiKey) {
      // No API key, redirect to home
      router.push('/');
    } else {
      setHasApiKey(true);
    }
  }, [router]);

  // Don't render anything until we've checked for API key
  if (hasApiKey === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-16 w-16 border-8 border-black border-t-transparent rounded-full mb-4"></div>
          <p className="text-2xl font-black text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {hasApiKey && <ApiKeySettings />}
    </>
  );
}
