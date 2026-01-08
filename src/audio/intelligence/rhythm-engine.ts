/**
 * KAIOS Rhythm Engine
 *
 * Mathematical rhythm generation using:
 * - Euclidean rhythms (Bjorklund's algorithm)
 * - Fibonacci timing
 * - Golden ratio subdivisions
 * - Polyrhythms
 * - Breakcore chops
 */

import { FIBONACCI, PHI } from './music-theory.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface RhythmPattern {
  name: string
  pattern: number[]       // 1 = hit, 0 = rest
  subdivision: number     // How many divisions per beat
  swing: number           // 0-1, amount of swing
  humanize: number        // 0-1, timing variation
}

export interface BreakPattern {
  name: string
  slices: BreakSlice[]
  originalBPM: number
}

export interface BreakSlice {
  start: number           // 0-1 position in original
  duration: number        // 0-1 length
  pitch: number           // Semitones shift (-12 to +12)
  reverse: boolean
  volume: number          // 0-1
  filter?: number         // Lowpass cutoff hz
  stutter?: number        // Repeat count
}

// ════════════════════════════════════════════════════════════════════════════════
// EUCLIDEAN RHYTHMS (Bjorklund's Algorithm)
// Mathematical patterns found in world music traditions
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate Euclidean rhythm using Bjorklund's algorithm
 * Distributes k hits as evenly as possible over n steps
 *
 * @param hits - Number of hits (k)
 * @param steps - Total steps (n)
 * @param rotation - Rotate pattern by this many steps
 *
 * Examples of famous Euclidean rhythms:
 * - E(3,8) = Tresillo (Cuban)
 * - E(5,8) = Cinquillo (Cuban/African)
 * - E(7,16) = Brazilian Samba
 * - E(5,12) = South African Venda
 * - E(4,9) = Turkey aksak
 * - E(5,9) = Arab rhythm
 */
export function euclidean(hits: number, steps: number, rotation: number = 0): number[] {
  if (hits >= steps) return Array(steps).fill(1)
  if (hits === 0) return Array(steps).fill(0)

  // Bjorklund's algorithm
  let pattern: number[][] = []

  // Start with hits 1s and (steps-hits) 0s
  for (let i = 0; i < hits; i++) pattern.push([1])
  for (let i = 0; i < steps - hits; i++) pattern.push([0])

  // Recursively distribute
  while (true) {
    const lastIndex = pattern.length - 1
    const lastValue = pattern[lastIndex]

    // Find how many of the last value exist at the end
    let count = 0
    for (let i = lastIndex; i >= 0; i--) {
      if (JSON.stringify(pattern[i]) === JSON.stringify(lastValue)) {
        count++
      } else {
        break
      }
    }

    // If only one type left or count is 1, we're done
    if (count === pattern.length || count <= 1) break

    // Distribute
    const distributed: number[][] = []
    const remaining: number[][] = []

    for (let i = 0; i < pattern.length; i++) {
      if (i < pattern.length - count) {
        distributed.push(pattern[i])
      } else {
        remaining.push(pattern[i])
      }
    }

    // Append remaining to distributed
    pattern = []
    for (let i = 0; i < Math.max(distributed.length, remaining.length); i++) {
      if (i < distributed.length && i < remaining.length) {
        pattern.push([...distributed[i], ...remaining[i]])
      } else if (i < distributed.length) {
        pattern.push(distributed[i])
      } else {
        pattern.push(remaining[i])
      }
    }
  }

  // Flatten
  const result = pattern.flat()

  // Rotate
  if (rotation !== 0) {
    const r = ((rotation % steps) + steps) % steps
    return [...result.slice(r), ...result.slice(0, r)]
  }

  return result
}

