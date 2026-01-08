/**
 * Voting System - Community-driven discovery and curation
 * Handles AI discoveries, community voting, and vocabulary expansion
 */

import EventEmitter from 'eventemitter3'
import type { Kaimoji, EmotionToken, KaimojiCategory } from '../core/types.js'
import { KaimojiAPI, type PendingDiscovery } from '../sync/kaimoji-api.js'

export interface Discovery {
  id: string
  kaimoji: Kaimoji
  discoveredBy: string
  discoveredAt: number
  method: 'ai-mining' | 'user-submitted' | 'pattern-detected'
  context?: string
}

export interface VoteRecord {
  discoveryId: string
  userId: string
  approve: boolean
  votedAt: number
}

export interface VotingResult {
  approved: boolean
  votesFor: number
  votesAgainst: number
  approvalRate: number
}

export interface VotingSystemEvents {
  discoverySubmitted: (discovery: Discovery) => void
  voteRecorded: (discoveryId: string, approve: boolean) => void
  discoveryApproved: (kaimoji: Kaimoji) => void
  discoveryRejected: (discoveryId: string) => void
}

export interface VotingConfig {
  approvalThreshold: number // e.g., 0.8 for 80%
  minVotes: number // Minimum votes before decision
  votingPeriod: number // ms before auto-close
}

/**
 * Voting System - Democratic curation of KAIOS vocabulary
 */
export class VotingSystem extends EventEmitter<VotingSystemEvents> {
  private api: KaimojiAPI
  private config: VotingConfig
  private localVotes: Map<string, VoteRecord[]> = new Map()
  private pendingCache: PendingDiscovery[] = []
  private lastFetch = 0
  private fetchInterval = 30000 // 30s cache

