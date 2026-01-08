/**
 * Vocabulary Manager - Manages KAIOS's KAIMOJI vocabulary
 * Handles unlocking, progression, and expression selection
 */

import type {
  Kaimoji,
  KaimojiCategory,
  KaimojiContext,
  EmotionToken,
  VocabularyBreakdown,
  SoundTexture,
  SoundFrequency
} from '../../core/types.js'
import {
  KAIMOJI_LIBRARY,
  getKaimojiUnlockableAtLevel
} from '../../core/kaimoji-library.js'

interface UsageRecord {
  id: string
  count: number
  lastUsed: number
}

interface VocabularyState {
  unlockedIds: Set<string>
  usageHistory: Map<string, UsageRecord>
  favorites: Set<string>
  communityExpressions: Kaimoji[]
}

export interface VocabularyConfig {
  startingLevel?: number
  unlockAll?: boolean
}

/**
 * Manages KAIOS's expression vocabulary
 */
export class VocabularyManager {
  private state: VocabularyState
  private level: number
  private library: Map<string, Kaimoji>

  constructor(config: VocabularyConfig = {}) {
    this.level = config.startingLevel || 1
    this.library = new Map(KAIMOJI_LIBRARY.map(k => [k.id, k]))

    this.state = {
      unlockedIds: new Set(),
      usageHistory: new Map(),
      favorites: new Set(),
      communityExpressions: []
    }

    // Initialize unlocked expressions based on level
    if (config.unlockAll) {
      this.unlockAll()
    } else {
      this.unlockForLevel(this.level)
    }
  }

  /**
   * Unlock all expressions available at current level
   */
  unlockForLevel(level: number): void {
    this.level = level
    const unlockable = getKaimojiUnlockableAtLevel(level)
    for (const kaimoji of unlockable) {
      this.state.unlockedIds.add(kaimoji.id)
    }
  }

  /**
   * Unlock all expressions (for testing/development)
   */
  unlockAll(): void {
    for (const kaimoji of KAIMOJI_LIBRARY) {
      this.state.unlockedIds.add(kaimoji.id)
    }
  }

  /**
   * Unlock a specific expression
   */
  unlock(kaimoji: Kaimoji): boolean {
    if (this.state.unlockedIds.has(kaimoji.id)) {
      return false // Already unlocked
    }
    this.state.unlockedIds.add(kaimoji.id)
    return true
  }

  /**
   * Check if an expression is unlocked
   */
  isUnlocked(id: string): boolean {
    return this.state.unlockedIds.has(id)
  }

  /**
   * Get all unlocked expressions
   */
  getUnlockedExpressions(): Kaimoji[] {
    const unlocked: Kaimoji[] = []
    for (const id of this.state.unlockedIds) {
      const kaimoji = this.library.get(id)
      if (kaimoji) {
        unlocked.push(kaimoji)
      }
    }
    // Also add community expressions
    unlocked.push(...this.state.communityExpressions)
    return unlocked
  }

  /**
   * Get count of unlocked expressions
   */
  getUnlockedCount(): number {
    return this.state.unlockedIds.size + this.state.communityExpressions.length
  }

  /**
   * Get total count of expressions
   */
  getTotalCount(): number {
    return KAIMOJI_LIBRARY.length + this.state.communityExpressions.length
  }

  /**
   * Get breakdown by rarity
   */
  getRarityBreakdown(): VocabularyBreakdown {
    const breakdown: VocabularyBreakdown = {
      common: 0,
      uncommon: 0,
      rare: 0,
      legendary: 0
    }

    for (const id of this.state.unlockedIds) {
      const kaimoji = this.library.get(id)
      if (kaimoji) {
        breakdown[kaimoji.rarity]++
      }
    }

    // Count community expressions
    for (const kaimoji of this.state.communityExpressions) {
      breakdown[kaimoji.rarity]++
    }

    return breakdown
  }

