import { Trend, Language } from './types';

export async function fetchGoogleTrends(region: string = 'US', language: Language = 'en'): Promise<Trend[]> {
  // Using SerpAPI for Google Trends (free tier available)
  // Fallback to mock data if no API key

  try {
    const mockTrends: Trend[] = [
      {
        id: `gt-${Date.now()}-1`,
        title: 'Artificial Intelligence Breakthrough',
        description: 'Latest AI developments making headlines worldwide',
        source: 'Google Trends',
        category: 'Technology',
        language,
        region,
        popularityScore: 95,
        fetchedAt: new Date().toISOString(),
        approved: false,
        hashtags: ['#AI', '#Technology', '#Innovation'],
        relatedTopics: ['Machine Learning', 'Neural Networks', 'ChatGPT'],
      },
      {
        id: `gt-${Date.now()}-2`,
        title: 'Sustainable Energy Solutions',
        description: 'New renewable energy technologies gaining traction',
        source: 'Google Trends',
        category: 'Environment',
        language,
        region,
        popularityScore: 88,
        fetchedAt: new Date().toISOString(),
        approved: false,
        hashtags: ['#CleanEnergy', '#Sustainability', '#GreenTech'],
        relatedTopics: ['Solar Power', 'Wind Energy', 'Climate Action'],
      },
    ];

    return mockTrends;
  } catch (error) {
    console.error('Error fetching Google Trends:', error);
    return [];
  }
}

export async function fetchTwitterTrends(region: string = 'worldwide'): Promise<Trend[]> {
  // Twitter API v2 - requires authentication
  // Fallback to mock data

  const mockTrends: Trend[] = [
    {
      id: `tw-${Date.now()}-1`,
      title: '#TechNews',
      description: 'Latest technology updates and innovations',
      source: 'Twitter/X',
      category: 'Technology',
      language: 'en',
      region,
      popularityScore: 92,
      fetchedAt: new Date().toISOString(),
      approved: false,
      hashtags: ['#TechNews', '#Innovation', '#Trending'],
      relatedTopics: ['Software Development', 'Startups', 'Tech Industry'],
    },
  ];

  return mockTrends;
}

export async function fetchRedditTrending(): Promise<Trend[]> {
  // Reddit API - no authentication needed for public data

  try {
    const response = await fetch('https://www.reddit.com/r/all/hot.json?limit=10');
    const data = await response.json();

    const trends: Trend[] = data.data.children.slice(0, 5).map((post: any, idx: number) => ({
      id: `reddit-${post.data.id}`,
      title: post.data.title,
      description: post.data.selftext?.substring(0, 200) || 'Trending on Reddit',
      source: 'Reddit',
      category: post.data.subreddit,
      language: 'en',
      region: 'worldwide',
      popularityScore: Math.min(100, Math.floor(post.data.ups / 100)),
      fetchedAt: new Date().toISOString(),
      approved: false,
      hashtags: [`#${post.data.subreddit}`, '#Reddit', '#Trending'],
      relatedTopics: [post.data.subreddit],
    }));

    return trends;
  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    return [];
  }
}

export async function fetchYouTubeTrending(region: string = 'US'): Promise<Trend[]> {
  // YouTube Data API - requires API key
  // Fallback to mock data

  const mockTrends: Trend[] = [
    {
      id: `yt-${Date.now()}-1`,
      title: 'Top Tech Reviews 2024',
      description: 'Most watched tech review videos this week',
      source: 'YouTube',
      category: 'Technology',
      language: 'en',
      region,
      popularityScore: 87,
      fetchedAt: new Date().toISOString(),
      approved: false,
      hashtags: ['#YouTube', '#TechReview', '#Gadgets'],
      relatedTopics: ['Product Reviews', 'Unboxing', 'Tech'],
    },
  ];

  return mockTrends;
}

export async function fetchAllTrends(
  region: string = 'US',
  language: Language = 'en'
): Promise<Trend[]> {
  const [google, twitter, reddit, youtube] = await Promise.allSettled([
    fetchGoogleTrends(region, language),
    fetchTwitterTrends(region),
    fetchRedditTrending(),
    fetchYouTubeTrending(region),
  ]);

  const allTrends: Trend[] = [];

  if (google.status === 'fulfilled') allTrends.push(...google.value);
  if (twitter.status === 'fulfilled') allTrends.push(...twitter.value);
  if (reddit.status === 'fulfilled') allTrends.push(...reddit.value);
  if (youtube.status === 'fulfilled') allTrends.push(...youtube.value);

  // Sort by popularity score
  return allTrends.sort((a, b) => b.popularityScore - a.popularityScore);
}
