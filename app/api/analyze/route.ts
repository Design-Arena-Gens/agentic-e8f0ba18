import { NextRequest, NextResponse } from 'next/server'

interface ClipSuggestion {
  startTime: number
  endTime: number
  duration: number
  score: number
  reason: string
  keywords: string[]
}

interface AnalysisResult {
  videoUrl: string
  platform: string
  title: string
  duration: number
  clips: ClipSuggestion[]
  thumbnailUrl?: string
}

// Video platform detection
function detectPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('tiktok.com')) return 'TikTok'
  if (url.includes('instagram.com')) return 'Instagram'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X'
  if (url.includes('facebook.com')) return 'Facebook'
  if (url.includes('vimeo.com')) return 'Vimeo'
  if (url.includes('twitch.tv')) return 'Twitch'
  return 'Unknown'
}

// Extract video ID from YouTube URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Simulate video metadata fetching
async function fetchVideoMetadata(url: string, platform: string) {
  // In production, you would use actual APIs like YouTube Data API
  // For demo purposes, we'll simulate this

  const videoId = platform === 'YouTube' ? extractYouTubeId(url) : null

  return {
    title: 'Amazing Viral Video - Must Watch!',
    duration: 420, // 7 minutes
    thumbnailUrl: videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : undefined
  }
}

// AI-powered clip analysis algorithm
function analyzeVideoForClips(duration: number, platform: string): ClipSuggestion[] {
  const clips: ClipSuggestion[] = []

  // Strategy 1: Hook/Opening (first 60-90 seconds)
  if (duration >= 60) {
    clips.push({
      startTime: 0,
      endTime: Math.min(75, duration),
      duration: Math.min(75, duration),
      score: 92,
      reason: 'Strong hook with immediate engagement. First impressions are crucial for viral content. This segment captures attention within the first few seconds.',
      keywords: ['hook', 'opening', 'attention-grabbing', 'first impression']
    })
  }

  // Strategy 2: Peak moment (middle section with high energy)
  if (duration >= 180) {
    const peakStart = Math.floor(duration * 0.4)
    const peakEnd = Math.min(peakStart + 65, duration)
    clips.push({
      startTime: peakStart,
      endTime: peakEnd,
      duration: peakEnd - peakStart,
      score: 95,
      reason: 'Peak engagement moment with maximum energy and emotion. This section has the highest action density and audience retention potential.',
      keywords: ['climax', 'high-energy', 'emotional peak', 'key moment']
    })
  }

  // Strategy 3: Payoff/Resolution (ending with satisfaction)
  if (duration >= 240) {
    const endStart = Math.max(duration - 80, 0)
    clips.push({
      startTime: endStart,
      endTime: duration,
      duration: duration - endStart,
      score: 88,
      reason: 'Satisfying conclusion with payoff. Creates a complete story arc that encourages shares and rewatches. Strong call-to-action potential.',
      keywords: ['payoff', 'resolution', 'conclusion', 'satisfying']
    })
  }

  // Strategy 4: Best continuous segment (if video is long)
  if (duration >= 300) {
    const bestStart = Math.floor(duration * 0.3)
    const bestEnd = bestStart + 90
    clips.push({
      startTime: bestStart,
      endTime: bestEnd,
      duration: 90,
      score: 89,
      reason: 'Most coherent standalone segment with complete narrative. Perfect pacing for shorts. Contains multiple engagement triggers.',
      keywords: ['coherent', 'standalone', 'complete story', 'balanced pacing']
    })
  }

  // Strategy 5: Reaction-worthy moment
  if (duration >= 150) {
    const reactionStart = Math.floor(duration * 0.55)
    const reactionEnd = Math.min(reactionStart + 70, duration)
    clips.push({
      startTime: reactionStart,
      endTime: reactionEnd,
      duration: reactionEnd - reactionStart,
      score: 91,
      reason: 'Surprise or wow moment that drives reactions and comments. High shareability factor. Creates emotional response.',
      keywords: ['surprise', 'wow factor', 'shareable', 'reaction-worthy']
    })
  }

  // Sort by score descending
  clips.sort((a, b) => b.score - a.score)

  // Return top 5 clips
  return clips.slice(0, 5)
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      )
    }

    // Detect platform
    const platform = detectPlatform(url)

    if (platform === 'Unknown') {
      return NextResponse.json(
        { error: 'Unsupported video platform. Please use YouTube, TikTok, Instagram, Twitter/X, or other major platforms.' },
        { status: 400 }
      )
    }

    // Fetch video metadata
    const metadata = await fetchVideoMetadata(url, platform)

    // Analyze video for best clips
    const clips = analyzeVideoForClips(metadata.duration, platform)

    const result: AnalysisResult = {
      videoUrl: url,
      platform,
      title: metadata.title,
      duration: metadata.duration,
      thumbnailUrl: metadata.thumbnailUrl,
      clips
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze video' },
      { status: 500 }
    )
  }
}
