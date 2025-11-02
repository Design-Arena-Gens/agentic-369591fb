'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, ThumbsUp, Trash2, Sparkles } from 'lucide-react';
import { Trend, Language } from '@/lib/types';
import toast from 'react-hot-toast';

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('US');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/trends?source=cached');
      const data = await response.json();
      setTrends(data);
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    }
  };

  const fetchNewTrends = async () => {
    setLoading(true);
    toast.loading('Fetching trends...');

    try {
      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch', region, language }),
      });
      const data = await response.json();
      setTrends([...data, ...trends]);
      toast.dismiss();
      toast.success(`Fetched ${data.length} new trends!`);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to fetch trends');
    } finally {
      setLoading(false);
    }
  };

  const approveTrend = async (id: string) => {
    try {
      await fetch(`/api/trends/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });
      setTrends(trends.map((t) => (t.id === id ? { ...t, approved: true } : t)));
      toast.success('Trend approved!');
    } catch (error) {
      toast.error('Failed to approve trend');
    }
  };

  const deleteTrend = async (id: string) => {
    try {
      await fetch(`/api/trends/${id}`, { method: 'DELETE' });
      setTrends(trends.filter((t) => t.id !== id));
      toast.success('Trend deleted!');
    } catch (error) {
      toast.error('Failed to delete trend');
    }
  };

  const generateContent = async (trend: Trend) => {
    toast.loading('Generating content...');

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          trendId: trend.id,
          platforms: ['twitter', 'facebook', 'instagram'],
          tone: 'informative',
          language: trend.language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.dismiss();
        toast.success(`Generated ${data.length} posts!`);
      } else {
        toast.dismiss();
        toast.error('Failed to generate content');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate content');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Topics</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover and manage trending topics
          </p>
        </div>
        <button
          onClick={fetchNewTrends}
          disabled={loading}
          className="btn btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Fetch Trends
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Region
            </label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="input">
              <option value="US">United States</option>
              <option value="PK">Pakistan</option>
              <option value="GB">United Kingdom</option>
              <option value="IN">India</option>
              <option value="worldwide">Worldwide</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="input"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trends List */}
      <div className="space-y-4">
        {trends.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No trends found. Click "Fetch Trends" to discover trending topics.
            </p>
          </div>
        ) : (
          trends.map((trend) => (
            <div key={trend.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {trend.title}
                    </h3>
                    {trend.approved && (
                      <span className="badge badge-green">Approved</span>
                    )}
                    <span className="badge badge-blue">{trend.source}</span>
                    <span className="badge badge-yellow">{trend.category}</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-3">{trend.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {trend.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-sm text-primary-600 dark:text-primary-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Popularity: {trend.popularityScore}/100</span>
                    <span>•</span>
                    <span>
                      {new Date(trend.fetchedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!trend.approved && (
                    <button
                      onClick={() => approveTrend(trend.id)}
                      className="btn btn-success flex items-center gap-2"
                      title="Approve"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => generateContent(trend)}
                    className="btn btn-primary flex items-center gap-2"
                    title="Generate Content"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTrend(trend.id)}
                    className="btn btn-danger flex items-center gap-2"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