/** Common Euclidean patterns with cultural origins */
export const EUCLIDEAN_PATTERNS: Record<string, { hits: number; steps: number; name: string }> = {
  tresillo: { hits: 3, steps: 8, name: 'Cuban Tresillo' },
  cinquillo: { hits: 5, steps: 8, name: 'Afro-Cuban Cinquillo' },
  clave32: { hits: 5, steps: 16, name: 'Son Clave 3-2' },
  clave23: { hits: 5, steps: 16, name: 'Son Clave 2-3' },
  samba: { hits: 7, steps: 16, name: 'Brazilian Samba' },
  venda: { hits: 5, steps: 12, name: 'South African Venda' },
  aksak: { hits: 4, steps: 9, name: 'Turkish Aksak' },
  arabic: { hits: 5, steps: 9, name: 'Arabic Rhythm' },
  gahu: { hits: 7, steps: 12, name: 'Ghanaian Gahu' },
  bembe: { hits: 7, steps: 12, name: 'West African Bembe' },
  fourFloor: { hits: 4, steps: 16, name: 'Four on the Floor' },
  offbeat: { hits: 4, steps: 16, name: 'Offbeat Hi-hat' },
}

// ════════════════════════════════════════════════════════════════════════════════
// FIBONACCI & GOLDEN RATIO RHYTHMS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate rhythm based on Fibonacci sequence
 * Creates organic, mathematically pleasing patterns
 */
export function fibonacciRhythm(length: number, density: number = 0.5): number[] {
  const pattern: number[] = Array(length).fill(0)
  const fibSet = new Set(FIBONACCI.filter(n => n <= length))

  // Place hits at Fibonacci positions
  for (let i = 0; i < length; i++) {
    if (fibSet.has(i + 1)) {
      pattern[i] = 1
    }
  }

  // Adjust density by adding/removing hits
  const currentDensity = pattern.filter(x => x === 1).length / length

  if (currentDensity < density) {
    // Add hits at golden ratio subdivisions
    const toAdd = Math.floor((density - currentDensity) * length)
    for (let i = 0; i < toAdd && i < length; i++) {
      const pos = Math.floor((i * PHI * length) % length)
      pattern[pos] = 1
    }
  }

  return pattern
}

/**
 * Generate timing offsets based on golden ratio
 * Creates natural-feeling groove
 */
export function goldenGroove(steps: number): number[] {
  const offsets: number[] = []

  for (let i = 0; i < steps; i++) {
    // Apply golden ratio micro-timing
    const baseOffset = (i * PHI) % 1
    const groove = (baseOffset - 0.5) * 0.1 // ±5% swing
    offsets.push(groove)
  }

  return offsets
}

// ════════════════════════════════════════════════════════════════════════════════
// POLYRHYTHMS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate polyrhythm combining two different subdivisions
 * e.g., 3 against 4, 5 against 3
 */
export function polyrhythm(a: number, b: number, steps: number): { layerA: number[]; layerB: number[] } {
  const lcm = (a * b) / gcd(a, b)
  const scaledSteps = Math.max(steps, lcm)

  const layerA: number[] = Array(scaledSteps).fill(0)
  const layerB: number[] = Array(scaledSteps).fill(0)

  // Place hits for rhythm A
  const stepA = scaledSteps / a
  for (let i = 0; i < a; i++) {
    layerA[Math.floor(i * stepA)] = 1
  }

  // Place hits for rhythm B
  const stepB = scaledSteps / b
  for (let i = 0; i < b; i++) {
    layerB[Math.floor(i * stepB)] = 1
  }

  return { layerA, layerB }
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/** Common polyrhythm combinations */
export const POLYRHYTHMS: Record<string, [number, number]> = {
  threeAgainstTwo: [3, 2],    // West African
  fourAgainstThree: [4, 3],   // Jazz
  fiveAgainstFour: [5, 4],    // Complex groove
  fiveAgainstThree: [5, 3],   // Very complex
  sevenAgainstFour: [7, 4],   // Extreme
  threeAgainstFour: [3, 4],   // Same as 4:3 reversed
}

// ════════════════════════════════════════════════════════════════════════════════
// SWING & HUMANIZATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Apply swing to a rhythm pattern
 * Delays every other subdivision
 */
export function applySwing(
  pattern: number[],
  swingAmount: number = 0.3,
  subdivision: number = 2
): { pattern: number[]; timings: number[] } {
  const timings: number[] = []

  for (let i = 0; i < pattern.length; i++) {
    const subPos = i % subdivision
    let timing = i / pattern.length

    // Delay odd subdivisions
    if (subPos % 2 === 1) {
      timing += (swingAmount * 0.5) / pattern.length
    }

    timings.push(timing)
  }

  return { pattern, timings }
}

/**
 * Add humanization (random timing variations)
 * Makes robotic patterns feel more natural
 */
export function humanize(timings: number[], amount: number = 0.02): number[] {
  return timings.map(t => {
    const variation = (Math.random() - 0.5) * 2 * amount
    return t + variation
  })
}

/**
 * Apply velocity variation for more dynamic feel
 */
export function velocityVariation(
  pattern: number[],
  accentPattern?: number[]
): number[] {
  const velocities: number[] = []

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 0) {
      velocities.push(0)
      continue
    }

    let velocity = 0.7 + Math.random() * 0.2 // Base velocity 0.7-0.9

    // Apply accent pattern if provided
    if (accentPattern && accentPattern[i % accentPattern.length] === 1) {
      velocity = Math.min(1, velocity + 0.2)
    }

    // Natural downbeat emphasis
    if (i % 4 === 0) velocity = Math.min(1, velocity + 0.1)

    velocities.push(velocity)
  }

  return velocities
}

