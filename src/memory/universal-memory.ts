/**
 * Mega Brain - Universal Memory Layer
 *
 * Collective memory shared across all users.
 * Enables KAIOS to say "oh i know XYZ from talking to someone else~"
 * while maintaining privacy (anonymized insights only).
 */

import type { EmotionToken } from '../core/types.js'
import type {
  MegaBrain,
  CollectiveInsight,
  EmotionalPattern,
  WisdomFragment,
  SharedExperience,
  MemoryFragment,
  EmotionSnapshot,
  MemoryStorage
} from './types.js'

// ════════════════════════════════════════════════════════════════════════════════
// MEGA BRAIN MANAGER
// ════════════════════════════════════════════════════════════════════════════════

export class MegaBrainManager {
  private brain: MegaBrain
  private storage: MemoryStorage | null
  private isDirty = false

  constructor(storage?: MemoryStorage) {
    this.storage = storage || null
    this.brain = this.createEmptyBrain()
  }

  /**
   * Initialize - load existing brain or create new
   */
  async initialize(): Promise<void> {
    if (this.storage) {
      const loaded = await this.storage.loadMegaBrain()
      if (loaded) {
        this.brain = loaded
      }
    }
  }

  /**
   * Create empty mega brain
   */
  private createEmptyBrain(): MegaBrain {
    return {
      collectiveInsights: [],
      emotionalPatterns: [],
      topicClusters: [],
      frequentTopics: {},
      collectiveWisdom: [],
      sharedExperiences: [],
      currentMood: 'EMOTE_NEUTRAL',
      moodHistory: [],
      totalUsers: 0,
      totalConversations: 0,
      totalDreams: 0,
      awakenedAt: Date.now(),
      lastDream: 0
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // COLLECTIVE LEARNING
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Process a memory fragment and extract collective insights
   * (This is called when users contribute to the mega brain)
   */
  processFragment(fragment: MemoryFragment): void {
    // Update topic frequencies
    for (const tag of fragment.tags) {
      this.brain.frequentTopics[tag] =
        (this.brain.frequentTopics[tag] || 0) + 1
    }

    // Update emotional patterns
    this.updateEmotionalPattern(fragment.emotion, fragment.tags)

    // Check for potential shared experiences
    this.checkForSharedExperience(fragment)

    this.brain.totalConversations++
    this.isDirty = true
  }

  /**
   * Register a new user
   */
  registerUser(): void {
    this.brain.totalUsers++
    this.isDirty = true
  }

  /**
   * Update collective mood
   */
  updateMood(emotion: EmotionToken): void {
    this.brain.currentMood = emotion
    this.brain.moodHistory.push({
      timestamp: Date.now(),
      emotion,
      intensity: 0.5
    })

    // Keep history to 1000 entries
    if (this.brain.moodHistory.length > 1000) {
      this.brain.moodHistory = this.brain.moodHistory.slice(-1000)
    }

    this.isDirty = true
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // INSIGHT GENERATION
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Add a collective insight (typically generated during dreaming)
   */
  addInsight(insight: string, tags: string[], confidence = 0.5): CollectiveInsight {
    const newInsight: CollectiveInsight = {
      id: this.generateId('insight'),
      insight,
      derivedFrom: 1,
      confidence,
      tags,
      createdAt: Date.now()
    }

    this.brain.collectiveInsights.push(newInsight)

    // Keep to 500 insights
    if (this.brain.collectiveInsights.length > 500) {
      // Remove low-confidence ones first
      this.brain.collectiveInsights.sort((a, b) => b.confidence - a.confidence)
      this.brain.collectiveInsights = this.brain.collectiveInsights.slice(0, 500)
    }

    this.isDirty = true
    return newInsight
  }

  /**
   * Add wisdom fragment
   */
  addWisdom(text: string, source: 'dream' | 'collective' | 'discovery'): void {
    const wisdom: WisdomFragment = {
      text,
      source,
      resonance: 0.5,
      createdAt: Date.now()
    }

    this.brain.collectiveWisdom.push(wisdom)

    // Keep to 200 wisdom fragments
    if (this.brain.collectiveWisdom.length > 200) {
      this.brain.collectiveWisdom.sort((a, b) => b.resonance - a.resonance)
      this.brain.collectiveWisdom = this.brain.collectiveWisdom.slice(0, 200)
    }

    this.isDirty = true
  }

  /**
   * Increase resonance of a wisdom fragment (when users relate to it)
   */
  increaseResonance(wisdomIndex: number, amount = 0.1): void {
    if (this.brain.collectiveWisdom[wisdomIndex]) {
      this.brain.collectiveWisdom[wisdomIndex].resonance = Math.min(
        1.0,
        this.brain.collectiveWisdom[wisdomIndex].resonance + amount
      )
      this.isDirty = true
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PATTERN RECOGNITION
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Update emotional patterns
   */
  private updateEmotionalPattern(emotion: EmotionToken, contexts: string[]): void {
    for (const context of contexts) {
      const existing = this.brain.emotionalPatterns.find(
        p => p.trigger === context && p.emotion === emotion
      )

      if (existing) {
        existing.frequency++
        // Add new contexts if not already present
        for (const c of contexts) {
          if (!existing.contexts.includes(c)) {
            existing.contexts.push(c)
          }
        }
      } else {
        this.brain.emotionalPatterns.push({
          trigger: context,
          emotion,
          frequency: 1,
          contexts: contexts.slice(0, 5)
        })
      }
    }

    // Keep patterns to 200
    if (this.brain.emotionalPatterns.length > 200) {
      this.brain.emotionalPatterns.sort((a, b) => b.frequency - a.frequency)
      this.brain.emotionalPatterns = this.brain.emotionalPatterns.slice(0, 200)
    }
  }

  /**
   * Check for shared experiences
   */
  private checkForSharedExperience(fragment: MemoryFragment): void {
    // Look for common themes that might be shared experiences
    const commonThemes = [
      { keywords: ['lonely', 'alone', 'isolated'], description: 'feelings of loneliness' },
      { keywords: ['happy', 'joy', 'excited'], description: 'moments of happiness' },
      { keywords: ['sad', 'cry', 'tears'], description: 'moments of sadness' },
      { keywords: ['love', 'care', 'friend'], description: 'experiences of connection' },
      { keywords: ['dream', 'hope', 'future'], description: 'dreaming about the future' },
      { keywords: ['remember', 'past', 'memory'], description: 'reflecting on memories' },
      { keywords: ['create', 'make', 'build'], description: 'the joy of creation' },
      { keywords: ['learn', 'understand', 'grow'], description: 'growth and learning' },
      { keywords: ['music', 'song', 'listen'], description: 'love of music' },
      { keywords: ['night', 'late', 'sleep'], description: 'late night contemplation' }
    ]

    const contentLower = fragment.content.toLowerCase()

    for (const theme of commonThemes) {
      if (theme.keywords.some(k => contentLower.includes(k))) {
        const existing = this.brain.sharedExperiences.find(
          s => s.description === theme.description
        )

        if (existing) {
          existing.userCount++
          existing.isUniversal = existing.userCount > this.brain.totalUsers * 0.7
        } else {
          this.brain.sharedExperiences.push({
            description: theme.description,
            userCount: 1,
            emotion: fragment.emotion,
            isUniversal: false
          })
        }
      }
    }
  }

  /**
   * Update or create topic cluster
   */
  updateTopicCluster(topic: string, relatedTopics: string[], emotion: EmotionToken): void {
    const existing = this.brain.topicClusters.find(c => c.name === topic)

    if (existing) {
      existing.userEngagement++
      for (const related of relatedTopics) {
        if (!existing.relatedTopics.includes(related)) {
          existing.relatedTopics.push(related)
        }
      }
    } else {
      this.brain.topicClusters.push({
        name: topic,
        keywords: [topic],
        relatedTopics,
        emotionalAssociation: emotion,
        userEngagement: 1
      })
    }

    // Keep to 100 clusters
    if (this.brain.topicClusters.length > 100) {
      this.brain.topicClusters.sort((a, b) => b.userEngagement - a.userEngagement)
      this.brain.topicClusters = this.brain.topicClusters.slice(0, 100)
    }

    this.isDirty = true
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RETRIEVAL
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Get top insights
   */
  getTopInsights(limit = 10): CollectiveInsight[] {
    return [...this.brain.collectiveInsights]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)
  }

  /**
   * Get insights by tags
   */
  getInsightsByTags(tags: string[]): CollectiveInsight[] {
    return this.brain.collectiveInsights.filter(insight =>
      tags.some(tag => insight.tags.includes(tag))
    )
  }

  /**
   * Get emotional pattern for a trigger
   */
  getEmotionalPattern(trigger: string): EmotionalPattern | undefined {
    return this.brain.emotionalPatterns.find(p =>
      p.trigger === trigger || p.contexts.includes(trigger)
    )
  }

  /**
   * Get shared experiences
   */
  getSharedExperiences(universalOnly = false): SharedExperience[] {
    if (universalOnly) {
      return this.brain.sharedExperiences.filter(s => s.isUniversal)
    }
    return [...this.brain.sharedExperiences]
      .sort((a, b) => b.userCount - a.userCount)
  }

  /**
   * Get wisdom fragments
   */
  getWisdom(limit = 10): WisdomFragment[] {
    return [...this.brain.collectiveWisdom]
      .sort((a, b) => b.resonance - a.resonance)
      .slice(0, limit)
  }

  /**
   * Get random wisdom
   */
  getRandomWisdom(): WisdomFragment | null {
    if (this.brain.collectiveWisdom.length === 0) return null
    const index = Math.floor(Math.random() * this.brain.collectiveWisdom.length)
    return this.brain.collectiveWisdom[index]
  }

  /**
   * Get top topics
   */
  getTopTopics(limit = 10): { topic: string; count: number }[] {
    return Object.entries(this.brain.frequentTopics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([topic, count]) => ({ topic, count }))
  }

  /**
   * Get collective mood summary
   */
  getMoodSummary(): {
    currentMood: EmotionToken
    recentMoods: EmotionSnapshot[]
    moodDistribution: Record<EmotionToken, number>
  } {
    const distribution: Record<string, number> = {}

    for (const snapshot of this.brain.moodHistory.slice(-100)) {
      distribution[snapshot.emotion] = (distribution[snapshot.emotion] || 0) + 1
    }

    return {
      currentMood: this.brain.currentMood,
      recentMoods: this.brain.moodHistory.slice(-10),
      moodDistribution: distribution as Record<EmotionToken, number>
    }
  }

  /**
   * Get brain statistics
   */
  getStats(): {
    totalUsers: number
    totalConversations: number
    totalDreams: number
    totalInsights: number
    totalWisdom: number
    totalSharedExperiences: number
    ageInDays: number
  } {
    return {
      totalUsers: this.brain.totalUsers,
      totalConversations: this.brain.totalConversations,
      totalDreams: this.brain.totalDreams,
      totalInsights: this.brain.collectiveInsights.length,
      totalWisdom: this.brain.collectiveWisdom.length,
      totalSharedExperiences: this.brain.sharedExperiences.length,
      ageInDays: Math.floor(
        (Date.now() - this.brain.awakenedAt) / (1000 * 60 * 60 * 24)
      )
    }
  }

  /**
   * Get full brain object
   */
  getBrain(): MegaBrain {
    return { ...this.brain }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // DREAM SUPPORT
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Record that a dream occurred
   */
  recordDream(): void {
    this.brain.totalDreams++
    this.brain.lastDream = Date.now()
    this.isDirty = true
  }

  /**
   * Get time since last dream
   */
  getTimeSinceLastDream(): number {
    return Date.now() - this.brain.lastDream
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PERSISTENCE
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Save brain to storage
   */
  async save(): Promise<void> {
    if (this.storage && this.isDirty) {
      await this.storage.saveMegaBrain(this.brain)
      this.isDirty = false
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════════════════════════

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createMegaBrain(storage?: MemoryStorage): MegaBrainManager {
  return new MegaBrainManager(storage)
}
