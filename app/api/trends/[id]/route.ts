import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    storage.updateTrend(id, updates);
    const trend = storage.getTrend(id);

    return NextResponse.json(trend);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update trend' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    storage.deleteTrend(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete trend' }, { status: 500 });
  }
}
