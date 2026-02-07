'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './Modal';

const API_KEY_STORAGE_KEY = 'openai_api_key';

export default function ApiKeySettings() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [error, setError] = useState('');

  const handleRevoke = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setIsOpen(false);
    // Redirect to home page
    router.push('/');
  };

  const handleChangeKey = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newApiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    if (!newApiKey.startsWith('sk-')) {
      setError('Invalid API key format. OpenAI keys start with "sk-"');
      return;
    }

    // Update the API key
    localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey.trim());
    setError('');
    setNewApiKey('');
    setShowChangeForm(false);
    setIsOpen(false);

    // Reload the page to use the new key
    window.location.reload();
  };

  const getMaskedKey = () => {
    const key = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!key) return '';
    return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
  };

  return (
    <>
      {/* Floating API Key Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-purple-400 border-4 border-black font-black text-black hover:bg-yellow-300 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-40"
        title="Manage API Key"
      >
        🔑 API Key
      </button>

      {/* Settings Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setShowChangeForm(false);
          setNewApiKey('');
          setError('');
        }}
        title="🔑 API Key Settings"
      >
        <div className="space-y-6">
          {!showChangeForm ? (
            <>
              {/* Current Key Info */}
              <div className="bg-cyan-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                <h3 className="font-black text-lg mb-2 text-black uppercase text-left">Current API Key</h3>
                <p className="text-black font-mono font-bold text-sm bg-white border-2 border-black p-3 text-left">
                  {getMaskedKey()}
                </p>
              </div>

              {/* Info */}
              <div className="bg-yellow-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                <h3 className="font-black text-lg mb-2 text-black uppercase text-left">ℹ️ About Your Key</h3>
                <p className="text-black font-bold leading-relaxed text-left">
                  Your API key is stored <span className="text-purple-600">only in your browser</span> (localStorage).
                  It's never saved on our servers and is used directly with OpenAI for AI features.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowChangeForm(true)}
                  className="w-full px-6 py-4 bg-cyan-400 border-4 border-black font-black text-black uppercase text-lg hover:bg-yellow-400 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none"
                >
                  🔄 Change API Key
                </button>

                <button
                  onClick={handleRevoke}
                  className="w-full px-6 py-4 bg-red-400 border-4 border-black font-black text-black uppercase text-lg hover:bg-red-500 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none"
                >
                  🗑️ Revoke & Return Home
                </button>
              </div>

              <p className="text-xs text-gray-600 font-bold text-center">
                Revoking your API key will remove it from your browser and redirect you to the home page.
              </p>
            </>
          ) : (
            <>
              {/* Change Key Form */}
              <div className="bg-purple-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                <h3 className="font-black text-lg mb-2 text-black uppercase text-left">🔄 Change API Key</h3>
                <p className="text-black font-bold leading-relaxed text-left">
                  Enter your new OpenAI API key below. The page will reload to apply the changes.
                </p>
              </div>

              <form onSubmit={handleChangeKey} className="space-y-4">
                <div>
                  <label htmlFor="newApiKey" className="block font-black text-black mb-2 uppercase">
                    New OpenAI API Key
                  </label>
                  <input
                    type="password"
                    id="newApiKey"
                    value={newApiKey}
                    onChange={(e) => {
                      setNewApiKey(e.target.value);
                      setError('');
                    }}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:bg-yellow-50 font-bold transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-sm font-bold text-red-600">
                      ⚠️ {error}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-cyan-400 border-4 border-black font-black text-black uppercase text-lg hover:bg-yellow-400 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none"
                  >
                    💾 Save New Key
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangeForm(false);
                      setNewApiKey('');
                      setError('');
                    }}
                    className="flex-1 px-6 py-4 bg-gray-300 border-4 border-black font-black text-black uppercase text-lg hover:bg-gray-400 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
