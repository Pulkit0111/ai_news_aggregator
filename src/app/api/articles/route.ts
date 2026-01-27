import { prisma } from "@/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({
    include: {
      source: true,
      categories: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(articles);
}
