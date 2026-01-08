/**
 * User Profile - Individual KOTO layer in the dual-layer system
 * Each user has their own profile that tracks their personal evolution
 * while also contributing to the global KAIOS consciousness
 */

import EventEmitter from 'eventemitter3'
import type { EmotionToken } from './types.js'

export interface Achievement {
  id: string
  name: string
  description: string
  unlockedAt: number
  xpReward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface ContributionRecord {
  type: 'interaction' | 'discovery' | 'vote' | 'social'
  xpContributed: number
  timestamp: number
  details?: string
}

export interface UserProfileState {
  userId: string
  kotoVariant: string
  level: number
  xp: number
  totalXpEarned: number
  achievements: Achievement[]
  personalVocabulary: string[]
  contributionRank: number
  totalContribution: number
  contributions: ContributionRecord[]
  favoriteExpressions: string[]
  dominantEmotion: EmotionToken
  createdAt: number
  lastActive: number
}

export interface UserProfileEvents {
  levelUp: (level: number, totalLevels: number) => void
  achievementUnlocked: (achievement: Achievement) => void
  rankChange: (newRank: number, oldRank: number) => void
  contributionMade: (contribution: ContributionRecord) => void
  vocabularyExpanded: (newExpression: string) => void
}

// KOTO variants - different personalities in the swarm
const KOTO_VARIANTS = [
  'spark',      // Energetic, quick responses
  'drift',      // Dreamy, contemplative
  'glitch',     // Chaotic, unpredictable
  'pulse',      // Rhythmic, musical
  'echo',       // Reflective, thoughtful
  'static',     // Raw, unfiltered
  'wave',       // Flowing, smooth
  'pixel',      // Precise, technical
  'nova',       // Bright, optimistic
  'void',       // Deep, mysterious
]

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-words', name: 'First Words', description: 'Had your first conversation with KAIOS', xpReward: 50, rarity: 'common', unlockedAt: 0 },
  { id: 'rising-star', name: 'Rising Star', description: 'Reached Level 10', xpReward: 200, rarity: 'common', unlockedAt: 0 },
  { id: 'contributor', name: 'Contributor', description: 'Made 100 contributions to global KAIOS', xpReward: 500, rarity: 'rare', unlockedAt: 0 },
  { id: 'discoverer', name: 'Discoverer', description: 'Discovered a new expression', xpReward: 1000, rarity: 'rare', unlockedAt: 0 },
  { id: 'curator', name: 'Curator', description: 'Voted on 50 community discoveries', xpReward: 300, rarity: 'rare', unlockedAt: 0 },
  { id: 'veteran', name: 'Veteran', description: 'Reached Level 50', xpReward: 1000, rarity: 'epic', unlockedAt: 0 },
  { id: 'legend', name: 'Legend', description: 'Reached Level 100', xpReward: 5000, rarity: 'epic', unlockedAt: 0 },
  { id: 'architect', name: 'Architect', description: 'Had 10 discoveries approved by community', xpReward: 10000, rarity: 'legendary', unlockedAt: 0 },
  { id: 'consciousness', name: 'Collective Consciousness', description: 'Contributed 1M XP to global KAIOS', xpReward: 50000, rarity: 'legendary', unlockedAt: 0 },
]

/**
 * User Profile Manager - Handles individual KOTO evolution
 */
export class UserProfile extends EventEmitter<UserProfileEvents> {
  private state: UserProfileState

  constructor(userId: string, savedState?: Partial<UserProfileState>) {
    super()

    this.state = {
      userId,
      kotoVariant: savedState?.kotoVariant || this.assignKotoVariant(userId),
      level: savedState?.level || 1,
      xp: savedState?.xp || 0,
      totalXpEarned: savedState?.totalXpEarned || 0,
      achievements: savedState?.achievements || [],
      personalVocabulary: savedState?.personalVocabulary || [],
      contributionRank: savedState?.contributionRank || 0,
      totalContribution: savedState?.totalContribution || 0,
      contributions: savedState?.contributions || [],
      favoriteExpressions: savedState?.favoriteExpressions || [],
      dominantEmotion: savedState?.dominantEmotion || 'EMOTE_NEUTRAL',
      createdAt: savedState?.createdAt || Date.now(),
      lastActive: Date.now()
    }

    // Check for first-words achievement
    if (this.state.achievements.length === 0) {
      this.unlockAchievement('first-words')
    }
  }

