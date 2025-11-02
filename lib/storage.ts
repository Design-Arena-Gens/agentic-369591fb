// Simple in-memory storage with persistence simulation
// For production, replace with a real database

import { Trend, GeneratedContent, ContentSettings, ApiConfig, Platform } from './types';

class Storage {
  private trends: Map<string, Trend> = new Map();
  private contents: Map<string, GeneratedContent> = new Map();
  private settings: ContentSettings = {
    defaultTone: 'informative',
    defaultLanguage: 'en',
    autoPost: false,
    platforms: ['twitter', 'facebook', 'instagram'],
    postingSchedule: {
      enabled: false,
      frequency: 'daily',
    },
    contentFilters: {
      minPopularityScore: 50,
      categories: [],
      excludeKeywords: [],
    },
  };
  private apiConfigs: Map<Platform, ApiConfig> = new Map();

  // Trends
  getAllTrends(): Trend[] {
    return Array.from(this.trends.values()).sort(
      (a, b) => new Date(b.fetchedAt).getTime() - new Date(a.fetchedAt).getTime()
    );
  }

  getTrend(id: string): Trend | undefined {
    return this.trends.get(id);
  }

  saveTrend(trend: Trend): void {
    this.trends.set(trend.id, trend);
  }

  updateTrend(id: string, updates: Partial<Trend>): void {
    const trend = this.trends.get(id);
    if (trend) {
      this.trends.set(id, { ...trend, ...updates });
    }
  }

  deleteTrend(id: string): void {
    this.trends.delete(id);
  }

  // Content
  getAllContent(): GeneratedContent[] {
    return Array.from(this.contents.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getContent(id: string): GeneratedContent | undefined {
    return this.contents.get(id);
  }

  saveContent(content: GeneratedContent): void {
    this.contents.set(content.id, content);
  }

  updateContent(id: string, updates: Partial<GeneratedContent>): void {
    const content = this.contents.get(id);
    if (content) {
      this.contents.set(id, { ...content, ...updates });
    }
  }

  deleteContent(id: string): void {
    this.contents.delete(id);
  }

  // Settings
  getSettings(): ContentSettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<ContentSettings>): void {
    this.settings = { ...this.settings, ...updates };
  }

  // API Configs
  getApiConfig(platform: Platform): ApiConfig | undefined {
    return this.apiConfigs.get(platform);
  }

  getAllApiConfigs(): ApiConfig[] {
    return Array.from(this.apiConfigs.values());
  }

  saveApiConfig(config: ApiConfig): void {
    this.apiConfigs.set(config.platform, config);
  }

  // Analytics
  getAnalytics() {
    const contents = this.getAllContent();
    const postedContents = contents.filter((c) => c.posted);

    const postsPerPlatform: Record<string, number> = {};
    postedContents.forEach((content) => {
      postsPerPlatform[content.platform] = (postsPerPlatform[content.platform] || 0) + 1;
    });

    const lastPosted = postedContents.sort(
      (a, b) => new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime()
    )[0];

    return {
      totalPosts: postedContents.length,
      postsPerPlatform,
      engagementRate: 0, // Mock data
      trendsTracked: this.trends.size,
      contentGenerated: contents.length,
      lastPostedAt: lastPosted?.postedAt,
    };
  }

  // Clear all data
  clearAll(): void {
    this.trends.clear();
    this.contents.clear();
  }
}

export const storage = new Storage();
