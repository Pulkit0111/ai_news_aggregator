import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

export async function GET(request: Request) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-openai-key');

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API key is required'
        },
        { status: 401 }
      );
    }

    // Create OpenAI client with user's API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    // Get articles from the past 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const articles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: oneWeekAgo,
        },
      },
      include: {
        source: true,
        categories: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 50, // Get top 50 to analyze
    });

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        topStories: [],
        analysis: 'No articles found from the past week.',
      });
    }

    // Prepare article summaries for AI analysis
    const articleSummaries = articles.slice(0, 20).map((article, index) => ({
      id: article.id,
      number: index + 1,
      title: article.title,
      summary: article.summary?.substring(0, 200) || '',
      source: article.source.name,
      categories: article.categories.map(c => c.name).join(', '),
    }));

    const prompt = `You are an AI news analyst. Analyze these AI news articles from the past week and identify the top 5 most significant stories.

Articles:
${articleSummaries.map(a => `${a.number}. ${a.title} (${a.source})\nCategories: ${a.categories}\nSummary: ${a.summary}`).join('\n\n')}

Please provide:
1. The top 5 most important/impactful stories (by article number)
2. A brief explanation of why each is significant
3. Overall trends you notice in AI news this week

Format as JSON:
{
  "topStoryNumbers": [1, 2, 3, 4, 5],
  "explanations": {
    "1": "Why this story matters...",
    "2": "Why this story matters...",
    ...
  },
  "weeklyTrends": "Overall trends and themes..."
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI news analyst. Identify the most significant stories and trends.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 800,
    });

    const analysisText = completion.choices[0].message.content;
    const aiAnalysis = analysisText ? JSON.parse(analysisText) : null;

    if (!aiAnalysis || !aiAnalysis.topStoryNumbers) {
      throw new Error('Failed to parse AI analysis');
    }

    // Get the top stories based on AI selection
    const topStories = aiAnalysis.topStoryNumbers.map((num: number) => {
      const articleData = articleSummaries.find(a => a.number === num);
      if (!articleData) return null;

      const fullArticle = articles.find(a => a.id === articleData.id);
      return {
        ...fullArticle,
        aiExplanation: aiAnalysis.explanations[num.toString()],
      };
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      topStories,
      weeklyTrends: aiAnalysis.weeklyTrends,
      totalArticles: articles.length,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200', // 1 hour cache
      },
    });
  } catch (error) {
    console.error('Top stories error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch top stories',
      },
      { status: 500 }
    );
  }
}
