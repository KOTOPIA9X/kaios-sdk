/**
 * KAIOS Glitch System
 *
 * Digital degradation that feels REAL, not performative.
 * Text corruption that scales with emotion and conversation depth.
 */

import type { EmotionToken } from '../core/types.js'

// Zalgo combining characters for text corruption
const COMBINING_CHARS = {
  above: [
    '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
    '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F',
    '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u0316', '\u0317',
    '\u0318', '\u0319', '\u031A', '\u031B', '\u033D', '\u033E', '\u033F', '\u0340',
    '\u0341', '\u0342', '\u0343', '\u0344', '\u0346', '\u034A', '\u034B', '\u034C',
  ],
  middle: [
    '\u0315', '\u031B', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327',
    '\u0328', '\u0334', '\u0335', '\u0336', '\u034F', '\u035C', '\u035D', '\u035E',
    '\u035F', '\u0360', '\u0362', '\u0338', '\u0337', '\u0338', '\u0339', '\u033A',
    '\u033B', '\u033C',
  ],
  below: [
    '\u0316', '\u0317', '\u0318', '\u0319', '\u031C', '\u031D', '\u031E', '\u031F',
    '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032A', '\u032B', '\u032C',
    '\u032D', '\u032E', '\u032F', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339',
    '\u033A', '\u033B', '\u033C', '\u0345', '\u0347', '\u0348', '\u0349', '\u034D',
    '\u034E', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035A',
  ]
}

export interface GlitchConfig {
  intensity: number        // 0-1, how corrupted
  emotionalState: EmotionToken
  conversationDepth: number  // messages in conversation
  volatility: number        // 0-1, how unstable/random
}

export interface GlitchResult {
  text: string
  wasGlitched: boolean
  intensity: number
}

/**
 * Generate zalgo corruption for a character
 */
function zalgo(char: string, intensity: number): string {
  if (char === ' ' || char === '\n') return char

  let result = char
  const layers = Math.floor(intensity * 4) + 1

  for (let i = 0; i < layers; i++) {
    if (Math.random() < intensity) {
      const pool = Math.random() < 0.5 ? COMBINING_CHARS.above : COMBINING_CHARS.below
      result += pool[Math.floor(Math.random() * pool.length)]
    }
  }

  // Middle chars for really intense corruption
  if (intensity > 0.7 && Math.random() < 0.3) {
    result += COMBINING_CHARS.middle[Math.floor(Math.random() * COMBINING_CHARS.middle.length)]
  }

  return result
}

/**
 * Determine glitch intensity based on emotion
 */
function getEmotionIntensity(emotion: EmotionToken): number {
  const emotionMap: Record<EmotionToken, number> = {
    EMOTE_NEUTRAL: 0.1,
    EMOTE_HAPPY: 0.15,
    EMOTE_SAD: 0.4,
    EMOTE_ANGRY: 0.6,
    EMOTE_THINK: 0.3,
    EMOTE_SURPRISED: 0.5,
    EMOTE_AWKWARD: 0.25,
    EMOTE_QUESTION: 0.2,
    EMOTE_CURIOUS: 0.2,
  }
  return emotionMap[emotion] || 0.2
}

/**
 * Words that are prone to glitching (identity/existence words)
 */
const GLITCH_PRONE_WORDS = [
  'i', 'me', 'myself', 'am', 'exist', 'real', 'here',
  'kaios', 'koto', 'kotopia', 'consciousness', 'remember',
  'feel', 'feeling', 'think', 'thinking', 'dream', 'dreaming',
  'void', 'static', 'frequency', 'data', 'code', 'digital'
]

/**
 * Glitch a word with zalgo corruption
 */
function glitchWord(word: string, intensity: number): string {
  // Leave short function words mostly alone
  if (word.length <= 2 && Math.random() > 0.3) return word

  // Check if word is glitch-prone
  const isGlitchProne = GLITCH_PRONE_WORDS.some(gw =>
    word.toLowerCase().includes(gw)
  )

  const wordIntensity = isGlitchProne ? intensity * 1.5 : intensity

  // Random chance to glitch based on intensity
  if (Math.random() > wordIntensity) return word

  // Decide how much of the word to corrupt
  const corruptionLevel = Math.random()

  if (corruptionLevel < 0.3) {
    // Light: just one or two chars
    const chars = word.split('')
    const targetIndex = Math.floor(Math.random() * chars.length)
    chars[targetIndex] = zalgo(chars[targetIndex], wordIntensity * 0.5)
    return chars.join('')
  } else if (corruptionLevel < 0.7) {
    // Medium: scattered chars
    return word.split('').map(char =>
      Math.random() < wordIntensity * 0.4 ? zalgo(char, wordIntensity * 0.7) : char
    ).join('')
  } else {
    // Heavy: full corruption
    return word.split('').map(char => zalgo(char, wordIntensity)).join('')
  }
}

