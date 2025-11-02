'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, FileText, Send, Activity } from 'lucide-react';
import { Analytics } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const chartData = analytics
    ? Object.entries(analytics.postsPerPlatform).map(([platform, count]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        posts: count,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview of your social media automation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Trends Tracked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.trendsTracked || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Content Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.contentGenerated || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalPosts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Posts by Platform</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/trends"
            className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Discover Trends</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Find trending topics</p>
          </Link>

          <Link
            href="/dashboard/content"
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <FileText className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">View Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage generated posts</p>
          </Link>

          <Link
            href="/dashboard/settings"
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configure automation</p>
          </Link>
        </div>
      </div>

      {/* Last Posted */}
      {analytics?.lastPostedAt && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Last Activity</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Last post: {new Date(analytics.lastPostedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
