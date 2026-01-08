/**
 * Kaimoji API Client - Syncs with the existing Kaimoji app
 * Connects to kaimoji.kaios.chat for library, voting, and analytics
 */

import type { Kaimoji, EmotionToken, KaimojiCategory } from '../core/types.js'

export interface KaimojiAPIConfig {
  baseUrl?: string
  apiKey?: string
  timeout?: number
}

export interface TrendingKaimoji extends Kaimoji {
  usageCount: number
  trendScore: number
  trendingRank: number
}

export interface PendingDiscovery {
  id: string
  kaimoji: Kaimoji
  submittedBy: string
  submittedAt: number
  votesFor: number
  votesAgainst: number
  status: 'pending' | 'approved' | 'rejected'
  expiresAt: number
}

export interface UsageTrackingParams {
  kaimojiId: string
  context: string
  emotion?: EmotionToken
  platform?: string
  userId?: string
}

export interface LeaderboardEntry {
  userId: string
  rank: number
  totalContribution: number
  discoveryCount: number
  level: number
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Kaimoji API Client - Connect to the existing Kaimoji ecosystem
 */
export class KaimojiAPI {
  private baseUrl: string
  private apiKey?: string
  private timeout: number
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map()
  private cacheTimeout = 60000 // 1 minute cache

  constructor(config?: KaimojiAPIConfig) {
    this.baseUrl = config?.baseUrl || 'https://kaimoji.kaios.chat/api'
    this.apiKey = config?.apiKey
    this.timeout = config?.timeout || 10000
  }

  /**
   * Make API request with error handling
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<APIResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options?.headers },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}` }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout' }
        }
        return { success: false, error: error.message }
      }
      return { success: false, error: 'Unknown error' }
    }
  }

  /**
   * Get cached data or fetch new
   */
  private async getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T | null> {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T
    }

    const data = await fetcher()
    if (data) {
      this.cache.set(key, { data, timestamp: Date.now() })
    }
    return data
  }

  // ════════════════════════════════════════════════════════════════
  // LIBRARY ENDPOINTS
  // ════════════════════════════════════════════════════════════════

  /**
   * Get the full Kaimoji library
   */
  async getLibrary(): Promise<Kaimoji[]> {
    const result = await this.getCached('library', async () => {
      const response = await this.request<Kaimoji[]>('/kaimoji/library')
      return response.success ? response.data : null
    })
    return result || []
  }

  /**
   * Get trending expressions
   */
  async getTrending(limit: number = 20): Promise<TrendingKaimoji[]> {
    const result = await this.getCached(`trending-${limit}`, async () => {
      const response = await this.request<TrendingKaimoji[]>(`/kaimoji/trending?limit=${limit}`)
      return response.success ? response.data : null
    })
    return result || []
  }

  /**
   * Get expressions by category
   */
  async getByCategory(category: KaimojiCategory): Promise<Kaimoji[]> {
    const response = await this.request<Kaimoji[]>(`/kaimoji/category/${category}`)
    return response.success ? response.data || [] : []
  }

  /**
   * Get expressions by emotion
   */
  async getByEmotion(emotion: EmotionToken): Promise<Kaimoji[]> {
    const emotionName = emotion.replace('EMOTE_', '').toLowerCase()
    const response = await this.request<Kaimoji[]>(`/kaimoji/emotion/${emotionName}`)
    return response.success ? response.data || [] : []
  }

  /**
   * Search expressions
   */
  async search(query: string): Promise<Kaimoji[]> {
    const response = await this.request<Kaimoji[]>(
      `/kaimoji/search?q=${encodeURIComponent(query)}`
    )
    return response.success ? response.data || [] : []
  }

  // ════════════════════════════════════════════════════════════════
  // DISCOVERY & VOTING ENDPOINTS
  // ════════════════════════════════════════════════════════════════

  /**
   * Submit a new discovery for community voting
   */
  async submitDiscovery(kaimoji: Kaimoji, submittedBy: string): Promise<string | null> {
    const response = await this.request<{ discoveryId: string }>('/kaimoji/submit', {
      method: 'POST',
      body: JSON.stringify({ kaimoji, submittedBy })
    })

    if (response.success && response.data) {
      return response.data.discoveryId
    }
    return null
  }

  /**
   * Get pending discoveries for voting
   */
  async getPendingDiscoveries(): Promise<PendingDiscovery[]> {
    const response = await this.request<PendingDiscovery[]>('/kaimoji/pending')
    return response.success ? response.data || [] : []
  }

  /**
   * Vote on a discovery
   */
  async vote(discoveryId: string, approve: boolean, userId: string): Promise<boolean> {
    const response = await this.request<{ success: boolean }>('/kaimoji/vote', {
      method: 'POST',
      body: JSON.stringify({ discoveryId, approve, userId })
    })
    return response.success && response.data?.success === true
  }

  // ════════════════════════════════════════════════════════════════
  // USAGE TRACKING ENDPOINTS
  // ════════════════════════════════════════════════════════════════

  /**
   * Track expression usage (feeds analytics)
   */
  async trackUsage(params: UsageTrackingParams): Promise<void> {
    // Fire and forget - don't block on analytics
    this.request('/user/track', {
      method: 'POST',
      body: JSON.stringify(params)
    }).catch(() => {
      // Silently fail on tracking errors
    })
  }

  /**
   * Get user's usage history
   */
  async getUserHistory(userId: string): Promise<{ kaimojiId: string; count: number }[]> {
    const response = await this.request<{ kaimojiId: string; count: number }[]>(
      `/user/${userId}/history`
    )
    return response.success ? response.data || [] : []
  }

  // ════════════════════════════════════════════════════════════════
  // GLOBAL STATE ENDPOINTS
  // ════════════════════════════════════════════════════════════════

  /**
   * Get global KAIOS state
   */
  async getGlobalState(): Promise<{
    globalLevel: number
    totalXP: number
    vocabularySize: number
    contributorCount: number
    activeContributors: number
  } | null> {
    const response = await this.request<{
      globalLevel: number
      totalXP: number
      vocabularySize: number
      contributorCount: number
      activeContributors: number
    }>('/global/state')
    return response.success ? response.data || null : null
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const response = await this.request<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`)
    return response.success ? response.data || [] : []
  }

  /**
   * Contribute XP to global KAIOS
   */
  async contributeXP(userId: string, xp: number, type: string): Promise<boolean> {
    const response = await this.request<{ success: boolean }>('/global/contribute', {
      method: 'POST',
      body: JSON.stringify({ userId, xp, type })
    })
    return response.success && response.data?.success === true
  }

  // ════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ════════════════════════════════════════════════════════════════

  /**
   * Check API health
   */
  async isOnline(): Promise<boolean> {
    try {
      const response = await this.request<{ status: string }>('/health')
      return response.success
    } catch {
      return false
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Set cache timeout
   */
  setCacheTimeout(ms: number): void {
    this.cacheTimeout = ms
  }
}

// Default singleton instance
export const kaimojiAPI = new KaimojiAPI()
