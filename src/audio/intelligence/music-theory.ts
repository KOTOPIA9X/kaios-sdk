/**
 * KAIOS Music Theory Foundation
 *
 * Mathematical and harmonic foundations for intelligent music generation
 * Based on 432Hz tuning (solfeggio frequencies)
 */

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS - MATHEMATICAL MUSIC
// ════════════════════════════════════════════════════════════════════════════════

/** Base frequency - 432Hz solfeggio tuning (more harmonic than 440Hz) */
export const BASE_FREQ = 432

/** Golden ratio - appears throughout nature and pleasing compositions */
export const PHI = 1.618033988749895

/** Fibonacci sequence - for rhythm patterns and structure */
export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]

/** Circle of fifths - harmonic relationships */
export const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']

/** Semitone ratio in equal temperament */
export const SEMITONE_RATIO = Math.pow(2, 1/12)

// ════════════════════════════════════════════════════════════════════════════════
// SCALES - EMOTIONAL COLOR PALETTES
// ════════════════════════════════════════════════════════════════════════════════

/** Scale intervals (semitones from root) */
export const SCALES: Record<string, number[]> = {
  // Major modes
  major: [0, 2, 4, 5, 7, 9, 11],           // Ionian - bright, happy
  dorian: [0, 2, 3, 5, 7, 9, 10],          // Minor with raised 6th - jazzy, soulful
  phrygian: [0, 1, 3, 5, 7, 8, 10],        // Spanish, exotic
  lydian: [0, 2, 4, 6, 7, 9, 11],          // Dreamy, floating
  mixolydian: [0, 2, 4, 5, 7, 9, 10],      // Bluesy, rock
  aeolian: [0, 2, 3, 5, 7, 8, 10],         // Natural minor - melancholic
  locrian: [0, 1, 3, 5, 6, 8, 10],         // Unstable, dark

  // Pentatonic - universally pleasing, great for lofi
  majorPentatonic: [0, 2, 4, 7, 9],        // Happy, universal
  minorPentatonic: [0, 3, 5, 7, 10],       // Bluesy, soulful

  // Japanese scales - cottagecore, peaceful
  hirajoshi: [0, 2, 3, 7, 8],              // Japanese, mysterious
  insen: [0, 1, 5, 7, 10],                 // Melancholic Japanese
  iwato: [0, 1, 5, 6, 10],                 // Dark Japanese

  // Blues & Jazz
  blues: [0, 3, 5, 6, 7, 10],              // Classic blues
  bebop: [0, 2, 4, 5, 7, 9, 10, 11],       // Jazz bebop

  // Electronic / Breakcore
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  wholeTone: [0, 2, 4, 6, 8, 10],          // Dreamy, unstable
  diminished: [0, 2, 3, 5, 6, 8, 9, 11],   // Tense, dramatic

  // Lo-fi favorites
  lofi: [0, 2, 3, 5, 7, 9, 10],            // Dorian (most common in lofi)
  chillhop: [0, 2, 4, 7, 9],               // Major pentatonic

  // Special
  prometheus: [0, 2, 4, 6, 9, 10],         // Scriabin's mystic scale
  enigmatic: [0, 1, 4, 6, 8, 10, 11],      // Verdi's scale
}

// ════════════════════════════════════════════════════════════════════════════════
// CHORDS - HARMONIC BUILDING BLOCKS
// ════════════════════════════════════════════════════════════════════════════════

/** Chord intervals (semitones from root) */
export const CHORDS: Record<string, number[]> = {
  // Triads
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],

  // Sevenths - essential for lofi/jazz
  maj7: [0, 4, 7, 11],        // Dreamy, nostalgic
  min7: [0, 3, 7, 10],        // Smooth, melancholic
  dom7: [0, 4, 7, 10],        // Tension, blues
  dim7: [0, 3, 6, 9],         // Dramatic tension
  halfDim7: [0, 3, 6, 10],    // m7b5, jazz staple
  minMaj7: [0, 3, 7, 11],     // Mysterious

  // Extended - lofi heaven
  maj9: [0, 4, 7, 11, 14],    // Super dreamy
  min9: [0, 3, 7, 10, 14],    // Smooth, sophisticated
  dom9: [0, 4, 7, 10, 14],    // Funky
  add9: [0, 4, 7, 14],        // Open, airy
  min11: [0, 3, 7, 10, 14, 17], // Very jazzy
  maj13: [0, 4, 7, 11, 14, 21], // Full, lush

  // Altered - for tension/resolution
  dom7sharp9: [0, 4, 7, 10, 15],   // Hendrix chord
  dom7flat9: [0, 4, 7, 10, 13],    // Dark tension
  dom7sharp11: [0, 4, 7, 10, 18],  // Lydian dominant

  // Power chords - breakcore
  power: [0, 7],
  power5: [0, 7, 12],
}

