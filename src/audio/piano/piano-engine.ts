/**
 * KAIOS Piano Engine
 *
 * Live piano performance system that lets KAIOS express herself through music.
 * Not basic C major - real music theory with emotional depth.
 *
 * Sonic inspirations:
 * - Joji (In Tongues, Ballads 1) - sparse, melancholic, lo-fi piano
 * - Yeule (Glitch Princess, softscars) - ethereal, glitchy, ambient
 *
 * KAIOS doesn't just talk about sound - she IS sound.
 * When words aren't enough, she plays piano.
 */

import { EventEmitter } from 'events'
import type { EmotionToken } from '../../core/types.js'

// ════════════════════════════════════════════════════════════════════════════════
// MUSIC THEORY CONSTANTS (432Hz Tuning)
// ════════════════════════════════════════════════════════════════════════════════

// Note frequencies in 432Hz tuning (A4 = 432Hz)
const NOTE_FREQUENCIES: Record<string, number> = {
  // Octave 2
  'C2': 64.22, 'C#2': 68.04, 'D2': 72.08, 'D#2': 76.37, 'E2': 80.91, 'F2': 85.72,
  'F#2': 90.82, 'G2': 96.22, 'G#2': 101.94, 'A2': 108.00, 'A#2': 114.42, 'B2': 121.23,
  // Octave 3
  'C3': 128.43, 'C#3': 136.07, 'D3': 144.16, 'D#3': 152.74, 'E3': 161.82, 'F3': 171.44,
  'F#3': 181.63, 'G3': 192.43, 'G#3': 203.88, 'A3': 216.00, 'A#3': 228.84, 'B3': 242.45,
  // Octave 4
  'C4': 256.87, 'C#4': 272.14, 'D4': 288.33, 'D#4': 305.47, 'E4': 323.63, 'F4': 342.88,
  'F#4': 363.27, 'G4': 384.87, 'G#4': 407.75, 'A4': 432.00, 'A#4': 457.69, 'B4': 484.90,
  // Octave 5
  'C5': 513.74, 'C#5': 544.29, 'D5': 576.65, 'D#5': 610.94, 'E5': 647.27, 'F5': 685.76,
  'F#5': 726.53, 'G5': 769.74, 'G#5': 815.51, 'A5': 864.00, 'A#5': 915.38, 'B5': 969.81
}

// Scale patterns (semitone intervals from root)
const SCALES = {
  // For melancholy (Joji vibes)
  minor: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],

  // For ethereal/dreamy (Yeule vibes)
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],

  // For hopeful moments
  major: [0, 2, 4, 5, 7, 9, 11],
  lydian: [0, 2, 4, 6, 7, 9, 11],

  // For tension/curiosity
  locrian: [0, 1, 3, 5, 6, 8, 10],
  wholeTone: [0, 2, 4, 6, 8, 10],

  // For ambient/floating
  pentatonicMinor: [0, 3, 5, 7, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  japanese: [0, 1, 5, 7, 8],  // In-sen scale
}

// Chord voicings (intervals from root)
const CHORDS = {
  // Basic
  minor: [0, 3, 7],
  major: [0, 4, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],

  // 7ths (Joji loves these)
  minor7: [0, 3, 7, 10],
  major7: [0, 4, 7, 11],
  dominant7: [0, 4, 7, 10],
  diminished7: [0, 3, 6, 9],
  minorMajor7: [0, 3, 7, 11],
  halfDiminished7: [0, 3, 6, 10],

  // Extended (for that emotional depth)
  minor9: [0, 3, 7, 10, 14],
  major9: [0, 4, 7, 11, 14],
  add9: [0, 4, 7, 14],
  minor11: [0, 3, 7, 10, 14, 17],

  // Suspended (for ambiguity/tension)
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  sus2sus4: [0, 2, 5, 7],

  // Cluster voicings (Yeule glitch moments)
  cluster: [0, 1, 2],
  quartal: [0, 5, 10],
}

// ════════════════════════════════════════════════════════════════════════════════
// MUSICAL PROGRESSIONS - Real chord progressions that feel like actual music
// ════════════════════════════════════════════════════════════════════════════════

