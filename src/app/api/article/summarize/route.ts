import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { title, url, summary } = await request.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    const prompt = `You are an AI news analyst. Analyze this AI news article and provide a concise summary and key insights.

Article Title: ${title}
Article Summary: ${summary || 'No summary available'}

Please provide:
1. A brief 2-3 sentence summary
2. 3-5 key insights or takeaways
3. Why this matters in the AI landscape

Format your response as JSON with the following structure:
{
  "summary": "Brief summary here",
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "significance": "Why this matters"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI news analyst. Provide concise, insightful analysis in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    });

    const analysisText = completion.choices[0].message.content;
    const analysis = analysisText ? JSON.parse(analysisText) : null;

    if (!analysis) {
      throw new Error('Failed to parse AI response');
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Article summarization error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to summarize article',
      },
      { status: 500 }
    );
  }
}