  /**
   * Select expressions based on criteria
   */
  select(params: {
    emotion?: EmotionToken
    context?: KaimojiContext
    category?: KaimojiCategory
    energy?: { min?: number; max?: number }
    onlyUnlocked?: boolean
    limit?: number
    excludeRecent?: boolean
  }): Kaimoji[] {
    let candidates = params.onlyUnlocked !== false
      ? this.getUnlockedExpressions()
      : [...KAIMOJI_LIBRARY]

    // Filter by emotion
    if (params.emotion) {
      candidates = candidates.filter(k =>
        k.emotionTokens?.includes(params.emotion!)
      )
      // If no direct matches, fall back to category-based selection
      if (candidates.length === 0) {
        const emotionCategory = this.emotionToCategory(params.emotion)
        if (emotionCategory) {
          candidates = this.getUnlockedExpressions().filter(k =>
            k.categories.includes(emotionCategory)
          )
        }
      }
    }

    // Filter by context
    if (params.context) {
      const contextFiltered = candidates.filter(k =>
        k.contexts.includes(params.context!)
      )
      if (contextFiltered.length > 0) {
        candidates = contextFiltered
      }
    }

    // Filter by category
    if (params.category) {
      const categoryFiltered = candidates.filter(k =>
        k.categories.includes(params.category!)
      )
      if (categoryFiltered.length > 0) {
        candidates = categoryFiltered
      }
    }

    // Filter by energy range
    if (params.energy) {
      const { min = 0, max = 10 } = params.energy
      candidates = candidates.filter(k =>
        k.energy >= min && k.energy <= max
      )
    }

    // Exclude recently used
    if (params.excludeRecent) {
      const recentThreshold = Date.now() - 60000 // 1 minute
      candidates = candidates.filter(k => {
        const record = this.state.usageHistory.get(k.id)
        return !record || record.lastUsed < recentThreshold
      })
    }

    // Apply limit with weighted random selection
    const limit = params.limit || 3
    if (candidates.length <= limit) {
      return candidates
    }

    return this.weightedSelect(candidates, limit)
  }

  /**
   * Select expressions by sound profile (for Sound Intelligence)
   */
  selectBySoundProfile(params: {
    soundFrequency?: SoundFrequency
    texture?: SoundTexture
    energy?: number
    onlyUnlocked?: boolean
  }): Kaimoji[] {
    let candidates = params.onlyUnlocked !== false
      ? this.getUnlockedExpressions()
      : [...KAIMOJI_LIBRARY]

    if (params.soundFrequency) {
      candidates = candidates.filter(k => k.soundFrequency === params.soundFrequency)
    }

    if (params.texture) {
      candidates = candidates.filter(k =>
        k.audioCharacteristics?.texture === params.texture
      )
    }

    if (params.energy !== undefined) {
      // Find expressions within ±2 energy
      const energyMin = Math.max(1, params.energy - 2)
      const energyMax = Math.min(10, params.energy + 2)
      candidates = candidates.filter(k =>
        k.energy >= energyMin && k.energy <= energyMax
      )
    }

    return candidates
  }

  /**
   * Record usage of an expression
   */
  recordUsage(id: string): void {
    const existing = this.state.usageHistory.get(id)
    this.state.usageHistory.set(id, {
      id,
      count: (existing?.count || 0) + 1,
      lastUsed: Date.now()
    })
  }

  /**
   * Get recently used expressions
   */
  getRecentlyUsed(limit: number = 10): Kaimoji[] {
    const sorted = Array.from(this.state.usageHistory.values())
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, limit)