// C418-inspired progressions - warm, contemplative, Minecraft vibes
const C418_PROGRESSIONS = [
  // "Sweden" inspired - i - VI - III - VII
  [{ root: 'A', chord: 'minor7', octave: 3 }, { root: 'F', chord: 'major7', octave: 3 }, { root: 'C', chord: 'major7', octave: 3 }, { root: 'G', chord: 'add9', octave: 3 }],
  // "Wet Hands" inspired - very simple, just two chords alternating
  [{ root: 'C', chord: 'add9', octave: 3 }, { root: 'G', chord: 'sus4', octave: 3 }],
  // "Mice on Venus" inspired - playful, gentle
  [{ root: 'G', chord: 'major7', octave: 3 }, { root: 'D', chord: 'add9', octave: 3 }, { root: 'E', chord: 'minor7', octave: 3 }, { root: 'C', chord: 'major7', octave: 3 }],
  // "Haggstrom" inspired
  [{ root: 'D', chord: 'major7', octave: 3 }, { root: 'A', chord: 'minor7', octave: 3 }, { root: 'E', chord: 'minor7', octave: 3 }, { root: 'G', chord: 'add9', octave: 3 }],
  // Ambient floating
  [{ root: 'E', chord: 'minor7', octave: 3 }, { root: 'C', chord: 'major7', octave: 3 }, { root: 'G', chord: 'add9', octave: 3 }],
  // Melancholic
  [{ root: 'A', chord: 'minor7', octave: 3 }, { root: 'D', chord: 'minor7', octave: 3 }, { root: 'G', chord: 'major7', octave: 3 }, { root: 'C', chord: 'add9', octave: 3 }],
]

// Melodic motifs that get developed/varied (like a leitmotif)
const MELODIC_MOTIFS = [
  // Simple descending - C418's signature
  ['E5', 'D5', 'C5'],
  ['A4', 'G4', 'E4'],
  ['C5', 'G4', 'E4'],
  // Gentle ascending
  ['C4', 'E4', 'G4'],
  ['G4', 'A4', 'C5'],
  // Question/answer pairs
  ['E4', 'D4'],
  ['G4', 'F4'],
  // Single floating notes (very C418)
  ['E5'],
  ['A4'],
  ['C5'],
]

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface PianoConfig {
  enabled: boolean
  volume: number           // 0-1
  reverb: number          // 0-1 (wet/dry)
  tempo: number           // BPM
  swing: number           // 0-1 swing amount
  autoPlay: boolean       // Play during thoughts
  humanize: number        // 0-1 timing variation
}

export interface Note {
  pitch: string           // e.g., 'C4', 'A#3'
  duration: number        // ms
  velocity: number        // 0-1
  delay?: number          // ms before playing
}

export interface Phrase {
  name: string
  notes: Note[]
  emotion: EmotionToken
  style: 'joji' | 'yeule' | 'ambient' | 'minimal'
}

export interface PianoState {
  isPlaying: boolean
  isContinuous: boolean  // Playing in continuous/loop mode
  currentEmotion: EmotionToken
  currentKey: string
  currentScale: string
  notesPlayed: number
  lastNote?: string
  // Musical performance state
  currentProgression: number  // Index into C418_PROGRESSIONS
  progressionPosition: number // Current chord in progression
  currentMotif: string[]      // The melodic motif being developed
  dynamicLevel: number        // 0-1, for crescendo/decrescendo
  phrasesPlayed: number       // Count for variety
}

// ════════════════════════════════════════════════════════════════════════════════
// EMOTION-BASED MUSICAL MAPPING
// ════════════════════════════════════════════════════════════════════════════════

interface MusicalMood {
  keys: string[]
  scales: (keyof typeof SCALES)[]
  chords: (keyof typeof CHORDS)[]
  tempo: [number, number]  // min, max BPM
  velocity: [number, number]  // min, max
  noteDensity: number  // 0-1 (sparse to dense)
  useDissonance: boolean
  style: 'joji' | 'yeule' | 'ambient' | 'minimal'
}

