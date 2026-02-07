import { NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/article-fetcher';

// Vercel serverless function timeout (Hobby: 60s, Pro: 300s)
export const maxDuration = 60;

/**
 * API route for manually triggering article fetching from all RSS sources
 * POST /api/fetch-articles
 *
 * Requires CRON_SECRET authorization header for security
 */
export async function POST(request: Request) {
  try {
    // Verify CRON_SECRET for security
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