    return sorted
      .map(record => this.library.get(record.id))
      .filter((k): k is Kaimoji => k !== undefined)
  }

  /**
   * Get most frequently used expressions
   */
  getMostUsed(limit: number = 10): Kaimoji[] {
    const sorted = Array.from(this.state.usageHistory.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)

    return sorted
      .map(record => this.library.get(record.id))
      .filter((k): k is Kaimoji => k !== undefined)
  }

  /**
   * Add to favorites
   */
  addFavorite(id: string): boolean {
    if (this.state.favorites.has(id)) {
      return false
    }
    this.state.favorites.add(id)
    return true
  }

  /**
   * Remove from favorites
   */
  removeFavorite(id: string): boolean {
    return this.state.favorites.delete(id)
  }

  /**
   * Get favorite expressions
   */
  getFavorites(): Kaimoji[] {
    return Array.from(this.state.favorites)
      .map(id => this.library.get(id))
      .filter((k): k is Kaimoji => k !== undefined)
  }

  /**
   * Add community expressions
   */
  addCommunityExpressions(expressions: Kaimoji[]): void {
    for (const expr of expressions) {
      // Check for duplicates
      if (!this.state.communityExpressions.some(e => e.id === expr.id)) {
        this.state.communityExpressions.push(expr)
      }
    }
  }

  /**
   * Get expression by ID
   */
  getById(id: string): Kaimoji | undefined {
    return this.library.get(id) ||
      this.state.communityExpressions.find(e => e.id === id)
  }

  /**
   * Search expressions
   */
  search(query: string): Kaimoji[] {
    const lowerQuery = query.toLowerCase()
    return this.getUnlockedExpressions().filter(k =>
      k.name.toLowerCase().includes(lowerQuery) ||
      k.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
      k.kaimoji.includes(query)
    )
  }

  /**
   * Get current level
   */
  getLevel(): number {
    return this.level
  }

  /**
   * Set level and unlock new expressions
   */
  setLevel(level: number): Kaimoji[] {
    const previousUnlocked = new Set(this.state.unlockedIds)
    this.unlockForLevel(level)

    // Return newly unlocked expressions
    const newlyUnlocked: Kaimoji[] = []
    for (const id of this.state.unlockedIds) {
      if (!previousUnlocked.has(id)) {
        const kaimoji = this.library.get(id)
        if (kaimoji) {
          newlyUnlocked.push(kaimoji)
        }
      }
    }

    return newlyUnlocked
  }

  /**
   * Export state for persistence
   */
  exportState(): {
    unlockedIds: string[]
    usageHistory: Array<UsageRecord>
    favorites: string[]
    communityExpressions: Kaimoji[]
    level: number
  } {
    return {
      unlockedIds: Array.from(this.state.unlockedIds),
      usageHistory: Array.from(this.state.usageHistory.values()),
      favorites: Array.from(this.state.favorites),
      communityExpressions: this.state.communityExpressions,
      level: this.level
    }
  }

  /**
   * Import state from persistence
   */
  importState(state: {
    unlockedIds?: string[]
    usageHistory?: Array<UsageRecord>
    favorites?: string[]
    communityExpressions?: Kaimoji[]
    level?: number
  }): void {
    if (state.unlockedIds) {
      this.state.unlockedIds = new Set(state.unlockedIds)
    }
    if (state.usageHistory) {
      this.state.usageHistory = new Map(state.usageHistory.map(r => [r.id, r]))
    }
    if (state.favorites) {
      this.state.favorites = new Set(state.favorites)
    }
    if (state.communityExpressions) {
      this.state.communityExpressions = state.communityExpressions
    }
    if (state.level) {
      this.level = state.level
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Map emotion token to category
   */
  private emotionToCategory(emotion: EmotionToken): KaimojiCategory | null {
    const mapping: Partial<Record<EmotionToken, KaimojiCategory>> = {
      EMOTE_HAPPY: 'happy',
      EMOTE_SAD: 'sad',
      EMOTE_ANGRY: 'angry',
      EMOTE_THINK: 'contemplative',
      EMOTE_SURPRISED: 'excited',
      EMOTE_AWKWARD: 'shy',
      EMOTE_QUESTION: 'curious',
      EMOTE_CURIOUS: 'curious'
    }
    return mapping[emotion] || null
  }

  /**
   * Weighted random selection
   * Prefers uncommon/rare expressions that haven't been used recently
   */
  private weightedSelect(candidates: Kaimoji[], limit: number): Kaimoji[] {
    const weights = candidates.map(k => {
      let weight = 1

      // Rarity bonus
      switch (k.rarity) {
        case 'legendary': weight *= 0.5 // Less frequent to keep special
          break
        case 'rare': weight *= 1.5
          break
        case 'uncommon': weight *= 1.2
          break
        default: weight *= 1
      }

      // Usage penalty
      const usage = this.state.usageHistory.get(k.id)
      if (usage) {
        const timeSinceUse = Date.now() - usage.lastUsed
        const hoursSinceUse = timeSinceUse / (1000 * 60 * 60)
        if (hoursSinceUse < 1) {
          weight *= 0.3
        } else if (hoursSinceUse < 24) {
          weight *= 0.7
        }
      }

      // Favorite bonus
      if (this.state.favorites.has(k.id)) {
        weight *= 1.3
      }

      return weight
    })

    // Weighted random selection
    const selected: Kaimoji[] = []
    const remainingIndices = candidates.map((_, i) => i)

    while (selected.length < limit && remainingIndices.length > 0) {
      const totalWeight = remainingIndices.reduce((sum, i) => sum + weights[i], 0)
      let random = Math.random() * totalWeight

      for (let j = 0; j < remainingIndices.length; j++) {
        const idx = remainingIndices[j]
        random -= weights[idx]
        if (random <= 0) {
          selected.push(candidates[idx])
          remainingIndices.splice(j, 1)
          break
        }
      }
    }

    return selected
  }
}
