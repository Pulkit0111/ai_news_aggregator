import { NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/article-fetcher';

/**
 * API route for manually triggering article fetching from all RSS sources
 * POST /api/fetch-articles
 */
export async function POST() {
  try {
    const result = await fetchAllSources();

    return NextResponse.json({
      success: true,
      added: result.added,
      updated: result.updated,
      errors: result.errors
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        added: 0,
        updated: 0,
        errors: [errorMsg]
      },
      { status: 500 }
    );
  }
}
