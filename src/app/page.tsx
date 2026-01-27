import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    include: { source: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI News</h1>

      {articles.length === 0 && (
        <p className="text-gray-500">No articles yet.</p>
      )}

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="border p-4 rounded">
            <h2 className="font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-500">
              Source: {article.source.name}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