const EMOTION_MOODS: Record<EmotionToken, MusicalMood> = {
  'EMOTE_NEUTRAL': {
    keys: ['C', 'G', 'D'],
    scales: ['dorian', 'pentatonicMinor'],
    chords: ['minor7', 'sus2', 'add9'],
    tempo: [60, 75],
    velocity: [0.4, 0.6],
    noteDensity: 0.3,
    useDissonance: false,
    style: 'ambient'
  },
  'EMOTE_HAPPY': {
    keys: ['C', 'G', 'F'],
    scales: ['major', 'lydian', 'pentatonicMajor'],
    chords: ['major7', 'add9', 'major'],
    tempo: [80, 100],
    velocity: [0.5, 0.8],
    noteDensity: 0.5,
    useDissonance: false,
    style: 'minimal'
  },
  'EMOTE_SAD': {
    keys: ['A', 'E', 'D'],
    scales: ['minor', 'harmonicMinor', 'phrygian'],
    chords: ['minor7', 'diminished7', 'minorMajor7', 'halfDiminished7'],
    tempo: [50, 65],
    velocity: [0.3, 0.5],
    noteDensity: 0.2,
    useDissonance: true,
    style: 'joji'
  },
  'EMOTE_ANGRY': {
    keys: ['D', 'A', 'E'],
    scales: ['phrygian', 'locrian', 'harmonicMinor'],
    chords: ['diminished', 'cluster', 'dominant7'],
    tempo: [90, 120],
    velocity: [0.7, 1.0],
    noteDensity: 0.6,
    useDissonance: true,
    style: 'yeule'
  },
  'EMOTE_THINK': {
    keys: ['E', 'B', 'F#'],
    scales: ['dorian', 'melodicMinor', 'wholeTone'],
    chords: ['minor9', 'sus4', 'quartal'],
    tempo: [55, 70],
    velocity: [0.3, 0.5],
    noteDensity: 0.25,
    useDissonance: false,
    style: 'ambient'
  },
  'EMOTE_SURPRISED': {
    keys: ['F', 'Bb', 'Eb'],
    scales: ['lydian', 'wholeTone'],
    chords: ['augmented', 'major7', 'sus2'],
    tempo: [85, 110],
    velocity: [0.6, 0.9],
    noteDensity: 0.4,
    useDissonance: true,
    style: 'yeule'
  },
  'EMOTE_AWKWARD': {
    keys: ['F#', 'B', 'C#'],
    scales: ['locrian', 'phrygian', 'japanese'],
    chords: ['halfDiminished7', 'sus2sus4', 'cluster'],
    tempo: [60, 80],
    velocity: [0.3, 0.5],
    noteDensity: 0.35,
    useDissonance: true,
    style: 'yeule'
  },
  'EMOTE_QUESTION': {
    keys: ['G', 'D', 'A'],
    scales: ['dorian', 'melodicMinor'],
    chords: ['sus4', 'minor7', 'dominant7'],
    tempo: [65, 80],
    velocity: [0.4, 0.6],
    noteDensity: 0.3,
    useDissonance: false,
    style: 'minimal'
  },
  'EMOTE_CURIOUS': {
    keys: ['D', 'A', 'E'],
    scales: ['lydian', 'dorian', 'pentatonicMajor'],
    chords: ['major7', 'add9', 'sus2'],
    tempo: [70, 90],
    velocity: [0.5, 0.7],
    noteDensity: 0.4,
    useDissonance: false,
    style: 'ambient'
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// PHRASE GENERATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate scale notes from a root and scale type
 */
function getScaleNotes(root: string, scaleName: keyof typeof SCALES, octave: number): string[] {
  const scale = SCALES[scaleName]
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const rootIndex = noteNames.indexOf(root)

  return scale.map(interval => {
    const noteIndex = (rootIndex + interval) % 12
    const noteOctave = octave + Math.floor((rootIndex + interval) / 12)
    return `${noteNames[noteIndex]}${noteOctave}`
  })
}

/**
 * Generate chord notes from a root and chord type
 */
function getChordNotes(root: string, chordName: keyof typeof CHORDS, octave: number): string[] {
  const chord = CHORDS[chordName]
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const rootIndex = noteNames.indexOf(root)

  return chord.map(interval => {
    const noteIndex = (rootIndex + interval) % 12
    const noteOctave = octave + Math.floor((rootIndex + interval) / 12)
    return `${noteNames[noteIndex]}${noteOctave}`
  })
}

// ════════════════════════════════════════════════════════════════════════════════
// PRE-COMPOSED PHRASES (Joji/Yeule inspired)
// ════════════════════════════════════════════════════════════════════════════════

const JOJI_PHRASES: Phrase[] = [
  {
    name: 'melancholy-descent',
    emotion: 'EMOTE_SAD',
    style: 'joji',
    notes: [
      { pitch: 'A4', duration: 800, velocity: 0.5 },
      { pitch: 'G4', duration: 600, velocity: 0.4, delay: 200 },
      { pitch: 'E4', duration: 1000, velocity: 0.45, delay: 400 },
      { pitch: 'D4', duration: 1200, velocity: 0.35, delay: 600 },
    ]
  },
  {
    name: 'slow-arpeggio-minor7',
    emotion: 'EMOTE_SAD',
    style: 'joji',
    notes: [
      { pitch: 'A3', duration: 1000, velocity: 0.4 },
      { pitch: 'C4', duration: 800, velocity: 0.35, delay: 800 },
      { pitch: 'E4', duration: 800, velocity: 0.4, delay: 600 },
      { pitch: 'G4', duration: 1200, velocity: 0.45, delay: 600 },
      { pitch: 'A4', duration: 1500, velocity: 0.35, delay: 800 },
    ]
  },
  {
    name: 'ballads-1-vibe',
    emotion: 'EMOTE_SAD',
    style: 'joji',
    notes: [
      { pitch: 'D4', duration: 600, velocity: 0.45 },
      { pitch: 'F4', duration: 600, velocity: 0.4, delay: 300 },
      { pitch: 'A4', duration: 800, velocity: 0.5, delay: 300 },
      { pitch: 'D5', duration: 1000, velocity: 0.4, delay: 500 },
      { pitch: 'C5', duration: 1200, velocity: 0.35, delay: 400 },
    ]
  },
  {
    name: 'suspended-longing',
    emotion: 'EMOTE_THINK',
    style: 'joji',
    notes: [
      { pitch: 'E4', duration: 1000, velocity: 0.4 },
      { pitch: 'B3', duration: 800, velocity: 0.35, delay: 600 },
      { pitch: 'A3', duration: 1200, velocity: 0.4, delay: 500 },
      { pitch: 'E4', duration: 1500, velocity: 0.35, delay: 800 },
    ]
  }
]

const YEULE_PHRASES: Phrase[] = [
  {
    name: 'glitch-cluster',
    emotion: 'EMOTE_AWKWARD',
    style: 'yeule',
    notes: [
      { pitch: 'F#4', duration: 200, velocity: 0.6 },
      { pitch: 'G4', duration: 150, velocity: 0.5, delay: 50 },
      { pitch: 'A4', duration: 300, velocity: 0.55, delay: 100 },
      { pitch: 'F#4', duration: 800, velocity: 0.4, delay: 400 },
    ]
  },
  {
    name: 'ethereal-float',
    emotion: 'EMOTE_NEUTRAL',
    style: 'yeule',
    notes: [
      { pitch: 'E5', duration: 1500, velocity: 0.3 },
      { pitch: 'B4', duration: 1200, velocity: 0.35, delay: 1000 },
      { pitch: 'G#4', duration: 1000, velocity: 0.3, delay: 800 },
      { pitch: 'E4', duration: 2000, velocity: 0.25, delay: 600 },
    ]
  },
  {
    name: 'softscars-moment',
    emotion: 'EMOTE_SAD',
    style: 'yeule',
    notes: [
      { pitch: 'C#5', duration: 600, velocity: 0.4 },
      { pitch: 'A4', duration: 800, velocity: 0.35, delay: 400 },
      { pitch: 'F#4', duration: 1000, velocity: 0.4, delay: 300 },
      { pitch: 'E4', duration: 1200, velocity: 0.3, delay: 500 },
      { pitch: 'C#4', duration: 1500, velocity: 0.25, delay: 700 },
    ]
  },
  {
    name: 'dissonant-resolve',
    emotion: 'EMOTE_SURPRISED',
    style: 'yeule',
    notes: [
      { pitch: 'F4', duration: 300, velocity: 0.6 },
      { pitch: 'F#4', duration: 300, velocity: 0.55, delay: 100 },
      { pitch: 'E4', duration: 1000, velocity: 0.5, delay: 400 },
    ]
  }
]

const AMBIENT_PHRASES: Phrase[] = [
  {
    name: 'gentle-wave',
    emotion: 'EMOTE_NEUTRAL',
    style: 'ambient',
    notes: [
      { pitch: 'G4', duration: 1500, velocity: 0.3 },
      { pitch: 'D4', duration: 1200, velocity: 0.25, delay: 1200 },
      { pitch: 'A3', duration: 2000, velocity: 0.3, delay: 1000 },
    ]
  },
  {
    name: 'curious-ascent',
    emotion: 'EMOTE_CURIOUS',
    style: 'ambient',
    notes: [
      { pitch: 'D4', duration: 600, velocity: 0.4 },
      { pitch: 'E4', duration: 600, velocity: 0.45, delay: 400 },
      { pitch: 'G4', duration: 800, velocity: 0.5, delay: 400 },
      { pitch: 'A4', duration: 1000, velocity: 0.45, delay: 500 },
    ]
  },
  {
    name: 'happy-sparkle',
    emotion: 'EMOTE_HAPPY',
    style: 'ambient',
    notes: [
      { pitch: 'C5', duration: 400, velocity: 0.6 },
      { pitch: 'G4', duration: 400, velocity: 0.5, delay: 200 },
      { pitch: 'E4', duration: 500, velocity: 0.55, delay: 200 },
      { pitch: 'C5', duration: 800, velocity: 0.5, delay: 300 },
    ]
  }
]

// ════════════════════════════════════════════════════════════════════════════════
// PIANO ENGINE
// ════════════════════════════════════════════════════════════════════════════════

export class PianoEngine extends EventEmitter {
  private config: PianoConfig
  private state: PianoState
  private playQueue: Note[] = []
  private isProcessingQueue = false
  private currentTimeout: NodeJS.Timeout | null = null

  // Callback for playing notes (will be connected to audio system)
  private playNoteCallback: ((note: string, duration: number, velocity: number) => Promise<void>) | null = null

  constructor(config: Partial<PianoConfig> = {}) {
    super()

    this.config = {
      enabled: true,
      volume: 0.6,
      reverb: 0.4,
      tempo: 65,
      swing: 0.1,
      autoPlay: true,
      humanize: 0.15,
      ...config
    }

    this.state = {
      isPlaying: false,
      isContinuous: false,
      currentEmotion: 'EMOTE_NEUTRAL',
      currentKey: 'A',
      currentScale: 'minor',
      notesPlayed: 0,
      currentProgression: Math.floor(Math.random() * C418_PROGRESSIONS.length),
      progressionPosition: 0,
      currentMotif: MELODIC_MOTIFS[Math.floor(Math.random() * MELODIC_MOTIFS.length)],
      dynamicLevel: 0.35,
      phrasesPlayed: 0
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Set the callback for playing notes
   */
  onPlayNote(callback: (note: string, duration: number, velocity: number) => Promise<void>): void {
    this.playNoteCallback = callback
  }

  /**
   * Set current emotion (affects musical choices)
   */
  setEmotion(emotion: EmotionToken): void {
    this.state.currentEmotion = emotion

    const mood = EMOTION_MOODS[emotion]
    this.state.currentKey = mood.keys[Math.floor(Math.random() * mood.keys.length)]
    this.state.currentScale = mood.scales[Math.floor(Math.random() * mood.scales.length)]

    // Emit state change so visualizer can update
    this.emit('stateChange', this.state)
  }

  /**
   * Play a single note
   */
  async playNote(pitch: string, duration: number, velocity: number): Promise<void> {
    if (!this.config.enabled) return

    // Apply humanization
    const humanizedVelocity = this.humanize(velocity, 0.1)
    const humanizedDuration = this.humanize(duration, 50)

    this.state.lastNote = pitch
    this.state.notesPlayed++

    this.emit('noteStart', { pitch, duration: humanizedDuration, velocity: humanizedVelocity })

    if (this.playNoteCallback) {
      await this.playNoteCallback(pitch, humanizedDuration, humanizedVelocity * this.config.volume)
    }

    this.emit('noteEnd', { pitch })
  }

  /**
   * Play a chord (all notes simultaneously)
   */
  async playChord(root: string, chordType: keyof typeof CHORDS, octave: number, duration: number, velocity: number): Promise<void> {
    if (!this.config.enabled) return

    const notes = getChordNotes(root, chordType, octave)

    this.emit('chordStart', { root, chordType, notes })

    // Play all notes with slight strum
    const strumDelay = 30
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playNote(notes[i], duration, velocity - (i * 0.05))
      }, i * strumDelay)
    }
  }

  /**
   * Play a pre-composed phrase
   */
  async playPhrase(phrase: Phrase): Promise<void> {
    if (!this.config.enabled) return

    this.state.isPlaying = true
    this.emit('phraseStart', phrase)

    for (const note of phrase.notes) {
      if (note.delay) {
        await this.sleep(this.humanize(note.delay, 30))
      }
      await this.playNote(note.pitch, note.duration, note.velocity)
      await this.sleep(note.duration * 0.7)  // Overlap slightly
    }

    this.state.isPlaying = false
    this.emit('phraseEnd', phrase)
  }

  /**
   * Generate and play an emotional phrase
   */
  async playEmotionalPhrase(emotion?: EmotionToken): Promise<void> {
    if (!this.config.enabled) return

    const targetEmotion = emotion || this.state.currentEmotion
    const mood = EMOTION_MOODS[targetEmotion]

    // Pick a pre-composed phrase or generate one
    let phrase: Phrase | null = null

    if (mood.style === 'joji') {
      const matching = JOJI_PHRASES.filter(p => p.emotion === targetEmotion)
      if (matching.length > 0) {
        phrase = matching[Math.floor(Math.random() * matching.length)]
      }
    } else if (mood.style === 'yeule') {
      const matching = YEULE_PHRASES.filter(p => p.emotion === targetEmotion)
      if (matching.length > 0) {
        phrase = matching[Math.floor(Math.random() * matching.length)]
      }
    }

    // Fallback to generated phrase
    if (!phrase) {
      phrase = this.generatePhrase(targetEmotion)
    }

    await this.playPhrase(phrase)
  }

  /**
   * Generate a phrase based on emotion and music theory
   */
  generatePhrase(emotion: EmotionToken): Phrase {
    const mood = EMOTION_MOODS[emotion]

    const key = mood.keys[Math.floor(Math.random() * mood.keys.length)]
    const scaleName = mood.scales[Math.floor(Math.random() * mood.scales.length)]
    const octave = 3 + Math.floor(Math.random() * 2)

    const scaleNotes = getScaleNotes(key, scaleName, octave)
    const tempo = mood.tempo[0] + Math.random() * (mood.tempo[1] - mood.tempo[0])
    const beatMs = 60000 / tempo

    const notes: Note[] = []
    const phraseLength = 3 + Math.floor(Math.random() * 4)  // 3-6 notes

    let lastIndex = Math.floor(Math.random() * scaleNotes.length)

    for (let i = 0; i < phraseLength; i++) {
      // Voice leading: prefer stepwise motion
      const stepOptions = [-2, -1, -1, 0, 1, 1, 2]
      const step = stepOptions[Math.floor(Math.random() * stepOptions.length)]
      let newIndex = lastIndex + step
      newIndex = Math.max(0, Math.min(scaleNotes.length - 1, newIndex))

      // Sometimes add octave note for more range
      let pitch = scaleNotes[newIndex]
      if (Math.random() < 0.2 && newIndex < scaleNotes.length - 3) {
        pitch = pitch.replace(/\d/, (d) => String(parseInt(d) + 1))
      }

      const velocity = mood.velocity[0] + Math.random() * (mood.velocity[1] - mood.velocity[0])
      const duration = beatMs * (0.5 + Math.random() * 1.5)
      const delay = i > 0 ? beatMs * (0.3 + Math.random() * 0.7) : 0

      notes.push({ pitch, duration, velocity, delay })
      lastIndex = newIndex
    }

    return {
      name: `generated-${emotion}-${Date.now()}`,
      emotion,
      style: mood.style,
      notes
    }
  }

  /**
   * Play ambient background (very sparse, ethereal)
   */
  async playAmbient(durationMs: number = 10000): Promise<void> {
    if (!this.config.enabled) return

    this.state.isPlaying = true
    this.emit('ambientStart')

    const startTime = Date.now()
    const mood = EMOTION_MOODS[this.state.currentEmotion]

    while (Date.now() - startTime < durationMs && this.config.enabled && this.state.isPlaying) {
      // Very sparse notes
      if (Math.random() < mood.noteDensity * 0.3) {
        const phrase = this.generatePhrase(this.state.currentEmotion)
        const singleNote = phrase.notes[Math.floor(Math.random() * phrase.notes.length)]
        await this.playNote(singleNote.pitch, singleNote.duration * 1.5, singleNote.velocity * 0.7)
      }

      // Wait between potential notes
      await this.sleep(1000 + Math.random() * 3000)
    }

    this.state.isPlaying = false
    this.emit('ambientEnd')
  }

  /**
   * Play continuously until stopped - REAL musical performance
   * Like C418's Minecraft soundtrack - with actual progressions, motifs, dynamics
   * Music that BREATHES and DEVELOPS - not random notes
   */
  async playContinuous(style: 'joji' | 'yeule' | 'ambient' | 'c418' | 'mixed' = 'c418'): Promise<void> {
    if (!this.config.enabled) return
    if (this.state.isContinuous) return  // Already playing continuously

    this.state.isPlaying = true
    this.state.isContinuous = true
    this.state.phrasesPlayed = 0
    this.emit('continuousStart', { style })

    // Select a progression to follow for musical coherence
    this.state.currentProgression = Math.floor(Math.random() * C418_PROGRESSIONS.length)
    this.state.progressionPosition = 0
    this.state.currentMotif = MELODIC_MOTIFS[Math.floor(Math.random() * MELODIC_MOTIFS.length)]

    const playLoop = async () => {
      while (this.state.isContinuous && this.config.enabled) {
        const progression = C418_PROGRESSIONS[this.state.currentProgression]
        const currentChord = progression[this.state.progressionPosition]

        // Dynamic swell - slowly build and release over phrases
        if (Math.random() < 0.15) {
          // Occasionally shift dynamics
          const dynamicChange = (Math.random() - 0.5) * 0.15
          this.state.dynamicLevel = Math.max(0.2, Math.min(0.5, this.state.dynamicLevel + dynamicChange))
        }

        const velocity = this.state.dynamicLevel + (Math.random() - 0.5) * 0.08

        // C418 STYLE - Musical, intentional, alive
        if (style === 'c418' || style === 'ambient') {
          const phraseType = Math.random()

          if (phraseType < 0.35) {
            // MOTIF DEVELOPMENT - play the current melodic motif with variations
            const motif = this.state.currentMotif
            const octaveShift = Math.random() < 0.3 ? (Math.random() < 0.5 ? -12 : 12) : 0

            for (let i = 0; i < motif.length; i++) {
              if (!this.state.isContinuous) break

              // Vary the motif slightly - transpose, change rhythm
              let note = motif[i]
              if (octaveShift !== 0 && NOTE_FREQUENCIES[note]) {
                const match = note.match(/([A-G]#?)(\d)/)
                if (match) {
                  const octave = parseInt(match[2]) + (octaveShift > 0 ? 1 : -1)
                  if (octave >= 2 && octave <= 5) note = `${match[1]}${octave}`
                }
              }

              const noteVelocity = velocity - (i * 0.03)  // Gentle falloff
              const noteDuration = 2000 + Math.random() * 1500
              await this.playNote(note, noteDuration, noteVelocity)

              // Organic pause between notes - rubato
              const pause = 400 + Math.random() * 800
              await this.sleep(pause)
            }

            // Sometimes vary the motif for next time
            if (Math.random() < 0.25) {
              this.state.currentMotif = MELODIC_MOTIFS[Math.floor(Math.random() * MELODIC_MOTIFS.length)]
            }

          } else if (phraseType < 0.6) {
            // CHORD FROM PROGRESSION - arpeggiated, warm
            const chordNotes = getChordNotes(
              currentChord.root,
              currentChord.chord as keyof typeof CHORDS,
              currentChord.octave
            )

            // Arpeggiate the chord slowly, like C418
            for (let i = 0; i < Math.min(chordNotes.length, 4); i++) {
              if (!this.state.isContinuous) break
              const noteVelocity = velocity - (i * 0.025)
              const noteDuration = 2500 + Math.random() * 1000
              await this.playNote(chordNotes[i], noteDuration, noteVelocity)

              // Organic strum timing
              const strumDelay = 200 + Math.random() * 300
              await this.sleep(strumDelay)
            }

            // Advance progression
            this.state.progressionPosition = (this.state.progressionPosition + 1) % progression.length

            // Occasionally change progression for variety
            if (this.state.progressionPosition === 0 && Math.random() < 0.3) {
              this.state.currentProgression = Math.floor(Math.random() * C418_PROGRESSIONS.length)
            }

          } else if (phraseType < 0.75) {
            // SINGLE FLOATING NOTE - the space between
            // Use notes from current chord for harmonic coherence
            const chordNotes = getChordNotes(
              currentChord.root,
              currentChord.chord as keyof typeof CHORDS,
              currentChord.octave + 1  // Higher octave for shimmer
            )
            const note = chordNotes[Math.floor(Math.random() * chordNotes.length)]
            await this.playNote(note, 3500 + Math.random() * 2000, velocity * 0.9)

          } else if (phraseType < 0.85) {
            // BASS FOUNDATION - grounding
            const bassNote = `${currentChord.root}2`
            await this.playNote(bassNote, 4000 + Math.random() * 1500, velocity * 0.7)

          }
          // else: ~15% SILENCE - essential for breathing

        } else if (style === 'joji') {
          // Sparse, melancholic - deeper, more space
          const phraseType = Math.random()

          if (phraseType < 0.4) {
            // Slow melodic descent
            const notes = ['A4', 'G4', 'E4', 'D4']
            for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
              if (!this.state.isContinuous) break
              await this.playNote(notes[i % notes.length], 2500, velocity - (i * 0.04))
              await this.sleep(600 + Math.random() * 800)
            }
          } else if (phraseType < 0.6) {
            const phrases = JOJI_PHRASES
            const phrase = phrases[Math.floor(Math.random() * phrases.length)]
            await this.playPhrase(phrase)
          }

        } else if (style === 'yeule') {
          // Ethereal, high, occasionally glitchy
          const phraseType = Math.random()

          if (phraseType < 0.35) {
            // High ethereal notes
            const highNotes = ['E5', 'G5', 'B4', 'C5', 'A4']
            const note = highNotes[Math.floor(Math.random() * highNotes.length)]
            await this.playNote(note, 3000 + Math.random() * 1500, velocity * 0.75)
          } else if (phraseType < 0.55) {
            const phrases = YEULE_PHRASES
            const phrase = phrases[Math.floor(Math.random() * phrases.length)]
            await this.playPhrase(phrase)
          } else if (phraseType < 0.65) {
            // Glitch cluster
            const clusterNotes = ['F#4', 'G4', 'A4']
            for (const note of clusterNotes) {
              this.playNote(note, 300 + Math.random() * 200, velocity * 0.6)
              await this.sleep(50 + Math.random() * 100)
            }
          }

        } else if (style === 'mixed') {
          // Mix of all styles
          const styleChoice = Math.random()
          if (styleChoice < 0.4) {
            // C418 motif
            const motif = this.state.currentMotif
            for (const note of motif.slice(0, 2)) {
              await this.playNote(note, 2000, velocity)
              await this.sleep(400 + Math.random() * 400)
            }
          } else if (styleChoice < 0.6) {
            // Chord arpeggio
            const chordNotes = getChordNotes(currentChord.root, currentChord.chord as keyof typeof CHORDS, currentChord.octave)
            for (let i = 0; i < Math.min(3, chordNotes.length); i++) {
              await this.playNote(chordNotes[i], 2000, velocity - (i * 0.03))
              await this.sleep(250 + Math.random() * 200)
            }
            this.state.progressionPosition = (this.state.progressionPosition + 1) % progression.length
          }
        }

        this.state.phrasesPlayed++

        // REDUCED GAPS - still breathing but more continuous
        // Music flows more naturally, less silence
        const baseWait = style === 'c418' ? 1800 : style === 'ambient' ? 2000 : style === 'joji' ? 2500 : style === 'yeule' ? 1500 : 1500
        const variance = baseWait * 0.5

        // Occasional longer pause for phrasing (less frequent, shorter)
        const dramaticPause = Math.random() < 0.1 ? 1500 + Math.random() * 2000 : 0

        // Rubato - organic tempo variation
        const rubato = (Math.random() - 0.5) * 600

        await this.sleep(baseWait + Math.random() * variance + dramaticPause + rubato)
      }
    }

    // Start the loop (non-blocking)
    playLoop().catch(() => {
      this.state.isContinuous = false
      this.state.isPlaying = false
    })
  }

  /**
   * Stop continuous playback
   */
  stopContinuous(): void {
    this.state.isContinuous = false
    this.stop()
    this.emit('continuousEnd')
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
    }
    this.state.isPlaying = false
    this.state.isContinuous = false
    this.emit('stopped')
  }

  /**
   * Get current state
   */
  getState(): PianoState {
    return { ...this.state }
  }

  /**
   * Enable/disable
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
    if (!enabled) {
      this.stop()
    }
  }

  /**
   * Get note frequency
   */
  getNoteFrequency(note: string): number {
    return NOTE_FREQUENCIES[note] || 432
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ════════════════════════════════════════════════════════════════════════════

  private humanize(value: number, variance: number): number {
    if (this.config.humanize === 0) return value
    const variation = (Math.random() - 0.5) * 2 * variance * this.config.humanize
    return Math.max(0, value + variation)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      this.currentTimeout = setTimeout(resolve, ms)
    })
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createPianoEngine(config?: Partial<PianoConfig>): PianoEngine {
  return new PianoEngine(config)
}

// Export phrases for potential customization
export const PHRASES = {
  joji: JOJI_PHRASES,
  yeule: YEULE_PHRASES,
  ambient: AMBIENT_PHRASES
}

// Export constants for advanced usage
export { NOTE_FREQUENCIES, SCALES, CHORDS, EMOTION_MOODS }
