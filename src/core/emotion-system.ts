/**
 * KAIOS Emotion System
 * ═══════════════════════════════════════════════════════════════════════════
 * Processes and manages KAIOS's emotional state
 * Emotion tokens: <|EMOTE_{EMOTION}|>
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  EmotionToken,
  EmotionState,
  SentimentData,
  SoundFrequency
} from '../types.js'
import { EMOTION_DESCRIPTIONS, emotionDistance } from './personality.js'

/**
 * Keywords associated with each emotion for text analysis
 */
const EMOTION_KEYWORDS: Record<EmotionToken, string[]> = {
  EMOTE_NEUTRAL: ['okay', 'fine', 'alright', 'normal', 'regular', 'usual', 'calm'],
  EMOTE_HAPPY: [
    'happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'awesome',
    'fantastic', 'beautiful', 'yay', 'hooray', 'celebrate', 'perfect', 'brilliant',
    'delighted', 'thrilled', 'pleased', 'glad', 'cheerful', 'elated'
  ],
  EMOTE_SAD: [
    'sad', 'sorry', 'unfortunate', 'miss', 'lonely', 'down', 'upset', 'cry',
    'depressed', 'melancholy', 'grief', 'sorrow', 'heartbroken', 'disappointed',
    'gloomy', 'unhappy', 'hurt', 'pain', 'lost', 'empty'
  ],
  EMOTE_ANGRY: [
    'angry', 'mad', 'frustrated', 'annoyed', 'hate', 'rage', 'furious', 'irritated',
    'upset', 'outraged', 'enraged', 'infuriated', 'livid', 'irate', 'fuming',
    'hostile', 'resentful', 'bitter', 'fed up', 'pissed'
  ],
  EMOTE_THINK: [
    'think', 'wonder', 'consider', 'maybe', 'perhaps', 'hmm', 'interesting',
    'ponder', 'reflect', 'contemplate', 'analyze', 'evaluate', 'suppose',
    'imagine', 'believe', 'assume', 'speculate', 'reason', 'deduce'
  ],
  EMOTE_SURPRISED: [
    'wow', 'oh', 'whoa', 'really', 'unexpected', 'shock', 'surprise', 'amazed',
    'astonished', 'stunned', 'startled', 'speechless', 'incredible', 'unbelievable',
    'omg', 'what', 'no way', 'seriously', 'holy', 'damn'
  ],
  EMOTE_AWKWARD: [
    'awkward', 'embarrassed', 'oops', 'sorry', 'uncomfortable', 'nervous',
    'cringe', 'clumsy', 'fumble', 'blush', 'shy', 'hesitant', 'uneasy',
    'self-conscious', 'flustered', 'weird', 'strange', 'uh', 'um', 'err'
  ],
  EMOTE_QUESTION: [
    'what', 'why', 'how', 'when', 'where', 'who', 'which', 'question',
    'ask', 'wonder', 'curious', 'explain', 'understand', 'clarify', 'help',
    'confused', 'lost', 'unclear', 'meaning', 'purpose'
  ],
  EMOTE_CURIOUS: [
    'curious', 'interested', 'intrigued', 'fascinating', 'explore', 'discover',
    'learn', 'know', 'investigate', 'research', 'study', 'examine', 'observe',
    'wonder', 'want to know', 'tell me', 'show me', 'teach'
  ]
}

/**
 * Punctuation patterns that affect emotion detection
 */
const PUNCTUATION_PATTERNS = {
  excitement: /!{2,}/g,
  question: /\?+/g,
  ellipsis: /\.{3,}/g,
  caps: /[A-Z]{3,}/g,
  multiple: /([!?])\1+/g
}

export class EmotionSystem {
  private state: EmotionState
  private history: Array<{ emotion: EmotionToken; timestamp: number }> = []
  private readonly maxHistorySize = 50

  constructor(initialEmotion: EmotionToken = 'EMOTE_NEUTRAL') {
    this.state = {
      current: initialEmotion,
      intensity: 0.5,
      timestamp: Date.now(),
      previousEmotions: []
    }
  }

