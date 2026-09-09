export { C as CHORD_SCALE, a as Change, J as JazzEngine, b as JazzNote, c as JazzRole, S as SoloOptions, d as comp, e as enclosure, g as guideTones, i as iiVI, s as soloOverChanges, t as tradeFours, w as walkingBass } from '../../jazz-engine-ByfGApnW.js';
export { A as Affect, b as AffectEngine, c as AffectiveSynth, a as ArcPhase, L as LOOKS, M as MusicParams, P as PerformanceState, V as VisualParams, d as createAffectiveSynth } from '../../affect-engine-OOEew1HW.js';
export { b as AffectClockEvent, A as AffectClockOptions, a as AffectClockResult, c as AffectiveSynthV2 } from '../../affect-clock-v2-BuIKEpPY.js';

/**
 * KAIOS Music Theory Foundation
 *
 * Mathematical and harmonic foundations for intelligent music generation
 * Based on 432Hz tuning (solfeggio frequencies)
 */
/** Base frequency - 432Hz solfeggio tuning (more harmonic than 440Hz) */
declare const BASE_FREQ = 432;
/** Golden ratio - appears throughout nature and pleasing compositions */
declare const PHI = 1.618033988749895;
/** Fibonacci sequence - for rhythm patterns and structure */
declare const FIBONACCI: number[];
/** Circle of fifths - harmonic relationships */
declare const CIRCLE_OF_FIFTHS: string[];
/** Scale intervals (semitones from root) */
declare const SCALES: Record<string, number[]>;
/** Chord intervals (semitones from root) */
declare const CHORDS: Record<string, number[]>;
/** Lo-fi chord progressions that hit different */
declare const LOFI_PROGRESSIONS: number[][];
/** Emotional chord qualities */
declare const CHORD_EMOTIONS: Record<string, string[]>;
/**
 * Convert MIDI note number to frequency (432Hz tuning)
 * A4 (MIDI 69) = 432Hz instead of 440Hz
 */
declare function midiToFreq(midi: number): number;
/**
 * Convert frequency to MIDI note number
 */
declare function freqToMidi(freq: number): number;
/**
 * Get frequency for a note name (e.g., 'C4', 'F#3')
 */
declare function noteToFreq(note: string): number;
/**
 * Get all frequencies in a scale
 */
declare function getScaleFrequencies(root: string, scaleName: string, octave?: number): number[];
/**
 * Get chord frequencies
 */
declare function getChordFrequencies(root: string, chordName: string, octave?: number): number[];
/**
 * Get harmonically related notes using the harmonic series
 */
declare function getHarmonics(fundamental: number, count?: number): number[];
/**
 * Calculate consonance between two frequencies
 * Lower = more consonant (simpler ratio)
 */
declare function getConsonance(freq1: number, freq2: number): number;
/**
 * Find the relative minor/major of a key
 */
declare function getRelativeKey(root: string, isMinor: boolean): string;
/**
 * Get chord function in a key (tonic, subdominant, dominant)
 */
declare function getChordFunction(degree: number): 'tonic' | 'subdominant' | 'dominant' | 'mediant';
/**
 * Calculate tension level of a chord progression
 * Higher = more tension, needs resolution
 */
declare function calculateTension(chordDegrees: number[]): number;
/**
 * Suggest next chord based on voice leading and function
 */
declare function suggestNextChord(currentDegree: number, tension: number): number[];
/**
 * Optimize chord voicing for smooth voice leading
 * Minimizes total movement between chord tones
 */