// ════════════════════════════════════════════════════════════════════════════════
// BREAKCORE PATTERNS
// ════════════════════════════════════════════════════════════════════════════════

/** The legendary Amen Break slices */
export const AMEN_SLICES: BreakSlice[] = [
  { start: 0, duration: 0.125, pitch: 0, reverse: false, volume: 1 },      // Kick
  { start: 0.125, duration: 0.125, pitch: 0, reverse: false, volume: 0.9 }, // Snare
  { start: 0.25, duration: 0.125, pitch: 0, reverse: false, volume: 0.8 },  // Hat
  { start: 0.375, duration: 0.125, pitch: 0, reverse: false, volume: 0.9 }, // Snare
  { start: 0.5, duration: 0.125, pitch: 0, reverse: false, volume: 1 },     // Kick
  { start: 0.625, duration: 0.125, pitch: 0, reverse: false, volume: 0.8 }, // Hat
  { start: 0.75, duration: 0.125, pitch: 0, reverse: false, volume: 0.9 },  // Snare
  { start: 0.875, duration: 0.125, pitch: 0, reverse: false, volume: 0.7 }, // Hat
]

/**
 * Generate breakcore chop pattern
 * Randomly rearranges, pitches, and effects slices
 */
export function generateBreakcoreChops(
  slices: BreakSlice[],
  intensity: number = 0.5,
  length: number = 16
): BreakSlice[] {
  const chops: BreakSlice[] = []

  for (let i = 0; i < length; i++) {
    // Pick a random slice
    const originalSlice = slices[Math.floor(Math.random() * slices.length)]

    const chop: BreakSlice = {
      ...originalSlice,
      start: originalSlice.start,
      duration: originalSlice.duration,
    }

    // Apply random transformations based on intensity
    if (Math.random() < intensity * 0.5) {
      // Random pitch shift
      chop.pitch = Math.floor((Math.random() - 0.5) * 12 * intensity)
    }

    if (Math.random() < intensity * 0.3) {
      // Reverse
      chop.reverse = true
    }

    if (Math.random() < intensity * 0.4) {
      // Stutter
      chop.stutter = Math.floor(Math.random() * 4) + 2
    }

    if (Math.random() < intensity * 0.3) {
      // Slice in half
      chop.duration = chop.duration / 2
    }

    if (Math.random() < intensity * 0.2) {
      // Filter sweep
      chop.filter = 200 + Math.random() * 2000
    }

    // Volume variation
    chop.volume = 0.6 + Math.random() * 0.4

    chops.push(chop)
  }

  return chops
}

/**
 * Generate a thought-amen pattern (intelligent chops)
 * Uses Euclidean distribution for more musical results
 */
