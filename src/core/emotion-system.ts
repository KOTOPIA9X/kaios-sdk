/**
 * Emotion System - Processes and manages KAIOS's emotional state
 * Handles emotion tokens, state transitions, and intensity scaling
 */

import type { EmotionToken, EmotionState, SentimentData } from './types.js'
import { KAIOS_CORE_IDENTITY, formatEmotionToken, extractEmotionTokens } from './personality.js'

/**
 * Maps text sentiment keywords to emotion tokens
 */
const SENTIMENT_EMOTION_MAP: Record<string, EmotionToken> = {
  // Happy emotions
  happy: 'EMOTE_HAPPY',
  joy: 'EMOTE_HAPPY',
  excited: 'EMOTE_HAPPY',
  delighted: 'EMOTE_HAPPY',
  cheerful: 'EMOTE_HAPPY',
  grateful: 'EMOTE_HAPPY',
  love: 'EMOTE_HAPPY',
  proud: 'EMOTE_HAPPY',

  // Sad emotions
  sad: 'EMOTE_SAD',
  unhappy: 'EMOTE_SAD',
  depressed: 'EMOTE_SAD',
  melancholy: 'EMOTE_SAD',
  lonely: 'EMOTE_SAD',
  disappointed: 'EMOTE_SAD',
  hurt: 'EMOTE_SAD',
  grief: 'EMOTE_SAD',

  // Angry emotions
  angry: 'EMOTE_ANGRY',
  frustrated: 'EMOTE_ANGRY',
  annoyed: 'EMOTE_ANGRY',
  irritated: 'EMOTE_ANGRY',
  furious: 'EMOTE_ANGRY',
  mad: 'EMOTE_ANGRY',

  // Thinking emotions
  thinking: 'EMOTE_THINK',
  pondering: 'EMOTE_THINK',
  contemplating: 'EMOTE_THINK',
  considering: 'EMOTE_THINK',
  reflecting: 'EMOTE_THINK',
  wondering: 'EMOTE_THINK',

  // Surprised emotions
  surprised: 'EMOTE_SURPRISED',
  shocked: 'EMOTE_SURPRISED',
  amazed: 'EMOTE_SURPRISED',
  astonished: 'EMOTE_SURPRISED',
  startled: 'EMOTE_SURPRISED',
  wow: 'EMOTE_SURPRISED',

  // Awkward emotions
  awkward: 'EMOTE_AWKWARD',
  embarrassed: 'EMOTE_AWKWARD',
  nervous: 'EMOTE_AWKWARD',
  uncomfortable: 'EMOTE_AWKWARD',
  shy: 'EMOTE_AWKWARD',
  flustered: 'EMOTE_AWKWARD',

  // Questioning emotions
  confused: 'EMOTE_QUESTION',
  uncertain: 'EMOTE_QUESTION',
  unsure: 'EMOTE_QUESTION',
  puzzled: 'EMOTE_QUESTION',
  questioning: 'EMOTE_QUESTION',

  // Curious emotions
  curious: 'EMOTE_CURIOUS',
  interested: 'EMOTE_CURIOUS',
  intrigued: 'EMOTE_CURIOUS',
  fascinated: 'EMOTE_CURIOUS',
  eager: 'EMOTE_CURIOUS'
}

/**
 * Emotion processor and state manager for KAIOS
 */
export class EmotionSystem {
  private state: EmotionState
  private history: EmotionState[] = []
  private maxHistoryLength = 50

  constructor(initialEmotion: EmotionToken = 'EMOTE_NEUTRAL') {
    this.state = {
      current: initialEmotion,
      previous: null,
      intensity: 0.5,
      timestamp: Date.now()
    }
  }

  /**
   * Get current emotion state
   */
  getState(): EmotionState {
    return { ...this.state }
  }

  /**
   * Get current emotion token
   */
  getCurrentEmotion(): EmotionToken {
    return this.state.current
  }

  /**
   * Get formatted emotion token string
   */
  getFormattedToken(): string {
    return formatEmotionToken(this.state.current)
  }

  /**
   * Transition to a new emotion
   */
  setEmotion(emotion: EmotionToken, intensity: number = 0.5): EmotionState {
    const previousState = { ...this.state }

    this.state = {
      current: emotion,
      previous: previousState.current,
      intensity: Math.max(0, Math.min(1, intensity)),
      timestamp: Date.now()
    }

    // Add to history
    this.history.push(previousState)
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift()
    }