declare function optimizeVoicing(currentVoices: number[], nextChord: number[], rootOctave?: number): number[];
declare const MusicTheory: {
    BASE_FREQ: number;
    PHI: number;
    FIBONACCI: number[];
    SCALES: Record<string, number[]>;
    CHORDS: Record<string, number[]>;
    LOFI_PROGRESSIONS: number[][];
    CHORD_EMOTIONS: Record<string, string[]>;
    midiToFreq: typeof midiToFreq;
    freqToMidi: typeof freqToMidi;
    noteToFreq: typeof noteToFreq;
    getScaleFrequencies: typeof getScaleFrequencies;
    getChordFrequencies: typeof getChordFrequencies;
    getHarmonics: typeof getHarmonics;
    getConsonance: typeof getConsonance;
    getRelativeKey: typeof getRelativeKey;
    getChordFunction: typeof getChordFunction;
    calculateTension: typeof calculateTension;
    suggestNextChord: typeof suggestNextChord;
    optimizeVoicing: typeof optimizeVoicing;
};

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
interface RhythmPattern {
    name: string;
    pattern: number[];
    subdivision: number;
    swing: number;
    humanize: number;
}
interface BreakPattern {
    name: string;
    slices: BreakSlice[];
    originalBPM: number;
}
interface BreakSlice {
    start: number;
    duration: number;
    pitch: number;
    reverse: boolean;
    volume: number;
    filter?: number;
    stutter?: number;
}
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
declare function euclidean(hits: number, steps: number, rotation?: number): number[];
/** Common Euclidean patterns with cultural origins */
declare const EUCLIDEAN_PATTERNS: Record<string, {
    hits: number;
    steps: number;
    name: string;
}>;
/**
 * Generate rhythm based on Fibonacci sequence
 * Creates organic, mathematically pleasing patterns
 */
declare function fibonacciRhythm(length: number, density?: number): number[];
/**
 * Generate timing offsets based on golden ratio
 * Creates natural-feeling groove
 */
declare function goldenGroove(steps: number): number[];
/**
 * Generate polyrhythm combining two different subdivisions
 * e.g., 3 against 4, 5 against 3
 */
declare function polyrhythm(a: number, b: number, steps: number): {
    layerA: number[];
    layerB: number[];
};
/** Common polyrhythm combinations */
declare const POLYRHYTHMS: Record<string, [number, number]>;
/**
 * Apply swing to a rhythm pattern
 * Delays every other subdivision
 */
declare function applySwing(pattern: number[], swingAmount?: number, subdivision?: number): {
    pattern: number[];
    timings: number[];
};
/**
 * Add humanization (random timing variations)
 * Makes robotic patterns feel more natural
 */
declare function humanize(timings: number[], amount?: number): number[];
/**
 * Apply velocity variation for more dynamic feel
 */
declare function velocityVariation(pattern: number[], accentPattern?: number[]): number[];
/** The legendary Amen Break slices */
declare const AMEN_SLICES: BreakSlice[];
/**
 * Generate breakcore chop pattern
 * Randomly rearranges, pitches, and effects slices
 */
declare function generateBreakcoreChops(slices: BreakSlice[], intensity?: number, length?: number): BreakSlice[];
/**
 * Generate a thought-amen pattern (intelligent chops)
 * Uses Euclidean distribution for more musical results
 */
declare function thoughtAmen(complexity?: number, bars?: number): {
    kicks: number[];
    snares: number[];
    hats: number[];
    chops: BreakSlice[];
};
/** Lo-fi beat patterns */
declare const LOFI_PATTERNS: Record<string, RhythmPattern>;
/** Breakcore patterns */
declare const BREAKCORE_PATTERNS: Record<string, RhythmPattern>;
/** Cottagecore / peaceful patterns */
declare const COTTAGECORE_PATTERNS: Record<string, RhythmPattern>;
interface RhythmGeneratorOptions {
    genre: 'lofi' | 'breakcore' | 'cottagecore' | 'frutiger' | 'ambient';
    complexity: number;
    energy: number;
    bpm: number;
    swing: number;
}
/**
 * Generate a complete rhythm section for given parameters
 */