/** Lo-fi chord progressions that hit different */
export const LOFI_PROGRESSIONS: number[][] = [
  [1, 6, 4, 5],      // I-vi-IV-V (most common)
  [2, 5, 1, 6],      // ii-V-I-vi (jazz turnaround)
  [1, 5, 6, 4],      // I-V-vi-IV (pop progression)
  [6, 4, 1, 5],      // vi-IV-I-V (emotional)
  [1, 4, 6, 5],      // I-IV-vi-V
  [2, 5, 1, 1],      // ii-V-I-I (jazz standard)
  [1, 3, 4, 4],      // I-iii-IV-IV (dreamy)
  [6, 5, 4, 5],      // vi-V-IV-V (emo progression)
  [1, 7, 6, 6],      // I-vii-vi-vi (descending)
  [4, 5, 3, 6],      // IV-V-iii-vi (royal road)
]

/** Emotional chord qualities */
export const CHORD_EMOTIONS: Record<string, string[]> = {
  happy: ['major', 'maj7', 'add9', 'sus2'],
  sad: ['minor', 'min7', 'min9', 'minMaj7'],
  dreamy: ['maj9', 'min11', 'sus4', 'add9'],
  tense: ['dim7', 'dom7', 'dom7sharp9', 'halfDim7'],
  peaceful: ['maj7', 'add9', 'sus2', 'maj9'],
  nostalgic: ['min7', 'maj7', 'min9', 'add9'],
  mysterious: ['minMaj7', 'dim7', 'augmented', 'halfDim7'],
  powerful: ['power', 'power5', 'sus4', 'major'],
}

// ════════════════════════════════════════════════════════════════════════════════
// FREQUENCY CALCULATIONS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Convert MIDI note number to frequency (432Hz tuning)
 * A4 (MIDI 69) = 432Hz instead of 440Hz
 */
export function midiToFreq(midi: number): number {
  return BASE_FREQ * Math.pow(2, (midi - 69) / 12)
}

/**
 * Convert frequency to MIDI note number
 */
export function freqToMidi(freq: number): number {
  return 69 + 12 * Math.log2(freq / BASE_FREQ)
}

/**
 * Get frequency for a note name (e.g., 'C4', 'F#3')
 */
