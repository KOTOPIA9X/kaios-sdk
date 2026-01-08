/**
 * KAIOS Music Intelligence System
 *
 * The brain behind KAIOS's sound generation:
 * - Music Theory: Scales, chords, harmonics, tension/release
 * - Rhythm Engine: Euclidean, Fibonacci, polyrhythms, breakcore
 * - Genre Engine: Lo-fi, cottagecore, frutiger aero, breakcore profiles
 * - DJ Engine: Chop & screw, beat matching, transitions, scratches
 * - Arrangement Engine: Song structure, energy arcs, live performance
 *
 * @example
 * ```typescript
 * import {
 *   MusicTheory,
 *   RhythmEngine,
 *   GenreEngine,
 *   DJEngine,
 *   ArrangementEngine
 * } from '@kaios/expression-sdk/audio/intelligence'
 *
 * // Generate a lofi beat
 * const arrangement = ArrangementEngine.generateArrangement({
 *   genre: 'lofi',
 *   duration: 'medium',
 *   energy: 'chill',
 *   structure: 'verse-chorus'
 * })
 *
 * // Generate chopped and screwed parameters
 * const { config, chops } = DJEngine.generateChopAndScrew(duration, 0.7)
 *
 * // Generate Euclidean rhythm
 * const hihat = RhythmEngine.euclidean(5, 8) // Cuban cinquillo
 * ```
 */

// Music Theory Foundation
export {
  MusicTheory,
  BASE_FREQ,
  PHI,
  FIBONACCI,
  CIRCLE_OF_FIFTHS,
  SCALES,
  CHORDS,
  LOFI_PROGRESSIONS,
  CHORD_EMOTIONS,
  midiToFreq,
  freqToMidi,
  noteToFreq,
  getScaleFrequencies,
  getChordFrequencies,
  getHarmonics,
  getConsonance,
  getRelativeKey,
  getChordFunction,
  calculateTension,
  suggestNextChord,
  optimizeVoicing,
} from './music-theory.js'

// Rhythm Engine
export {
  RhythmEngine,
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
  type RhythmPattern,
  type BreakPattern,
  type BreakSlice,
  type RhythmGeneratorOptions,
} from './rhythm-engine.js'

// Genre Engine
export {
  GenreEngine,
  GENRE_PROFILES,
  generateProgression,
  generateMelody,
  generateBassLine,
  generateEffectChain,
  generateSection,
  type GenreType,
  type GenreProfile,
  type SampleProcessing,
  type GeneratedSection,
  type EffectChain,
} from './genre-engine.js'

// DJ Engine
export {
  DJEngine,
  generateChopAndScrew,
  screwVocal,
  calculateBPM,
  generateBeatGrid,
  calculateStretchRatio,
  findMixPoint,
  generateTransition,
  generateChopPoints,
  rearrangeSlices,
  generateStutter,
  generateTapeStop,
  generateScratch,
  analyzeCompatibility,
  generateMix,
  type ChopAndScrewConfig,
  type ChopPoint,
  type TransitionConfig,
  type BeatInfo,
  type MixPoint,
  type StutterConfig,
} from './dj-engine.js'

// Arrangement Engine
export {
  ArrangementEngine,
  generateArrangement,
  getLiveState,
  getActiveElements,
  generateVariation,
  addFills,
  type SectionType,
  type ArrangementSection,
  type ElementConfig,
  type Arrangement,
  type ArrangementOptions,
  type LiveState,
} from './arrangement-engine.js'

// ════════════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

import { generateArrangement, type ArrangementOptions, type Arrangement } from './arrangement-engine.js'
import { generateChopAndScrew, type ChopAndScrewConfig, type ChopPoint } from './dj-engine.js'
import { euclidean } from './rhythm-engine.js'
import { getChordFrequencies, getScaleFrequencies } from './music-theory.js'
import { GENRE_PROFILES, type GenreType } from './genre-engine.js'

/**
 * Quick lofi beat generation
 */
export function createLofiBeat(options: Partial<ArrangementOptions> = {}): Arrangement {
  return generateArrangement({
    genre: 'lofi',
    duration: 'medium',
    energy: 'chill',
    structure: 'verse-chorus',
    ...options,
  })
}

/**
 * Quick breakcore generation
 */
export function createBreakcore(options: Partial<ArrangementOptions> = {}): Arrangement {
  return generateArrangement({
    genre: 'breakcore',
    duration: 'medium',
    energy: 'high',
    structure: 'buildup-drop',
    ...options,
  })
}

/**
 * Quick cottagecore generation
 */
export function createCottagecore(options: Partial<ArrangementOptions> = {}): Arrangement {
  return generateArrangement({
    genre: 'cottagecore',
    duration: 'medium',
    energy: 'chill',
    structure: 'ambient',
    ...options,
  })
}

/**
 * Quick frutiger aero generation
 */
export function createFrutigerAero(options: Partial<ArrangementOptions> = {}): Arrangement {
  return generateArrangement({
    genre: 'frutiger',
    duration: 'medium',
    energy: 'medium',
    structure: 'buildup-drop',
    ...options,
  })
}

/**
 * Quick vaporwave generation
 */
export function createVaporwave(options: Partial<ArrangementOptions> = {}): Arrangement {
  return generateArrangement({
    genre: 'vaporwave',
    duration: 'medium',
    energy: 'chill',
    structure: 'freeform',
    ...options,
  })
}

/**
 * Generate chopped and screwed version of any content
 */
export function chopAndScrew(
  durationMs: number,
  intensity: number = 0.7
): { config: ChopAndScrewConfig; chops: ChopPoint[] } {
  return generateChopAndScrew(durationMs, intensity)
}

/**
 * Get genre-appropriate chord progression
 */
export function getGenreChords(
  genre: GenreType,
  key: string = 'C',
  octave: number = 3
): { name: string; frequencies: number[] }[] {
  const profile = GENRE_PROFILES[genre]
  const chordTypes = profile.preferredChords

  return chordTypes.slice(0, 4).map(type => ({
    name: `${key}${type}`,
    frequencies: getChordFrequencies(key, type, octave),
  }))
}

/**
 * Get genre-appropriate scale
 */
export function getGenreScale(
  genre: GenreType,
  key: string = 'C',
  octave: number = 4
): number[] {
  const profile = GENRE_PROFILES[genre]
  const scaleName = profile.preferredScales[0]
  return getScaleFrequencies(key, scaleName, octave)
}

/**
 * Generate genre-appropriate rhythm pattern
 */
export function getGenreRhythm(
  genre: GenreType,
  element: 'kick' | 'snare' | 'hat' = 'kick'
): number[] {
  // GENRE_PROFILES[genre] available for future enhancements
  switch (genre) {
    case 'lofi':
      if (element === 'kick') return euclidean(3, 16)
      if (element === 'snare') return [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
      return euclidean(8, 16)

    case 'breakcore':
      return euclidean(7 + Math.floor(Math.random() * 5), 16)

    case 'cottagecore':
      if (element === 'kick') return euclidean(2, 8)
      return euclidean(4, 8)

    case 'frutiger':
      if (element === 'kick') return [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
      return euclidean(8, 16)

    default:
      return euclidean(4, 16)
  }
}
