'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

const API_KEY_STORAGE_KEY = 'openai_api_key';

type ApiKeyModalProps = {
  onKeySubmit: (apiKey: string) => void;
};

export default function ApiKeyModal({ onKeySubmit }: ApiKeyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!storedKey) {
      setIsOpen(true);
    } else {
      onKeySubmit(storedKey);
    }
  }, [onKeySubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError('Invalid API key format. OpenAI keys start with "sk-"');
      return;
    }

    // Store the API key
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    setError('');
    setIsOpen(false);
    onKeySubmit(apiKey.trim());
  };

  const handleClearKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setIsOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {}} // Prevent closing without key
        title="🔑 OpenAI API Key Required"
      >
        <div className="space-y-6">
          {/* Info Section */}
          <div className="bg-cyan-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg mb-2 text-black uppercase">ℹ️ Important</h3>
            <p className="text-black font-bold leading-relaxed mb-2">
              This application is <span className="text-green-600">100% FREE</span>, but to use AI-powered features like:
            </p>
            <ul className="list-disc list-inside space-y-1 text-black font-medium ml-2">
              <li>Article Summarization</li>
              <li>Top Stories Detection</li>
              <li>Weekly Trend Analysis</li>
            </ul>
            <p className="text-black font-bold mt-3">
              You need to provide your own OpenAI API key.
            </p>
          </div>

          {/* Security Note */}
          <div className="bg-yellow-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg mb-2 text-black uppercase">🔒 Privacy & Security</h3>
            <p className="text-black font-bold leading-relaxed">
              Your API key is stored <span className="text-purple-600">only in your browser</span> (localStorage)
              and is never saved on our servers. Each request uses your key directly with OpenAI.
            </p>
          </div>

          {/* How to Get API Key */}
          <div className="bg-purple-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg mb-2 text-black uppercase">📝 How to Get an API Key</h3>
            <ol className="list-decimal list-inside space-y-2 text-black font-medium ml-2">
              <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline font-black">platform.openai.com/api-keys</a></li>
              <li>Sign up or log in to your OpenAI account</li>
              <li>Click "Create new secret key"</li>
              <li>Copy the key and paste it below</li>
            </ol>
          </div>

          {/* API Key Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block font-black text-black mb-2 uppercase">
                Your OpenAI API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:bg-yellow-50 font-bold transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
              {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                  ⚠️ {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-cyan-400 border-4 border-black font-black text-black uppercase text-lg hover:bg-yellow-400 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none"
            >
              🚀 Continue to News
            </button>
          </form>

          {/* Note */}
          <p className="text-xs text-gray-600 font-bold text-center">
            Note: You can change your API key anytime from the settings menu.
          </p>
        </div>
      </Modal>

      {/* Settings button to change key (shown when key exists) */}
      {!isOpen && (
        <button
          onClick={handleClearKey}
          className="fixed bottom-4 right-4 p-3 bg-purple-400 border-4 border-black font-black text-black hover:bg-yellow-300 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-40"
          title="Change API Key"
        >
          🔑 API Key
        </button>
      )}
    </>
  );
}

// Export helper function to get API key
export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}