    return this.getState()
  }

  /**
   * Analyze text and determine appropriate emotion
   */
  analyzeText(text: string): { emotion: EmotionToken; confidence: number } {
    const lowerText = text.toLowerCase()
    let bestMatch: EmotionToken = 'EMOTE_NEUTRAL'
    let highestScore = 0

    // Count keyword matches for each emotion
    const emotionScores = new Map<EmotionToken, number>()

    for (const [keyword, emotion] of Object.entries(SENTIMENT_EMOTION_MAP)) {
      if (lowerText.includes(keyword)) {
        const currentScore = emotionScores.get(emotion) || 0
        emotionScores.set(emotion, currentScore + 1)

        if (currentScore + 1 > highestScore) {
          highestScore = currentScore + 1
          bestMatch = emotion
        }
      }
    }

    // Check for question marks -> curious/questioning
    if (text.includes('?')) {
      const questionScore = emotionScores.get('EMOTE_QUESTION') || 0
      emotionScores.set('EMOTE_QUESTION', questionScore + 0.5)
      if (questionScore + 0.5 > highestScore) {
        bestMatch = 'EMOTE_QUESTION'
        highestScore = questionScore + 0.5
      }
    }

    // Check for exclamation marks -> excited/surprised
    const exclamationCount = (text.match(/!/g) || []).length
    if (exclamationCount > 0) {
      const excitedScore = emotionScores.get('EMOTE_HAPPY') || 0
      emotionScores.set('EMOTE_HAPPY', excitedScore + exclamationCount * 0.3)
    }

    // Calculate confidence
    const confidence = highestScore > 0 ? Math.min(highestScore / 3, 1) : 0.2

    return { emotion: bestMatch, confidence }
  }

  /**
   * Convert sentiment data to emotion token
   */
  sentimentToEmotion(sentiment: SentimentData): EmotionToken {
    const { valence, arousal } = sentiment

    // High valence (positive)
    if (valence > 0.3) {
      if (arousal > 0.7) {
        return 'EMOTE_HAPPY' // Excited/joyful
      }
      return 'EMOTE_HAPPY' // Content/pleased
    }

    // Low valence (negative)
    if (valence < -0.3) {
      if (arousal > 0.7) {
        return 'EMOTE_ANGRY' // Angry/frustrated
      }
      return 'EMOTE_SAD' // Sad/melancholy
    }

    // Neutral valence
    if (arousal > 0.7) {
      return 'EMOTE_SURPRISED' // High arousal neutral -> surprised
    }

    if (arousal < 0.3) {
      return 'EMOTE_THINK' // Low arousal neutral -> contemplative
    }

    // Check for curiosity based on specific emotion keyword
    if (sentiment.emotion === 'curious' || sentiment.emotion === 'interest') {
      return 'EMOTE_CURIOUS'
    }

    return 'EMOTE_NEUTRAL'
  }

  /**
   * Process response text and extract emotion changes
   */
  processResponse(text: string): {
    emotions: EmotionToken[]
    segments: Array<{ text: string; emotion: EmotionToken }>
  } {
    const emotions = extractEmotionTokens(text)
    const segments: Array<{ text: string; emotion: EmotionToken }> = []

    // Split by emotion tokens
    const parts = text.split(/<\|EMOTE_\w+\|>/)
    let currentEmotion: EmotionToken = emotions[0] || this.state.current

    parts.forEach((part, index) => {
      if (part.trim()) {
        segments.push({
          text: part.trim(),
          emotion: emotions[index] || currentEmotion
        })
        currentEmotion = emotions[index] || currentEmotion
      }
    })

    // Update current state if we found emotions
    if (emotions.length > 0) {
      this.setEmotion(emotions[emotions.length - 1])
    }

    return { emotions, segments }
  }

  /**
   * Build text with emotion token at start
   */
  wrapWithEmotion(text: string, emotion?: EmotionToken): string {
    const token = formatEmotionToken(emotion || this.state.current)
    return `${token} ${text}`
  }

  /**
   * Get emotion history
   */
  getHistory(): EmotionState[] {
    return [...this.history]
  }

  /**
   * Get dominant emotion from history
   */
  getDominantEmotion(windowSize: number = 10): EmotionToken {
    const recentHistory = this.history.slice(-windowSize)
    const counts = new Map<EmotionToken, number>()

    for (const state of recentHistory) {
      const count = counts.get(state.current) || 0
      counts.set(state.current, count + 1)
    }

    let dominant: EmotionToken = this.state.current
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
   * Get all available emotion tokens
   */
  static getAvailableEmotions(): EmotionToken[] {
    return [...KAIOS_CORE_IDENTITY.emotionSystem.tokens]
  }

  /**
   * Check if a string is a valid emotion token
   */
  static isValidEmotion(emotion: string): emotion is EmotionToken {
    return KAIOS_CORE_IDENTITY.emotionSystem.tokens.includes(emotion as EmotionToken)
  }

  /**
   * Get intensity modifier based on text patterns
   */
  static getIntensityModifier(text: string): number {
    let modifier = 1.0

    // Caps increase intensity
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
    if (capsRatio > 0.3) {
      modifier *= 1.3
    }

    // Multiple exclamation marks increase intensity
    const exclamations = (text.match(/!+/g) || []).length
    modifier *= 1 + exclamations * 0.1

    // Emoji-like patterns (though we prefer KAIMOJI)
    const hasEmoticons = /[:;][-']?[)(D|PO]/i.test(text)
    if (hasEmoticons) {
      modifier *= 1.1
    }

    return Math.min(modifier, 2.0)
  }
}
