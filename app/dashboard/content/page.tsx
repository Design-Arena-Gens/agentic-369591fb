'use client';

import { useEffect, useState } from 'react';
import { Send, Edit2, Trash2, Eye, Image } from 'lucide-react';
import { GeneratedContent, Platform } from '@/lib/types';
import toast from 'react-hot-toast';

const platformColors: Record<Platform, string> = {
  facebook: 'bg-blue-600',
  twitter: 'bg-sky-500',
  instagram: 'bg-pink-600',
  youtube: 'bg-red-600',
  pinterest: 'bg-red-500',
  threads: 'bg-black',
  linkedin: 'bg-blue-700',
  tiktok: 'bg-black',
};

export default function ContentPage() {
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  const approveContent = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });
      setContents(contents.map((c) => (c.id === id ? { ...c, approved: true } : c)));
      toast.success('Content approved!');
    } catch (error) {
      toast.error('Failed to approve content');
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, { method: 'DELETE' });
      setContents(contents.filter((c) => c.id !== id));
      toast.success('Content deleted!');
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const postContent = async (id: string) => {
    toast.loading('Posting...');

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'post' }),
      });

      const data = await response.json();
      if (data.success) {
        setContents(
          contents.map((c) =>
            c.id === id ? { ...c, posted: true, postedAt: new Date().toISOString() } : c
          )
        );
        toast.dismiss();
        toast.success('Posted successfully!');
      } else {
        toast.dismiss();
        toast.error('Failed to post');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to post');
    }
  };

  const openEditModal = (content: GeneratedContent) => {
    setSelectedContent(content);
    setEditText(content.text);
  };

  const saveEdit = async () => {
    if (!selectedContent) return;

    try {
      await fetch(`/api/content/${selectedContent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      });
      setContents(
        contents.map((c) => (c.id === selectedContent.id ? { ...c, text: editText } : c))
      );
      setSelectedContent(null);
      toast.success('Content updated!');
    } catch (error) {
      toast.error('Failed to update content');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generated Content</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review and manage AI-generated posts
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contents.length === 0 ? (
          <div className="col-span-2 card text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No content generated yet. Go to Trends and generate content from trending topics.
            </p>
          </div>
        ) : (
          contents.map((content) => (
            <div key={content.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`${
                      platformColors[content.platform]
                    } text-white px-3 py-1 rounded-full text-xs font-medium capitalize`}
                  >
                    {content.platform}
                  </span>
                  {content.approved && <span className="badge badge-green">Approved</span>}
                  {content.posted && <span className="badge badge-blue">Posted</span>}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>

              {content.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={content.imageUrl}
                    alt="Content"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                {content.text}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {content.hashtags.slice(0, 5).map((tag, idx) => (
                  <span key={idx} className="text-sm text-primary-600 dark:text-primary-400">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                {!content.posted && (
                  <>
                    <button
                      onClick={() => openEditModal(content)}
                      className="btn btn-secondary flex items-center gap-2 flex-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => postContent(content.id)}
                      className="btn btn-primary flex items-center gap-2 flex-1"
                    >
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteContent(content.id)}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {content.posted && content.postedAt && (
                <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                  Posted on {new Date(content.postedAt).toLocaleString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Content
            </h2>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="input min-h-[200px] mb-4"
              placeholder="Edit your post..."
            />
            <div className="flex gap-3">
              <button onClick={saveEdit} className="btn btn-primary flex-1">
                Save Changes
              </button>
              <button
                onClick={() => setSelectedContent(null)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