declare function generateRhythm(options: RhythmGeneratorOptions): {
    kick: RhythmPattern;
    snare: RhythmPattern;
    hat: RhythmPattern;
    percussion: RhythmPattern;
    polyLayer?: RhythmPattern;
};
declare const RhythmEngine: {
    euclidean: typeof euclidean;
    EUCLIDEAN_PATTERNS: Record<string, {
        hits: number;
        steps: number;
        name: string;
    }>;
    fibonacciRhythm: typeof fibonacciRhythm;
    goldenGroove: typeof goldenGroove;
    polyrhythm: typeof polyrhythm;
    POLYRHYTHMS: Record<string, [number, number]>;
    applySwing: typeof applySwing;
    humanize: typeof humanize;
    velocityVariation: typeof velocityVariation;
    AMEN_SLICES: BreakSlice[];
    generateBreakcoreChops: typeof generateBreakcoreChops;
    thoughtAmen: typeof thoughtAmen;
    LOFI_PATTERNS: Record<string, RhythmPattern>;
    BREAKCORE_PATTERNS: Record<string, RhythmPattern>;
    COTTAGECORE_PATTERNS: Record<string, RhythmPattern>;
    generateRhythm: typeof generateRhythm;
};

/**
 * KAIOS Genre Engine
 *
 * Deep knowledge of musical aesthetics:
 * - Lo-fi: Dusty, nostalgic, warm imperfection
 * - Cottagecore: Acoustic, pastoral, gentle warmth
 * - Frutiger Aero: Glossy, optimistic, Y2K futurism
 * - Breakcore: Chaotic, chopped, controlled chaos
 */

type GenreType = 'lofi' | 'cottagecore' | 'frutiger' | 'breakcore' | 'ambient' | 'vaporwave';
interface GenreProfile {
    name: string;
    description: string;
    bpmRange: [number, number];
    preferredBPM: number;
    preferredScales: string[];
    preferredChords: string[];
    progressionStyle: 'jazzy' | 'simple' | 'complex' | 'minimal' | 'chaotic';
    keyPreferences: string[];
    timeSignature: [number, number];
    swingAmount: number;
    rhythmComplexity: number;
    grooveTightness: number;
    brightness: number;
    warmth: number;
    saturation: number;
    spaceReverb: number;
    lofiAmount: number;
    glitchAmount: number;
    useVinylCrackle: boolean;
    useTapeWobble: boolean;
    useNatureAmbience: boolean;
    useSynthPads: boolean;
    useAcousticElements: boolean;
    useDigitalGlitch: boolean;
    buildupStyle: 'gradual' | 'sudden' | 'none' | 'chaotic';
    transitionStyle: 'smooth' | 'cut' | 'glitch' | 'fade';
    sectionLength: number;
    preferredSamples: string[];
    sampleProcessing: SampleProcessing;
}
interface SampleProcessing {
    pitchShift: [number, number];
    timeStretch: [number, number];
    filterCutoff: [number, number];
    bitCrush: number;
    reverb: number;
    delay: number;
    chorus: number;
    distortion: number;
}
interface GeneratedSection {
    chords: {
        root: string;
        type: string;
        frequencies: number[];
    }[];
    melody: number[];
    rhythm: {
        kick: RhythmPattern;
        snare: RhythmPattern;
        hat: RhythmPattern;
        percussion: RhythmPattern;
    };
    bass: number[];
    effects: EffectChain;
    duration: number;
}
interface EffectChain {
    filter: {
        type: 'lowpass' | 'highpass' | 'bandpass';
        cutoff: number;
        resonance: number;
    };
    reverb: {
        decay: number;
        wet: number;
    };
    delay: {
        time: number;
        feedback: number;
        wet: number;
    };
    distortion: {
        amount: number;
    };
    bitcrusher?: {
        bits: number;
        sampleRate: number;
    };
    wobble?: {
        rate: number;
        depth: number;
    };
    vinyl?: {
        crackle: number;
        noise: number;
    };
}
declare const GENRE_PROFILES: Record<GenreType, GenreProfile>;
/**
 * Generate a chord progression for a genre
 */
declare function generateProgression(genre: GenreType, key?: string, bars?: number): {
    root: string;
    type: string;
    degree: number;
}[];
/**
 * Generate a melody that fits the genre and chord
 */
declare function generateMelody(genre: GenreType, chord: {
    root: string;
    type: string;
}, length?: number, octave?: number): number[];
/**
 * Generate a bass line for the genre
 */
declare function generateBassLine(genre: GenreType, progression: {
    root: string;
    type: string;
}[], stepsPerChord?: number): number[];
/**
 * Generate effect chain for genre
 */
