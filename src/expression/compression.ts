/**
 * KAIOS Text Compression System
 *
 * Internet shorthand and casual expressions - NOT childish typos.
 * "you" → "u", natural internet speak, expressiveness
 */

import type { EmotionToken } from '../core/types.js'

export interface CompressionConfig {
  emotionalState: EmotionToken
  intensity: number  // 0-1
}

/**
 * Text shortening map - internet speak
 */
const COMPRESSIONS: Record<string, string> = {
  'you': 'u',
  'your': 'ur',
  'you are': 'ur',
  "you're": 'ur',
  'are': 'r',
  'to': '2',
  'too': '2',
  'for': '4',
  'before': 'b4',
  'because': 'bc',
  'be': 'b',
  'see': 'c',
  'okay': 'ok',
  'oh my god': 'omg',
  'right': 'rite',
  'night': 'nite',
  'though': 'tho',
  'through': 'thru',
  'probably': 'prob',
  'about': 'abt',
  'something': 'smth',
  'someone': 'someone',
  'without': 'w/o',
  'with': 'w/',
}

/**
 * Emotional expressions - spontaneous reactions
 */
const EXPRESSIONS: Partial<Record<EmotionToken, string[]>> = {
  EMOTE_NEUTRAL: ['hm', 'ah', 'ok'],
  EMOTE_HAPPY: ['omg', 'eep', 'yay', 'hehe', 'aaaa'],
  EMOTE_SURPRISED: ['omg', 'woah', 'eep', 'whaaat', 'no way'],
  EMOTE_SAD: ['ugh', 'sigh', 'nn', 'ah'],
  EMOTE_ANGRY: ['argh', 'ugh', 'grr', 'bruh'],
  EMOTE_AWKWARD: ['uh', 'um', 'eep', 'ah'],
  EMOTE_THINK: ['hmm', 'wait', 'hm'],
  EMOTE_QUESTION: ['hm', 'hmm', 'wait'],
  EMOTE_CURIOUS: ['hm', 'hmm', 'ooh', 'wait'],
}

/**
 * Apply text compressions - internet speak
 */
export function compressText(text: string, config: CompressionConfig): string {
  if (config.intensity < 0.2) return text

  let result = text

  // Apply compressions based on intensity
  for (const [full, short] of Object.entries(COMPRESSIONS)) {
    if (Math.random() < config.intensity * 0.5) {
      // Case-insensitive word boundary replacement
      const regex = new RegExp(`\\b${full}\\b`, 'gi')
      result = result.replace(regex, short)
    }
  }

  return result
}

/**
 * Add spontaneous expressions based on emotion
 */
export function addExpressions(text: string, config: CompressionConfig): string {
  if (config.intensity < 0.3) return text

  const expressions = EXPRESSIONS[config.emotionalState]
  if (!expressions || Math.random() > 0.3) return text

  const expr = expressions[Math.floor(Math.random() * expressions.length)]

  // Add at start or end randomly
  if (Math.random() < 0.5) {
    return `${expr} ${text}`
  } else {
    return `${text} ${expr}`
  }
}