export function thoughtAmen(
  complexity: number = 0.5,
  bars: number = 2
): { kicks: number[]; snares: number[]; hats: number[]; chops: BreakSlice[] } {
  const steps = bars * 16

  // Euclidean patterns for each drum element
  const kickHits = Math.floor(4 * bars * (1 - complexity * 0.5))
  const snareHits = Math.floor(4 * bars)
  const hatHits = Math.floor(8 * bars * (1 + complexity * 0.5))

  const kicks = euclidean(kickHits, steps)
  const snares = euclidean(snareHits, steps, 4) // Offset for backbeat
  const hats = euclidean(hatHits, steps)

  // Generate intelligent chops
  const chops: BreakSlice[] = []

  for (let i = 0; i < steps; i++) {
    // Determine what happens at this step
    const hasKick = kicks[i] === 1
    const hasSnare = snares[i] === 1
    const hasHat = hats[i] === 1

    if (hasKick) {
      chops.push({
        start: 0,
        duration: 0.125,
        pitch: Math.random() < complexity ? Math.floor((Math.random() - 0.5) * 4) : 0,
        reverse: false,
        volume: 0.9 + Math.random() * 0.1,
        stutter: Math.random() < complexity * 0.3 ? 2 : undefined,
      })
    }

    if (hasSnare) {
      chops.push({
        start: 0.125,
        duration: 0.125,
        pitch: Math.random() < complexity * 0.5 ? Math.floor((Math.random() - 0.5) * 6) : 0,
        reverse: Math.random() < complexity * 0.2,
        volume: 0.85 + Math.random() * 0.15,
      })
    }

    if (hasHat && !hasKick && !hasSnare) {
      chops.push({
        start: 0.25 + Math.random() * 0.25,
        duration: 0.0625,
        pitch: Math.floor(Math.random() * 3),
        reverse: false,
        volume: 0.5 + Math.random() * 0.3,
      })
    }
  }

  return { kicks, snares, hats, chops }
}

// ════════════════════════════════════════════════════════════════════════════════
// GENRE PATTERNS
// ════════════════════════════════════════════════════════════════════════════════

