'use client';

import { useEffect, useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { ContentSettings, Platform, Tone } from '@/lib/types';
import toast from 'react-hot-toast';

const platforms: Platform[] = [
  'facebook',
  'instagram',
  'twitter',
  'youtube',
  'pinterest',
  'threads',
  'linkedin',
  'tiktok',
];

const tones: Tone[] = [
  'funny',
  'professional',
  'informative',
  'casual',
  'motivational',
  'educational',
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<ContentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const togglePlatform = (platform: Platform) => {
    if (!settings) return;

    const platforms = settings.platforms.includes(platform)
      ? settings.platforms.filter((p) => p !== platform)
      : [...settings.platforms, platform];

    setSettings({ ...settings, platforms });
  };

  if (loading || !settings) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure your automation preferences
          </p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* General Settings */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">General</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Tone
            </label>
            <select
              value={settings.defaultTone}
              onChange={(e) =>
                setSettings({ ...settings, defaultTone: e.target.value as Tone })
              }
              className="input"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Language
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) =>
                setSettings({ ...settings, defaultLanguage: e.target.value as any })
              }
              className="input"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoPost"
              checked={settings.autoPost}
              onChange={(e) => setSettings({ ...settings, autoPost: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="autoPost" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Enable Auto-posting (automatically post approved content)
            </label>
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Active Platforms
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platforms.map((platform) => (
            <label
              key={platform}
              className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                settings.platforms.includes(platform)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={settings.platforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
                className="sr-only"
              />
              <span className="font-medium capitalize text-gray-900 dark:text-white">
                {platform}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Content Filters */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Content Filters
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Popularity Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.contentFilters.minPopularityScore}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contentFilters: {
                    ...settings.contentFilters,
                    minPopularityScore: parseInt(e.target.value),
                  },
                })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exclude Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={settings.contentFilters.excludeKeywords.join(', ')}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contentFilters: {
                    ...settings.contentFilters,
                    excludeKeywords: e.target.value.split(',').map((k) => k.trim()),
                  },
                })
              }
              className="input"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>

      {/* Posting Schedule */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Posting Schedule
        </h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="scheduleEnabled"
              checked={settings.postingSchedule.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  postingSchedule: {
                    ...settings.postingSchedule,
                    enabled: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="scheduleEnabled"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Enable scheduled posting
            </label>
          </div>

          {settings.postingSchedule.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency
              </label>
              <select
                value={settings.postingSchedule.frequency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    postingSchedule: {
                      ...settings.postingSchedule,
                      frequency: e.target.value as any,
                    },
                  })
                }
                className="input"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* API Configuration Notice */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              API Configuration
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              To enable real posting to social media platforms, configure your API keys in the{' '}
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">.env.local</code>{' '}
              file. See{' '}
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                .env.local.example
              </code>{' '}
              for required keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
