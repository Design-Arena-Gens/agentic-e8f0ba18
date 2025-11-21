'use client'

import { useState } from 'react'
import { Video, Scissors, TrendingUp, Clock, Download, Loader2 } from 'lucide-react'

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

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a video URL')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze video')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold text-white">Viral Video Clipper</h1>
          </div>
          <p className="text-xl text-gray-300">
            AI-powered agent that finds the most viral-worthy moments in your videos
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <label className="block text-white text-lg font-semibold mb-3">
            Enter Video URL
          </label>
          <p className="text-gray-300 text-sm mb-4">
            Supports YouTube, TikTok, Instagram, Twitter/X, and more
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-6 py-4 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5" />
                  Find Viral Clips
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-4 text-red-400 bg-red-900/30 px-4 py-3 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Video Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-6">
                {result.thumbnailUrl && (
                  <img
                    src={result.thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-48 h-27 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-sm font-semibold mb-2">
                    {result.platform}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{result.title}</h2>
                  <div className="flex items-center gap-4 text-gray-300">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTime(result.duration)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Scissors className="w-4 h-4" />
                      {result.clips.length} clips found
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clip Suggestions */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Viral Clip Suggestions
              </h3>
              {result.clips.map((clip, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">
                          {formatTime(clip.startTime)} → {formatTime(clip.endTime)}
                        </div>
                        <div className="text-gray-300 text-sm">
                          {clip.duration} seconds
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {clip.score}%
                      </div>
                      <div className="text-gray-400 text-sm">Viral Score</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-300">{clip.reason}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {clip.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Generate This Clip
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {!result && !loading && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Analysis</h3>
              <p className="text-gray-300">
                Advanced algorithms analyze engagement patterns, pacing, and content to identify viral moments
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-pink-500/30 rounded-lg flex items-center justify-center mb-4">
                <Scissors className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Clipping</h3>
              <p className="text-gray-300">
                Automatically finds optimal 60+ second segments that tell a complete story
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Platform</h3>
              <p className="text-gray-300">
                Works with YouTube, TikTok, Instagram, Twitter, and other major video platforms
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