/** Lo-fi beat patterns */
export const LOFI_PATTERNS: Record<string, RhythmPattern> = {
  dustyBoom: {
    name: 'Dusty Boom Bap',
    pattern: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    subdivision: 16,
    swing: 0.2,
    humanize: 0.03,
  },
  lateNight: {
    name: 'Late Night',
    pattern: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    subdivision: 16,
    swing: 0.15,
    humanize: 0.02,
  },
  jazzySwing: {
    name: 'Jazzy Swing',
    pattern: [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
    subdivision: 12, // Triplet feel
    swing: 0.3,
    humanize: 0.04,
  },
  rainyDay: {
    name: 'Rainy Day',
    pattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    subdivision: 16,
    swing: 0.1,
    humanize: 0.05,
  },
}

/** Breakcore patterns */
export const BREAKCORE_PATTERNS: Record<string, RhythmPattern> = {
  amenChop: {
    name: 'Amen Chop',
    pattern: euclidean(7, 16),
    subdivision: 16,
    swing: 0,
    humanize: 0,
  },
  glitchCore: {
    name: 'Glitch Core',
    pattern: euclidean(11, 16),
    subdivision: 16,
    swing: 0,
    humanize: 0,
  },
  jungleist: {
    name: 'Jungleist',
    pattern: euclidean(9, 16, 2),
    subdivision: 16,
    swing: 0.05,
    humanize: 0.01,
  },
  speedcore: {
    name: 'Speedcore',
    pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    subdivision: 16,
    swing: 0,
    humanize: 0,
  },
}

/** Cottagecore / peaceful patterns */
export const COTTAGECORE_PATTERNS: Record<string, RhythmPattern> = {
  gentleWaltz: {
    name: 'Gentle Waltz',
    pattern: [1, 0, 0, 1, 0, 0],
    subdivision: 6,
    swing: 0,
    humanize: 0.03,
  },
  forestDance: {
    name: 'Forest Dance',
    pattern: [1, 0, 1, 0, 0, 1, 0, 0],
    subdivision: 8,
    swing: 0.1,
    humanize: 0.04,
  },
  meadowStroll: {
    name: 'Meadow Stroll',
    pattern: fibonacciRhythm(8, 0.4),
    subdivision: 8,
    swing: 0.15,
    humanize: 0.05,
  },
}

// ════════════════════════════════════════════════════════════════════════════════
// RHYTHM GENERATION
// ════════════════════════════════════════════════════════════════════════════════

export interface RhythmGeneratorOptions {
  genre: 'lofi' | 'breakcore' | 'cottagecore' | 'frutiger' | 'ambient'
  complexity: number       // 0-1
  energy: number           // 0-1
  bpm: number
  swing: number            // 0-1
}

/**
 * Generate a complete rhythm section for given parameters
 */
export function generateRhythm(options: RhythmGeneratorOptions): {
  kick: RhythmPattern
  snare: RhythmPattern
  hat: RhythmPattern
  percussion: RhythmPattern
  polyLayer?: RhythmPattern
} {
  const { genre, complexity, energy } = options

  let kick: number[]
  let snare: number[]
  let hat: number[]
  let percussion: number[]

  switch (genre) {
    case 'breakcore':
      // High complexity Euclidean patterns
      kick = euclidean(Math.floor(4 + complexity * 6), 16)
      snare = euclidean(Math.floor(4 + complexity * 4), 16, 4)
      hat = euclidean(Math.floor(8 + complexity * 8), 16)
      percussion = euclidean(Math.floor(3 + complexity * 5), 16, 2)
      break

    case 'lofi':
      // Laid back, swung patterns
      kick = euclidean(Math.floor(3 + complexity * 2), 16)
      snare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] // Backbeat
      hat = euclidean(Math.floor(6 + complexity * 4), 16)
      percussion = fibonacciRhythm(16, 0.2 + complexity * 0.2)
      break

    case 'cottagecore':
      // Gentle, organic patterns
      kick = euclidean(Math.floor(2 + complexity), 8)
      snare = fibonacciRhythm(8, 0.3)
      hat = euclidean(Math.floor(3 + complexity * 2), 8)
      percussion = goldenGroove(8).map(g => Math.abs(g) > 0.03 ? 1 : 0)
      break

    case 'frutiger':
      // Clean, optimistic, bouncy
      kick = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
      snare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
      hat = euclidean(8 + Math.floor(energy * 4), 16)
      percussion = euclidean(Math.floor(2 + complexity * 3), 16, 1)
      break

    case 'ambient':
    default:
      // Sparse, meditative
      kick = fibonacciRhythm(16, 0.15)
      snare = fibonacciRhythm(16, 0.1)
      hat = euclidean(Math.floor(2 + complexity * 3), 16)
      percussion = goldenGroove(16).map(g => Math.abs(g) > 0.04 ? 1 : 0)
      break
  }

  const baseSwing = genre === 'lofi' ? 0.2 : genre === 'breakcore' ? 0 : 0.1

  return {
    kick: {
      name: `${genre}-kick`,
      pattern: kick,
      subdivision: 16,
      swing: baseSwing + options.swing * 0.2,
      humanize: genre === 'breakcore' ? 0 : 0.02 + complexity * 0.02,
    },
    snare: {
      name: `${genre}-snare`,
      pattern: snare,
      subdivision: 16,
      swing: baseSwing + options.swing * 0.2,
      humanize: genre === 'breakcore' ? 0 : 0.03,
    },
    hat: {
      name: `${genre}-hat`,
      pattern: hat,
      subdivision: 16,
      swing: baseSwing + options.swing * 0.3,
      humanize: 0.01 + complexity * 0.02,
    },
    percussion: {
      name: `${genre}-perc`,
      pattern: percussion,
      subdivision: 16,
      swing: baseSwing,
      humanize: 0.03,
    },
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export const RhythmEngine = {
  euclidean,
  EUCLIDEAN_PATTERNS,
  fibonacciRhythm,
  goldenGroove,
  polyrhythm,
  POLYRHYTHMS,
  applySwing,
  humanize,
  velocityVariation,
  AMEN_SLICES,
  generateBreakcoreChops,
  thoughtAmen,
  LOFI_PATTERNS,
  BREAKCORE_PATTERNS,
  COTTAGECORE_PATTERNS,
  generateRhythm,
}