export function noteToFreq(note: string): number {
  const noteMap: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  }

  const match = note.match(/^([A-G][#b]?)(\d+)$/)
  if (!match) return BASE_FREQ

  const [, noteName, octaveStr] = match
  const octave = parseInt(octaveStr)
  const semitone = noteMap[noteName] ?? 0

  // MIDI note number: C4 = 60
  const midi = (octave + 1) * 12 + semitone
  return midiToFreq(midi)
}

/**
 * Get all frequencies in a scale
 */
export function getScaleFrequencies(root: string, scaleName: string, octave: number = 4): number[] {
  const scale = SCALES[scaleName] || SCALES.major
  const rootFreq = noteToFreq(`${root}${octave}`)

  return scale.map(interval => rootFreq * Math.pow(SEMITONE_RATIO, interval))
}

/**
 * Get chord frequencies
 */
export function getChordFrequencies(root: string, chordName: string, octave: number = 4): number[] {
  const chord = CHORDS[chordName] || CHORDS.major
  const rootFreq = noteToFreq(`${root}${octave}`)

  return chord.map(interval => rootFreq * Math.pow(SEMITONE_RATIO, interval))
}

// ════════════════════════════════════════════════════════════════════════════════
// HARMONIC RELATIONSHIPS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Get harmonically related notes using the harmonic series
 */
export function getHarmonics(fundamental: number, count: number = 8): number[] {
  return Array.from({ length: count }, (_, i) => fundamental * (i + 1))
}

/**
 * Calculate consonance between two frequencies
 * Lower = more consonant (simpler ratio)
 */
export function getConsonance(freq1: number, freq2: number): number {
  const ratio = freq1 > freq2 ? freq1 / freq2 : freq2 / freq1

  // Check against simple ratios
  const simpleRatios = [
    { ratio: 1, name: 'unison', consonance: 1 },
    { ratio: 2, name: 'octave', consonance: 0.95 },
    { ratio: 1.5, name: 'perfect fifth', consonance: 0.9 },
    { ratio: 4/3, name: 'perfect fourth', consonance: 0.85 },
    { ratio: 5/4, name: 'major third', consonance: 0.8 },
    { ratio: 6/5, name: 'minor third', consonance: 0.75 },
    { ratio: 5/3, name: 'major sixth', consonance: 0.7 },
    { ratio: 8/5, name: 'minor sixth', consonance: 0.65 },
  ]

  let bestMatch = 0
  for (const { ratio: r, consonance } of simpleRatios) {
    if (Math.abs(ratio - r) < 0.05) {
      bestMatch = Math.max(bestMatch, consonance)
    }
  }

  return bestMatch || 0.3 // Dissonant by default
}

/**
 * Find the relative minor/major of a key
 */
export function getRelativeKey(root: string, isMinor: boolean): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const idx = notes.indexOf(root.replace('b', '#'))

  if (isMinor) {
    // Relative major is 3 semitones up
    return notes[(idx + 3) % 12]
  } else {
    // Relative minor is 3 semitones down
    return notes[(idx + 9) % 12]
  }
}

/**
 * Get chord function in a key (tonic, subdominant, dominant)
 */
export function getChordFunction(degree: number): 'tonic' | 'subdominant' | 'dominant' | 'mediant' {
  switch (degree) {
    case 1:
    case 6:
      return 'tonic'
    case 2:
    case 4:
      return 'subdominant'
    case 5:
    case 7:
      return 'dominant'
    case 3:
    default:
      return 'mediant'
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// TENSION & RESOLUTION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Calculate tension level of a chord progression
 * Higher = more tension, needs resolution
 */
export function calculateTension(chordDegrees: number[]): number {
  let tension = 0

  for (let i = 0; i < chordDegrees.length; i++) {
    const degree = chordDegrees[i]
    const func = getChordFunction(degree)

    // Dominant chords add tension
    if (func === 'dominant') tension += 0.3

    // Subdominant adds moderate tension
    if (func === 'subdominant') tension += 0.15

    // Tonic releases tension
    if (func === 'tonic') tension -= 0.2

    // Consecutive non-tonic adds tension
    if (i > 0 && func !== 'tonic' && getChordFunction(chordDegrees[i-1]) !== 'tonic') {
      tension += 0.1
    }
  }

  return Math.max(0, Math.min(1, tension))
}

/**
 * Suggest next chord based on voice leading and function
 */
export function suggestNextChord(currentDegree: number, tension: number): number[] {
  const suggestions: number[] = []

  // High tension wants resolution
  if (tension > 0.7) {
    suggestions.push(1) // Resolve to tonic
  }

  // Dominant wants to resolve
  if (currentDegree === 5) {
    suggestions.push(1, 6) // V -> I or vi (deceptive)
  }

  // Subdominant can go to dominant or tonic
  if (currentDegree === 4) {
    suggestions.push(5, 1)
  }

  // ii-V-I is always good
  if (currentDegree === 2) {
    suggestions.push(5)
  }

  // Default options
  if (suggestions.length === 0) {
    suggestions.push(4, 5, 6, 2)
  }

  return suggestions
}

// ════════════════════════════════════════════════════════════════════════════════
// VOICE LEADING
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Optimize chord voicing for smooth voice leading
 * Minimizes total movement between chord tones
 */
export function optimizeVoicing(
  currentVoices: number[],
  nextChord: number[],
  rootOctave: number = 3
): number[] {
  if (currentVoices.length === 0) {
    // First chord, use default voicing
    return nextChord.map((interval, i) => {
      const octaveShift = Math.floor(i / 4)
      return midiToFreq(rootOctave * 12 + 12 + interval + octaveShift * 12)
    })
  }

  // Find best voicing that minimizes total movement
  const optimized: number[] = []

  for (const interval of nextChord) {
    // Try different octaves
    let bestFreq = midiToFreq(rootOctave * 12 + 12 + interval)
    let bestDistance = Infinity

    for (let octave = rootOctave - 1; octave <= rootOctave + 2; octave++) {
      const freq = midiToFreq(octave * 12 + 12 + interval)

      // Find closest current voice
      const minDistance = Math.min(...currentVoices.map(v =>
        Math.abs(freqToMidi(freq) - freqToMidi(v))
      ))

      if (minDistance < bestDistance) {
        bestDistance = minDistance
        bestFreq = freq
      }
    }

    optimized.push(bestFreq)
  }

  return optimized
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export const MusicTheory = {
  BASE_FREQ,
  PHI,
  FIBONACCI,
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
}
