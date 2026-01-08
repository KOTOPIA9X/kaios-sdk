/**
 * SoX Synthesizer for KAIOS Piano
 *
 * Generates real synthesized piano tones using SoX (Sound eXchange)
 * No samples needed - pure waveform synthesis at 432Hz tuning
 */

import { spawn } from 'child_process'
import { getAudioBus } from './audio-bus.js'

// ════════════════════════════════════════════════════════════════════════════════
// 432Hz TUNING - Note frequencies
// ════════════════════════════════════════════════════════════════════════════════

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
  'F#5': 726.53, 'G5': 769.74, 'G#5': 815.51, 'A5': 864.00, 'A#5': 915.38, 'B5': 969.81,
  // Octave 6
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
   * Play a soft, warm piano-like note
   * Simple but warm - sine wave with gentle envelope and reverb
   */
  async playNote(note: string, durationMs: number = 800, velocity: number = 0.4): Promise<void> {
    if (!this.config.enabled) return

    const freq = NOTE_FREQUENCIES[note]
    if (!freq) return

    const durationSec = Math.max(0.6, durationMs / 1000)
    const vol = Math.min(0.5, velocity * this.config.volume)

    // Emit to audio bus for visualization
    const audioBus = getAudioBus()
    audioBus.soundStart(`synth-${note}`, 'music', velocity, durationMs)

    // Simple warm sine wave with gentle envelope
    // Using pluck for a softer piano-like attack, then applying effects
    const args = [
      '-n', '-d',     // null input, default output
      'synth', durationSec.toFixed(2),
      'pl', freq.toFixed(2),  // pluck synth (piano-like)
      'fade', 'q',    // quarter-sine fade (smooth)
      '0.01',         // fast attack
      durationSec.toFixed(2),
      '0.3',          // gentle decay
      'reverb', '40', // moderate reverb
      'vol', vol.toFixed(2),
      'gain', '-3'
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
   * Play a chord (multiple notes simultaneously)
   * Gentle strum with soft velocity falloff
   */
  async playChord(notes: string[], durationMs: number = 1500, velocity: number = 0.35): Promise<void> {
    // Play all notes with gentle strum delay - like fingers brushing strings
    for (let i = 0; i < notes.length; i++) {
      const strumDelay = 30 + Math.random() * 20  // Organic strum timing
      const noteVelocity = velocity - (i * 0.03)  // Gentle falloff
      setTimeout(() => {
        this.playNote(notes[i], durationMs + Math.random() * 300, Math.max(0.2, noteVelocity))
      }, i * strumDelay)
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
