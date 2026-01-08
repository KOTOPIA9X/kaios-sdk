/**
 * Memory System - Cross-session memory for KAIOS
 * Handles persistence, interaction history, and state management
 */

import type {
  Interaction,
  EmotionToken,
  Kaimoji,
  StateBackendConfig,
  SonicResponse
} from '../core/types.js'

interface MemoryState {
  userId: string
  interactions: Interaction[]
  emotionHistory: Array<{ emotion: EmotionToken; timestamp: number }>
  preferences: Map<string, unknown>
  lastActive: number
  sessionCount: number
  totalInteractions: number
}

/**
 * Memory manager for KAIOS state persistence
 */
export class MemoryManager {
  private state: MemoryState
  private backend: StateBackend
  private maxInteractions = 1000
  private maxEmotionHistory = 500
  private autoSaveInterval: ReturnType<typeof setInterval> | null = null

  constructor(config?: StateBackendConfig) {
    this.state = {
      userId: '',
      interactions: [],
      emotionHistory: [],
      preferences: new Map(),
      lastActive: Date.now(),
      sessionCount: 0,
      totalInteractions: 0
    }

    // Initialize backend
    this.backend = this.createBackend(config)
  }

  /**
   * Initialize memory for a user
   */
  async initialize(userId: string): Promise<void> {
    this.state.userId = userId
    await this.loadState()
    this.state.sessionCount++
    this.state.lastActive = Date.now()

    // Start auto-save
    this.startAutoSave()
  }

  /**
   * Record an interaction
   */
  recordInteraction(params: {
    input: string
    output?: string
    emotion: EmotionToken
    expressions: Kaimoji[]
    sonic?: SonicResponse
  }): Interaction {
    const interaction: Interaction = {
      id: this.generateId(),
      input: params.input,
      output: params.output,
      emotion: params.emotion,
      expressions: params.expressions,
      sonic: params.sonic,
      timestamp: Date.now()
    }

    this.state.interactions.push(interaction)
    this.state.totalInteractions++

    // Record emotion
    this.state.emotionHistory.push({
      emotion: params.emotion,
      timestamp: interaction.timestamp
    })

    // Trim if necessary
    if (this.state.interactions.length > this.maxInteractions) {
      this.state.interactions = this.state.interactions.slice(-this.maxInteractions)
    }
    if (this.state.emotionHistory.length > this.maxEmotionHistory) {
      this.state.emotionHistory = this.state.emotionHistory.slice(-this.maxEmotionHistory)
    }

    this.state.lastActive = Date.now()

    return interaction
  }

  /**
   * Get recent interactions
   */
  getRecentInteractions(limit: number = 10): Interaction[] {
    return this.state.interactions.slice(-limit)
  }

  /**
   * Get interaction count
   */
  getInteractionCount(): number {
    return this.state.totalInteractions
  }

  /**
   * Get session count
   */
  getSessionCount(): number {
    return this.state.sessionCount
  }

  /**
   * Get emotion history
   */
  getEmotionHistory(limit?: number): Array<{ emotion: EmotionToken; timestamp: number }> {
    const history = this.state.emotionHistory
    return limit ? history.slice(-limit) : history
  }

  /**
   * Get dominant emotion over time
   */
  getDominantEmotion(windowMs: number = 3600000): EmotionToken {
    const cutoff = Date.now() - windowMs
    const recent = this.state.emotionHistory.filter(e => e.timestamp > cutoff)

    if (recent.length === 0) {
      return 'EMOTE_NEUTRAL'
    }

    const counts = new Map<EmotionToken, number>()
    for (const entry of recent) {
      counts.set(entry.emotion, (counts.get(entry.emotion) || 0) + 1)
    }

    let dominant: EmotionToken = 'EMOTE_NEUTRAL'
    let maxCount = 0
    for (const [emotion, count] of counts) {
      if (count > maxCount) {
        maxCount = count
        dominant = emotion
      }
    }

    return dominant
  }

  /**
   * Set a preference
   */
  setPreference(key: string, value: unknown): void {
    this.state.preferences.set(key, value)
  }

  /**
   * Get a preference
   */
  getPreference<T>(key: string, defaultValue: T): T {
    return (this.state.preferences.get(key) as T) ?? defaultValue
  }

  /**
   * Search interactions by content
   */
  searchInteractions(query: string, limit: number = 10): Interaction[] {
    const lowerQuery = query.toLowerCase()
    return this.state.interactions
      .filter(i =>
        i.input.toLowerCase().includes(lowerQuery) ||
        i.output?.toLowerCase().includes(lowerQuery)
      )
      .slice(-limit)
  }

  /**
   * Get interactions by emotion
   */
  getInteractionsByEmotion(emotion: EmotionToken, limit: number = 10): Interaction[] {
    return this.state.interactions
      .filter(i => i.emotion === emotion)
      .slice(-limit)
  }

  /**
   * Persist state to backend
   */
  async persistState(): Promise<void> {
    await this.backend.save(this.state.userId, this.exportState())
  }

