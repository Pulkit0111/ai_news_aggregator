export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        AI News Aggregator
      </h1>

      <p className="text-gray-600 mb-8">
        One place to stay updated with the latest in Artificial Intelligence.
      </p>

      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold">
            GPT-4.5 Released with Better Reasoning
          </h2>
          <p className="text-sm text-gray-500">
            Source: OpenAI Blog
          </p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold">
            New Open-Source LLM Beats Benchmarks
          </h2>
          <p className="text-sm text-gray-500">
            Source: Hugging Face
          </p>
        </div>
      </div>
    </main>
  );
}