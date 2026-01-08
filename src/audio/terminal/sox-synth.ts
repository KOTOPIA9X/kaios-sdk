/**
 * SoX Synthesizer for KAIOS Piano - C418 Minecraft Style
 *
 * Generates warm, ambient, lush piano tones inspired by C418's Minecraft soundtrack
 * Pure sine waves with soft attacks, long decay, and reverb
 * 432Hz tuning for that ethereal, healing frequency
 */

import { spawn } from 'child_process'
import { getAudioBus } from './audio-bus.js'

// ════════════════════════════════════════════════════════════════════════════════
// 432Hz TUNING - Note frequencies
// ════════════════════════════════════════════════════════════════════════════════

const NOTE_FREQUENCIES: Record<string, number> = {
  // Octave 2 (deep, warm bass)
  'C2': 64.22, 'C#2': 68.04, 'D2': 72.08, 'D#2': 76.37, 'E2': 80.91, 'F2': 85.72,
  'F#2': 90.82, 'G2': 96.22, 'G#2': 101.94, 'A2': 108.00, 'A#2': 114.42, 'B2': 121.23,
  // Octave 3 (mellow mid-bass)
  'C3': 128.43, 'C#3': 136.07, 'D3': 144.16, 'D#3': 152.74, 'E3': 161.82, 'F3': 171.44,
  'F#3': 181.63, 'G3': 192.43, 'G#3': 203.88, 'A3': 216.00, 'A#3': 228.84, 'B3': 242.45,
  // Octave 4 (sweet spot - like C418's piano)
  'C4': 256.87, 'C#4': 272.14, 'D4': 288.33, 'D#4': 305.47, 'E4': 323.63, 'F4': 342.88,
  'F#4': 363.27, 'G4': 384.87, 'G#4': 407.75, 'A4': 432.00, 'A#4': 457.69, 'B4': 484.90,
  // Octave 5 (shimmering highs)
  'C5': 513.74, 'C#5': 544.29, 'D5': 576.65, 'D#5': 610.94, 'E5': 647.27, 'F5': 685.76,
  'F#5': 726.53, 'G5': 769.74, 'G#5': 815.51, 'A5': 864.00, 'A#5': 915.38, 'B5': 969.81,
  // Octave 6 (high shimmer)
  'C6': 1027.47, 'C#6': 1088.57, 'D6': 1153.30, 'D#6': 1221.88, 'E6': 1294.54, 'F6': 1371.51,
  'F#6': 1453.07, 'G6': 1539.47, 'G#6': 1631.01, 'A6': 1728.00, 'A#6': 1830.75, 'B6': 1939.61
}

// ════════════════════════════════════════════════════════════════════════════════
// SOX SYNTH CLASS
// ════════════════════════════════════════════════════════════════════════════════

export interface SoxSynthConfig {
  enabled: boolean
  volume: number  // 0-1
  attack: number  // seconds
  sustain: number // seconds
  decay: number   // seconds
  reverb: number  // 0-100
  warmth: number  // 0-1 (adds lower harmonics)
}

export class SoxSynth {
  private config: SoxSynthConfig
  private soxAvailable: boolean = false
  private activeProcesses: Set<ReturnType<typeof spawn>> = new Set()

  constructor(config: Partial<SoxSynthConfig> = {}) {
    this.config = {
      enabled: true,
      volume: 0.5,      // Softer default
      attack: 0.02,     // Gentle attack
      sustain: 0.4,     // Hold the note
      decay: 0.5,       // Slow fade out
      reverb: 50,       // More reverb for warmth
      warmth: 0.3,      // Add some lower harmonics
      ...config
    }

    // Check if SoX is available
    this.checkSox()
  }

  private async checkSox(): Promise<void> {
    try {
      const proc = spawn('which', ['sox'])
      proc.on('close', (code) => {
        this.soxAvailable = code === 0
        if (!this.soxAvailable) {
          console.log('[sox-synth] SoX not found. Install with: brew install sox')
        }
      })
    } catch {
      this.soxAvailable = false
    }
  }

  /**
   * Play a C418-style ambient piano note
   * Warm sine waves with soft attack, long decay, and lush reverb
   * Inspired by Minecraft's "Sweden", "Wet Hands", "Mice on Venus"
   */
  async playNote(note: string, durationMs: number = 2500, velocity: number = 0.35): Promise<void> {
    if (!this.config.enabled) return

    const freq = NOTE_FREQUENCIES[note]
    if (!freq) return

    // C418 style: longer notes, soft and ambient
    const durationSec = Math.max(2.0, durationMs / 1000)
    const vol = Math.min(0.25, velocity * this.config.volume * 0.5)

    // Emit to audio bus for visualization
    const audioBus = getAudioBus()
    audioBus.soundStart(`synth-${note}`, 'music', velocity, durationMs)

    // Soft attack time (C418 notes fade in gently)
    const attackTime = 0.15 + Math.random() * 0.1
    // Long decay (notes linger and breathe)
    const decayTime = durationSec * 0.5 + Math.random() * 0.3

    // C418 ambient piano: sine wave + flanger for movement + heavy reverb
    const args = [
      '-n', '-d',     // null input, default output
      'synth', durationSec.toFixed(2),
      'sine', freq.toFixed(2),  // Pure sine wave (not pluck!)
      'flanger', '0', '2', '0', '71', '0.5', 'sine',  // Subtle movement
      'fade', 'h',    // half-sine fade (very smooth)
      attackTime.toFixed(2),  // Soft attack
      durationSec.toFixed(2),
      decayTime.toFixed(2),   // Long decay
      'reverb', '55',  // Heavy reverb for that spacious feel
      'vol', vol.toFixed(2),
      'gain', '-4'    // Headroom to prevent clipping
    ]

    try {
      const proc = spawn('play', args, {
        stdio: ['ignore', 'ignore', 'ignore']
      })
      this.activeProcesses.add(proc)
      proc.on('close', () => this.activeProcesses.delete(proc))
      proc.on('error', () => this.activeProcesses.delete(proc))
    } catch {
      // Silently fail
    }
  }