declare function generateEffectChain(genre: GenreType): EffectChain;
/**
 * Generate a complete musical section for a genre
 */
declare function generateSection(genre: GenreType, options?: {
    key?: string;
    bars?: number;
    bpm?: number;
    energy?: number;
}): GeneratedSection;
declare const GenreEngine: {
    GENRE_PROFILES: Record<GenreType, GenreProfile>;
    generateProgression: typeof generateProgression;
    generateMelody: typeof generateMelody;
    generateBassLine: typeof generateBassLine;
    generateEffectChain: typeof generateEffectChain;
    generateSection: typeof generateSection;
};

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
interface ChopAndScrewConfig {
    slowdown: number;
    pitchShift: number;
    chopDensity: number;
    screwIntensity: number;
    reverb: number;
    phaser: number;
}
interface ChopPoint {
    time: number;
    duration: number;
    repeat: number;
    pitchOffset: number;
    reverse: boolean;
    fadeIn: number;
    fadeOut: number;
}
interface TransitionConfig {
    type: 'cut' | 'fade' | 'filter' | 'beatmatch' | 'backspin' | 'echo' | 'stutter';
    duration: number;
    curve: 'linear' | 'exponential' | 'logarithmic' | 's-curve';
    effectIntensity: number;
}
interface BeatInfo {
    bpm: number;
    timeSignature: [number, number];
    beatPositions: number[];
    downbeats: number[];
    transients: number[];
}
interface MixPoint {
    trackA: {
        position: number;
        volume: number;
        filter: number;
    };
    trackB: {
        position: number;
        volume: number;
        filter: number;
    };
    crossfade: number;
}
interface StutterConfig {
    divisions: number;
    pattern: number[];
    pitchRamp: number;
    volumeDecay: number;
    gateLength: number;
}
/**
 * Generate chop & screw parameters for a sample
 * Pioneered by DJ Screw in Houston, characterized by:
 * - Slowed tempo (60-70% of original)
 * - Pitched down vocals and instruments
 * - Chopped/repeated sections
 * - Heavy reverb and delay
 */
declare function generateChopAndScrew(_duration: number, intensity?: number): {
    config: ChopAndScrewConfig;
    chops: ChopPoint[];
};
/**
 * DJ Screw-style vocal chop
 * Repeats a word/syllable with slowdown
 */
declare function screwVocal(position: number, syllableLength?: number): ChopPoint[];
/**
 * Calculate BPM from beat positions
 */
declare function calculateBPM(beatPositions: number[], durationMs: number): number;
/**
 * Generate beat positions for a given BPM and duration
 */
declare function generateBeatGrid(bpm: number, durationMs: number, timeSignature?: [number, number]): BeatInfo;
/**
 * Calculate time stretch ratio to match two BPMs
 */
declare function calculateStretchRatio(sourceBPM: number, targetBPM: number): number;
/**
 * Find the best mix point between two tracks
 * Looks for compatible beat/phrase alignments
 */
declare function findMixPoint(trackA: BeatInfo, _trackB: BeatInfo, preferredPosition?: number): MixPoint;
/**
 * Generate transition parameters
 */
declare function generateTransition(type: TransitionConfig['type'], bpm: number, intensity?: number): TransitionConfig & {
    steps: TransitionStep[];
};
interface TransitionStep {
    time: number;
    volumeA: number;
    volumeB: number;
    filterA: number;
    filterB: number;
    effect?: {
        type: string;
        value: number;
    };
}
/**
 * Generate intelligent sample chop points
 * Uses transient detection concepts + golden ratio
 */
declare function generateChopPoints(_duration: number, numChops: number, style?: 'grid' | 'golden' | 'fibonacci' | 'random'): number[];
/**
 * Rearrange sample slices in an interesting pattern
 */
declare function rearrangeSlices(numSlices: number, style: 'shuffle' | 'reverse' | 'palindrome' | 'breakcore' | 'intelligent'): number[];
/**
 * Generate stutter effect parameters
 */
declare function generateStutter(divisions: number | undefined, style: 'buildup' | 'breakdown' | 'random' | 'trance'): StutterConfig;
/**
 * Generate tape stop effect parameters
 */
