import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { fetchAllTrends } from '@/lib/trending';
import { Language } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    if (source === 'cached') {
      // Return cached trends from storage
      const trends = storage.getAllTrends();
      return NextResponse.json(trends);
    }

    // Return all trends (cached + new)
    const trends = storage.getAllTrends();
    return NextResponse.json(trends);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, region, language } = await request.json();

    if (action === 'fetch') {
      // Fetch new trends
      const trends = await fetchAllTrends(region || 'US', language as Language || 'en');

      // Save to storage
      trends.forEach((trend) => storage.saveTrend(trend));

      return NextResponse.json(trends);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
