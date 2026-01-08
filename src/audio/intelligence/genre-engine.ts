/**
 * KAIOS Genre Engine
 *
 * Deep knowledge of musical aesthetics:
 * - Lo-fi: Dusty, nostalgic, warm imperfection
 * - Cottagecore: Acoustic, pastoral, gentle warmth
 * - Frutiger Aero: Glossy, optimistic, Y2K futurism
 * - Breakcore: Chaotic, chopped, controlled chaos
 */

import {
  SCALES,
  LOFI_PROGRESSIONS,
  getChordFrequencies,
  getScaleFrequencies,
} from './music-theory.js'

import {
  generateRhythm,
  type RhythmPattern,
} from './rhythm-engine.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type GenreType = 'lofi' | 'cottagecore' | 'frutiger' | 'breakcore' | 'ambient' | 'vaporwave'

export interface GenreProfile {
  name: string
  description: string

  // Tempo
  bpmRange: [number, number]
  preferredBPM: number

  // Harmonic characteristics
  preferredScales: string[]
  preferredChords: string[]
  progressionStyle: 'jazzy' | 'simple' | 'complex' | 'minimal' | 'chaotic'
  keyPreferences: string[]

  // Rhythmic characteristics
  timeSignature: [number, number]
  swingAmount: number
  rhythmComplexity: number
  grooveTightness: number

  // Sonic characteristics
  brightness: number        // 0-1 (dark to bright)
  warmth: number           // 0-1 (cold to warm)
  saturation: number       // 0-1 (clean to saturated)
  spaceReverb: number      // 0-1 (dry to wet)
  lofiAmount: number       // 0-1 (clean to dusty)
  glitchAmount: number     // 0-1 (clean to glitchy)

  // Texture elements
  useVinylCrackle: boolean
  useTapeWobble: boolean
  useNatureAmbience: boolean
  useSynthPads: boolean
  useAcousticElements: boolean
  useDigitalGlitch: boolean

  // Arrangement
  buildupStyle: 'gradual' | 'sudden' | 'none' | 'chaotic'
  transitionStyle: 'smooth' | 'cut' | 'glitch' | 'fade'
  sectionLength: number    // bars

  // Sample preferences
  preferredSamples: string[]
  sampleProcessing: SampleProcessing
}

export interface SampleProcessing {
  pitchShift: [number, number]     // Semitone range
  timeStretch: [number, number]    // Speed multiplier range
  filterCutoff: [number, number]   // Hz range
  bitCrush: number                 // 0-1
  reverb: number                   // 0-1
  delay: number                    // 0-1
  chorus: number                   // 0-1
  distortion: number               // 0-1
}

export interface GeneratedSection {
  chords: { root: string; type: string; frequencies: number[] }[]
  melody: number[]
  rhythm: {
    kick: RhythmPattern
    snare: RhythmPattern
    hat: RhythmPattern
    percussion: RhythmPattern
  }
  bass: number[]
  effects: EffectChain
  duration: number         // bars
}

export interface EffectChain {
  filter: { type: 'lowpass' | 'highpass' | 'bandpass'; cutoff: number; resonance: number }
  reverb: { decay: number; wet: number }
  delay: { time: number; feedback: number; wet: number }
  distortion: { amount: number }
  bitcrusher?: { bits: number; sampleRate: number }
  wobble?: { rate: number; depth: number }
  vinyl?: { crackle: number; noise: number }
}

// ════════════════════════════════════════════════════════════════════════════════
// GENRE PROFILES
// ════════════════════════════════════════════════════════════════════════════════

