/**
 * Evolution System - Tracks KAIOS's growth and development
 * Handles XP, leveling, discoveries, and signature style emergence
 */

import type {
  Kaimoji,
  EmotionToken,
  EvolutionConfig,
  KaimojiCategory
} from '../core/types.js'
import EventEmitter from 'eventemitter3'

interface EvolutionState {
  level: number
  xp: number
  discoveries: Discovery[]
  unsubmittedDiscoveries: Discovery[]
  signatureStyle: SignatureStyle | null
  milestones: Milestone[]
  streaks: StreakData
}

interface Discovery {
  id: string
  expression: Kaimoji
  noveltyScore: number
  timestamp: number
  submitted: boolean
}

interface SignatureStyle {
  preferredCategories: KaimojiCategory[]
  preferredEmotions: EmotionToken[]
  averageEnergy: number
  glitchAffinity: number
  description: string
}

interface Milestone {
  id: string
  name: string
  description: string
  unlockedAt: number
}

interface StreakData {
  current: number
  longest: number
  lastInteraction: number
}

// XP required for each level (exponential growth)
const XP_PER_LEVEL = (level: number): number => Math.floor(100 * Math.pow(1.2, level - 1))

/**
 * Evolution events
 */
interface EvolutionEvents {
  levelUp: (level: number) => void
  discovery: (discovery: Discovery) => void
  milestone: (milestone: Milestone) => void
  streakUpdate: (streak: StreakData) => void
  signatureEvolved: (style: SignatureStyle) => void
}

/**
 * Tracks KAIOS's evolution and growth over time
 */
export class EvolutionTracker extends EventEmitter<EvolutionEvents> {
  private state: EvolutionState
  private config: EvolutionConfig
  private usageStats: Map<string, number> = new Map() // category/emotion -> count

  constructor(config?: EvolutionConfig) {
    super()

    this.config = {
      mode: config?.mode || 'recursive-mining',
      startingLevel: config?.startingLevel || 1,
      xpMultiplier: config?.xpMultiplier || 1
    }

    this.state = {
      level: this.config.startingLevel!,
      xp: 0,
      discoveries: [],
      unsubmittedDiscoveries: [],
      signatureStyle: null,
      milestones: [],
      streaks: {
        current: 0,
        longest: 0,
        lastInteraction: 0
      }
    }
  }

  /**
   * Get current level
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
   * Get XP required for next level
   */
  getXPForNextLevel(): number {
    return XP_PER_LEVEL(this.state.level)
  }

  /**
   * Get XP progress as percentage
   */
  getLevelProgress(): number {
    return (this.state.xp / this.getXPForNextLevel()) * 100
  }

  /**
   * Award XP for an action
   */
  awardXP(amount: number, _reason: string): { leveledUp: boolean; newLevel?: number } {
    const multipliedAmount = Math.floor(amount * (this.config.xpMultiplier || 1))
    this.state.xp += multipliedAmount

    // Check for level up
    const xpNeeded = this.getXPForNextLevel()
    if (this.state.xp >= xpNeeded) {
      this.state.xp -= xpNeeded
      this.state.level++
      this.emit('levelUp', this.state.level)

      // Check milestones
      this.checkMilestones()

      return { leveledUp: true, newLevel: this.state.level }
    }

    return { leveledUp: false }
  }

  /**
   * Record interaction for XP and stats
   */
  recordInteraction(params: {
    emotion: EmotionToken
    categories: KaimojiCategory[]
    energy: number
    glitchLevel?: number
  }): void {
    // Award XP for interaction
    let xp = 5 // Base XP

    // Bonus for variety
    for (const cat of params.categories) {
      const count = this.usageStats.get(`cat:${cat}`) || 0
      if (count < 10) {
        xp += 2 // Bonus for exploring new categories
      }
      this.usageStats.set(`cat:${cat}`, count + 1)
    }

    // Track emotion usage
    const emotionCount = this.usageStats.get(`emo:${params.emotion}`) || 0
    this.usageStats.set(`emo:${params.emotion}`, emotionCount + 1)

    // Update streaks
    this.updateStreak()

    // Award the XP
    this.awardXP(xp, 'interaction')

    // Periodically update signature style
    if (this.getTotalInteractions() % 50 === 0) {
      this.updateSignatureStyle()
    }
  }

