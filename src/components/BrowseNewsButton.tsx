'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiKeyModal from './ApiKeyModal';

type BrowseNewsButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export default function BrowseNewsButton({ children, className }: BrowseNewsButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user has API key
    const apiKey = localStorage.getItem('openai_api_key');

    if (apiKey) {
      // Has key, navigate directly to news
      router.push('/news');
    } else {
      // No key, show modal first
      setShowModal(true);
    }
  };

  const handleKeySubmit = (apiKey: string) => {
    setShowModal(false);
    // Navigate to news after key is submitted
    router.push('/news');
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Stay on landing page if modal is closed
  };

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children}
      </button>

      {/* Show API key modal on landing page */}
      {showModal && (
        <ApiKeyModal onKeySubmit={handleKeySubmit} onClose={handleModalClose} />
      )}
    </>
  );
}
