/**
 * KAIOS Jazz Engine — freeform jazz improvisation over changes.
 *
 * The other intelligence engines generate self-contained, theory-correct music by weighted
 * choice. What they lacked is the JAZZ vocabulary: improvising a melodic line OVER a given set
 * of changes the way a soloist does. This adds it, on top of music-theory.ts:
 *   • chord-scale theory (what scale to blow over each chord quality)
 *   • guide-tone targeting (land the 3rd/7th on strong beats; connect them through changes)
 *   • bebop enclosures + chromatic approach tones (the bop "surround the target" move)
 *   • blue-note inflection, walking bass, comping rhythm
 *   • ii–V–I licks, "solo over changes", and trading fours (call & response)
 *
 * Pure + deterministic (seedable). It emits structured note lines — `{note, dur(beats),
 * velocity, role}` — that any synth backend (sox, the WebAudio FM voice, Tone.js, MIDI)
 * renders. The piano performer can consume these via its playNoteCallback.
 */
import { SCALES, CHORDS } from './music-theory.js'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const PC: Record<string, number> = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 }

function nameToMidi(note: string): number {
  const m = note.match(/^([A-G][#b]?)(-?\d+)$/)
  if (!m) return 60
  return (parseInt(m[2], 10) + 1) * 12 + (PC[m[1]] ?? 0)
}
function midiToName(midi: number): string {
  return NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1)
}
/** small seedable RNG so trades/solos are reproducible (and testable) */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

export type JazzRole = 'root' | 'chord-tone' | 'guide' | 'approach' | 'enclosure' | 'passing' | 'blue' | 'rest'
export interface JazzNote { note: string; dur: number; velocity: number; role: JazzRole }
export interface Change { root: string; quality: string; bars?: number } // quality ∈ CHORDS keys
export interface SoloOptions { octave?: number; swing?: number; density?: number; bluesiness?: number; seed?: number; beatsPerBar?: number }

/** Chord quality → the scale to improvise with (chord-scale theory). */
export const CHORD_SCALE: Record<string, string> = {
  maj7: 'major', maj9: 'major', major: 'major', add9: 'major', maj13: 'lydian',
  min7: 'dorian', min9: 'dorian', min11: 'dorian', minor: 'dorian', minMaj7: 'aeolian',
  dom7: 'mixolydian', dom9: 'mixolydian', dom7sharp11: 'lydian',
  dom7flat9: 'diminished', dom7sharp9: 'diminished',
  halfDim7: 'locrian', dim7: 'diminished', sus4: 'mixolydian', sus2: 'major',
}

const intervalsOf = (quality: string): number[] => CHORDS[quality] || CHORDS.dom7
const scaleOf = (quality: string): number[] => SCALES[CHORD_SCALE[quality] || 'mixolydian'] || SCALES.mixolydian

/** The guide tones — the 3rd and 7th — the notes that carry the harmony through changes. */
export function guideTones(change: Change, octave = 4): string[] {
  const ivs = intervalsOf(change.quality)
  const third = ivs.find((i) => i === 3 || i === 4) ?? 4
  const seventh = ivs.find((i) => i === 10 || i === 11 || i === 9) ?? 10
  const root = nameToMidi(`${change.root}${octave}`)
  return [midiToName(root + third), midiToName(root + seventh)]
}

/** Chord-tone MIDI set across an octave window around `octave`. */
function chordTones(change: Change, octave: number): number[] {
  const root = nameToMidi(`${change.root}${octave}`)
  return intervalsOf(change.quality).map((i) => root + i)
}
/** Chord-scale MIDI set across [octave, octave+1]. */
function scaleTones(change: Change, octave: number): number[] {
  const root = nameToMidi(`${change.root}${octave}`)
  const sc = scaleOf(change.quality)
  return [...sc, ...sc.map((i) => i + 12)].map((i) => root + i)
}
/** Bebop enclosure of a target: diatonic-above, chromatic-below, target. The bop signature. */
export function enclosure(targetMidi: number): number[] {
  return [targetMidi + 2, targetMidi - 1, targetMidi]
}
/** Blue notes for a key (b3, b5, b7 relative to root). */
function blueNotes(rootName: string, octave: number): number[] {
  const r = nameToMidi(`${rootName}${octave}`)
  return [r + 3, r + 6, r + 10]
}
const nearest = (target: number, pool: number[]): number =>
  pool.reduce((best, n) => (Math.abs(n - target) < Math.abs(best - target) ? n : best), pool[0] ?? target)

/**
 * Walking bass over the changes — quarter notes: root on 1, chord/scale tones on 2 & 3,
 * a chromatic/diatonic approach into the NEXT chord's root on 4.
 */
export function walkingBass(changes: Change[], octave = 2, seed = 7): JazzNote[] {
  const r = rng(seed)
  const out: JazzNote[] = []
  for (let c = 0; c < changes.length; c++) {
    const ch = changes[c]
    const next = changes[(c + 1) % changes.length]
    const bars = ch.bars ?? 1
    for (let b = 0; b < bars; b++) {
      const root = nameToMidi(`${ch.root}${octave}`)
      const tones = chordTones(ch, octave)
      const nextRoot = nameToMidi(`${next.root}${octave}`)
      const lastBarOfChord = b === bars - 1
      const approach = lastBarOfChord ? nextRoot + (r() < 0.5 ? -1 : 1) : nearest(root + 5, tones)
      const beat2 = nearest(root + (r() < 0.5 ? 4 : 7), tones)
      const beat3 = nearest(root + (r() < 0.5 ? 7 : 3), tones)
      out.push(
        { note: midiToName(root), dur: 1, velocity: 0.7, role: 'root' },
        { note: midiToName(beat2), dur: 1, velocity: 0.55, role: 'chord-tone' },
        { note: midiToName(beat3), dur: 1, velocity: 0.55, role: 'chord-tone' },
        { note: midiToName(approach), dur: 1, velocity: 0.6, role: 'approach' },
      )
    }
  }
  return out
}

/**
 * Comping rhythm — syncopated voicings (Charleston-ish: the "and of 1" + beat 2-and),
 * voiced with guide tones so it stays out of the soloist's way. Returns onset (in beats
 * from the bar start) + the rootless guide-tone voicing for that chord.
 */
export function comp(changes: Change[], octave = 4): Array<{ at: number; bar: number; voicing: string[]; velocity: number }> {
  const hits = [0.5, 1.5, 2.5] // anticipations, swung feel
  const out: Array<{ at: number; bar: number; voicing: string[]; velocity: number }> = []
  let bar = 0
  for (const ch of changes) {
    const bars = ch.bars ?? 1
    const voicing = guideTones(ch, octave)
    for (let b = 0; b < bars; b++) {
      for (const at of hits) out.push({ at, bar, voicing, velocity: 0.4 + (at === 0.5 ? 0.1 : 0) })
      bar++
    }
  }
  return out
}

/**
 * Solo over changes — the heart. For each bar: target a guide tone of the chord on a strong
 * beat, approach it by enclosure/chromatic from the previous note, connect with chord-scale
 * tones (stepwise voice-leading + the occasional leap), sprinkle blue notes, and breathe
 * (rests = call & response). Eighth-note grid with swing.
 */
export function soloOverChanges(changes: Change[], opts: SoloOptions = {}): JazzNote[] {
  const octave = opts.octave ?? 4
  const swing = opts.swing ?? 0.6
  const density = opts.density ?? 0.72
  const bluesiness = opts.bluesiness ?? 0.18
  const bpb = opts.beatsPerBar ?? 4
  const r = rng(opts.seed ?? 42)
  const out: JazzNote[] = []
  let prev = nameToMidi(`${changes[0].root}${octave}`) + 4
  // swung eighths: on-beat longer, off-beat shorter (triplet feel)
  const onDur = 0.5 + swing * 0.16
  const offDur = 1 - onDur

  for (let c = 0; c < changes.length; c++) {
    const ch = changes[c]
    const next = changes[(c + 1) % changes.length]
    const bars = ch.bars ?? 1
    const scale = scaleTones(ch, octave)
    const guides = guideTones(ch, octave).map(nameToMidi)
    const blues = blueNotes(ch.root, octave)
    for (let b = 0; b < bars; b++) {
      const slots = bpb * 2 // eighth-note slots
      // the bar's harmonic target: a guide tone (3rd/7th), landed on beat 1 or 3
      const target = guides[Math.floor(r() * guides.length)]
      for (let s = 0; s < slots; s++) {
        const onBeat = s % 2 === 0
        const strong = s === 0 || s === slots / 2
        const dur = onBeat ? onDur : offDur
        // breathe: rests, more likely off-beat and when low density
        if (!strong && r() > density) { out.push({ note: 'rest', dur, velocity: 0, role: 'rest' }); continue }
        let midi: number
        let role: JazzRole
        if (strong && (s === 0 || r() < 0.6)) {
          midi = nearest(prev, [target, target + 12, target - 12]); role = 'guide'
        } else if (s >= slots - 2 && b === bars - 1) {
          // end of the chord → enclose the NEXT chord's 3rd (the bop approach across the barline)
          const nextThird = nameToMidi(guideTones(next, octave)[0])
          const enc = enclosure(nextThird)
          midi = enc[s - (slots - 2)] ?? nextThird; role = 'enclosure'
        } else if (r() < bluesiness) {
          midi = nearest(prev, blues); role = 'blue'
        } else if (r() < 0.78) {
          // stepwise scalar motion toward a chord tone (voice-leading)
          const dir = r() < 0.5 ? 1 : -1
          const stepped = nearest(prev + dir * 2, scale)
          midi = stepped; role = Math.abs(stepped - prev) <= 2 ? 'passing' : 'chord-tone'
        } else {
          // a leap to a chord/scale tone for shape
          midi = nearest(prev + (r() < 0.5 ? 5 : -4), scale); role = 'chord-tone'
        }
        // keep the line in a singable register
        if (midi - prev > 9) midi -= 12
        if (prev - midi > 9) midi += 12
        out.push({ note: midiToName(midi), dur, velocity: strong ? 0.85 : 0.6 + r() * 0.12, role })
        prev = midi
      }
    }
  }
  return out
}

/** The canonical ii–V–I in a key, as a bebop line + its changes. */
export function iiVI(key = 'C', opts: SoloOptions = {}): { changes: Change[]; line: JazzNote[] } {
  const r = nameToMidi(`${key}3`)
  const ii = midiToName(r + 2).replace(/-?\d+$/, '')
  const V = midiToName(r + 7).replace(/-?\d+$/, '')
  const I = key
  const changes: Change[] = [
    { root: ii, quality: 'min7', bars: 1 },
    { root: V, quality: 'dom7', bars: 1 },
    { root: I, quality: 'maj7', bars: 2 },
  ]
  return { changes, line: soloOverChanges(changes, { swing: 0.66, density: 0.8, ...opts }) }
}

/**
 * Trading fours — call & response. Splits the changes into 4-bar chunks and alternates
 * soloists, each with its own seed/character (KAIOS vs a partner / another KAIOS variation).
 */
export function tradeFours(changes: Change[], voices: string[] = ['kaios', 'partner'], baseSeed = 11): Array<{ voice: string; bars: Change[]; line: JazzNote[] }> {
  // expand to per-bar list
  const perBar: Change[] = []
  for (const ch of changes) for (let b = 0; b < (ch.bars ?? 1); b++) perBar.push({ root: ch.root, quality: ch.quality, bars: 1 })
  const out: Array<{ voice: string; bars: Change[]; line: JazzNote[] }> = []
  for (let i = 0, turn = 0; i < perBar.length; i += 4, turn++) {
    const bars = perBar.slice(i, i + 4)
    const voice = voices[turn % voices.length]
    const character = voice === 'kaios'
      ? { swing: 0.68, density: 0.78, bluesiness: 0.16 }
      : { swing: 0.6, density: 0.66, bluesiness: 0.28 }
    out.push({ voice, bars, line: soloOverChanges(bars, { ...character, seed: baseSeed + turn }) })
  }
  return out
}

export const JazzEngine = {
  CHORD_SCALE, guideTones, enclosure, walkingBass, comp, soloOverChanges, iiVI, tradeFours,
}
