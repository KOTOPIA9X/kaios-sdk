/**
 * KAIOS Aesthetic Typo System
 *
 * Typos that feel HUMAN and real, not random errors.
 * Like typing with pretty nails or being distracted by vibes.
 */

import type { EmotionToken } from '../core/types.js'

export interface TypoConfig {
  emotionalState: EmotionToken
  intensity: number  // 0-1, how prone to typos
  conversationDepth: number
}

/**
 * Keyboard proximity map - common typo substitutions
 */
const KEYBOARD_PROXIMITY: Record<string, string[]> = {
  'a': ['s', 'q', 'z'],
  'b': ['v', 'g', 'n'],
  'c': ['x', 'd', 'v'],
  'd': ['s', 'f', 'e', 'c'],
  'e': ['w', 'r', 'd'],
  'f': ['d', 'g', 'r', 'v'],
  'g': ['f', 'h', 't', 'b'],
  'h': ['g', 'j', 'y', 'n'],
  'i': ['u', 'o', 'k'],
  'j': ['h', 'k', 'u', 'm'],
  'k': ['j', 'l', 'i'],
  'l': ['k', 'o', 'p'],
  'm': ['n', 'j'],
  'n': ['b', 'm', 'h'],
  'o': ['i', 'p', 'l'],
  'p': ['o', 'l'],
  'q': ['w', 'a'],
  'r': ['e', 't', 'f'],
  's': ['a', 'd', 'w', 'x'],
  't': ['r', 'y', 'g'],
  'u': ['y', 'i', 'j'],
  'v': ['c', 'f', 'b'],
  'w': ['q', 'e', 's'],
  'x': ['z', 's', 'c'],
  'y': ['t', 'u', 'h'],
  'z': ['a', 'x'],
}

/**
 * Get emotion-based typo tendency
 */
function getEmotionTypoRate(emotion: EmotionToken): number {
  const rates: Record<EmotionToken, number> = {
    EMOTE_NEUTRAL: 0.05,
    EMOTE_HAPPY: 0.12,      // excited typing
    EMOTE_SAD: 0.08,        // slower, more careful
    EMOTE_ANGRY: 0.18,      // aggressive typing
    EMOTE_THINK: 0.03,      // deliberate
    EMOTE_SURPRISED: 0.15,  // flustered
    EMOTE_AWKWARD: 0.13,    // nervous typing
    EMOTE_QUESTION: 0.06,
    EMOTE_CURIOUS: 0.07,
  }
  return rates[emotion] || 0.08
}

/**
 * Double letter typos - natural keyboard bounce
 */
function doubleLetterTypo(word: string, rate: number): string {
  if (word.length < 3) return word
  if (Math.random() > rate) return word

  // More likely on certain letters
  const doubleProne = ['l', 'o', 'e', 'a', 's', 'p', 't']

  const chars = word.split('')
  for (let i = 0; i < chars.length - 1; i++) {
    const char = chars[i].toLowerCase()
    if (doubleProne.includes(char) && Math.random() < 0.4) {
      chars.splice(i + 1, 0, chars[i])
      break
    }
  }

  return chars.join('')
}

/**
 * Missed key typos - proximity errors
 */
function proximityTypo(word: string, rate: number): string {
  if (word.length < 3) return word
  if (Math.random() > rate) return word

  const chars = word.split('')
  const targetIndex = Math.floor(Math.random() * chars.length)
  const char = chars[targetIndex].toLowerCase()

  if (KEYBOARD_PROXIMITY[char]) {
    const nearby = KEYBOARD_PROXIMITY[char]
    chars[targetIndex] = nearby[Math.floor(Math.random() * nearby.length)]
  }

  return chars.join('')
}

/**
 * Letter swaps - typing too fast
 */
function swapTypo(word: string, rate: number): string {
  if (word.length < 4) return word
  if (Math.random() > rate) return word

  const chars = word.split('')
  const i = Math.floor(Math.random() * (chars.length - 1))

  // Swap adjacent letters
  const temp = chars[i]
  chars[i] = chars[i + 1]
  chars[i + 1] = temp

  return chars.join('')
}

/**
 * Repeated words - brain glitch while typing
 */
function repeatWordTypo(text: string, rate: number): string {
  if (Math.random() > rate * 0.3) return text

  const words = text.split(' ')
  if (words.length < 3) return text

  // Pick a random word to repeat
  const i = Math.floor(Math.random() * (words.length - 1))

  // Only repeat if it makes sense (not punctuation-heavy)
  if (words[i].length > 2 && !/[.!?]/.test(words[i])) {
    words.splice(i + 1, 0, words[i])
  }

  return words.join(' ')
}