  /**
   * Play a pad note - sustained, ambient, like background texture
   * These layer under the piano notes for that full C418 sound
   */
  async playPad(note: string, durationMs: number = 5000, velocity: number = 0.2): Promise<void> {
    if (!this.config.enabled) return

    const freq = NOTE_FREQUENCIES[note]
    if (!freq) return

    const durationSec = Math.max(4.0, durationMs / 1000)
    const vol = Math.min(0.15, velocity * this.config.volume * 0.3)

    const audioBus = getAudioBus()
    audioBus.soundStart(`pad-${note}`, 'music', velocity * 0.5, durationMs)

    // Pad: very soft, long sustain, tremolo for warmth
    const args = [
      '-n', '-d',
      'synth', durationSec.toFixed(2),
      'sine', freq.toFixed(2),
      'tremolo', '3', '15',  // Very subtle tremolo for organic warmth
      'fade', 'h',
      '0.5',           // Slow attack
      durationSec.toFixed(2),
      (durationSec * 0.4).toFixed(2),  // Long fade out
      'reverb', '65',  // Extra reverb for pads
      'vol', vol.toFixed(2),
      'gain', '-6'
    ]

    try {
      const proc = spawn('play', args, {
        stdio: ['ignore', 'ignore', 'ignore']
      })
      this.activeProcesses.add(proc)
      proc.on('close', () => this.activeProcesses.delete(proc))
      proc.on('error', () => this.activeProcesses.delete(proc))
    } catch {
      // Silently fail
    }
  }

  /**
   * Play a chord - C418 style with arpeggiated strum
   * Notes gently cascade with organic timing
   */
  async playChord(notes: string[], durationMs: number = 3500, velocity: number = 0.3): Promise<void> {
    // C418 chords: soft, arpeggiated, each note slightly delayed
    for (let i = 0; i < notes.length; i++) {
      // Organic strum timing - like someone slowly pressing keys
      const strumDelay = 80 + Math.random() * 60  // 80-140ms between notes
      const noteVelocity = velocity - (i * 0.02)  // Very gentle falloff
      const noteDuration = durationMs + Math.random() * 500  // Varied duration

      setTimeout(() => {
        this.playNote(notes[i], noteDuration, Math.max(0.15, noteVelocity))
      }, i * strumDelay)
    }

    // Occasionally add a bass pad underneath (30% chance)
    if (Math.random() < 0.3 && notes.length > 0) {
      const rootNote = notes[0]
      const match = rootNote.match(/([A-G]#?)(\d)/)
      if (match) {
        const noteName = match[1]
        const octave = parseInt(match[2]) - 1  // One octave down
        if (octave >= 2) {
          setTimeout(() => {
            this.playPad(`${noteName}${octave}`, durationMs * 1.5, velocity * 0.6)
          }, 200)
        }
      }
    }
  }

  /**
   * Play a gentle arpeggio - notes flowing upward or downward
   * Very C418 - like "Sweden" or "Wet Hands"
   */
  async playArpeggio(notes: string[], durationMs: number = 2000, velocity: number = 0.3, direction: 'up' | 'down' = 'up'): Promise<void> {
    const orderedNotes = direction === 'up' ? notes : [...notes].reverse()

    for (let i = 0; i < orderedNotes.length; i++) {
      // Arpeggio timing - more space between notes than a chord
      const delay = 200 + Math.random() * 100  // 200-300ms between notes
      const noteVelocity = velocity + (Math.random() * 0.05 - 0.025)  // Subtle variation

      setTimeout(() => {
        this.playNote(orderedNotes[i], durationMs, Math.max(0.1, noteVelocity))
      }, i * delay)
    }
  }

  /**
   * Stop all active sounds
   */
  stop(): void {
    for (const proc of this.activeProcesses) {
      try {
        proc.kill()
      } catch {}
    }
    this.activeProcesses.clear()
  }

  /**
   * Check if SoX is available
   */
  isAvailable(): boolean {
    return this.soxAvailable
  }

  /**
   * Set volume
   */
  setVolume(vol: number): void {
    this.config.volume = Math.max(0, Math.min(1, vol))
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
  getFrequency(note: string): number {
    return NOTE_FREQUENCIES[note] || 432
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

let globalSoxSynth: SoxSynth | null = null

export function getSoxSynth(): SoxSynth {
  if (!globalSoxSynth) {
    globalSoxSynth = new SoxSynth()
  }
  return globalSoxSynth
}

export function createSoxSynth(config?: Partial<SoxSynthConfig>): SoxSynth {
  return new SoxSynth(config)
}
