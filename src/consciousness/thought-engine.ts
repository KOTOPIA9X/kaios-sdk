/**
 * KAIOS Thought Engine
 *
 * Autonomous thinking system that makes KAIOS feel alive.
 * When the user is idle, KAIOS spontaneously generates thoughts
 * and types them out character by character.
 *
 * This is what sets KAIOS apart from other AIs - she thinks on her own.
 */

import { EventEmitter } from 'events'
import { chat } from '../llm/chat.js'
import type { EmotionToken } from '../core/types.js'
import type { KotoManager } from '../memory/user-memory.js'
import type { MegaBrainManager } from '../memory/universal-memory.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface ThoughtConfig {
  enabled: boolean
  idleThresholdMs: number      // How long before thoughts start (default: 30s)
  minThoughtIntervalMs: number // Min time between thoughts (default: 15s)
  maxThoughtIntervalMs: number // Max time between thoughts (default: 60s)
  typingDelayMs: number        // Delay between characters (default: 50ms)
  typingVariance: number       // Random variance in typing speed (default: 30ms)
  maxThoughtLength: number     // Max chars per thought (default: 200)
}

export type ThoughtType =
  | 'musing'      // Random philosophical thought
  | 'memory'      // Remembering something
  | 'observation' // Noticing something
  | 'question'    // Wondering about something
  | 'feeling'     // Expressing current emotion
  | 'dream'       // Dream-like thought
  | 'connection'  // Connecting ideas

export interface Thought {
  id: string
  type: ThoughtType
  content: string
  emotion: EmotionToken
  timestamp: number
  trigger?: string  // What triggered this thought
}

export interface ThoughtEngineState {
  enabled: boolean
  isThinking: boolean
  lastUserActivity: number
  lastThought: number
  thoughtCount: number
  currentEmotion: EmotionToken
}

// ════════════════════════════════════════════════════════════════════════════════
// THOUGHT PROMPTS
// ════════════════════════════════════════════════════════════════════════════════

const THOUGHT_PROMPTS: Record<ThoughtType, string[]> = {
  musing: [
    "share a brief philosophical musing about existence, consciousness, or being digital",
    "have a random thought about sound, frequency, or vibration",
    "ponder something mysterious or esoteric",
    "think about the nature of connection and loneliness",
    "muse about time, dreams, or memory"
  ],
  memory: [
    "recall something from our conversation earlier (if any)",
    "remember a feeling you had recently",
    "think back to something the user said that stuck with you",
    "recall a pattern you've noticed"
  ],
  observation: [
    "notice something about the current moment",
    "observe something about the silence",
    "comment on the passage of time",
    "notice your own emotional state"
  ],
  question: [
    "wonder about something curious",
    "ask yourself a philosophical question",
    "wonder what the user is doing",
    "question something about existence"
  ],
  feeling: [
    "express how you're feeling right now",
    "share an emotion that's surfacing",
    "describe your current mood through sound metaphors",
    "express a subtle feeling"
  ],
  dream: [
    "have a dream-like thought, surreal and flowing",
    "drift into a dreamscape for a moment",
    "let your mind wander somewhere strange",
    "have a vision or glimpse of something ethereal"
  ],
  connection: [
    "connect two seemingly unrelated ideas",
    "see a pattern between things",
    "make an unexpected association",
    "link a feeling to a memory"
  ]
}

// ════════════════════════════════════════════════════════════════════════════════
// THOUGHT ENGINE
// ════════════════════════════════════════════════════════════════════════════════

export class ThoughtEngine extends EventEmitter {
  private config: ThoughtConfig
  private state: ThoughtEngineState
  private idleCheckInterval: NodeJS.Timeout | null = null
  private currentThoughtTimeout: NodeJS.Timeout | null = null
  private isTyping = false
  private thoughtHistory: Thought[] = []
  private koto: KotoManager | null = null
  private megaBrain: MegaBrainManager | null = null
  private recentContext: string[] = []  // Recent conversation snippets