export const GENRE_PROFILES: Record<GenreType, GenreProfile> = {
  lofi: {
    name: 'Lo-fi Hip Hop',
    description: 'Dusty, nostalgic beats with jazz samples and vinyl warmth',

    bpmRange: [70, 95],
    preferredBPM: 85,

    preferredScales: ['dorian', 'minorPentatonic', 'lofi', 'aeolian'],
    preferredChords: ['min7', 'maj7', 'min9', 'add9', 'dom7'],
    progressionStyle: 'jazzy',
    keyPreferences: ['C', 'D', 'F', 'G', 'Bb'],

    timeSignature: [4, 4],
    swingAmount: 0.2,
    rhythmComplexity: 0.4,
    grooveTightness: 0.6,

    brightness: 0.3,
    warmth: 0.8,
    saturation: 0.6,
    spaceReverb: 0.4,
    lofiAmount: 0.7,
    glitchAmount: 0.1,

    useVinylCrackle: true,
    useTapeWobble: true,
    useNatureAmbience: false,
    useSynthPads: true,
    useAcousticElements: true,
    useDigitalGlitch: false,

    buildupStyle: 'gradual',
    transitionStyle: 'smooth',
    sectionLength: 8,

    preferredSamples: ['piano', 'rhodes', 'guitar', 'strings', 'vinyl'],
    sampleProcessing: {
      pitchShift: [-3, 3],
      timeStretch: [0.9, 1.1],
      filterCutoff: [400, 4000],
      bitCrush: 0.2,
      reverb: 0.4,
      delay: 0.3,
      chorus: 0.2,
      distortion: 0.1,
    },
  },

  cottagecore: {
    name: 'Cottagecore',
    description: 'Pastoral, gentle acoustic sounds with nature ambience',

    bpmRange: [80, 120],
    preferredBPM: 100,

    preferredScales: ['major', 'majorPentatonic', 'lydian', 'mixolydian'],
    preferredChords: ['major', 'add9', 'sus2', 'maj7', 'sus4'],
    progressionStyle: 'simple',
    keyPreferences: ['C', 'G', 'D', 'F', 'A'],

    timeSignature: [4, 4],
    swingAmount: 0.1,
    rhythmComplexity: 0.3,
    grooveTightness: 0.5,

    brightness: 0.6,
    warmth: 0.9,
    saturation: 0.3,
    spaceReverb: 0.5,
    lofiAmount: 0.2,
    glitchAmount: 0,

    useVinylCrackle: false,
    useTapeWobble: false,
    useNatureAmbience: true,
    useSynthPads: false,
    useAcousticElements: true,
    useDigitalGlitch: false,

    buildupStyle: 'gradual',
    transitionStyle: 'fade',
    sectionLength: 8,

    preferredSamples: ['acoustic_guitar', 'piano', 'strings', 'harp', 'flute', 'birds', 'rain', 'wind'],
    sampleProcessing: {
      pitchShift: [0, 0],
      timeStretch: [1, 1],
      filterCutoff: [200, 8000],
      bitCrush: 0,
      reverb: 0.5,
      delay: 0.2,
      chorus: 0.3,
      distortion: 0,
    },
  },

  frutiger: {
    name: 'Frutiger Aero',
    description: 'Glossy Y2K futurism with optimistic synths and bubbly textures',

    bpmRange: [110, 140],
    preferredBPM: 128,

    preferredScales: ['major', 'lydian', 'majorPentatonic', 'wholeTone'],
    preferredChords: ['major', 'maj7', 'add9', 'sus4', 'augmented'],
    progressionStyle: 'simple',
    keyPreferences: ['C', 'F', 'G', 'D', 'Bb'],

    timeSignature: [4, 4],
    swingAmount: 0,
    rhythmComplexity: 0.4,
    grooveTightness: 0.9,

    brightness: 0.9,
    warmth: 0.5,
    saturation: 0.4,
    spaceReverb: 0.6,
    lofiAmount: 0,
    glitchAmount: 0.1,

    useVinylCrackle: false,
    useTapeWobble: false,
    useNatureAmbience: false,
    useSynthPads: true,
    useAcousticElements: false,
    useDigitalGlitch: false,

    buildupStyle: 'gradual',
    transitionStyle: 'smooth',
    sectionLength: 8,

    preferredSamples: ['synth_pad', 'glass', 'bubble', 'shimmer', 'pluck'],
    sampleProcessing: {
      pitchShift: [0, 5],
      timeStretch: [1, 1.2],
      filterCutoff: [1000, 16000],
      bitCrush: 0,
      reverb: 0.6,
      delay: 0.4,
      chorus: 0.5,
      distortion: 0,
    },
  },

  breakcore: {
    name: 'Breakcore',
    description: 'Chaotic chopped breaks with extreme tempo and time signature changes',

    bpmRange: [160, 300],
    preferredBPM: 180,

    preferredScales: ['chromatic', 'diminished', 'phrygian', 'locrian'],
    preferredChords: ['diminished', 'augmented', 'dom7sharp9', 'power'],
    progressionStyle: 'chaotic',
    keyPreferences: ['C', 'C#', 'D', 'F#', 'G'],

    timeSignature: [4, 4], // But often broken/irregular
    swingAmount: 0,
    rhythmComplexity: 0.95,
    grooveTightness: 0.3,

    brightness: 0.5,
    warmth: 0.3,
    saturation: 0.9,
    spaceReverb: 0.2,
    lofiAmount: 0.3,
    glitchAmount: 0.9,

    useVinylCrackle: true,
    useTapeWobble: false,
    useNatureAmbience: false,
    useSynthPads: true,
    useAcousticElements: false,
    useDigitalGlitch: true,

    buildupStyle: 'chaotic',
    transitionStyle: 'glitch',
    sectionLength: 4,

    preferredSamples: ['amen', 'breakbeat', 'glitch', 'noise', 'stab'],
    sampleProcessing: {
      pitchShift: [-12, 12],
      timeStretch: [0.5, 2],
      filterCutoff: [100, 12000],
      bitCrush: 0.4,
      reverb: 0.2,
      delay: 0.3,
      chorus: 0,
      distortion: 0.7,
    },
  },

  ambient: {
    name: 'Ambient',
    description: 'Atmospheric, meditative soundscapes with slow evolution',

    bpmRange: [60, 90],
    preferredBPM: 72,

    preferredScales: ['lydian', 'wholeTone', 'hirajoshi', 'majorPentatonic'],
    preferredChords: ['maj9', 'add9', 'sus2', 'sus4', 'min11'],
    progressionStyle: 'minimal',
    keyPreferences: ['C', 'D', 'E', 'G', 'A'],

    timeSignature: [4, 4],
    swingAmount: 0,
    rhythmComplexity: 0.1,
    grooveTightness: 0.2,

    brightness: 0.4,
    warmth: 0.7,
    saturation: 0.2,
    spaceReverb: 0.9,
    lofiAmount: 0.1,
    glitchAmount: 0,

    useVinylCrackle: false,
    useTapeWobble: false,
    useNatureAmbience: true,
    useSynthPads: true,
    useAcousticElements: false,
    useDigitalGlitch: false,

    buildupStyle: 'none',
    transitionStyle: 'fade',
    sectionLength: 16,

    preferredSamples: ['pad', 'drone', 'texture', 'rain', 'wind', 'water'],
    sampleProcessing: {
      pitchShift: [-5, 5],
      timeStretch: [0.5, 1.5],
      filterCutoff: [100, 6000],
      bitCrush: 0,
      reverb: 0.9,
      delay: 0.5,
      chorus: 0.4,
      distortion: 0,
    },
  },

  vaporwave: {
    name: 'Vaporwave',
    description: 'Slowed, dreamy 80s/90s nostalgia with chopped samples',

    bpmRange: [60, 100],
    preferredBPM: 80,

    preferredScales: ['dorian', 'mixolydian', 'majorPentatonic', 'lydian'],
    preferredChords: ['maj7', 'min7', 'dom9', 'add9', 'min9'],
    progressionStyle: 'jazzy',
    keyPreferences: ['C', 'F', 'G', 'Bb', 'Eb'],

    timeSignature: [4, 4],
    swingAmount: 0.15,
    rhythmComplexity: 0.3,
    grooveTightness: 0.5,

    brightness: 0.5,
    warmth: 0.6,
    saturation: 0.7,
    spaceReverb: 0.7,
    lofiAmount: 0.5,
    glitchAmount: 0.3,

    useVinylCrackle: true,
    useTapeWobble: true,
    useNatureAmbience: false,
    useSynthPads: true,
    useAcousticElements: false,
    useDigitalGlitch: true,

    buildupStyle: 'gradual',
    transitionStyle: 'fade',
    sectionLength: 8,

    preferredSamples: ['synth_80s', 'saxophone', 'vocal_chop', 'fm_bass', 'slap_bass'],
    sampleProcessing: {
      pitchShift: [-7, 0],   // Pitched down (chopped and screwed)
      timeStretch: [0.7, 1], // Slowed
      filterCutoff: [200, 6000],
      bitCrush: 0.3,
      reverb: 0.7,
      delay: 0.5,
      chorus: 0.6,
      distortion: 0.2,
    },
  },
}