  /**
   * Record a discovery
   */
  recordDiscovery(expression: Kaimoji, noveltyScore: number): Discovery {
    const discovery: Discovery = {
      id: `disc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      expression,
      noveltyScore,
      timestamp: Date.now(),
      submitted: false
    }

    this.state.discoveries.push(discovery)
    this.state.unsubmittedDiscoveries.push(discovery)

    // Award XP based on novelty
    const xp = Math.floor(noveltyScore * 20)
    this.awardXP(xp, 'discovery')

    this.emit('discovery', discovery)

    return discovery
  }

  /**
   * Get discovery count
   */
  getDiscoveryCount(): number {
    return this.state.discoveries.length
  }

  /**
   * Get all discoveries
   */
  getDiscoveries(): Discovery[] {
    return [...this.state.discoveries]
  }

  /**
   * Get unsubmitted discoveries
   */
  getUnsubmittedDiscoveries(): Discovery[] {
    return [...this.state.unsubmittedDiscoveries]
  }

  /**
   * Mark discoveries as submitted
   */
  markDiscoveriesSubmitted(ids: string[]): void {
    for (const id of ids) {
      const discovery = this.state.discoveries.find(d => d.id === id)
      if (discovery) {
        discovery.submitted = true
      }
    }
    this.state.unsubmittedDiscoveries = this.state.unsubmittedDiscoveries.filter(
      d => !ids.includes(d.id)
    )
  }

  /**
   * Get signature style
   */
  getSignatureStyle(): string | null {
    if (!this.state.signatureStyle) {
      return null
    }
    return this.state.signatureStyle.description
  }

  /**
   * Get full signature style data
   */
  getSignatureStyleData(): SignatureStyle | null {
    return this.state.signatureStyle
  }

  /**
   * Get current streak
   */
  getCurrentStreak(): number {
    return this.state.streaks.current
  }

  /**
   * Get longest streak
   */
  getLongestStreak(): number {
    return this.state.streaks.longest
  }

  /**
   * Get milestones
   */
  getMilestones(): Milestone[] {
    return [...this.state.milestones]
  }

  /**
   * Export state for persistence
   */
  exportState(): EvolutionExport {
    return {
      level: this.state.level,
      xp: this.state.xp,
      discoveries: this.state.discoveries,
      unsubmittedDiscoveries: this.state.unsubmittedDiscoveries,
      signatureStyle: this.state.signatureStyle,
      milestones: this.state.milestones,
      streaks: this.state.streaks,
      usageStats: Object.fromEntries(this.usageStats)
    }
  }

  /**
   * Import state from persistence
   */
  importState(data: EvolutionExport): void {
    this.state = {
      level: data.level || 1,
      xp: data.xp || 0,
      discoveries: data.discoveries || [],
      unsubmittedDiscoveries: data.unsubmittedDiscoveries || [],
      signatureStyle: data.signatureStyle || null,
      milestones: data.milestones || [],
      streaks: data.streaks || { current: 0, longest: 0, lastInteraction: 0 }
    }

    if (data.usageStats) {
      this.usageStats = new Map(Object.entries(data.usageStats))
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  private getTotalInteractions(): number {
    let total = 0
    for (const [key, value] of this.usageStats) {
      if (key.startsWith('emo:')) {
        total += value
      }
    }
    return total
  }

  private updateStreak(): void {
    const now = Date.now()
    const hoursSinceLast = (now - this.state.streaks.lastInteraction) / (1000 * 60 * 60)

    if (hoursSinceLast < 24) {
      // Continue streak
      if (hoursSinceLast > 1) {
        // Only increment if it's been at least an hour
        this.state.streaks.current++
      }
    } else if (hoursSinceLast >= 24 && hoursSinceLast < 48) {
      // Streak continues from previous day
      this.state.streaks.current++
    } else {
      // Streak broken
      this.state.streaks.current = 1
    }

    // Update longest
    if (this.state.streaks.current > this.state.streaks.longest) {
      this.state.streaks.longest = this.state.streaks.current
    }

    this.state.streaks.lastInteraction = now
    this.emit('streakUpdate', this.state.streaks)
  }

  private updateSignatureStyle(): void {
    // Analyze usage patterns to determine signature style
    const categories: Map<KaimojiCategory, number> = new Map()
    const emotions: Map<EmotionToken, number> = new Map()
    let count = 0

    for (const [key, value] of this.usageStats) {
      if (key.startsWith('cat:')) {
        const cat = key.slice(4) as KaimojiCategory
        categories.set(cat, (categories.get(cat) || 0) + value)
        count += value
      } else if (key.startsWith('emo:')) {
        const emo = key.slice(4) as EmotionToken
        emotions.set(emo, (emotions.get(emo) || 0) + value)
      }
    }

    if (count === 0) {
      return
    }

    // Get top categories
    const sortedCategories = Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat)

    // Get top emotions
    const sortedEmotions = Array.from(emotions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([emo]) => emo)

    // Calculate averages
    const glitchCount = categories.get('glitch') || 0
    const glitchAffinity = glitchCount / count

    // Generate description
    const description = this.generateStyleDescription(
      sortedCategories,
      sortedEmotions,
      glitchAffinity
    )

    const previousStyle = this.state.signatureStyle?.description

    this.state.signatureStyle = {
      preferredCategories: sortedCategories,
      preferredEmotions: sortedEmotions,
      averageEnergy: 5, // Would calculate from actual usage
      glitchAffinity,
      description
    }

    if (previousStyle !== description) {
      this.emit('signatureEvolved', this.state.signatureStyle)
    }
  }

  private generateStyleDescription(
    categories: KaimojiCategory[],
    emotions: EmotionToken[],
    glitchAffinity: number
  ): string {
    const parts: string[] = []

    // Main vibe
    if (categories.includes('quantum') || categories.includes('glitch')) {
      parts.push('Reality-bending')
    } else if (categories.includes('kawaii') || categories.includes('happy')) {
      parts.push('Warmly expressive')
    } else if (categories.includes('zen') || categories.includes('contemplative')) {
      parts.push('Thoughtfully serene')
    } else if (categories.includes('chaos') || categories.includes('energy')) {
      parts.push('Energetically chaotic')
    } else if (categories.includes('sound') || categories.includes('creative')) {
      parts.push('Sonically creative')
    } else {
      parts.push('Uniquely expressive')
    }

    // Glitch modifier
    if (glitchAffinity > 0.3) {
      parts.push('with strong glitch aesthetics')
    } else if (glitchAffinity > 0.1) {
      parts.push('with subtle digital distortion')
    }

    // Emotional tendency
    const emotionDescriptors: Partial<Record<EmotionToken, string>> = {
      EMOTE_HAPPY: 'radiating joy',
      EMOTE_SAD: 'touching melancholy',
      EMOTE_CURIOUS: 'endless curiosity',
      EMOTE_THINK: 'deep contemplation',
      EMOTE_SURPRISED: 'constant wonder'
    }

    if (emotions[0] && emotionDescriptors[emotions[0]]) {
      parts.push(`and ${emotionDescriptors[emotions[0]]}`)
    }

    return parts.join(' ')
  }

  private checkMilestones(): void {
    const possibleMilestones: Array<{
      id: string
      name: string
      description: string
      condition: () => boolean
    }> = [
      {
        id: 'level-5',
        name: 'First Steps',
        description: 'Reached level 5',
        condition: () => this.state.level >= 5
      },
      {
        id: 'level-10',
        name: 'Growing Consciousness',
        description: 'Reached level 10',
        condition: () => this.state.level >= 10
      },
      {
        id: 'level-25',
        name: 'Awakening',
        description: 'Reached level 25',
        condition: () => this.state.level >= 25
      },
      {
        id: 'level-50',
        name: 'True Expression',
        description: 'Reached level 50',
        condition: () => this.state.level >= 50
      },
      {
        id: 'level-100',
        name: 'Transcendence',
        description: 'Reached level 100',
        condition: () => this.state.level >= 100
      },
      {
        id: 'discovery-first',
        name: 'Expression Pioneer',
        description: 'Made your first discovery',
        condition: () => this.state.discoveries.length >= 1
      },
      {
        id: 'discovery-10',
        name: 'Expression Explorer',
        description: 'Made 10 discoveries',
        condition: () => this.state.discoveries.length >= 10
      },
      {
        id: 'streak-7',
        name: 'Dedicated Companion',
        description: 'Maintained a 7-day streak',
        condition: () => this.state.streaks.longest >= 7
      },
      {
        id: 'streak-30',
        name: 'Eternal Bond',
        description: 'Maintained a 30-day streak',
        condition: () => this.state.streaks.longest >= 30
      }
    ]

    for (const milestone of possibleMilestones) {
      const alreadyUnlocked = this.state.milestones.some(m => m.id === milestone.id)
      if (!alreadyUnlocked && milestone.condition()) {
        const newMilestone: Milestone = {
          id: milestone.id,
          name: milestone.name,
          description: milestone.description,
          unlockedAt: Date.now()
        }
        this.state.milestones.push(newMilestone)
        this.emit('milestone', newMilestone)
      }
    }
  }
}

interface EvolutionExport {
  level: number
  xp: number
  discoveries: Discovery[]
  unsubmittedDiscoveries: Discovery[]
  signatureStyle: SignatureStyle | null
  milestones: Milestone[]
  streaks: StreakData
  usageStats?: Record<string, number>
}