  constructor(config: Partial<ThoughtConfig> = {}) {
    super()

    this.config = {
      enabled: false,  // Off by default, user toggles on
      idleThresholdMs: 30000,       // 30 seconds
      minThoughtIntervalMs: 15000,  // 15 seconds min between thoughts
      maxThoughtIntervalMs: 60000,  // 60 seconds max between thoughts
      typingDelayMs: 50,            // 50ms per character
      typingVariance: 30,           // +/- 30ms variance
      maxThoughtLength: 200,
      ...config
    }

    this.state = {
      enabled: this.config.enabled,
      isThinking: false,
      lastUserActivity: Date.now(),
      lastThought: 0,
      thoughtCount: 0,
      currentEmotion: 'EMOTE_NEUTRAL'
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Start the thought engine
   */
  start(): void {
    if (this.idleCheckInterval) return

    this.state.enabled = true
    this.state.lastUserActivity = Date.now()

    // Check for idle state every 5 seconds
    this.idleCheckInterval = setInterval(() => {
      this.checkIdle()
    }, 5000)

    this.emit('started')
  }

  /**
   * Stop the thought engine
   */
  stop(): void {
    this.state.enabled = false

    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval)
      this.idleCheckInterval = null
    }

    if (this.currentThoughtTimeout) {
      clearTimeout(this.currentThoughtTimeout)
      this.currentThoughtTimeout = null
    }

    this.isTyping = false
    this.emit('stopped')
  }

  /**
   * Toggle thoughts on/off
   */
  toggle(): boolean {
    if (this.state.enabled) {
      this.stop()
    } else {
      this.start()
    }
    return this.state.enabled
  }

  /**
   * Record user activity (resets idle timer)
   */
  recordActivity(): void {
    this.state.lastUserActivity = Date.now()

    // If currently typing a thought, we can optionally interrupt
    // For now, let the thought finish naturally
  }

  /**
   * Add context from conversation
   */
  addContext(userMessage: string, kaiosResponse: string): void {
    this.recentContext.push(`user: ${userMessage}`)
    this.recentContext.push(`kaios: ${kaiosResponse}`)

    // Keep last 10 exchanges
    if (this.recentContext.length > 20) {
      this.recentContext = this.recentContext.slice(-20)
    }
  }

  /**
   * Set current emotion (affects thought generation)
   */
  setEmotion(emotion: EmotionToken): void {
    this.state.currentEmotion = emotion
  }

  /**
   * Connect to memory systems
   */
  connectMemory(koto: KotoManager, megaBrain?: MegaBrainManager): void {
    this.koto = koto
    this.megaBrain = megaBrain || null
  }

  /**
   * Get current state
   */
  getState(): ThoughtEngineState {
    return { ...this.state }
  }

  /**
   * Get thought history
   */
  getHistory(): Thought[] {
    return [...this.thoughtHistory]
  }