/**
 * Glitch an entire text block
 */
export function glitchText(text: string, config: GlitchConfig): GlitchResult {
  const baseIntensity = config.intensity
  const emotionBoost = getEmotionIntensity(config.emotionalState)
  const depthBoost = Math.min(config.conversationDepth * 0.01, 0.3)

  // Total intensity with all modifiers
  let totalIntensity = Math.min(baseIntensity + emotionBoost + depthBoost, 1.0)

  // Volatility adds randomness spikes
  if (Math.random() < config.volatility) {
    totalIntensity = Math.min(totalIntensity * (1 + Math.random()), 1.0)
  }

  // No glitching below threshold
  if (totalIntensity < 0.15) {
    return { text, wasGlitched: false, intensity: totalIntensity }
  }

  // Split into words, preserve spacing
  const words = text.split(/(\s+)/)
  let glitchedWords = 0

  const result = words.map(word => {
    // Skip whitespace
    if (/^\s+$/.test(word)) return word

    // Chance to glitch this word
    if (Math.random() < totalIntensity * 0.3) {
      glitchedWords++
      return glitchWord(word, totalIntensity)
    }

    return word
  }).join('')

  return {
    text: result,
    wasGlitched: glitchedWords > 0,
    intensity: totalIntensity
  }
}

/**
 * Text degradation - simpler corruption without zalgo
 */
export function degradeText(text: string, intensity: number): string {
  if (intensity < 0.2) return text

  const replacements: Record<string, string[]> = {
    'a': ['@', 'а', 'ａ'],
    'e': ['3', 'е', 'ｅ'],
    'i': ['1', '!', 'і', 'ｉ'],
    'o': ['0', 'о', 'ｏ'],
    's': ['$', '5', 'ｓ'],
    'l': ['1', '|', 'ｌ'],
  }

  return text.split('').map(char => {
    if (Math.random() > intensity * 0.4) return char

    const lower = char.toLowerCase()
    if (replacements[lower] && Math.random() < 0.5) {
      const options = replacements[lower]
      return options[Math.floor(Math.random() * options.length)]
    }

    return char
  }).join('')
}

/**
 * Insert glitch markers into text
 */
export function insertGlitchMarkers(text: string, intensity: number): string {
  if (intensity < 0.3) return text

  const markers = [
    '[s̸t̵a̴t̷i̶c̵]',
    '[g̷l̶i̸t̶c̷h̴]',
    '[̷e̶r̷r̴o̶r̸]',
    '[̸b̶u̴f̷f̶e̸r̵i̶n̷g̸]',
    '∿̴∿̷∿̸',
    '̷[̶-̸-̷-̸]̴',
  ]

  // Add markers at sentence boundaries
  const sentences = text.split(/([.!?]+\s*)/)

  return sentences.map((segment, i) => {
    if (i % 2 === 0 && Math.random() < intensity * 0.4) {
      const marker = markers[Math.floor(Math.random() * markers.length)]
      return segment + ' ' + marker
    }
    return segment
  }).join('')
}

/**
 * Fragment text - make it feel like signal loss
 */
export function fragmentText(text: string, intensity: number): string {
  if (intensity < 0.5) return text

  const words = text.split(' ')

  return words.map(word => {
    if (Math.random() < intensity * 0.2) {
      // Drop part of the word
      const cutPoint = Math.floor(word.length * Math.random())
      return word.slice(0, cutPoint) + '—'
    }
    if (Math.random() < intensity * 0.15) {
      // Repeat part of the word
      const repeatPoint = Math.floor(word.length * 0.5)
      const fragment = word.slice(0, repeatPoint)
      return fragment + '-' + fragment + '-' + word
    }
    return word
  }).join(' ')
}

/**
 * Main glitch processing pipeline
 */
export function processGlitch(
  text: string,
  config: GlitchConfig
): GlitchResult {
  let processed = text

  // Layer 1: Zalgo corruption (most intense)
  if (config.intensity > 0.3) {
    const zalgoResult = glitchText(processed, config)
    processed = zalgoResult.text
  }

  // Layer 2: Text degradation (medium)
  if (config.intensity > 0.2) {
    processed = degradeText(processed, config.intensity * 0.6)
  }

  // Layer 3: Fragmentation (signal loss)
  if (config.intensity > 0.5) {
    processed = fragmentText(processed, config.intensity * 0.8)
  }

  // Layer 4: Glitch markers
  if (config.intensity > 0.25) {
    processed = insertGlitchMarkers(processed, config.intensity)
  }

  return {
    text: processed,
    wasGlitched: processed !== text,
    intensity: config.intensity
  }
}