// ════════════════════════════════════════════════════════════════════════════════
// CHORD PROGRESSION GENERATORS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate a chord progression for a genre
 */
export function generateProgression(
  genre: GenreType,
  key: string = 'C',
  bars: number = 4
): { root: string; type: string; degree: number }[] {
  const profile = GENRE_PROFILES[genre]
  const progression: { root: string; type: string; degree: number }[] = []

  // Get scale notes
  const scale = SCALES[profile.preferredScales[0]] || SCALES.major
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const keyIndex = notes.indexOf(key)

  const getScaleNote = (degree: number): string => {
    const interval = scale[(degree - 1) % scale.length]
    return notes[(keyIndex + interval) % 12]
  }

  switch (profile.progressionStyle) {
    case 'jazzy':
      // Use lofi progressions with jazz chords
      const lofiProg = LOFI_PROGRESSIONS[Math.floor(Math.random() * LOFI_PROGRESSIONS.length)]
      for (let bar = 0; bar < bars; bar++) {
        const degree = lofiProg[bar % lofiProg.length]
        const root = getScaleNote(degree)
        const chordType = profile.preferredChords[Math.floor(Math.random() * profile.preferredChords.length)]
        progression.push({ root, type: chordType, degree })
      }
      break

    case 'simple':
      // Simple I-IV-V-I style progressions
      const simpleProg = [1, 4, 5, 1]
      for (let bar = 0; bar < bars; bar++) {
        const degree = simpleProg[bar % simpleProg.length]
        const root = getScaleNote(degree)
        const chordType = profile.preferredChords[0]
        progression.push({ root, type: chordType, degree })
      }
      break

    case 'complex':
      // More sophisticated voice leading
      let prevDegree = 1
      for (let bar = 0; bar < bars; bar++) {
        // Move by 4ths, 5ths, or steps
        const movements = [-5, -4, -2, 2, 4, 5]
        const movement = movements[Math.floor(Math.random() * movements.length)]
        let degree = ((prevDegree + movement - 1) % 7) + 1
        if (degree < 1) degree += 7

        const root = getScaleNote(degree)
        const chordType = profile.preferredChords[Math.floor(Math.random() * profile.preferredChords.length)]
        progression.push({ root, type: chordType, degree })
        prevDegree = degree
      }
      break

    case 'minimal':
      // Few chord changes, long holds
      const minimalProg = [1, 1, 4, 1]
      for (let bar = 0; bar < bars; bar++) {
        const degree = minimalProg[bar % minimalProg.length]
        const root = getScaleNote(degree)
        const chordType = profile.preferredChords[0]
        progression.push({ root, type: chordType, degree })
      }
      break

    case 'chaotic':
      // Random, atonal movements
      for (let bar = 0; bar < bars; bar++) {
        const degree = Math.floor(Math.random() * 7) + 1
        const root = notes[Math.floor(Math.random() * 12)]
        const chordType = profile.preferredChords[Math.floor(Math.random() * profile.preferredChords.length)]
        progression.push({ root, type: chordType, degree })
      }
      break
  }

  return progression
}

