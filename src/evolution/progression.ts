/**
 * Progression System - Infinite levels with no caps
 * Handles XP calculations, level curves, and progression milestones
 */

export interface LevelInfo {
  level: number
  currentXP: number
  xpForNextLevel: number
  xpProgress: number // 0-100 percentage
  totalXPEarned: number
}

export interface XPReward {
  base: number
  multiplier: number
  bonus: number
  total: number
  reason: string
}

/**
 * Progression System - Infinite leveling with exponential curves
 */
export class ProgressionSystem {
  private baseXP: number
  private exponent: number

  constructor(options?: { baseXP?: number; exponent?: number }) {
    // Level N requires (N^exponent) * baseXP XP
    this.baseXP = options?.baseXP || 50
    this.exponent = options?.exponent || 2
  }

  /**
   * Calculate level from total XP (no cap, always calculable)
   */
  calculateLevelFromXP(totalXP: number): number {
    // Level = floor(root(xp / baseXP, exponent))
    // For exponent=2: Level = floor(sqrt(xp / 50))
    if (totalXP <= 0) return 1
    const level = Math.floor(Math.pow(totalXP / this.baseXP, 1 / this.exponent))
    return Math.max(1, level)
  }

  /**
   * Calculate XP needed for a specific level
   */
  getXPForLevel(level: number): number {
    // Level 1: 50 XP
    // Level 10: 5,000 XP
    // Level 100: 500,000 XP
    // Level 1000: 50,000,000 XP
    return Math.pow(level, this.exponent) * this.baseXP
  }

  /**
   * Calculate XP needed for next level from current level
   */
  getXPForNextLevel(currentLevel: number): number {
    return this.getXPForLevel(currentLevel + 1)
  }

  /**
   * Get detailed level info
   */
  getLevelInfo(currentXP: number, totalXPEarned: number): LevelInfo {
    const level = this.calculateLevelFromXP(totalXPEarned)
    const xpForCurrentLevel = this.getXPForLevel(level)
    const xpForNextLevel = this.getXPForLevel(level + 1)
    const xpIntoLevel = totalXPEarned - xpForCurrentLevel
    const xpNeededForNext = xpForNextLevel - xpForCurrentLevel
    const xpProgress = Math.min(100, (xpIntoLevel / xpNeededForNext) * 100)

    return {
      level,
      currentXP,
      xpForNextLevel: xpNeededForNext,
      xpProgress,
      totalXPEarned
    }
  }

  /**
   * Calculate XP reward for an action
   */
  calculateXPReward(params: {
    action: 'interaction' | 'discovery' | 'vote' | 'social' | 'streak' | 'achievement'
    intensity?: number // 0-1, how intense/meaningful the action was
    streak?: number // Current streak multiplier
    rarityBonus?: number // Bonus for rare discoveries
  }): XPReward {
    const { action, intensity = 0.5, streak = 1, rarityBonus = 0 } = params

    // Base XP by action type
    const baseXP: Record<string, number> = {
      interaction: 10,
      discovery: 100,
      vote: 5,
      social: 25,
      streak: 50,
      achievement: 0 // Achievements have their own XP
    }

    const base = baseXP[action] || 10
    const multiplier = 1 + (intensity * 0.5) + (streak > 1 ? (streak - 1) * 0.1 : 0)
    const bonus = rarityBonus

    return {
      base,
      multiplier: Math.round(multiplier * 100) / 100,
      bonus,
      total: Math.floor(base * multiplier + bonus),
      reason: `${action}${streak > 1 ? ` (${streak}x streak)` : ''}`
    }
  }

  /**
   * Get level title based on level ranges
   */
  getLevelTitle(level: number): string {
    if (level < 5) return 'Novice'
    if (level < 10) return 'Apprentice'
    if (level < 25) return 'Adept'
    if (level < 50) return 'Expert'
    if (level < 100) return 'Master'
    if (level < 250) return 'Grandmaster'
    if (level < 500) return 'Legend'
    if (level < 1000) return 'Mythic'
    if (level < 5000) return 'Transcendent'
    if (level < 10000) return 'Ascended'
    return 'Infinite'
  }

  /**
   * Get visual level indicator
   */
  getLevelIndicator(level: number): string {
    if (level < 10) return '.'
    if (level < 50) return '..'
    if (level < 100) return '...'
    if (level < 500) return '*'
    if (level < 1000) return '**'
    if (level < 5000) return '***'
    return '***+'
  }

  /**
   * Format level for display
   */
  formatLevel(level: number): string {
    return `Lv.${level.toLocaleString()}`
  }

  /**
   * Format XP for display
   */
  formatXP(xp: number): string {
    if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`
    return xp.toLocaleString()
  }

  /**
   * Calculate time to reach target level at current rate
   */
  estimateTimeToLevel(
    currentTotalXP: number,
    targetLevel: number,
    xpPerDay: number
  ): { days: number; display: string } {
    const targetXP = this.getXPForLevel(targetLevel)
    const xpNeeded = targetXP - currentTotalXP

    if (xpNeeded <= 0) return { days: 0, display: 'Already reached!' }
    if (xpPerDay <= 0) return { days: Infinity, display: 'N/A' }

    const days = Math.ceil(xpNeeded / xpPerDay)

    if (days > 365) {
      const years = Math.floor(days / 365)
      return { days, display: `~${years} year${years > 1 ? 's' : ''}` }
    }
    if (days > 30) {
      const months = Math.floor(days / 30)
      return { days, display: `~${months} month${months > 1 ? 's' : ''}` }
    }
    return { days, display: `~${days} day${days > 1 ? 's' : ''}` }
  }
}

// Default singleton instance
export const progression = new ProgressionSystem()