  /**
   * Load state from backend
   */
  async loadState(): Promise<void> {
    const data = await this.backend.load(this.state.userId)
    if (data) {
      this.importState(data)
    }
  }

  /**
   * Clear all memory
   */
  async clear(): Promise<void> {
    this.state = {
      userId: this.state.userId,
      interactions: [],
      emotionHistory: [],
      preferences: new Map(),
      lastActive: Date.now(),
      sessionCount: this.state.sessionCount,
      totalInteractions: 0
    }
    await this.backend.clear(this.state.userId)
  }

  /**
   * Export state for persistence
   */
  exportState(): MemoryExport {
    return {
      userId: this.state.userId,
      interactions: this.state.interactions,
      emotionHistory: this.state.emotionHistory,
      preferences: Object.fromEntries(this.state.preferences),
      lastActive: this.state.lastActive,
      sessionCount: this.state.sessionCount,
      totalInteractions: this.state.totalInteractions
    }
  }

  /**
   * Import state from persistence
   */
  importState(data: MemoryExport): void {
    this.state = {
      userId: data.userId || this.state.userId,
      interactions: data.interactions || [],
      emotionHistory: data.emotionHistory || [],
      preferences: new Map(Object.entries(data.preferences || {})),
      lastActive: data.lastActive || Date.now(),
      sessionCount: data.sessionCount || 0,
      totalInteractions: data.totalInteractions || 0
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stopAutoSave()
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  }

  private createBackend(config?: StateBackendConfig): StateBackend {
    if (!config) {
      return new MemoryBackend()
    }

    switch (config.type) {
      case 'localStorage':
        return new LocalStorageBackend()
      case 'supabase':
        return new SupabaseBackend(config.url!, config.key!)
      default:
        return new MemoryBackend()
    }
  }

  private startAutoSave(): void {
    if (this.autoSaveInterval) {
      return
    }
    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.persistState().catch(console.error)
    }, 30000)
  }

  private stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval)
      this.autoSaveInterval = null
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE BACKENDS
// ═══════════════════════════════════════════════════════════════════════════════

interface MemoryExport {
  userId: string
  interactions: Interaction[]
  emotionHistory: Array<{ emotion: EmotionToken; timestamp: number }>
  preferences: Record<string, unknown>
  lastActive: number
  sessionCount: number
  totalInteractions: number
}

interface StateBackend {
  save(userId: string, data: MemoryExport): Promise<void>
  load(userId: string): Promise<MemoryExport | null>
  clear(userId: string): Promise<void>
}

/**
 * In-memory backend (no persistence)
 */
class MemoryBackend implements StateBackend {
  private store = new Map<string, MemoryExport>()

  async save(userId: string, data: MemoryExport): Promise<void> {
    this.store.set(userId, data)
  }

  async load(userId: string): Promise<MemoryExport | null> {
    return this.store.get(userId) || null
  }

  async clear(userId: string): Promise<void> {
    this.store.delete(userId)
  }
}

/**
 * LocalStorage backend (browser only)
 */
class LocalStorageBackend implements StateBackend {
  private prefix = 'kaios_memory_'

  async save(userId: string, data: MemoryExport): Promise<void> {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available')
      return
    }
    localStorage.setItem(this.prefix + userId, JSON.stringify(data))
  }

  async load(userId: string): Promise<MemoryExport | null> {
    if (typeof localStorage === 'undefined') {
      return null
    }
    const data = localStorage.getItem(this.prefix + userId)
    return data ? JSON.parse(data) : null
  }

  async clear(userId: string): Promise<void> {
    if (typeof localStorage === 'undefined') {
      return
    }
    localStorage.removeItem(this.prefix + userId)
  }
}

/**
 * Supabase backend (cloud persistence)
 */
class SupabaseBackend implements StateBackend {
  private url: string
  private key: string
  private tableName = 'kaios_memory'

  constructor(url: string, key: string) {
    this.url = url
    this.key = key
  }

  async save(userId: string, data: MemoryExport): Promise<void> {
    try {
      const response = await fetch(`${this.url}/rest/v1/${this.tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          user_id: userId,
          data: data,
          updated_at: new Date().toISOString()
        })
      })

      if (!response.ok) {
        console.error('Supabase save error:', response.statusText)
      }
    } catch (error) {
      console.error('Supabase save error:', error)
    }
  }

  async load(userId: string): Promise<MemoryExport | null> {
    try {
      const response = await fetch(
        `${this.url}/rest/v1/${this.tableName}?user_id=eq.${userId}&select=data`,
        {
          headers: {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`
          }
        }
      )

      if (!response.ok) {
        return null
      }

      const results = await response.json()
      return results[0]?.data || null
    } catch (error) {
      console.error('Supabase load error:', error)
      return null
    }
  }

  async clear(userId: string): Promise<void> {
    try {
      await fetch(
        `${this.url}/rest/v1/${this.tableName}?user_id=eq.${userId}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`
          }
        }
      )
    } catch (error) {
      console.error('Supabase clear error:', error)
    }
  }
}