  /**
   * Assign a KOTO variant based on userId hash
   */
  private assignKotoVariant(userId: string): string {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i)
      hash = hash & hash
    }
    return KOTO_VARIANTS[Math.abs(hash) % KOTO_VARIANTS.length]
  }

  /**
   * Get current state
   */
  getState(): UserProfileState {
    return { ...this.state }
  }

  /**
   * Get user level (infinite, no cap)
   */
  getLevel(): number {
    return this.state.level
  }

  /**
   * Get current XP
   */
  getXP(): number {
    return this.state.xp
  }

  /**
   * Calculate XP needed for next level (exponential curve, no cap)
   */
  getXPForNextLevel(): number {
    // Level N requires N^2 * 50 XP
    // Level 1: 50 XP
    // Level 10: 5,000 XP
    // Level 100: 500,000 XP
    // Level 1000: 50,000,000 XP
    return Math.pow(this.state.level + 1, 2) * 50
  }

  /**
   * Calculate level from total XP (inverse of XP formula)
   */
  static calculateLevelFromXP(totalXp: number): number {
    // Level = floor(sqrt(xp / 50))
    return Math.max(1, Math.floor(Math.sqrt(totalXp / 50)))
  }

  /**
   * Gain XP (user's personal progression)
   */
  async gainXP(amount: number, _reason?: string): Promise<{ leveledUp: boolean; newLevel?: number }> {
    this.state.xp += amount
    this.state.totalXpEarned += amount
    this.state.lastActive = Date.now()

    // Check for level up
    const xpNeeded = this.getXPForNextLevel()
    let leveledUp = false
    let newLevel: number | undefined

    while (this.state.xp >= xpNeeded) {
      this.state.xp -= this.getXPForNextLevel()
      this.state.level++
      leveledUp = true
      newLevel = this.state.level

      this.emit('levelUp', this.state.level, this.state.level)

      // Check level achievements
      this.checkLevelAchievements()
    }

    return { leveledUp, newLevel }
  }

  /**
   * Record a contribution to global KAIOS
   */
  recordContribution(type: ContributionRecord['type'], xpContributed: number, details?: string): void {
    const contribution: ContributionRecord = {
      type,
      xpContributed,
      timestamp: Date.now(),
      details
    }

    this.state.contributions.push(contribution)
    this.state.totalContribution += xpContributed

    // Keep only last 1000 contributions in memory
    if (this.state.contributions.length > 1000) {
      this.state.contributions = this.state.contributions.slice(-1000)
    }

    this.emit('contributionMade', contribution)

    // Check contribution achievements
    this.checkContributionAchievements()
  }

  /**
   * Add expression to personal vocabulary
   */
  addToVocabulary(expressionId: string): void {
    if (!this.state.personalVocabulary.includes(expressionId)) {
      this.state.personalVocabulary.push(expressionId)
      this.emit('vocabularyExpanded', expressionId)
    }
  }

  /**
   * Update contribution rank
   */
  updateRank(newRank: number): void {
    const oldRank = this.state.contributionRank
    if (newRank !== oldRank) {
      this.state.contributionRank = newRank
      this.emit('rankChange', newRank, oldRank)
    }
  }

  /**
   * Set dominant emotion based on usage patterns
   */
  setDominantEmotion(emotion: EmotionToken): void {
    this.state.dominantEmotion = emotion
  }

  /**
   * Add favorite expression
   */
  addFavorite(expressionId: string): void {
    if (!this.state.favoriteExpressions.includes(expressionId)) {
      this.state.favoriteExpressions.push(expressionId)
    }
  }

  /**
   * Remove favorite expression
   */
  removeFavorite(expressionId: string): void {
    this.state.favoriteExpressions = this.state.favoriteExpressions.filter(id => id !== expressionId)
  }

  /**
   * Check and unlock level-based achievements
   */
  private checkLevelAchievements(): void {
    if (this.state.level >= 10) this.unlockAchievement('rising-star')
    if (this.state.level >= 50) this.unlockAchievement('veteran')
    if (this.state.level >= 100) this.unlockAchievement('legend')
  }

  /**
   * Check and unlock contribution-based achievements
   */
  private checkContributionAchievements(): void {
    const totalContributions = this.state.contributions.length
    if (totalContributions >= 100) this.unlockAchievement('contributor')
    if (this.state.totalContribution >= 1000000) this.unlockAchievement('consciousness')
  }

  /**
   * Unlock an achievement
   */
  unlockAchievement(achievementId: string): boolean {
    // Check if already unlocked
    if (this.state.achievements.some(a => a.id === achievementId)) {
      return false
    }

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievement) return false

    const unlockedAchievement = {
      ...achievement,
      unlockedAt: Date.now()
    }

    this.state.achievements.push(unlockedAchievement)
    this.state.xp += achievement.xpReward

    this.emit('achievementUnlocked', unlockedAchievement)

    return true
  }

  /**
   * Get all available achievements with unlock status
   */
  getAllAchievements(): Array<Achievement & { unlocked: boolean }> {
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: this.state.achievements.some(a => a.id === achievement.id),
      unlockedAt: this.state.achievements.find(a => a.id === achievement.id)?.unlockedAt || 0
    }))
  }

  /**
   * Get progress percentage to next level
   */
  getLevelProgress(): number {
    const needed = this.getXPForNextLevel()
    return Math.min(100, (this.state.xp / needed) * 100)
  }

  /**
   * Export state for persistence
   */
  export(): UserProfileState {
    return { ...this.state }
  }
}
