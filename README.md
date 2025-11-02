# AI Social Media Manager

Fully automated social media management system with AI-powered content generation and multi-platform posting.

## Features

- **Trending Discovery**: Fetch trending topics from Google Trends, Twitter, Reddit, YouTube
- **AI Content Generation**: Auto-generate unique posts using GPT models
- **Multi-Platform Support**: Facebook, Instagram, Twitter, YouTube, Pinterest, Threads, LinkedIn, TikTok
- **Admin Dashboard**: Full frontend and backend control
- **Manual Approval**: Review and approve content before posting
- **Customizable**: Choose tone, language, and posting schedule
- **Analytics**: Track performance across platforms

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys:
- `OPENAI_API_KEY` - For AI content generation
- Social media API keys for each platform
- `ADMIN_PASSWORD` - Dashboard access password (default: admin123)

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Login**: Use password "admin123" (or your configured password)
2. **Discover Trends**: Go to Trends page and click "Fetch Trends"
3. **Generate Content**: Click the sparkle icon on any trend
4. **Review & Post**: View generated content, edit if needed, and post

## API Keys (Free/Freemium)

- **OpenAI**: Get free trial at [openai.com](https://openai.com)
- **Unsplash**: Free tier at [unsplash.com/developers](https://unsplash.com/developers)
- **Reddit**: No auth needed for public data
- **Social Media**: Configure per platform

## Deployment

Deploy to Vercel:
```bash
vercel deploy --prod
```

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Hot Toast
- Recharts

## License

Private use only
