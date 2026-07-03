import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const parsedPage = pageParam === null ? 1 : Number(pageParam);
    const parsedLimit = limitParam === null ? 100 : Number(limitParam);
    const paginationErrors: string[] = [];

    if (!Number.isFinite(parsedPage) || !Number.isInteger(parsedPage) || parsedPage <= 0) {
      paginationErrors.push('page must be a positive integer');
    }

    if (!Number.isFinite(parsedLimit) || !Number.isInteger(parsedLimit) || parsedLimit <= 0) {
      paginationErrors.push('limit must be a positive integer');
    }

    if (paginationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters', details: paginationErrors },
        { status: 400 }
      );
    }

    const page = parsedPage;
    const limit = Math.min(parsedLimit, 200); // Max 200 per request
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        include: {
          source: true,
          categories: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.article.count(),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800', // 15 min cache
      },
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
