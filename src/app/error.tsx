'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md">
        <h2 className="text-3xl font-black text-black mb-4">⚠️ Something went wrong!</h2>
        <p className="text-black font-bold mb-6">{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="w-full px-6 py-3 bg-cyan-400 border-4 border-black font-black text-black uppercase hover:bg-yellow-400 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