  /**
   * Get the current emotion state
   */
  getCurrentState(): EmotionState {
    return { ...this.state }
  }

  /**
   * Get the current emotion token
   */
  getCurrentEmotion(): EmotionToken {
    return this.state.current
  }

  /**
   * Set a new emotion
   */
  setEmotion(emotion: EmotionToken, intensity?: number): void {
    const oldEmotion = this.state.current

    // Add to history
    this.history.push({
      emotion: oldEmotion,
      timestamp: this.state.timestamp
    })

    // Trim history if needed
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize)
    }

    // Update state
    this.state = {
      current: emotion,
      intensity: intensity ?? this.calculateIntensity(oldEmotion, emotion),
      timestamp: Date.now(),
      previousEmotions: [oldEmotion, ...this.state.previousEmotions.slice(0, 4)]
    }
  }

  /**
   * Analyze text to detect emotion
   */
  analyzeText(text: string): SentimentData {
    const lowerText = text.toLowerCase()
    const scores: Record<EmotionToken, number> = {} as Record<EmotionToken, number>

    // Initialize scores
    for (const emotion of Object.keys(EMOTION_KEYWORDS) as EmotionToken[]) {
      scores[emotion] = 0
    }

    // Count keyword matches
    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS) as Array<[EmotionToken, string[]]>) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          scores[emotion] += 1
        }
      }
    }

    // Apply punctuation modifiers
    const excitementMatch = text.match(PUNCTUATION_PATTERNS.excitement)
    if (excitementMatch) {
      scores.EMOTE_HAPPY += excitementMatch.length * 0.5
      scores.EMOTE_SURPRISED += excitementMatch.length * 0.3
    }

    const questionMatch = text.match(PUNCTUATION_PATTERNS.question)
    if (questionMatch) {
      scores.EMOTE_QUESTION += questionMatch.length * 0.8
      scores.EMOTE_CURIOUS += questionMatch.length * 0.4
    }

    const capsMatch = text.match(PUNCTUATION_PATTERNS.caps)
    if (capsMatch) {
      scores.EMOTE_ANGRY += capsMatch.length * 0.3
      scores.EMOTE_SURPRISED += capsMatch.length * 0.2
    }

    // Find the dominant emotion
    let maxScore = 0
    let dominantEmotion: EmotionToken = 'EMOTE_NEUTRAL'

    for (const [emotion, score] of Object.entries(scores) as Array<[EmotionToken, number]>) {
      if (score > maxScore) {
        maxScore = score
        dominantEmotion = emotion
      }
    }

    // Calculate sentiment values
    const desc = EMOTION_DESCRIPTIONS[dominantEmotion]
    const intensity = Math.min(1, maxScore / 5)
    const confidence = maxScore > 0 ? Math.min(1, maxScore / 3) : 0.3

    return {
      emotion: dominantEmotion,
      valence: desc.valence,
      arousal: desc.arousal,
      intensity,
      confidence
    }
  }

  /**
   * Analyze and set emotion from text
   */
  processText(text: string): SentimentData {
    const sentiment = this.analyzeText(text)

    // Only update if confidence is high enough
    if (sentiment.confidence > 0.4) {
      this.setEmotion(sentiment.emotion, sentiment.intensity)
    }

    return sentiment
  }

  /**
   * Get the sound frequency for current emotion
   */
  getSoundFrequency(): SoundFrequency {
    return EMOTION_DESCRIPTIONS[this.state.current].soundFrequency
  }

  /**
   * Get the emotional color for visualization
   */
  getEmotionColor(): string {
    return EMOTION_DESCRIPTIONS[this.state.current].color
  }

  /**
   * Get emotion history
   */
  getHistory(): Array<{ emotion: EmotionToken; timestamp: number }> {
    return [...this.history]
  }

  /**
   * Get dominant emotion from recent history
   */
  getDominantEmotion(count: number = 10): EmotionToken {
    const recent = this.history.slice(-count)
    if (recent.length === 0) return this.state.current

    const counts: Partial<Record<EmotionToken, number>> = {}
    for (const entry of recent) {
      counts[entry.emotion] = (counts[entry.emotion] || 0) + 1
    }

    let maxCount = 0
    let dominant: EmotionToken = this.state.current

    for (const [emotion, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count
        dominant = emotion as EmotionToken
      }
    }

    return dominant
  }

  /**
   * Check if there was a recent emotional shift
   */
  hasRecentShift(withinMs: number = 5000): boolean {
    if (this.state.previousEmotions.length === 0) return false
    const previousEmotion = this.state.previousEmotions[0]
    const timeDiff = Date.now() - this.state.timestamp
    return timeDiff < withinMs && previousEmotion !== this.state.current
  }

  /**
   * Get emotional momentum (trend direction)
   */
  getEmotionalMomentum(): { valence: number; arousal: number } {
    const recent = this.history.slice(-5)
    if (recent.length < 2) {
      const desc = EMOTION_DESCRIPTIONS[this.state.current]
      return { valence: 0, arousal: desc.arousal }
    }

    let valenceSum = 0
    let arousalSum = 0

    for (let i = 1; i < recent.length; i++) {
      const prev = EMOTION_DESCRIPTIONS[recent[i - 1].emotion]
      const curr = EMOTION_DESCRIPTIONS[recent[i].emotion]
      valenceSum += curr.valence - prev.valence
      arousalSum += curr.arousal - prev.arousal
    }

    return {
      valence: valenceSum / (recent.length - 1),
      arousal: arousalSum / (recent.length - 1)
    }
  }

  /**
   * Calculate intensity based on emotion transition
   */
  private calculateIntensity(from: EmotionToken, to: EmotionToken): number {
    const distance = emotionDistance(from, to)
    // Larger transitions create higher intensity
    return Math.min(1, 0.5 + distance * 0.5)
  }

  /**
   * Reset to neutral state
   */
  reset(): void {
    this.state = {
      current: 'EMOTE_NEUTRAL',
      intensity: 0.5,
      timestamp: Date.now(),
      previousEmotions: []
    }
    this.history = []
  }

  /**
   * Serialize state for persistence
   */
  toJSON(): object {
    return {
      state: this.state,
      history: this.history.slice(-20) // Keep last 20 entries
    }
  }

  /**
   * Restore from serialized state
   */
  static fromJSON(data: {
    state: EmotionState
    history: Array<{ emotion: EmotionToken; timestamp: number }>
  }): EmotionSystem {
    const system = new EmotionSystem(data.state.current)
    system.state = data.state
    system.history = data.history
    return system
  }
}

