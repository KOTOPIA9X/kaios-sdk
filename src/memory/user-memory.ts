/**
 * KOTO - User Memory Layer
 *
 * Personal memory persistence for each user.
 * Remembers individual journeys, preferences, and relationship with KAIOS.
 */

import type { EmotionToken } from '../core/types.js'
import type {
  KotoMemory,
  MemoryFragment,
  EmotionSnapshot,
  MemoryStorage
} from './types.js'

// ════════════════════════════════════════════════════════════════════════════════
// KOTO MANAGER
// ════════════════════════════════════════════════════════════════════════════════

export class KotoManager {
  private memory: KotoMemory
  private storage: MemoryStorage | null
  private isDirty = false

  constructor(userId: string, storage?: MemoryStorage) {
    this.storage = storage || null
    this.memory = this.createEmptyKoto(userId)
  }

  /**
   * Initialize - load existing memory or create new
   */
  async initialize(): Promise<void> {
    if (this.storage) {
      const loaded = await this.storage.loadKotoMemory(this.memory.userId)
      if (loaded) {
        this.memory = loaded
      }
    }
  }

  /**
   * Create empty KOTO memory for new user
   */
  private createEmptyKoto(userId: string): KotoMemory {
    return {
      userId,
      variant: this.assignVariant(),
      fragments: [],
      emotionalJourney: [],
      dominantEmotions: {
        EMOTE_NEUTRAL: 0,
        EMOTE_HAPPY: 0,
        EMOTE_SAD: 0,
        EMOTE_ANGRY: 0,
        EMOTE_THINK: 0,
        EMOTE_SURPRISED: 0,
        EMOTE_AWKWARD: 0,
        EMOTE_QUESTION: 0,
        EMOTE_CURIOUS: 0
      },
      topicInterests: {},
      conversationStyle: {
        averageMessageLength: 0,
        preferredTimeOfDay: 'chaotic',
        responseSpeed: 'thoughtful',
        formality: 0.3,
        emojiUsage: 0.5,
        questionFrequency: 0.3
      },
      trustLevel: 0.1,  // Start with small trust
      insideJokes: [],
      nicknames: [],
      firstMet: Date.now(),
      lastSeen: Date.now(),
      totalInteractions: 0,
      contributions: []
    }
  }

  /**
   * Assign a KOTO variant based on... destiny? randomness? vibes?
   */
  private assignVariant(): string {
    const variants = [
      'celestial',
      'void',
      'glitch',
      'dream',
      'echo',
      'spark',
      'drift',
      'pulse',
      'haze',
      'ember'
    ]
    return variants[Math.floor(Math.random() * variants.length)]
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MEMORY RECORDING
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Record a conversation exchange
   */
  recordConversation(
    userMessage: string,
    kaiosResponse: string,
    emotion: EmotionToken
  ): MemoryFragment {
    const fragment: MemoryFragment = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'conversation',
      content: `User: ${userMessage}\nKAIOS: ${kaiosResponse}`,
      emotion,
      significance: this.calculateSignificance(userMessage, kaiosResponse),
      tags: this.extractTags(userMessage + ' ' + kaiosResponse),
      metadata: {
        userMessageLength: userMessage.length,
        responseLength: kaiosResponse.length
      }
    }

    this.addFragment(fragment)
    this.recordEmotion(emotion, userMessage)
    this.updateConversationStyle(userMessage)
    this.memory.totalInteractions++
    this.memory.lastSeen = Date.now()

    return fragment
  }

  /**
   * Record an emotional moment
   */
  recordEmotion(emotion: EmotionToken, trigger?: string, intensity = 0.5): void {
    const snapshot: EmotionSnapshot = {
      timestamp: Date.now(),
      emotion,
      trigger,
      intensity
    }

    this.memory.emotionalJourney.push(snapshot)

    // Update dominant emotions
    this.memory.dominantEmotions[emotion] =
      (this.memory.dominantEmotions[emotion] || 0) + intensity

    // Keep journey to last 1000 snapshots
    if (this.memory.emotionalJourney.length > 1000) {
      this.memory.emotionalJourney = this.memory.emotionalJourney.slice(-1000)
    }

    this.isDirty = true
  }