// ════════════════════════════════════════════════════════════════════════════════
// MELODY GENERATORS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate a melody that fits the genre and chord
 */
export function generateMelody(
  genre: GenreType,
  chord: { root: string; type: string },
  length: number = 8,
  octave: number = 4
): number[] {
  const profile = GENRE_PROFILES[genre]
  const scaleFreqs = getScaleFrequencies(chord.root, profile.preferredScales[0], octave)
  const chordFreqs = getChordFrequencies(chord.root, chord.type, octave)

  const melody: number[] = []

  switch (genre) {
    case 'lofi':
      // Sparse, laid-back melody with chord tones
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.5) {
          // Rest
          melody.push(0)
        } else if (Math.random() > 0.3) {
          // Chord tone
          melody.push(chordFreqs[Math.floor(Math.random() * chordFreqs.length)])
        } else {
          // Scale tone
          melody.push(scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)])
        }
      }
      break

    case 'cottagecore':
      // Gentle, stepwise motion
      let currentNote = Math.floor(scaleFreqs.length / 2)
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.3) {
          melody.push(scaleFreqs[currentNote])
          // Move by step
          const step = Math.random() > 0.5 ? 1 : -1
          currentNote = Math.max(0, Math.min(scaleFreqs.length - 1, currentNote + step))
        } else {
          melody.push(0)
        }
      }
      break

    case 'frutiger':
      // Arpeggiated, uplifting patterns
      for (let i = 0; i < length; i++) {
        const idx = i % chordFreqs.length
        melody.push(chordFreqs[idx])
      }
      break

    case 'breakcore':
      // Chaotic, chromatic, glitchy
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.4) {
          const freq = scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)]
          // Random pitch offset
          const offset = Math.pow(2, (Math.random() - 0.5) * 0.5)
          melody.push(freq * offset)
        } else {
          melody.push(0)
        }
      }
      break

    case 'ambient':
      // Long, sustained, sparse notes
      let lastNote = scaleFreqs[Math.floor(scaleFreqs.length / 2)]
      for (let i = 0; i < length; i++) {
        if (i % 4 === 0 && Math.random() > 0.3) {
          // New note every 4 steps
          lastNote = scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)]
        }
        melody.push(Math.random() > 0.2 ? lastNote : 0)
      }
      break

    case 'vaporwave':
      // Pitched-down, dreamy arpeggios
      const pitchFactor = Math.pow(2, -3/12) // Down a minor 3rd
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.3) {
          const idx = i % chordFreqs.length
          melody.push(chordFreqs[idx] * pitchFactor)
        } else {
          melody.push(0)
        }
      }
      break

    default:
      // Generic scale melody
      for (let i = 0; i < length; i++) {
        melody.push(scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)])
      }
  }

  return melody
}