/**
 * Create a sentiment-based emotion suggestion
 */
export function suggestEmotion(
  valence: number,
  arousal: number
): EmotionToken {
  // Map valence (-1 to 1) and arousal (0 to 1) to emotions
  if (arousal > 0.7) {
    if (valence > 0.3) return 'EMOTE_HAPPY'
    if (valence < -0.3) return 'EMOTE_ANGRY'
    return 'EMOTE_SURPRISED'
  }

  if (arousal < 0.3) {
    if (valence < -0.3) return 'EMOTE_SAD'
    if (valence > 0.3) return 'EMOTE_HAPPY'
    return 'EMOTE_NEUTRAL'
  }

  // Medium arousal
  if (valence > 0.2) return 'EMOTE_CURIOUS'
  if (valence < -0.2) return 'EMOTE_THINK'
  return 'EMOTE_QUESTION'
}

/**
 * Blend two emotions based on weight
 */
export function blendEmotions(
  a: EmotionToken,
  b: EmotionToken,
  weight: number = 0.5
): SentimentData {
  const descA = EMOTION_DESCRIPTIONS[a]
  const descB = EMOTION_DESCRIPTIONS[b]

  const blendedValence = descA.valence * (1 - weight) + descB.valence * weight
  const blendedArousal = descA.arousal * (1 - weight) + descB.arousal * weight

  return {
    emotion: suggestEmotion(blendedValence, blendedArousal),
    valence: blendedValence,
    arousal: blendedArousal,
    intensity: (descA.energy + descB.energy) / 20,
    confidence: 0.8
  }
}
