import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { postContent } from '@/lib/social-post';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    storage.updateContent(id, updates);
    const content = storage.getContent(id);

    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    storage.deleteContent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action === 'post') {
      const content = storage.getContent(id);
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }

      const success = await postContent(content);
      if (success) {
        storage.updateContent(id, {
          posted: true,
          postedAt: new Date().toISOString(),
        });
      }

      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post content' }, { status: 500 });
  }
}
