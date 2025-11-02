export interface Trend {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  language: string;
  region: string;
  popularityScore: number;
  fetchedAt: string;
  approved: boolean;
  hashtags: string[];
  relatedTopics: string[];
}

export interface GeneratedContent {
  id: string;
  trendId: string;
  platform: Platform;
  text: string;
  imageUrl?: string;
  tone: Tone;
  hashtags: string[];
  createdAt: string;
  approved: boolean;
  posted: boolean;
  postedAt?: string;
  scheduledFor?: string;
}

export type Platform =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'pinterest'
  | 'threads'
  | 'linkedin'
  | 'tiktok';

export type Tone =
  | 'funny'
  | 'professional'
  | 'informative'
  | 'casual'
  | 'motivational'
  | 'educational';

export type Language = 'en' | 'ur';

export interface ContentSettings {
  defaultTone: Tone;
  defaultLanguage: Language;
  autoPost: boolean;
  platforms: Platform[];
  postingSchedule: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'custom';
    customTimes?: string[];
  };
  contentFilters: {
    minPopularityScore: number;
    categories: string[];
    excludeKeywords: string[];
  };
}

export interface Analytics {
  totalPosts: number;
  postsPerPlatform: Record<Platform, number>;
  engagementRate: number;
  trendsTracked: number;
  contentGenerated: number;
  lastPostedAt?: string;
}

export interface ApiConfig {
  platform: Platform;
  enabled: boolean;
  credentials: Record<string, string>;
  lastSync?: string;
  status: 'connected' | 'disconnected' | 'error';
}