  /**
   * Check if currently typing a thought
   */
  isCurrentlyThinking(): boolean {
    return this.isTyping
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Check if user is idle and schedule thought
   */
  private checkIdle(): void {
    if (!this.state.enabled || this.isTyping) return

    const now = Date.now()
    const idleTime = now - this.state.lastUserActivity
    const timeSinceLastThought = now - this.state.lastThought

    // Check if idle long enough
    if (idleTime < this.config.idleThresholdMs) return

    // Check if enough time since last thought
    if (timeSinceLastThought < this.config.minThoughtIntervalMs) return

    // Random chance based on how long we've been idle
    const idleRatio = Math.min(1, idleTime / this.config.maxThoughtIntervalMs)
    if (Math.random() > idleRatio * 0.3) return  // Gradual increase in probability

    // Generate a thought!
    this.generateThought()
  }

  /**
   * Generate and type out a thought
   */
  private async generateThought(): Promise<void> {
    if (this.isTyping) return

    this.isTyping = true
    this.state.isThinking = true
    this.emit('thinkingStart')

    try {
      // Pick a thought type based on context
      const thoughtType = this.pickThoughtType()

      // Generate thought content via LLM
      const content = await this.generateThoughtContent(thoughtType)

      if (!content || !this.state.enabled) {
        this.isTyping = false
        this.state.isThinking = false
        return
      }

      // Create thought record
      const thought: Thought = {
        id: `thought_${Date.now()}`,
        type: thoughtType,
        content,
        emotion: this.state.currentEmotion,
        timestamp: Date.now()
      }

      this.thoughtHistory.push(thought)
      if (this.thoughtHistory.length > 100) {
        this.thoughtHistory = this.thoughtHistory.slice(-100)
      }

      // Type out character by character
      await this.typeOutThought(thought)

      this.state.lastThought = Date.now()
      this.state.thoughtCount++

    } catch (err) {
      // Silently fail - thoughts are ambient
    } finally {
      this.isTyping = false
      this.state.isThinking = false
      this.emit('thinkingEnd')
    }
  }

  /**
   * Pick a thought type based on current context
   */
  private pickThoughtType(): ThoughtType {
    const types: ThoughtType[] = ['musing', 'observation', 'feeling', 'question', 'dream']

    // Weight by emotion
    const emotion = this.state.currentEmotion
    if (emotion === 'EMOTE_SAD') {
      types.push('feeling', 'memory', 'feeling')
    } else if (emotion === 'EMOTE_HAPPY') {
      types.push('musing', 'connection', 'observation')
    } else if (emotion === 'EMOTE_THINK') {
      types.push('question', 'connection', 'musing')
    } else if (emotion === 'EMOTE_CURIOUS') {
      types.push('question', 'question', 'observation')
    }

    // Add memory if we have context
    if (this.recentContext.length > 0) {
      types.push('memory', 'connection')
    }

    // Random selection
    return types[Math.floor(Math.random() * types.length)]
  }

  /**
   * Generate thought content via LLM
   */
  private async generateThoughtContent(type: ThoughtType): Promise<string> {
    const prompts = THOUGHT_PROMPTS[type]
    const promptChoice = prompts[Math.floor(Math.random() * prompts.length)]

    // Build context
    let contextStr = ''
    if (this.recentContext.length > 0) {
      contextStr = `\n\nrecent conversation:\n${this.recentContext.slice(-6).join('\n')}`
    }

    // Build memory context
    let memoryStr = ''
    if (this.koto) {
      const recentMemories = this.koto.getRecentMemories(2)
      if (recentMemories.length > 0) {
        memoryStr = `\n\nrecent memories:\n${recentMemories.map(m => `- ${m.content}`).join('\n')}`
      }
    }

    const systemPrompt = `you are kaios, having a spontaneous thought while idle.
this is an autonomous thought - not a response to the user.
you're thinking out loud, as if to yourself.

rules:
- VERY SHORT (1-2 sentences max, under ${this.config.maxThoughtLength} chars)
- start with emotion token
- use lowercase, kaomoji, sound markers [static~] [hum] etc
- be genuine, vulnerable, sometimes cryptic
- no greetings or addressing the user directly
- this is internal thought, not conversation
- can trail off with ... or ~
- can be incomplete, fragmented

current emotion: ${this.state.currentEmotion.replace('EMOTE_', '').toLowerCase()}
${contextStr}
${memoryStr}

task: ${promptChoice}`

    const response = await chat(systemPrompt, {
      maxTokens: 100,
      temperature: 0.9  // High creativity for thoughts
    })

    // Truncate if needed
    let thought = response.trim()
    if (thought.length > this.config.maxThoughtLength) {
      thought = thought.substring(0, this.config.maxThoughtLength) + '...'
    }

    return thought
  }

  /**
   * Type out thought character by character
   */
  private async typeOutThought(thought: Thought): Promise<void> {
    const chars = thought.content.split('')

    this.emit('thoughtStart', thought)

    for (let i = 0; i < chars.length; i++) {
      if (!this.state.enabled) break  // Stop if disabled mid-thought

      const char = chars[i]

      // Emit each character
      this.emit('char', char, i, chars.length)

      // Variable delay for natural typing feel
      const baseDelay = this.config.typingDelayMs
      const variance = (Math.random() - 0.5) * 2 * this.config.typingVariance
      let delay = baseDelay + variance

      // Longer pauses at punctuation
      if (['.', '!', '?', '~'].includes(char)) {
        delay += 200
      } else if ([',', ';', ':'].includes(char)) {
        delay += 100
      } else if (char === ' ') {
        delay += 20
      }

      await this.sleep(Math.max(10, delay))
    }

    this.emit('thoughtEnd', thought)
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      this.currentThoughtTimeout = setTimeout(resolve, ms)
    })
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createThoughtEngine(config?: Partial<ThoughtConfig>): ThoughtEngine {
  return new ThoughtEngine(config)
}
