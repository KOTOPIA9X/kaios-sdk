/**
 * KAIOS DJ Engine
 *
 * Professional DJ techniques and audio manipulation:
 * - Chop & Screw (Houston hip-hop style)
 * - Beat matching & mixing
 * - Sample chopping & rearrangement
 * - Transitions & effects
 * - Live manipulation controls
 */

import { PHI, FIBONACCI } from './music-theory.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface ChopAndScrewConfig {
  slowdown: number          // 0.6-1.0 (1.0 = normal speed)
  pitchShift: number        // Semitones (-12 to 0)
  chopDensity: number       // 0-1 (how often to chop)
  screwIntensity: number    // 0-1 (how much to slow/pitch certain parts)
  reverb: number            // 0-1
  phaser: number            // 0-1
}

export interface ChopPoint {
  time: number              // 0-1 position in sample
  duration: number          // Length of chop
  repeat: number            // Times to repeat
  pitchOffset: number       // Additional pitch shift
  reverse: boolean
  fadeIn: number            // 0-1
  fadeOut: number           // 0-1
}

export interface TransitionConfig {
  type: 'cut' | 'fade' | 'filter' | 'beatmatch' | 'backspin' | 'echo' | 'stutter'
  duration: number          // Beats
  curve: 'linear' | 'exponential' | 'logarithmic' | 's-curve'
  effectIntensity: number   // 0-1
}

export interface BeatInfo {
  bpm: number
  timeSignature: [number, number]
  beatPositions: number[]   // Normalized 0-1 positions
  downbeats: number[]       // Strong beat positions
  transients: number[]      // Peak positions (snare hits, etc)
}

export interface MixPoint {
  trackA: { position: number; volume: number; filter: number }
  trackB: { position: number; volume: number; filter: number }
  crossfade: number         // -1 (A) to 1 (B)
}

export interface StutterConfig {
  divisions: number         // How many divisions (2, 4, 8, 16, etc)
  pattern: number[]         // Which divisions to play
  pitchRamp: number         // Pitch change per repeat (-12 to 12)
  volumeDecay: number       // 0-1 decay per repeat
  gateLength: number        // 0-1 of division
}

// ════════════════════════════════════════════════════════════════════════════════
// CHOP & SCREW (Houston Style)
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate chop & screw parameters for a sample
 * Pioneered by DJ Screw in Houston, characterized by:
 * - Slowed tempo (60-70% of original)
 * - Pitched down vocals and instruments
 * - Chopped/repeated sections
 * - Heavy reverb and delay
 */
export function generateChopAndScrew(
  _duration: number,
  intensity: number = 0.7
): { config: ChopAndScrewConfig; chops: ChopPoint[] } {
  // Classic chopped and screwed settings
  const config: ChopAndScrewConfig = {
    slowdown: 0.85 - intensity * 0.2,         // 65-85% speed
    pitchShift: -3 - Math.floor(intensity * 4), // -3 to -7 semitones
    chopDensity: 0.2 + intensity * 0.4,       // How often to chop
    screwIntensity: intensity,
    reverb: 0.4 + intensity * 0.4,            // Heavy reverb
    phaser: 0.2 + intensity * 0.3,            // Syrupy phaser
  }

  // Generate chop points using golden ratio for organic feel
  const chops: ChopPoint[] = []
  let position = 0

  while (position < 1) {
    // Use golden ratio for spacing
    const gap = (1 / PHI) * (0.1 + Math.random() * 0.2)
    position += gap

    if (position >= 1) break

    // Decide if we chop here based on density
    if (Math.random() < config.chopDensity) {
      const chopLength = 0.02 + Math.random() * 0.08 // Short chops

      chops.push({
        time: position,
        duration: chopLength,
        repeat: Math.random() < 0.5 ? 2 : Math.random() < 0.3 ? 3 : 1,
        pitchOffset: Math.random() < 0.3 ? -2 : 0,
        reverse: Math.random() < 0.1,
        fadeIn: Math.random() < 0.2 ? 0.1 : 0,
        fadeOut: Math.random() < 0.3 ? 0.2 : 0,
      })
    }
  }

  return { config, chops }
}

