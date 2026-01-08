/**
 * KAIOS Terminal Tone Generator
 * Layer 1: 432Hz-based UI tones for typing and response feedback
 *
 * Based on the original kaios-og-xi 432Hz solfeggio frequency system
 */

import type { EmotionToken } from '../../core/types.js'

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS (from kaios-og-xi KAIOSCore.ts)
// ════════════════════════════════════════════════════════════════════════════════

/** Base frequency - 432Hz solfeggio tuning (core to KAIOS identity) */
export const BASE_FREQUENCY = 432

/** Pentatonic scale for harmony (from kaios-og-xi SoundManager.ts) */
export const SCALE_432 = [
  261.63,  // C4
  293.66,  // D4
  329.63,  // E4
  392.00,  // G4
  440.00   // A4 (close to 432Hz aesthetic)
]

/** Glitch patterns (from kaios-og-xi KAIOSCore.ts) */
export const GLITCH_PATTERNS = {
  bzzzzt: { frequencies: [432, 440, 444], intensity: 0.8, duration: 0.1 },
  static: { frequencies: [666, 777, 888], intensity: 0.5, duration: 0.2 },
  ping: { frequencies: [880, 660], intensity: 0.6, duration: 0.05 },
  hum: { frequencies: [220, 330], intensity: 0.3, duration: 0.5 },
  whirr: { frequencies: [300, 350, 400], intensity: 0.4, duration: 0.15 },
  click: { frequencies: [1200], intensity: 0.7, duration: 0.02 }
}

/** Emotion to frequency offset mapping */
export const EMOTION_FREQUENCY_OFFSET: Record<EmotionToken, number> = {
  EMOTE_NEUTRAL: 0,
  EMOTE_HAPPY: 4,      // +4 semitones (brighter)
  EMOTE_SAD: -3,       // -3 semitones (darker)
  EMOTE_ANGRY: -2,     // -2 semitones (lower, intense)
  EMOTE_THINK: 2,      // +2 semitones (thoughtful)
  EMOTE_SURPRISED: 7,  // +7 semitones (high, sudden)
  EMOTE_AWKWARD: 1,    // +1 semitone (slightly off)
  EMOTE_QUESTION: 5,   // +5 semitones (rising)
  EMOTE_CURIOUS: 3     // +3 semitones (exploratory)
}

// ════════════════════════════════════════════════════════════════════════════════
// TONE GENERATOR
// ════════════════════════════════════════════════════════════════════════════════

export interface ToneOptions {
  frequency?: number
  duration?: number
  volume?: number
  waveform?: 'sine' | 'square' | 'triangle' | 'sawtooth'
}

export interface ToneGeneratorConfig {
  enabled: boolean
  volume: number  // 0-1
  typingTones: boolean
  responseTones: boolean
}

/**
 * Terminal tone generator using process.stdout for bell tones
 * Falls back gracefully when audio is unavailable
 *
 * Note: Full audio synthesis requires native modules (speaker/pcm-util)
 * This implementation uses terminal bell as a fallback for basic feedback
 */
export class ToneGenerator {
  private config: ToneGeneratorConfig
  private currentEmotion: EmotionToken = 'EMOTE_NEUTRAL'
  private lastToneTime = 0
  private minToneInterval = 50 // ms between tones

  constructor(config: Partial<ToneGeneratorConfig> = {}) {
    this.config = {
      enabled: true,
      volume: 0.3,
      typingTones: true,
      responseTones: true,
      ...config
    }
  }

  /**
   * Enable or disable tones
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
  }

  /**
   * Set current emotion for tone modulation
   */
  setEmotion(emotion: EmotionToken): void {
    this.currentEmotion = emotion
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Play a typing feedback tone (user input)
   * Uses terminal bell as basic feedback
   */
  playTypingTone(_char?: string): void {
    if (!this.config.enabled || !this.config.typingTones) return
    if (!this.canPlayTone()) return

    // Terminal bell for basic feedback
    // Real implementation would use speaker module for proper audio
    this.playBell()
    this.lastToneTime = Date.now()
  }

  /**
   * Play a response arrival tone
   */
  playResponseTone(): void {
    if (!this.config.enabled || !this.config.responseTones) return

    // Double bell for response
    this.playBell()
    setTimeout(() => this.playBell(), 100)
    this.lastToneTime = Date.now()
  }

  /**
   * Play a level up tone
   */
  playLevelUpTone(): void {
    if (!this.config.enabled) return

    // Triple ascending bells for level up
    this.playBell()
    setTimeout(() => this.playBell(), 150)
    setTimeout(() => this.playBell(), 300)
    this.lastToneTime = Date.now()
  }

  /**
   * Play a glitch pattern by name
   */
  playGlitchPattern(pattern: keyof typeof GLITCH_PATTERNS): void {
    if (!this.config.enabled) return

    const glitch = GLITCH_PATTERNS[pattern]
    if (!glitch) return

    // Simple bell representation of glitch
    const bellCount = Math.ceil(glitch.duration * 10)
    for (let i = 0; i < bellCount; i++) {
      setTimeout(() => this.playBell(), i * 50)
    }
    this.lastToneTime = Date.now()
  }

  /**
   * Play error tone
   */
  playErrorTone(): void {
    if (!this.config.enabled) return

    // Rapid bells for error
    this.playBell()
    setTimeout(() => this.playBell(), 50)
    this.lastToneTime = Date.now()
  }

  /**
   * Calculate frequency for current emotion
   */
  getEmotionFrequency(baseFreq: number = BASE_FREQUENCY): number {
    const offset = EMOTION_FREQUENCY_OFFSET[this.currentEmotion] || 0
    // Semitone formula: f * 2^(n/12)
    return baseFreq * Math.pow(2, offset / 12)
  }

  /**
   * Get scale note for character (maps char to pentatonic scale)
   */
  getCharacterFrequency(char: string): number {
    const code = char.charCodeAt(0)
    const noteIndex = code % SCALE_432.length
    const baseFreq = SCALE_432[noteIndex]
    return this.getEmotionFrequency(baseFreq)
  }

  /**
   * Play terminal bell (basic audio feedback)
   * This is a fallback - real audio would use native modules
   */
  private playBell(): void {
    if (this.config.volume > 0) {
      // Terminal bell character
      process.stdout.write('\x07')
    }
  }

  /**
   * Check if enough time has passed to play another tone
   */
  private canPlayTone(): boolean {
    return Date.now() - this.lastToneTime >= this.minToneInterval
  }

  /**
   * Get current config
   */
  getConfig(): ToneGeneratorConfig {
    return { ...this.config }
  }

  /**
   * Dispose and clean up
   */
  dispose(): void {
    this.config.enabled = false
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createToneGenerator(config?: Partial<ToneGeneratorConfig>): ToneGenerator {
  return new ToneGenerator(config)
}
