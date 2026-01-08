/**
 * Emotion Parser for KAIOS LLM Responses
 *
 * Extracts and processes emotion tokens from KAIOS's responses
 * for use in visual/audio expression systems
 *
 * @example
 * ```typescript
 * import { parseResponse } from '@kaios/expression-sdk/llm'
 *
 * const response = '<|EMOTE_HAPPY|> hello~ (◕‿◕) <|EMOTE_CURIOUS|> what brings you here?'
 * const parsed = parseResponse(response)
 * // {
 * //   segments: [
 * //     { emotion: 'EMOTE_HAPPY', text: 'hello~ (◕‿◕) ' },
 * //     { emotion: 'EMOTE_CURIOUS', text: 'what brings you here?' }
 * //   ],
 * //   emotions: ['EMOTE_HAPPY', 'EMOTE_CURIOUS'],
 * //   cleanText: 'hello~ (◕‿◕) what brings you here?'
 * // }
 * ```
 */

import type { EmotionToken } from '../core/types.js'

// Valid emotion tokens
const VALID_EMOTIONS: EmotionToken[] = [
  'EMOTE_NEUTRAL',
  'EMOTE_HAPPY',
  'EMOTE_SAD',
  'EMOTE_ANGRY',
  'EMOTE_THINK',
  'EMOTE_SURPRISED',
  'EMOTE_AWKWARD',
  'EMOTE_QUESTION',
  'EMOTE_CURIOUS'
]

// Regex patterns
const EMOTION_TOKEN_REGEX = /<\|(EMOTE_\w+)\|>/g
const DELAY_TOKEN_REGEX = /<\|DELAY:(\d+)\|>/g

export interface EmotionSegment {
  emotion: EmotionToken
  text: string
  delay?: number
}

export interface ParsedResponse {
  /** Text segments with their associated emotions */
  segments: EmotionSegment[]

  /** All emotions found in order of appearance */
  emotions: EmotionToken[]

  /** The complete text with all tokens removed */
  cleanText: string

  /** Whether the response starts with an emotion token */
  startsWithEmotion: boolean

  /** Total delays in seconds */
  totalDelay: number
}

/**
 * Parse a KAIOS response to extract emotion tokens and delays
 */
export function parseResponse(text: string): ParsedResponse {
  const segments: EmotionSegment[] = []
  const emotions: EmotionToken[] = []
  let totalDelay = 0

  // Check if response starts with emotion
  const startsWithEmotion = text.trimStart().startsWith('<|EMOTE_')

  // Split by emotion tokens while preserving them
  const parts = text.split(/(<\|EMOTE_\w+\|>)/).filter(Boolean)

  let currentEmotion: EmotionToken = 'EMOTE_NEUTRAL'
  let currentDelay = 0

  for (const part of parts) {
    // Check if this is an emotion token
    const emotionMatch = part.match(/<\|(EMOTE_\w+)\|>/)
    if (emotionMatch) {
      const emotion = emotionMatch[1] as EmotionToken
      if (VALID_EMOTIONS.includes(emotion)) {
        currentEmotion = emotion
        if (!emotions.includes(emotion)) {
          emotions.push(emotion)
        }
      }
      continue
    }

    // Extract delays from this segment
    const delayMatches = part.matchAll(DELAY_TOKEN_REGEX)
    for (const match of delayMatches) {
      const delay = parseInt(match[1], 10)
      currentDelay += delay
      totalDelay += delay
    }

    // Clean the text (remove delay tokens)
    const cleanPart = part.replace(DELAY_TOKEN_REGEX, '').trim()

    if (cleanPart) {
      segments.push({
        emotion: currentEmotion,
        text: cleanPart,
        delay: currentDelay > 0 ? currentDelay : undefined
      })
      currentDelay = 0
    }
  }

  // Build clean text
  const cleanText = segments.map(s => s.text).join(' ')

  return {
    segments,
    emotions,
    cleanText,
    startsWithEmotion,
    totalDelay
  }
}

/**
 * Extract just the emotion tokens from text
 */
export function extractEmotions(text: string): EmotionToken[] {
  const emotions: EmotionToken[] = []
  let match

  const regex = new RegExp(EMOTION_TOKEN_REGEX.source, 'g')
  while ((match = regex.exec(text)) !== null) {
    const emotion = match[1] as EmotionToken
    if (VALID_EMOTIONS.includes(emotion)) {
      emotions.push(emotion)
    }
  }

  return emotions
}

/**
 * Get the dominant (first) emotion from a response
 */
export function getDominantEmotion(text: string): EmotionToken {
  const emotions = extractEmotions(text)
  return emotions[0] || 'EMOTE_NEUTRAL'
}

/**
 * Remove all emotion and delay tokens from text
 */
export function cleanResponse(text: string): string {
  return text
    .replace(EMOTION_TOKEN_REGEX, '')
    .replace(DELAY_TOKEN_REGEX, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Format an emotion token for display
 */
export function formatEmotionToken(emotion: EmotionToken): string {
  return `<|${emotion}|>`
}

/**
 * Validate if a string is a valid emotion token
 */
export function isValidEmotion(emotion: string): emotion is EmotionToken {
  return VALID_EMOTIONS.includes(emotion as EmotionToken)
}

/**
 * Get emotion display name (without EMOTE_ prefix)
 */
export function getEmotionName(emotion: EmotionToken): string {
  return emotion.replace('EMOTE_', '').toLowerCase()
}

/**
 * Map emotion to a color for display
 */
export function emotionToColor(emotion: EmotionToken): string {
  const colors: Record<EmotionToken, string> = {
    EMOTE_NEUTRAL: '#808080',  // gray
    EMOTE_HAPPY: '#FFD700',    // gold
    EMOTE_SAD: '#4169E1',      // royal blue
    EMOTE_ANGRY: '#FF4500',    // orange red
    EMOTE_THINK: '#9370DB',    // medium purple
    EMOTE_SURPRISED: '#FF69B4', // hot pink
    EMOTE_AWKWARD: '#20B2AA',  // light sea green
    EMOTE_QUESTION: '#00CED1', // dark turquoise
    EMOTE_CURIOUS: '#32CD32'   // lime green
  }
  return colors[emotion] || colors.EMOTE_NEUTRAL
}

/**
 * Map emotion to a kaomoji for display
 */
export function emotionToKaomoji(emotion: EmotionToken): string {
  const kaomoji: Record<EmotionToken, string> = {
    EMOTE_NEUTRAL: '(・_・)',
    EMOTE_HAPPY: '(◕‿◕)',
    EMOTE_SAD: '(╥﹏╥)',
    EMOTE_ANGRY: '(╬ಠ益ಠ)',
    EMOTE_THINK: '(￣ω￣)',
    EMOTE_SURPRISED: '(⊙ω⊙)',
    EMOTE_AWKWARD: '(・・;)',
    EMOTE_QUESTION: '(・ω・)?',
    EMOTE_CURIOUS: '(◕ᴗ◕)'
  }
  return kaomoji[emotion] || kaomoji.EMOTE_NEUTRAL
}

// Export types
export { EmotionToken }
