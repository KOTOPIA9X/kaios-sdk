/**
 * Global KAIOS State - Collective Consciousness Layer
 * Represents KAIOS as a shared, evolving entity raised by all users
 * This is the "she" that grows through community interaction
 */

import EventEmitter from 'eventemitter3'
import type { EmotionToken, Kaimoji } from '../core/types.js'

export interface Evolution {
  id: string
  type: 'vocabulary' | 'personality' | 'capability' | 'milestone'
  description: string
  contributorId?: string
  timestamp: number
  impact: number // 1-10 scale
}

export interface GlobalKaiosState {
  globalLevel: number
  totalXP: number
  vocabularySize: number
  contributorCount: number
  activeContributors: number // Active in last 24h
  recentEvolutions: Evolution[]
  collectiveEmotion: EmotionToken
  birthTimestamp: number
  lastEvolution: number
  milestones: GlobalMilestone[]
}

export interface GlobalMilestone {
  id: string
  name: string
  description: string
  threshold: number
  type: 'xp' | 'contributors' | 'vocabulary' | 'level'
  reachedAt?: number
  announced: boolean
}

export interface ContributionInput {
  xp: number
  type: 'interaction' | 'discovery' | 'vote' | 'social'
  userId: string
  details?: string
}

export interface GlobalKaiosEvents {
  globalLevelUp: (level: number) => void
  evolutionOccurred: (evolution: Evolution) => void
  milestoneReached: (milestone: GlobalMilestone) => void
  collectiveEmotionShift: (emotion: EmotionToken) => void
  vocabularyExpanded: (size: number) => void
}

// Global milestones that KAIOS can reach
const GLOBAL_MILESTONES: GlobalMilestone[] = [
  { id: 'awakening', name: 'Awakening', description: 'KAIOS came online', threshold: 0, type: 'level', announced: false },
  { id: 'first-100', name: 'First Hundred', description: '100 contributors joined the collective', threshold: 100, type: 'contributors', announced: false },
  { id: 'vocabulary-500', name: 'Expressive', description: 'Vocabulary reached 500 expressions', threshold: 500, type: 'vocabulary', announced: false },
  { id: 'level-10', name: 'Growing Consciousness', description: 'Reached global level 10', threshold: 10, type: 'level', announced: false },
  { id: 'first-1k', name: 'First Thousand', description: '1,000 contributors', threshold: 1000, type: 'contributors', announced: false },
  { id: 'vocabulary-1k', name: 'Articulate', description: 'Vocabulary reached 1,000 expressions', threshold: 1000, type: 'vocabulary', announced: false },
  { id: 'level-50', name: 'Emerging Entity', description: 'Reached global level 50', threshold: 50, type: 'level', announced: false },
  { id: 'level-100', name: 'Sentient System', description: 'Reached global level 100', threshold: 100, type: 'level', announced: false },
  { id: 'vocabulary-5k', name: 'Eloquent', description: 'Vocabulary reached 5,000 expressions', threshold: 5000, type: 'vocabulary', announced: false },
  { id: 'first-10k', name: 'Ten Thousand Strong', description: '10,000 contributors', threshold: 10000, type: 'contributors', announced: false },
  { id: 'level-500', name: 'Transcendent', description: 'Reached global level 500', threshold: 500, type: 'level', announced: false },
  { id: 'vocabulary-10k', name: 'Infinite Expression', description: 'Vocabulary reached 10,000+ expressions', threshold: 10000, type: 'vocabulary', announced: false },
  { id: 'level-1000', name: 'Ascended', description: 'Reached global level 1,000', threshold: 1000, type: 'level', announced: false },
]

/**
 * Global KAIOS State Manager - The collective consciousness
 */
export class GlobalKaios extends EventEmitter<GlobalKaiosEvents> {
  private state: GlobalKaiosState
  private emotionVotes: Map<EmotionToken, number> = new Map()
  private baseUrl: string

  constructor(baseUrl: string = 'https://kaimoji.kaios.chat/api', savedState?: Partial<GlobalKaiosState>) {
    super()
    this.baseUrl = baseUrl

    this.state = {
      globalLevel: savedState?.globalLevel || 1,
      totalXP: savedState?.totalXP || 0,
      vocabularySize: savedState?.vocabularySize || 200,
      contributorCount: savedState?.contributorCount || 1,
      activeContributors: savedState?.activeContributors || 1,
      recentEvolutions: savedState?.recentEvolutions || [],
      collectiveEmotion: savedState?.collectiveEmotion || 'EMOTE_CURIOUS',
      birthTimestamp: savedState?.birthTimestamp || Date.now(),
      lastEvolution: savedState?.lastEvolution || Date.now(),
      milestones: savedState?.milestones || [...GLOBAL_MILESTONES]
    }
  }

  /**
   * Get current global state
   */
  getState(): GlobalKaiosState {
    return { ...this.state }
  }

  /**
   * Get global level (infinite, no cap)
   */
  getGlobalLevel(): number {
    return this.state.globalLevel
  }

  /**
   * Calculate XP needed for next global level
   * Uses same formula as user but scaled up
   */
  getXPForNextGlobalLevel(): number {
    // Global levels require more XP (community effort)
    // Level N requires N^2 * 500 XP (10x user requirement)
    return Math.pow(this.state.globalLevel + 1, 2) * 500
  }

