'use client';

import { useState, FormEvent } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="text-center mb-6">
        <h3 className="text-4xl font-black mb-3 text-black uppercase">
          📬 Newsletter
        </h3>
        <p className="text-black font-bold text-lg">
          Get the latest AI news delivered weekly to your inbox
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          className="flex-1 px-6 py-4 border-4 border-black focus:outline-none focus:bg-white bg-yellow-100 text-black placeholder-gray-600 disabled:opacity-50 font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-8 py-4 bg-cyan-400 text-black border-4 border-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <div
          className={`mt-6 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            status === 'success'
              ? 'bg-green-300'
              : 'bg-red-300'
          }`}
        >
          <p className="text-black font-bold text-center">{message}</p>
        </div>
      )}
    </div>
  );
}
