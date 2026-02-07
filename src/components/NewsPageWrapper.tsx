'use client';

import { useState } from 'react';
import ApiKeyModal from './ApiKeyModal';
import ApiKeySettings from './ApiKeySettings';

type NewsPageWrapperProps = {
  children: React.ReactNode;
};

export default function NewsPageWrapper({ children }: NewsPageWrapperProps) {
  const [hasApiKey, setHasApiKey] = useState(false);

  const handleKeySubmit = (apiKey: string) => {
    setHasApiKey(true);
  };

  const handleModalClose = () => {
    // Modal was closed without entering key, don't show loading
    setHasApiKey(false);
  };

  return (
    <>
      {/* Always render children so background is visible behind modal */}
      {children}

      {/* Show API key modal if no key exists */}
      <ApiKeyModal onKeySubmit={handleKeySubmit} onClose={handleModalClose} />

      {/* Show API key settings button only when user has a key */}
      {hasApiKey && <ApiKeySettings />}
    </>
  );
}
