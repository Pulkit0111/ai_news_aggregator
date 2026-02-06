import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API route for newsletter unsubscription
 * POST /api/newsletter/unsubscribe
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in subscription list' },
        { status: 404 }
      );
    }

    // Set active to false
    await prisma.newsletterSubscriber.update({
      where: { email: email.toLowerCase() },
      data: { active: false },
    });

    return NextResponse.json({
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);

    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}