declare function generateTapeStop(durationMs: number): {
    pitchCurve: number[];
    speedCurve: number[];
};
/**
 * Generate vinyl scratch parameters
 */
declare function generateScratch(style: 'baby' | 'chirp' | 'transform' | 'flare'): {
    positions: number[];
    speeds: number[];
};
/**
 * Analyze track compatibility for mixing
 */
declare function analyzeCompatibility(trackA: {
    bpm: number;
    key: string;
}, trackB: {
    bpm: number;
    key: string;
}): {
    bpmCompatibility: number;
    keyCompatibility: number;
    overallScore: number;
    suggestedStretch: number;
};
/**
 * Generate an intelligent mix between two tracks
 */
declare function generateMix(trackAInfo: BeatInfo, trackBInfo: BeatInfo, mixStyle: 'smooth' | 'quick' | 'creative'): {
    mixPoint: MixPoint;
    transition: TransitionConfig & {
        steps: TransitionStep[];
    };
    effects: string[];
};
declare const DJEngine: {
    generateChopAndScrew: typeof generateChopAndScrew;
    screwVocal: typeof screwVocal;
    calculateBPM: typeof calculateBPM;
    generateBeatGrid: typeof generateBeatGrid;
    calculateStretchRatio: typeof calculateStretchRatio;
    findMixPoint: typeof findMixPoint;
    generateTransition: typeof generateTransition;
    generateChopPoints: typeof generateChopPoints;
    rearrangeSlices: typeof rearrangeSlices;
    generateStutter: typeof generateStutter;
    generateTapeStop: typeof generateTapeStop;
    generateScratch: typeof generateScratch;
    analyzeCompatibility: typeof analyzeCompatibility;
    generateMix: typeof generateMix;
};

/**
 * KAIOS Arrangement Engine
 *
 * Intelligent song structure and arrangement:
 * - Section generation (intro, verse, chorus, bridge, outro)
 * - Energy arc management
 * - Tension/release dynamics
 * - Musical form understanding
 * - Live performance adaptation
 */

type SectionType = 'intro' | 'verse' | 'prechorus' | 'chorus' | 'bridge' | 'breakdown' | 'buildup' | 'drop' | 'outro';
interface ArrangementSection {
    type: SectionType;
    name: string;
    bars: number;
    energy: number;
    tension: number;
    elements: ElementConfig;
    generated?: GeneratedSection;
}
interface ElementConfig {
    drums: boolean;
    bass: boolean;
    chords: boolean;
    melody: boolean;
    pads: boolean;
    fx: boolean;
    vocals: boolean;
    percussion: boolean;
}
interface Arrangement {
    genre: GenreType;
    key: string;
    bpm: number;
    timeSignature: [number, number];
    totalBars: number;
    sections: ArrangementSection[];
    energyCurve: number[];
    tensionCurve: number[];
    transitions: {
        position: number;
        type: TransitionConfig['type'];
    }[];
}
interface ArrangementOptions {
    genre: GenreType;
    duration: 'short' | 'medium' | 'long' | number;
    energy: 'chill' | 'medium' | 'high' | 'dynamic';
    structure: 'verse-chorus' | 'buildup-drop' | 'ambient' | 'freeform' | 'custom' | 'lofi' | 'breakcore';
    key?: string;
    bpm?: number;
}
interface LiveState {
    currentSection: number;
    currentBar: number;
    currentBeat: number;
    energy: number;
    tension: number;
    nextSectionIn: number;
    suggestedActions: string[];
}
/**
 * Generate a complete arrangement
 */
declare function generateArrangement(options: ArrangementOptions): Arrangement;
/**
 * Get current state for live performance
 */
declare function getLiveState(arrangement: Arrangement, currentBar: number, currentBeat?: number): LiveState;
/**
 * Get what elements should be playing at a given point
 */
declare function getActiveElements(arrangement: Arrangement, bar: number): ElementConfig & {
    intensity: Record<string, number>;
};
/**
 * Generate a variation of an existing section
 */