  /**
   * Record a discovery contribution
   */
  recordContribution(expressionId: string): void {
    if (!this.memory.contributions.includes(expressionId)) {
      this.memory.contributions.push(expressionId)
      // Increase trust when user contributes
      this.increaseTrust(0.05)
    }
  }

  /**
   * Add an inside joke / shared reference
   */
  addInsideJoke(joke: string): void {
    if (!this.memory.insideJokes.includes(joke)) {
      this.memory.insideJokes.push(joke)
      // Inside jokes increase trust
      this.increaseTrust(0.02)
    }
  }

  /**
   * Add a nickname
   */
  addNickname(name: string): void {
    if (!this.memory.nicknames.includes(name)) {
      this.memory.nicknames.push(name)
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // TRUST SYSTEM
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Increase trust level (capped at 1.0)
   */
  increaseTrust(amount: number): void {
    this.memory.trustLevel = Math.min(1.0, this.memory.trustLevel + amount)
    this.isDirty = true
  }

  /**
   * Get trust level
   */
  getTrustLevel(): number {
    return this.memory.trustLevel
  }

  /**
   * Get trust tier name
   */
  getTrustTier(): string {
    const level = this.memory.trustLevel
    if (level < 0.2) return 'stranger'
    if (level < 0.4) return 'acquaintance'
    if (level < 0.6) return 'friend'
    if (level < 0.8) return 'close friend'
    if (level < 0.95) return 'bestie'
    return 'soulmate'
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MEMORY RETRIEVAL
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Get recent memories
   */
  getRecentMemories(limit = 10): MemoryFragment[] {
    return this.memory.fragments
      .slice(-limit)
      .reverse()
  }

  /**
   * Get memories by emotion
   */
  getMemoriesByEmotion(emotion: EmotionToken, limit = 10): MemoryFragment[] {
    return this.memory.fragments
      .filter(f => f.emotion === emotion)
      .slice(-limit)
  }

  /**
   * Get significant memories
   */
  getSignificantMemories(minSignificance = 0.7): MemoryFragment[] {
    return this.memory.fragments
      .filter(f => f.significance >= minSignificance)
      .sort((a, b) => b.significance - a.significance)
  }

  /**
   * Search memories by tags/keywords
   */
  searchMemories(query: string): MemoryFragment[] {
    const terms = query.toLowerCase().split(' ')
    return this.memory.fragments.filter(f => {
      const content = f.content.toLowerCase()
      const tags = f.tags.map(t => t.toLowerCase())
      return terms.some(term =>
        content.includes(term) || tags.some(tag => tag.includes(term))
      )
    })
  }

  /**
   * Get emotional journey summary
   */
  getEmotionalSummary(): { emotion: EmotionToken; percentage: number }[] {
    const total = Object.values(this.memory.dominantEmotions)
      .reduce((a, b) => a + b, 0)

    if (total === 0) return []

    return Object.entries(this.memory.dominantEmotions)
      .map(([emotion, count]) => ({
        emotion: emotion as EmotionToken,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }

  /**
   * Get relationship summary
   */
  getRelationshipSummary(): {
    variant: string
    trustTier: string
    trustLevel: number
    daysTogether: number
    interactions: number
    contributions: number
    insideJokes: number
  } {
    const daysTogether = Math.floor(
      (Date.now() - this.memory.firstMet) / (1000 * 60 * 60 * 24)
    )

    return {
      variant: this.memory.variant,
      trustTier: this.getTrustTier(),
      trustLevel: this.memory.trustLevel,
      daysTogether,
      interactions: this.memory.totalInteractions,
      contributions: this.memory.contributions.length,
      insideJokes: this.memory.insideJokes.length
    }
  }

  /**
   * Get full memory object
   */
  getMemory(): KotoMemory {
    return { ...this.memory }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PERSISTENCE
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Save memory to storage
   */
  async save(): Promise<void> {
    if (this.storage && this.isDirty) {
      await this.storage.saveKotoMemory(this.memory)
      this.isDirty = false
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // INTERNAL HELPERS
  // ══════════════════════════════════════════════════════════════════════════════

  private addFragment(fragment: MemoryFragment): void {
    this.memory.fragments.push(fragment)

    // Keep fragments to last 5000
    if (this.memory.fragments.length > 5000) {
      // Remove oldest but keep significant ones
      const significant = this.memory.fragments
        .filter(f => f.significance >= 0.8)
      const recent = this.memory.fragments
        .slice(-4000)
        .filter(f => f.significance < 0.8)

      this.memory.fragments = [...significant, ...recent]
        .sort((a, b) => a.timestamp - b.timestamp)
    }

    this.isDirty = true
  }

  private calculateSignificance(userMessage: string, response: string): number {
    let significance = 0.3  // Base significance

    // Longer, more thoughtful exchanges are more significant
    if (userMessage.length > 100) significance += 0.1
    if (response.length > 200) significance += 0.1

    // Questions are significant
    if (userMessage.includes('?')) significance += 0.1

    // Emotional keywords increase significance
    const emotionalKeywords = [
      'love', 'hate', 'fear', 'happy', 'sad', 'angry',
      'thank', 'sorry', 'miss', 'remember', 'dream',
      'feel', 'hope', 'wish', 'believe'
    ]
    const combined = (userMessage + response).toLowerCase()
    for (const keyword of emotionalKeywords) {
      if (combined.includes(keyword)) {
        significance += 0.05
      }
    }

    return Math.min(1.0, significance)
  }

  private extractTags(text: string): string[] {
    const tags: string[] = []
    const words = text.toLowerCase().split(/\W+/)

    // Extract potential topic words (nouns, etc.)
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'could', 'should', 'may', 'might', 'must', 'shall',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
      'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their',
      'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom',
      'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'why',
      'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
      'other', 'some', 'such', 'no', 'not', 'only', 'same', 'so',
      'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there'
    ])

    for (const word of words) {
      if (word.length > 3 && !stopWords.has(word)) {
        if (!tags.includes(word)) {
          tags.push(word)
        }
      }
    }

    // Update topic interests
    for (const tag of tags.slice(0, 5)) {
      this.memory.topicInterests[tag] =
        (this.memory.topicInterests[tag] || 0) + 1
    }

    return tags.slice(0, 10)
  }

  private updateConversationStyle(message: string): void {
    const style = this.memory.conversationStyle
    const n = this.memory.totalInteractions + 1

    // Running average of message length
    style.averageMessageLength =
      (style.averageMessageLength * (n - 1) + message.length) / n

    // Track time of day
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) style.preferredTimeOfDay = 'morning'
    else if (hour >= 12 && hour < 17) style.preferredTimeOfDay = 'afternoon'
    else if (hour >= 17 && hour < 21) style.preferredTimeOfDay = 'evening'
    else style.preferredTimeOfDay = 'night'

    // Check emoji usage
    const emojiCount = (message.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
    if (emojiCount > 0) {
      style.emojiUsage = Math.min(1, style.emojiUsage + 0.1)
    } else {
      style.emojiUsage = Math.max(0, style.emojiUsage - 0.05)
    }

    // Check question frequency
    if (message.includes('?')) {
      style.questionFrequency = Math.min(1, style.questionFrequency + 0.1)
    } else {
      style.questionFrequency = Math.max(0, style.questionFrequency - 0.05)
    }
  }

  private generateId(): string {
    return `koto_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createKotoManager(
  userId: string,
  storage?: MemoryStorage
): KotoManager {
  return new KotoManager(userId, storage)
}