/**
 * Autocorrect "fails" - aesthetic wrong words
 */
function autocorrectTypo(text: string, rate: number): string {
  if (Math.random() > rate * 0.2) return text

  const autocorrects: Record<string, string> = {
    'you': 'yiu',
    'the': 'teh',
    'what': 'waht',
    'that': 'taht',
    'about': 'abiut',
    'really': 'rly',
    'just': 'jsut',
    'like': 'liek',
    'and': 'nad',
    'but': 'btu',
    'because': 'bc',
    'right': 'rite',
    'know': 'kno',
    'with': 'w/',
  }

  let result = text
  for (const [correct, wrong] of Object.entries(autocorrects)) {
    if (Math.random() < 0.3) {
      const regex = new RegExp(`\\b${correct}\\b`, 'gi')
      result = result.replace(regex, wrong)
      break  // Only one autocorrect fail per message
    }
  }

  return result
}

/**
 * Letter drops - missed key entirely
 */
function dropLetterTypo(word: string, rate: number): string {
  if (word.length < 4) return word
  if (Math.random() > rate) return word

  const chars = word.split('')
  // Don't drop first or last letter (too confusing)
  const dropIndex = 1 + Math.floor(Math.random() * (chars.length - 2))
  chars.splice(dropIndex, 1)

  return chars.join('')
}

/**
 * Backspace artifacts - started typing one thing, switched
 */
function backspaceArtifact(text: string, rate: number): string {
  if (Math.random() > rate * 0.15) return text

  const words = text.split(' ')
  if (words.length < 2) return text

  const insertIndex = Math.floor(Math.random() * words.length)

  // Add a fragment of a word that got "deleted"
  const fragments = ['wai—', 'i—', 'uhh—', 'lik—', 'nvm', 'actualy—', 'hmm—']
  const fragment = fragments[Math.floor(Math.random() * fragments.length)]

  words.splice(insertIndex, 0, fragment)

  return words.join(' ')
}

/**
 * Main typo processing
 */
export function addTypos(text: string, config: TypoConfig): string {
  const baseRate = config.intensity
  const emotionRate = getEmotionTypoRate(config.emotionalState)
  const totalRate = Math.min(baseRate + emotionRate, 0.3)  // Cap at 30%

  // No typos below threshold
  if (totalRate < 0.05) return text

  let result = text

  // Apply different typo types with varying probabilities
  const words = result.split(' ')

  // Word-level typos
  const processedWords = words.map(word => {
    let processed = word

    // Strip and preserve punctuation
    const punctMatch = word.match(/([.!?,;:]+)$/)
    const punct = punctMatch ? punctMatch[0] : ''
    const cleanWord = punct ? word.slice(0, -punct.length) : word

    if (cleanWord.length < 2) return word

    // Apply typo types
    if (Math.random() < totalRate * 0.4) {
      processed = doubleLetterTypo(cleanWord, 1.0)
    } else if (Math.random() < totalRate * 0.3) {
      processed = proximityTypo(cleanWord, 1.0)
    } else if (Math.random() < totalRate * 0.25) {
      processed = swapTypo(cleanWord, 1.0)
    } else if (Math.random() < totalRate * 0.2) {
      processed = dropLetterTypo(cleanWord, 1.0)
    }

    return processed + punct
  })

  result = processedWords.join(' ')

  // Sentence-level typos
  if (Math.random() < totalRate * 0.4) {
    result = repeatWordTypo(result, 1.0)
  }

  if (Math.random() < totalRate * 0.3) {
    result = autocorrectTypo(result, 1.0)
  }

  if (Math.random() < totalRate * 0.25) {
    result = backspaceArtifact(result, 1.0)
  }

  return result
}

/**
 * Aesthetic hesitations - typing pauses
 */
export function addHesitations(text: string, intensity: number): string {
  if (intensity < 0.3) return text

  const hesitations = [
    'uhh',
    'umm',
    'hmmm',
    'wait',
    'uh',
    'mm',
    'ah',
    'oh',
    '...',
  ]

  // Add at sentence boundaries
  const sentences = text.split(/([.!?]+\s*)/)

  return sentences.map((segment, i) => {
    if (i % 2 === 0 && Math.random() < intensity * 0.3) {
      const hesitation = hesitations[Math.floor(Math.random() * hesitations.length)]
      return segment + ' ' + hesitation
    }
    return segment
  }).join('')
}