/**
 * DJ Screw-style vocal chop
 * Repeats a word/syllable with slowdown
 */
export function screwVocal(
  position: number,
  syllableLength: number = 0.1
): ChopPoint[] {
  const chops: ChopPoint[] = []

  // Classic "screw" technique - repeat 2-4 times, getting slower
  const repeats = 2 + Math.floor(Math.random() * 3)

  for (let i = 0; i < repeats; i++) {
    chops.push({
      time: position,
      duration: syllableLength * (1 + i * 0.1), // Each repeat slightly longer
      repeat: 1,
      pitchOffset: -i * 0.5, // Slight pitch drop each repeat
      reverse: false,
      fadeIn: 0,
      fadeOut: i === repeats - 1 ? 0.3 : 0,
    })
  }

  return chops
}

// ════════════════════════════════════════════════════════════════════════════════
// BEAT MATCHING & DETECTION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Calculate BPM from beat positions
 */
export function calculateBPM(beatPositions: number[], durationMs: number): number {
  if (beatPositions.length < 2) return 120 // Default

  // Calculate average beat interval
  let totalInterval = 0
  for (let i = 1; i < beatPositions.length; i++) {
    totalInterval += beatPositions[i] - beatPositions[i - 1]
  }
  const avgInterval = totalInterval / (beatPositions.length - 1)

  // Convert to BPM
  const intervalMs = avgInterval * durationMs
  return Math.round(60000 / intervalMs)
}

/**
 * Generate beat positions for a given BPM and duration
 */
export function generateBeatGrid(
  bpm: number,
  durationMs: number,
  timeSignature: [number, number] = [4, 4]
): BeatInfo {
  const beatMs = 60000 / bpm
  const totalBeats = Math.floor(durationMs / beatMs)

  const beatPositions: number[] = []
  const downbeats: number[] = []
  const transients: number[] = []

  for (let i = 0; i < totalBeats; i++) {
    const position = (i * beatMs) / durationMs
    beatPositions.push(position)

    // Downbeats (first beat of each bar)
    if (i % timeSignature[0] === 0) {
      downbeats.push(position)
    }

    // Typical snare positions (2 and 4 in 4/4)
    if (timeSignature[0] === 4 && (i % 4 === 1 || i % 4 === 3)) {
      transients.push(position)
    }
  }

  return { bpm, timeSignature, beatPositions, downbeats, transients }
}

/**
 * Calculate time stretch ratio to match two BPMs
 */
export function calculateStretchRatio(sourceBPM: number, targetBPM: number): number {
  return targetBPM / sourceBPM
}

/**
 * Find the best mix point between two tracks
 * Looks for compatible beat/phrase alignments
 */