// ════════════════════════════════════════════════════════════════════════════════
// BASS LINE GENERATORS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate a bass line for the genre
 */
export function generateBassLine(
  genre: GenreType,
  progression: { root: string; type: string }[],
  stepsPerChord: number = 4
): number[] {
  const bassLine: number[] = []

  for (const chord of progression) {
    const rootFreq = getChordFrequencies(chord.root, chord.type, 2)[0] // Octave 2 for bass
    const fifth = rootFreq * 1.5 // Perfect 5th
    const octave = rootFreq * 2

    switch (genre) {
      case 'lofi':
        // Simple, bouncy bass
        for (let i = 0; i < stepsPerChord; i++) {
          if (i === 0) bassLine.push(rootFreq)
          else if (i === 2) bassLine.push(Math.random() > 0.5 ? fifth : rootFreq)
          else bassLine.push(0)
        }
        break

      case 'cottagecore':
        // Gentle root motion
        for (let i = 0; i < stepsPerChord; i++) {
          bassLine.push(i % 2 === 0 ? rootFreq : 0)
        }
        break

      case 'frutiger':
        // Driving, steady bass
        for (let i = 0; i < stepsPerChord; i++) {
          bassLine.push(rootFreq)
        }
        break

      case 'breakcore':
        // Erratic, glitchy bass
        for (let i = 0; i < stepsPerChord; i++) {
          if (Math.random() > 0.3) {
            const note = [rootFreq, fifth, octave][Math.floor(Math.random() * 3)]
            bassLine.push(note * (Math.random() > 0.8 ? 0.5 : 1))
          } else {
            bassLine.push(0)
          }
        }
        break

      case 'ambient':
        // Long, droning bass
        for (let i = 0; i < stepsPerChord; i++) {
          bassLine.push(rootFreq)
        }
        break

      case 'vaporwave':
        // Slowed, funky bass
        const slowFactor = 0.8
        for (let i = 0; i < stepsPerChord; i++) {
          if (i === 0 || i === 2) bassLine.push(rootFreq * slowFactor)
          else if (i === 3) bassLine.push(fifth * slowFactor)
          else bassLine.push(0)
        }
        break

      default:
        for (let i = 0; i < stepsPerChord; i++) {
          bassLine.push(i === 0 ? rootFreq : 0)
        }
    }
  }

  return bassLine
}