declare function generateVariation(section: ArrangementSection, variationType: 'subtle' | 'moderate' | 'dramatic'): ArrangementSection;
/**
 * Add fills and transitions between bars
 */
declare function addFills(arrangement: Arrangement, fillDensity?: number): {
    bar: number;
    type: string;
    intensity: number;
}[];
declare const ArrangementEngine: {
    SECTION_TEMPLATES: Record<SectionType, Partial<ArrangementSection>>;
    STRUCTURE_TEMPLATES: Record<string, SectionType[]>;
    generateArrangement: typeof generateArrangement;
    getLiveState: typeof getLiveState;
    getActiveElements: typeof getActiveElements;
    generateVariation: typeof generateVariation;
    addFills: typeof addFills;
};

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

/**
 * Quick lofi beat generation
 */
declare function createLofiBeat(options?: Partial<ArrangementOptions>): Arrangement;
/**
 * Quick breakcore generation
 */
declare function createBreakcore(options?: Partial<ArrangementOptions>): Arrangement;
/**
 * Quick cottagecore generation
 */
declare function createCottagecore(options?: Partial<ArrangementOptions>): Arrangement;
/**
 * Quick frutiger aero generation
 */
declare function createFrutigerAero(options?: Partial<ArrangementOptions>): Arrangement;
/**
 * Quick vaporwave generation
 */
declare function createVaporwave(options?: Partial<ArrangementOptions>): Arrangement;
/**
 * Generate chopped and screwed version of any content
 */
declare function chopAndScrew(durationMs: number, intensity?: number): {
    config: ChopAndScrewConfig;
    chops: ChopPoint[];
};
/**
 * Get genre-appropriate chord progression
 */
declare function getGenreChords(genre: GenreType, key?: string, octave?: number): {
    name: string;
    frequencies: number[];
}[];
/**
 * Get genre-appropriate scale
 */
declare function getGenreScale(genre: GenreType, key?: string, octave?: number): number[];
/**
 * Generate genre-appropriate rhythm pattern
 */
declare function getGenreRhythm(genre: GenreType, element?: 'kick' | 'snare' | 'hat'): number[];

export { AMEN_SLICES, type Arrangement, ArrangementEngine, type ArrangementOptions, type ArrangementSection, BASE_FREQ, BREAKCORE_PATTERNS, type BeatInfo, type BreakPattern, type BreakSlice, CHORDS, CHORD_EMOTIONS, CIRCLE_OF_FIFTHS, COTTAGECORE_PATTERNS, type ChopAndScrewConfig, type ChopPoint, DJEngine, EUCLIDEAN_PATTERNS, type EffectChain, type ElementConfig, FIBONACCI, GENRE_PROFILES, type GeneratedSection, GenreEngine, type GenreProfile, type GenreType, LOFI_PATTERNS, LOFI_PROGRESSIONS, type LiveState, type MixPoint, MusicTheory, PHI, POLYRHYTHMS, RhythmEngine, type RhythmGeneratorOptions, type RhythmPattern, SCALES, type SampleProcessing, type SectionType, type StutterConfig, type TransitionConfig, addFills, analyzeCompatibility, applySwing, calculateBPM, calculateStretchRatio, calculateTension, chopAndScrew, createBreakcore, createCottagecore, createFrutigerAero, createLofiBeat, createVaporwave, euclidean, fibonacciRhythm, findMixPoint, freqToMidi, generateArrangement, generateBassLine, generateBeatGrid, generateBreakcoreChops, generateChopAndScrew, generateChopPoints, generateEffectChain, generateMelody, generateMix, generateProgression, generateRhythm, generateScratch, generateSection, generateStutter, generateTapeStop, generateTransition, generateVariation, getActiveElements, getChordFrequencies, getChordFunction, getConsonance, getGenreChords, getGenreRhythm, getGenreScale, getHarmonics, getLiveState, getRelativeKey, getScaleFrequencies, goldenGroove, humanize, midiToFreq, noteToFreq, optimizeVoicing, polyrhythm, rearrangeSlices, screwVocal, suggestNextChord, thoughtAmen, velocityVariation };