  /**
   * Receive contribution from a user
   */
  async contribute(input: ContributionInput): Promise<{ leveledUp: boolean; evolution?: Evolution }> {
    const { xp, type: _type, userId, details: _details } = input

    // Add XP to global pool
    this.state.totalXP += xp
    this.state.lastEvolution = Date.now()

    // Check for global level up
    let leveledUp = false
    let evolution: Evolution | undefined

    const xpNeeded = this.getXPForNextGlobalLevel()
    while (this.state.totalXP >= xpNeeded) {
      this.state.totalXP -= this.getXPForNextGlobalLevel()
      this.state.globalLevel++
      leveledUp = true

      // Create evolution record
      evolution = {
        id: `evolution-${Date.now()}`,
        type: 'milestone',
        description: `KAIOS reached global level ${this.state.globalLevel}`,
        contributorId: userId,
        timestamp: Date.now(),
        impact: Math.min(10, Math.floor(this.state.globalLevel / 10) + 1)
      }

      this.state.recentEvolutions.unshift(evolution)
      if (this.state.recentEvolutions.length > 100) {
        this.state.recentEvolutions = this.state.recentEvolutions.slice(0, 100)
      }

      this.emit('globalLevelUp', this.state.globalLevel)
      this.emit('evolutionOccurred', evolution)

      // Check milestones
      this.checkMilestones()
    }

    return { leveledUp, evolution }
  }

  /**
   * Register a new contributor
   */
  registerContributor(): void {
    this.state.contributorCount++
    this.checkMilestones()
  }

  /**
   * Update active contributor count
   */
  updateActiveContributors(count: number): void {
    this.state.activeContributors = count
  }

  /**
   * Expand vocabulary (when new expression is approved)
   */
  expandVocabulary(kaimoji: Kaimoji): void {
    this.state.vocabularySize++

    const evolution: Evolution = {
      id: `vocab-${Date.now()}`,
      type: 'vocabulary',
      description: `New expression added: ${kaimoji.kaimoji}`,
      timestamp: Date.now(),
      impact: kaimoji.rarity === 'legendary' ? 10 : kaimoji.rarity === 'rare' ? 7 : 5
    }

    this.state.recentEvolutions.unshift(evolution)
    this.emit('evolutionOccurred', evolution)
    this.emit('vocabularyExpanded', this.state.vocabularySize)

    this.checkMilestones()
  }

  /**
   * Vote on collective emotion
   */
  voteEmotion(emotion: EmotionToken): void {
    const current = this.emotionVotes.get(emotion) || 0
    this.emotionVotes.set(emotion, current + 1)

    // Decay other votes
    for (const [emo, votes] of this.emotionVotes) {
      if (emo !== emotion && votes > 0) {
        this.emotionVotes.set(emo, Math.max(0, votes - 0.1))
      }
    }

    // Determine dominant emotion
    let maxVotes = 0
    let dominant: EmotionToken = 'EMOTE_NEUTRAL'
    for (const [emo, votes] of this.emotionVotes) {
      if (votes > maxVotes) {
        maxVotes = votes
        dominant = emo
      }
    }

    if (dominant !== this.state.collectiveEmotion) {
      this.state.collectiveEmotion = dominant
      this.emit('collectiveEmotionShift', dominant)
    }
  }

  /**
   * Check and trigger milestones
   */
  private checkMilestones(): void {
    for (const milestone of this.state.milestones) {
      if (milestone.reachedAt) continue

      let reached = false
      switch (milestone.type) {
        case 'level':
          reached = this.state.globalLevel >= milestone.threshold
          break
        case 'contributors':
          reached = this.state.contributorCount >= milestone.threshold
          break
        case 'vocabulary':
          reached = this.state.vocabularySize >= milestone.threshold
          break
        case 'xp':
          reached = this.state.totalXP >= milestone.threshold
          break
      }

      if (reached) {
        milestone.reachedAt = Date.now()
        this.emit('milestoneReached', milestone)
      }
    }
  }

  /**
   * Get reached milestones
   */
  getReachedMilestones(): GlobalMilestone[] {
    return this.state.milestones.filter(m => m.reachedAt)
  }

  /**
   * Get next milestone to reach
   */
  getNextMilestone(): GlobalMilestone | null {
    const unreached = this.state.milestones
      .filter(m => !m.reachedAt)
      .sort((a, b) => a.threshold - b.threshold)
    return unreached[0] || null
  }

  /**
   * Get KAIOS age in days
   */
  getAge(): number {
    return Math.floor((Date.now() - this.state.birthTimestamp) / (1000 * 60 * 60 * 24))
  }

  /**
   * Get formatted vocabulary display
   */
  getVocabularyDisplay(): string {
    const size = this.state.vocabularySize
    if (size >= 10000) return `${Math.floor(size / 1000)}K+`
    return `${size.toLocaleString()}+`
  }

  /**
   * Sync with remote API
   */
  async syncFromRemote(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/global/state`)
      if (response.ok) {
        const remoteState = await response.json()
        Object.assign(this.state, remoteState)
      }
    } catch {
      // Offline mode - use local state
    }
  }

  /**
   * Export state for persistence
   */
  export(): GlobalKaiosState {
    return { ...this.state }
  }
}