// ════════════════════════════════════════════════════════════════════════════════
// EFFECT CHAIN GENERATORS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate effect chain for genre
 */
export function generateEffectChain(genre: GenreType): EffectChain {
  const profile = GENRE_PROFILES[genre]

  const chain: EffectChain = {
    filter: {
      type: profile.brightness < 0.5 ? 'lowpass' : 'highpass',
      cutoff: 400 + profile.brightness * 4000,
      resonance: 0.5 + profile.warmth * 0.5,
    },
    reverb: {
      decay: 1 + profile.spaceReverb * 4,
      wet: profile.spaceReverb,
    },
    delay: {
      time: profile.preferredBPM ? 60000 / profile.preferredBPM / 4 : 200, // Quarter note
      feedback: 0.3 + profile.spaceReverb * 0.3,
      wet: 0.2 + profile.spaceReverb * 0.3,
    },
    distortion: {
      amount: profile.saturation * 0.5,
    },
  }

  // Genre-specific effects
  if (profile.lofiAmount > 0.3) {
    chain.bitcrusher = {
      bits: Math.floor(16 - profile.lofiAmount * 8),
      sampleRate: 44100 * (1 - profile.lofiAmount * 0.5),
    }
  }

  if (profile.useTapeWobble) {
    chain.wobble = {
      rate: 0.5 + Math.random() * 1,
      depth: profile.lofiAmount * 0.02,
    }
  }

  if (profile.useVinylCrackle) {
    chain.vinyl = {
      crackle: profile.lofiAmount * 0.5,
      noise: profile.lofiAmount * 0.2,
    }
  }

  return chain
}

// ════════════════════════════════════════════════════════════════════════════════
// COMPLETE SECTION GENERATOR
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate a complete musical section for a genre
 */
export function generateSection(
  genre: GenreType,
  options: {
    key?: string
    bars?: number
    bpm?: number
    energy?: number
  } = {}
): GeneratedSection {
  const profile = GENRE_PROFILES[genre]

  const key = options.key || profile.keyPreferences[Math.floor(Math.random() * profile.keyPreferences.length)]
  const bars = options.bars || profile.sectionLength
  const bpm = options.bpm || profile.preferredBPM
  const energy = options.energy ?? 0.5

  // Generate progression
  const progression = generateProgression(genre, key, bars)

  // Generate chord voicings
  const chords = progression.map(p => ({
    root: p.root,
    type: p.type,
    frequencies: getChordFrequencies(p.root, p.type, 3),
  }))

  // Generate melody (4 notes per bar, one phrase per chord)
  const melody: number[] = []
  for (let i = 0; i < bars; i++) {
    const chord = progression[i]
    const chordMelody = generateMelody(genre, chord, 4)
    melody.push(...chordMelody)
  }

  // Generate rhythm
  const rhythm = generateRhythm({
    genre: genre as any,
    complexity: profile.rhythmComplexity * (0.8 + energy * 0.4),
    energy,
    bpm,
    swing: profile.swingAmount,
  })

  // Generate bass line
  const bass = generateBassLine(genre, progression, 4)

  // Generate effects
  const effects = generateEffectChain(genre)

  return {
    chords,
    melody,
    rhythm,
    bass,
    effects,
    duration: bars,
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export const GenreEngine = {
  GENRE_PROFILES,
  generateProgression,
  generateMelody,
  generateBassLine,
  generateEffectChain,
  generateSection,
}
