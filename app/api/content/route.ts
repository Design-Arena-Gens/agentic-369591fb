import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { generateContentForTrend } from '@/lib/ai-content';
import { Platform, Tone, Language } from '@/lib/types';

export async function GET() {
  try {
    const contents = storage.getAllContent();
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, trendId, platforms, tone, language } = await request.json();

    if (action === 'generate') {
      const trend = storage.getTrend(trendId);
      if (!trend) {
        return NextResponse.json({ error: 'Trend not found' }, { status: 404 });
      }

      const contents = await generateContentForTrend(
        trend,
        platforms as Platform[],
        tone as Tone,
        language as Language
      );

      // Save generated content
      contents.forEach((content) => storage.saveContent(content));

      return NextResponse.json(contents);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