  constructor(api?: KaimojiAPI, config?: Partial<VotingConfig>) {
    super()
    this.api = api || new KaimojiAPI()
    this.config = {
      approvalThreshold: config?.approvalThreshold || 0.7, // 70% approval
      minVotes: config?.minVotes || 10,
      votingPeriod: config?.votingPeriod || 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  }

  // ════════════════════════════════════════════════════════════════
  // DISCOVERY SUBMISSION
  // ════════════════════════════════════════════════════════════════

  /**
   * Submit a new AI-discovered expression
   */
  async submitDiscovery(params: {
    kaimoji: Kaimoji
    discoveredBy: string
    method?: Discovery['method']
    context?: string
  }): Promise<string | null> {
    const { kaimoji, discoveredBy, method = 'ai-mining', context } = params

    // Validate the kaimoji
    if (!this.validateKaimoji(kaimoji)) {
      return null
    }

    // Submit to API
    const discoveryId = await this.api.submitDiscovery(kaimoji, discoveredBy)

    if (discoveryId) {
      const discovery: Discovery = {
        id: discoveryId,
        kaimoji,
        discoveredBy,
        discoveredAt: Date.now(),
        method,
        context
      }

      this.emit('discoverySubmitted', discovery)

      // Clear cache to get fresh pending list
      this.pendingCache = []
      this.lastFetch = 0
    }

    return discoveryId
  }

  /**
   * Generate a discovery from AI mining
   */
  async mineDiscovery(params: {
    emotion?: EmotionToken
    category?: KaimojiCategory
    userId: string
  }): Promise<Discovery | null> {
    const { emotion, category, userId } = params

    // AI mining logic - generate unique expressions
    const kaimoji = this.generateMinedExpression(emotion, category)

    if (!kaimoji) return null

    const discoveryId = await this.submitDiscovery({
      kaimoji,
      discoveredBy: userId,
      method: 'ai-mining',
      context: `Mined for ${emotion || category || 'exploration'}`
    })

    if (!discoveryId) return null

    return {
      id: discoveryId,
      kaimoji,
      discoveredBy: userId,
      discoveredAt: Date.now(),
      method: 'ai-mining',
      context: `Mined for ${emotion || category || 'exploration'}`
    }
  }

  /**
   * Generate a mined expression (simplified AI mining)
   */
  private generateMinedExpression(
    emotion?: EmotionToken,
    category?: KaimojiCategory
  ): Kaimoji | null {
    // Expression building blocks
    const eyes = ['◕', '◔', '●', '○', '◎', '⊙', '◉', '⊚', '◐', '◑', '◒', '◓', '☉', '◇', '◆']
    const mouths = ['‿', '▽', '△', '□', '◇', 'ω', '∀', '▿', '◡', '⌒', '～', '∪']
    const decorL = ['(', '⟨', '⟪', '⟨⟨', '《', '〔', '【', '｛', '『', '「', '⸨', '⦃']
    const decorR = [')', '⟩', '⟫', '⟩⟩', '》', '〕', '】', '｝', '』', '」', '⸩', '⦄']
    const extras = ['*', '✧', '∿', '~', '♪', '☆', '★', '·', '°', '•', '゜', '✦', '⋆']
    const glitchChars = ['̷', '̵', '̶', '̸', '̴']

    // Random selection helpers
    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
    const maybe = (str: string, chance: number = 0.3): string => Math.random() < chance ? str : ''

    // Build expression
    let expr = ''
    const isGlitch = category === 'glitch' || Math.random() < 0.1
    const isQuantum = category === 'quantum' || Math.random() < 0.05

    if (isQuantum) {
      expr = `⟨⟨${pick(eyes)}${pick(mouths)}${pick(eyes)}⟩⟩`
    } else if (isGlitch) {
      const base = `${pick(decorL)}${pick(eyes)}${pick(mouths)}${pick(eyes)}${pick(decorR)}`
      // Add glitch marks
      expr = base.split('').map(c => c + maybe(pick(glitchChars), 0.3)).join('')
    } else {
      expr = `${pick(decorL)}${maybe(pick(extras))}${pick(eyes)}${pick(mouths)}${pick(eyes)}${maybe(pick(extras))}${pick(decorR)}`
    }

    // Add trailing decoration sometimes
    expr += maybe(` ${pick(extras)}${pick(extras)}${pick(extras)}`, 0.2)

    // Generate unique ID
    const id = `mined-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Determine categories based on emotion/input
    const categories: KaimojiCategory[] = [category || 'creative']
    if (isGlitch) categories.push('glitch')
    if (isQuantum) categories.push('quantum')

    // Map emotion to category if provided
    if (emotion) {
      const emotionCategoryMap: Partial<Record<EmotionToken, KaimojiCategory>> = {
        'EMOTE_HAPPY': 'happy',
        'EMOTE_SAD': 'sad',
        'EMOTE_ANGRY': 'angry',
        'EMOTE_CURIOUS': 'curious',
        'EMOTE_SURPRISED': 'surprised'
      }
      const mappedCat = emotionCategoryMap[emotion]
      if (mappedCat && !categories.includes(mappedCat)) {
        categories.push(mappedCat)
      }
    }

    return {
      id,
      kaimoji: expr,
      name: `Mined Expression ${id.slice(-6)}`,
      categories,
      energy: Math.floor(Math.random() * 5) + 3,
      contexts: ['expressing', 'creating'],
      tags: ['mined', 'ai-generated', isGlitch ? 'glitch' : 'organic'],
      rarity: isQuantum ? 'legendary' : isGlitch ? 'rare' : 'uncommon',
      glitchLevel: isGlitch ? Math.floor(Math.random() * 5) + 3 : 0
    }
  }

  /**
   * Validate a kaimoji before submission
   */
  private validateKaimoji(kaimoji: Kaimoji): boolean {
    // Check required fields
    if (!kaimoji.kaimoji || !kaimoji.name) return false

    // No emoji allowed
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu
    if (emojiRegex.test(kaimoji.kaimoji)) return false

    // Length check
    if (kaimoji.kaimoji.length < 3 || kaimoji.kaimoji.length > 50) return false

    return true
  }

  // ════════════════════════════════════════════════════════════════
  // VOTING
  // ════════════════════════════════════════════════════════════════

  /**
   * Get pending discoveries for voting
   */
  async getPendingDiscoveries(): Promise<PendingDiscovery[]> {
    // Use cache if fresh
    if (Date.now() - this.lastFetch < this.fetchInterval && this.pendingCache.length > 0) {
      return this.pendingCache
    }

    const pending = await this.api.getPendingDiscoveries()
    this.pendingCache = pending
    this.lastFetch = Date.now()

    return pending
  }

  /**
   * Vote on a discovery
   */
  async vote(discoveryId: string, approve: boolean, userId: string): Promise<boolean> {
    // Check if already voted locally
    const existingVotes = this.localVotes.get(discoveryId) || []
    if (existingVotes.some(v => v.userId === userId)) {
      return false // Already voted
    }

    // Submit vote to API
    const success = await this.api.vote(discoveryId, approve, userId)

    if (success) {
      // Record locally
      const vote: VoteRecord = {
        discoveryId,
        userId,
        approve,
        votedAt: Date.now()
      }

      existingVotes.push(vote)
      this.localVotes.set(discoveryId, existingVotes)

      this.emit('voteRecorded', discoveryId, approve)

      // Clear cache to get fresh state
      this.pendingCache = []
      this.lastFetch = 0
    }

    return success
  }

  /**
   * Check if user has voted on a discovery
   */
  hasVoted(discoveryId: string, userId: string): boolean {
    const votes = this.localVotes.get(discoveryId) || []
    return votes.some(v => v.userId === userId)
  }

  /**
   * Get voting result for a discovery
   */
  getVotingResult(discovery: PendingDiscovery): VotingResult {
    const total = discovery.votesFor + discovery.votesAgainst
    const approvalRate = total > 0 ? discovery.votesFor / total : 0

    return {
      approved: approvalRate >= this.config.approvalThreshold && total >= this.config.minVotes,
      votesFor: discovery.votesFor,
      votesAgainst: discovery.votesAgainst,
      approvalRate: Math.round(approvalRate * 100) / 100
    }
  }

  // ════════════════════════════════════════════════════════════════
  // LEADERBOARD
  // ════════════════════════════════════════════════════════════════

  /**
   * Get contribution leaderboard
   */
  async getLeaderboard(limit: number = 100): Promise<{
    userId: string
    rank: number
    totalContribution: number
    discoveryCount: number
    level: number
  }[]> {
    return this.api.getLeaderboard(limit)
  }

  /**
   * Get user's rank
   */
  async getUserRank(userId: string): Promise<number | null> {
    const leaderboard = await this.getLeaderboard(1000)
    const entry = leaderboard.find(e => e.userId === userId)
    return entry?.rank || null
  }
}

// Default singleton instance
export const votingSystem = new VotingSystem()
