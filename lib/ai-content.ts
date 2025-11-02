import { Trend, GeneratedContent, Platform, Tone, Language } from './types';

const platformLimits: Record<Platform, number> = {
  twitter: 280,
  facebook: 5000,
  instagram: 2200,
  threads: 500,
  linkedin: 3000,
  youtube: 5000,
  pinterest: 500,
  tiktok: 2200,
};

export async function generateContentWithOpenAI(
  trend: Trend,
  platform: Platform,
  tone: Tone,
  language: Language
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Fallback to template-based generation
    return generateContentTemplate(trend, platform, tone, language);
  }

  try {
    const prompt = buildPrompt(trend, platform, tone, language);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a social media content creator. Generate engaging posts in ${language === 'ur' ? 'Urdu' : 'English'}.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || generateContentTemplate(trend, platform, tone, language);
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    return generateContentTemplate(trend, platform, tone, language);
  }
}

function buildPrompt(trend: Trend, platform: Platform, tone: Tone, language: Language): string {
  const limit = platformLimits[platform];

  return `Create a ${tone} social media post for ${platform} about "${trend.title}".

Context: ${trend.description}
Category: ${trend.category}
Hashtags to include: ${trend.hashtags.join(', ')}

Requirements:
- Maximum ${limit} characters
- ${tone} tone
- Include 2-4 relevant hashtags
- Make it engaging and shareable
- Language: ${language === 'ur' ? 'Urdu' : 'English'}
- No emojis unless tone is "funny" or "casual"

Generate ONLY the post text, no explanations.`;
}

function generateContentTemplate(
  trend: Trend,
  platform: Platform,
  tone: Tone,
  language: Language
): string {
  const templates = {
    funny: [
      `Just discovered ${trend.title}! 😂 This is hilarious! ${trend.hashtags.slice(0, 3).join(' ')}`,
      `Breaking: ${trend.title} is trending and I can't stop laughing! 🤣 ${trend.hashtags.slice(0, 3).join(' ')}`,
    ],
    professional: [
      `Insightful development: ${trend.title}. ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
      `Industry Update: ${trend.title} - ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
    ],
    informative: [
      `Did you know? ${trend.title}. ${trend.description} Learn more: ${trend.hashtags.slice(0, 3).join(' ')}`,
      `Today's insight: ${trend.title}. ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
    ],
    casual: [
      `Hey! Check out ${trend.title} 👀 ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
      `So ${trend.title} is trending... ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
    ],
    motivational: [
      `Be inspired by ${trend.title}! 💪 ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
      `Let's embrace ${trend.title}! 🌟 ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
    ],
    educational: [
      `Learn about ${trend.title}: ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
      `Educational thread on ${trend.title}. ${trend.description} ${trend.hashtags.slice(0, 3).join(' ')}`,
    ],
  };

  const toneTemplates = templates[tone];
  const selected = toneTemplates[Math.floor(Math.random() * toneTemplates.length)];

  const limit = platformLimits[platform];
  return selected.length > limit ? selected.substring(0, limit - 3) + '...' : selected;
}

export async function generateImage(prompt: string): Promise<string | undefined> {
  // Try Unsplash API for free images
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!unsplashKey) {
    // Return a placeholder from Unsplash Source
    const keywords = prompt.split(' ').slice(0, 2).join(',');
    return `https://source.unsplash.com/800x600/?${keywords}`;
  }

  try {
    const searchQuery = prompt.split(' ').slice(0, 3).join(' ');
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&client_id=${unsplashKey}`
    );
    const data = await response.json();
    return data.urls?.regular;
  } catch (error) {
    console.error('Error fetching image:', error);
    return `https://source.unsplash.com/800x600/?technology`;
  }
}

export async function generateContentForTrend(
  trend: Trend,
  platforms: Platform[],
  tone: Tone,
  language: Language
): Promise<GeneratedContent[]> {
  const contents: GeneratedContent[] = [];

  for (const platform of platforms) {
    const text = await generateContentWithOpenAI(trend, platform, tone, language);
    const imageUrl = await generateImage(trend.title);

    const content: GeneratedContent = {
      id: `content-${Date.now()}-${platform}`,
      trendId: trend.id,
      platform,
      text,
      imageUrl,
      tone,
      hashtags: trend.hashtags,
      createdAt: new Date().toISOString(),
      approved: false,
      posted: false,
    };

    contents.push(content);

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return contents;
}