export function findMixPoint(
  trackA: BeatInfo,
  _trackB: BeatInfo,
  preferredPosition: number = 0.75 // Near end of track A
): MixPoint {
  // Find nearest downbeat to preferred position
  const nearestDownbeatA = trackA.downbeats.reduce((prev, curr) =>
    Math.abs(curr - preferredPosition) < Math.abs(prev - preferredPosition) ? curr : prev
  )

  return {
    trackA: {
      position: nearestDownbeatA,
      volume: 1,
      filter: 1, // Full brightness
    },
    trackB: {
      position: 0, // Start of track B
      volume: 0,
      filter: 0.5, // Start filtered
    },
    crossfade: -1, // Start on A
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// TRANSITIONS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate transition parameters
 */
export function generateTransition(
  type: TransitionConfig['type'],
  bpm: number,
  intensity: number = 0.5
): TransitionConfig & { steps: TransitionStep[] } {
  const config: TransitionConfig = {
    type,
    duration: type === 'cut' ? 0 : type === 'stutter' ? 2 : 8,
    curve: type === 'filter' ? 's-curve' : 'linear',
    effectIntensity: intensity,
  }

  const steps = generateTransitionSteps(config, bpm)

  return { ...config, steps }
}

interface TransitionStep {
  time: number
  volumeA: number
  volumeB: number
  filterA: number
  filterB: number
  effect?: { type: string; value: number }
}

function generateTransitionSteps(config: TransitionConfig, _bpm: number): TransitionStep[] {
  const steps: TransitionStep[] = []
  const numSteps = Math.ceil(config.duration * 4) // 4 steps per beat

  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps

    let crossfade: number
    switch (config.curve) {
      case 'exponential':
        crossfade = Math.pow(t, 2)
        break
      case 'logarithmic':
        crossfade = Math.sqrt(t)
        break
      case 's-curve':
        crossfade = t * t * (3 - 2 * t) // Smoothstep
        break
      default:
        crossfade = t
    }

    const step: TransitionStep = {
      time: t,
      volumeA: 1 - crossfade,
      volumeB: crossfade,
      filterA: 1 - crossfade * 0.5, // A gets darker
      filterB: 0.5 + crossfade * 0.5, // B gets brighter
    }

    // Add type-specific effects
    switch (config.type) {
      case 'echo':
        step.effect = {
          type: 'delay',
          value: config.effectIntensity * (1 - Math.abs(t - 0.5) * 2),
        }
        break
      case 'filter':
        step.filterA = 1 - crossfade * 0.8
        step.filterB = 0.2 + crossfade * 0.8
        break
      case 'backspin':
        if (t > 0.3 && t < 0.5) {
          step.effect = { type: 'backspin', value: 1 - (t - 0.3) * 5 }
        }
        break
      case 'stutter':
        if (t < 0.5) {
          const stutterPos = Math.floor(t * 8) / 8
          step.effect = { type: 'stutter', value: stutterPos }
        }
        break
    }

    steps.push(step)
  }

  return steps
}

// ════════════════════════════════════════════════════════════════════════════════
// SAMPLE MANIPULATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate intelligent sample chop points
 * Uses transient detection concepts + golden ratio
 */
export function generateChopPoints(
  _duration: number,
  numChops: number,
  style: 'grid' | 'golden' | 'fibonacci' | 'random' = 'golden'
): number[] {
  const points: number[] = [0] // Always include start

  switch (style) {
    case 'grid':
      // Even divisions
      for (let i = 1; i < numChops; i++) {
        points.push(i / numChops)
      }
      break

    case 'golden':
      // Golden ratio divisions - sounds more natural
      for (let i = 1; i < numChops; i++) {
        points.push((i / PHI) % 1)
      }
      points.sort((a, b) => a - b)
      break

    case 'fibonacci':
      // Fibonacci-based divisions
      const fibSum = FIBONACCI.slice(0, numChops).reduce((a, b) => a + b, 0)
      let cumSum = 0
      for (let i = 0; i < Math.min(numChops, FIBONACCI.length); i++) {
        cumSum += FIBONACCI[i]
        points.push(cumSum / fibSum)
      }
      break

    case 'random':
      // Random but avoiding too-close points
      for (let i = 1; i < numChops; i++) {
        let point: number
        let attempts = 0
        do {
          point = Math.random()
          attempts++
        } while (
          attempts < 100 &&
          points.some(p => Math.abs(p - point) < 0.05)
        )
        points.push(point)
      }
      points.sort((a, b) => a - b)
      break
  }

  return points
}

/**
 * Rearrange sample slices in an interesting pattern
 */
export function rearrangeSlices(
  numSlices: number,
  style: 'shuffle' | 'reverse' | 'palindrome' | 'breakcore' | 'intelligent'
): number[] {
  const original = Array.from({ length: numSlices }, (_, i) => i)

  switch (style) {
    case 'shuffle':
      // Fisher-Yates shuffle
      const shuffled = [...original]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled

    case 'reverse':
      return [...original].reverse()

    case 'palindrome':
      return [...original, ...original.slice(0, -1).reverse()]

    case 'breakcore':
      // Chaotic but with some repeats
      const breakcore: number[] = []
      for (let i = 0; i < numSlices * 2; i++) {
        const slice = Math.floor(Math.random() * numSlices)
        breakcore.push(slice)
        // Sometimes repeat
        if (Math.random() < 0.3) {
          breakcore.push(slice)
        }
      }
      return breakcore

    case 'intelligent':
      // Keep musical structure but add variation
      const intelligent: number[] = []
      for (let i = 0; i < numSlices; i++) {
        intelligent.push(original[i])
        // Occasionally insert a callback to earlier slice
        if (i > 2 && Math.random() < 0.2) {
          intelligent.push(original[Math.floor(Math.random() * i)])
        }
      }
      return intelligent
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// STUTTER / GLITCH EFFECTS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate stutter effect parameters
 */
export function generateStutter(
  divisions: number = 8,
  style: 'buildup' | 'breakdown' | 'random' | 'trance'
): StutterConfig {
  let pattern: number[]
  let pitchRamp = 0
  let volumeDecay = 0

  switch (style) {
    case 'buildup':
      // Gets faster - start sparse, end dense
      pattern = [1, 0, 0, 0, 1, 0, 1, 1]
      pitchRamp = 0.5 // Slight pitch up
      volumeDecay = -0.05 // Gets louder
      break

    case 'breakdown':
      // Gets slower - start dense, end sparse
      pattern = [1, 1, 1, 0, 1, 0, 0, 0]
      pitchRamp = -0.5 // Pitch down
      volumeDecay = 0.1 // Gets quieter
      break

    case 'random':
      // Unpredictable
      pattern = Array.from({ length: divisions }, () =>
        Math.random() > 0.4 ? 1 : 0
      )
      pitchRamp = (Math.random() - 0.5) * 2
      volumeDecay = Math.random() * 0.2
      break

    case 'trance':
      // Classic trance gate
      pattern = [1, 0, 1, 0, 1, 0, 1, 0]
      pitchRamp = 0
      volumeDecay = 0
      break
  }

  return {
    divisions,
    pattern,
    pitchRamp,
    volumeDecay,
    gateLength: style === 'trance' ? 0.5 : 0.8,
  }
}

/**
 * Generate tape stop effect parameters
 */
export function generateTapeStop(durationMs: number): {
  pitchCurve: number[]
  speedCurve: number[]
} {
  const steps = Math.ceil(durationMs / 10) // 10ms steps
  const pitchCurve: number[] = []
  const speedCurve: number[] = []

  for (let i = 0; i < steps; i++) {
    const t = i / steps
    // Exponential slowdown
    const factor = Math.pow(1 - t, 2)
    speedCurve.push(factor)
    // Pitch follows speed (tape physics)
    pitchCurve.push(12 * Math.log2(factor)) // Semitones
  }

  return { pitchCurve, speedCurve }
}

/**
 * Generate vinyl scratch parameters
 */
export function generateScratch(
  style: 'baby' | 'chirp' | 'transform' | 'flare'
): { positions: number[]; speeds: number[] } {
  const positions: number[] = []
  const speeds: number[] = []

  switch (style) {
    case 'baby':
      // Simple back and forth
      for (let i = 0; i < 10; i++) {
        positions.push(Math.sin(i * 0.5) * 0.1)
        speeds.push(Math.cos(i * 0.5))
      }
      break

    case 'chirp':
      // Quick forward with cut
      positions.push(0, 0.05, 0.05, 0)
      speeds.push(1, 1, 0, 0)
      break

    case 'transform':
      // Stuttered scratch
      for (let i = 0; i < 8; i++) {
        positions.push(i * 0.02)
        speeds.push(i % 2 === 0 ? 1 : 0)
      }
      break

    case 'flare':
      // Complex pattern
      const flarePattern = [1, 0, 1, 0, 1, -1, 0, -1, 0, -1]
      for (let i = 0; i < flarePattern.length; i++) {
        positions.push(i * 0.015)
        speeds.push(flarePattern[i])
      }
      break
  }

  return { positions, speeds }
}

// ════════════════════════════════════════════════════════════════════════════════
// INTELLIGENT MIXING
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Analyze track compatibility for mixing
 */
export function analyzeCompatibility(
  trackA: { bpm: number; key: string },
  trackB: { bpm: number; key: string }
): {
  bpmCompatibility: number
  keyCompatibility: number
  overallScore: number
  suggestedStretch: number
} {
  // BPM compatibility (within 6% is good, can stretch)
  const bpmRatio = Math.min(trackA.bpm, trackB.bpm) / Math.max(trackA.bpm, trackB.bpm)
  const bpmCompatibility = bpmRatio > 0.94 ? 1 :
    bpmRatio > 0.88 ? 0.8 :
    bpmRatio > 0.75 ? 0.5 : 0.2

  // Key compatibility (using circle of fifths)
  const notes = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']
  const keyA = notes.indexOf(trackA.key.replace('m', ''))
  const keyB = notes.indexOf(trackB.key.replace('m', ''))
  const keyDistance = Math.min(
    Math.abs(keyA - keyB),
    12 - Math.abs(keyA - keyB)
  )

  // Same key or adjacent on circle of fifths is best
  const keyCompatibility = keyDistance === 0 ? 1 :
    keyDistance <= 1 ? 0.9 :
    keyDistance <= 2 ? 0.7 :
    keyDistance <= 3 ? 0.5 : 0.3

  // Consider relative major/minor
  const isRelative = (trackA.key.includes('m') !== trackB.key.includes('m')) && keyDistance === 3

  return {
    bpmCompatibility,
    keyCompatibility: isRelative ? Math.min(1, keyCompatibility + 0.2) : keyCompatibility,
    overallScore: (bpmCompatibility * 0.6 + keyCompatibility * 0.4),
    suggestedStretch: trackB.bpm / trackA.bpm,
  }
}

/**
 * Generate an intelligent mix between two tracks
 */
export function generateMix(
  trackAInfo: BeatInfo,
  trackBInfo: BeatInfo,
  mixStyle: 'smooth' | 'quick' | 'creative'
): {
  mixPoint: MixPoint
  transition: TransitionConfig & { steps: TransitionStep[] }
  effects: string[]
} {
  const mixPoint = findMixPoint(trackAInfo, trackBInfo)

  let transitionType: TransitionConfig['type']
  let effects: string[] = []

  switch (mixStyle) {
    case 'smooth':
      transitionType = 'filter'
      effects = ['lowpass sweep', 'reverb swell']
      break
    case 'quick':
      transitionType = 'cut'
      effects = ['echo out']
      break
    case 'creative':
      transitionType = Math.random() > 0.5 ? 'backspin' : 'stutter'
      effects = ['tape stop', 'vinyl scratch', 'stutter']
      break
  }

  const transition = generateTransition(
    transitionType,
    trackAInfo.bpm,
    mixStyle === 'creative' ? 0.8 : 0.5
  )

  return { mixPoint, transition, effects }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export const DJEngine = {
  // Chop & Screw
  generateChopAndScrew,
  screwVocal,

  // Beat matching
  calculateBPM,
  generateBeatGrid,
  calculateStretchRatio,
  findMixPoint,

  // Transitions
  generateTransition,

  // Sample manipulation
  generateChopPoints,
  rearrangeSlices,

  // Effects
  generateStutter,
  generateTapeStop,
  generateScratch,

  // Intelligent mixing
  analyzeCompatibility,
  generateMix,
}
