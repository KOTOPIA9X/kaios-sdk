/**
 * KAIOS Terminal Sample Player
 * Layer 4: Sound library playback for sound markers
 *
 * Plays pre-recorded sounds when KAIOS uses sound markers like [bzzzt], *static*, etc.
 * Uses play-sound for cross-platform audio playback
 */

import { existsSync } from 'fs'
import { join } from 'path'
import { getAudioBus } from './audio-bus.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface SamplePlayerConfig {
  enabled: boolean
  volume: number  // 0-1
  soundsDir: string
}

export interface SoundMapping {
  pattern: RegExp
  file: string
  volume?: number
}

// ════════════════════════════════════════════════════════════════════════════════
// SOUND MAPPINGS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Map sound markers to audio files
 * Supports both [marker] and *marker* formats
 * ULTRA QUIET - barely perceptible background texture
 */
export const SOUND_MAPPINGS: SoundMapping[] = [
  // Glitch sounds - ghost whisper
  { pattern: /\[bzzzt\]|\*bzzzt\*/gi, file: 'bzzzt.mp3', volume: 0.015 },
  { pattern: /\[static~?\]|\*static~?\*/gi, file: 'glitch1.mp3', volume: 0.015 },
  { pattern: /\[glitch\]|\*glitch\*/gi, file: 'glitch2.mp3', volume: 0.015 },

  // UI sounds - subliminal
  { pattern: /\[ping\]|\*ping\*/gi, file: '432hz_trim.mp3', volume: 0.01 },
  { pattern: /\[click\]|\*click\*/gi, file: 'bzzzt.mp3', volume: 0.008 },

  // Ambient sounds - almost imagined
  { pattern: /\[hum\]|\*hum\*/gi, file: 'ambient_drone_trim.mp3', volume: 0.012 },
  { pattern: /\[whirr\]|\*whirr\*/gi, file: 'spacey.mp3', volume: 0.012 },
  { pattern: /\[wind\]|\*wind\*/gi, file: 'windsamples/Wind Howl.mp3', volume: 0.015 },

  // Melodic sounds - distant memory
  { pattern: /\[windchime\]|\*windchime\*/gi, file: 'windsamples/Raw Wind Chimes.mp3', volume: 0.018 },
  { pattern: /\[chime\]|\*chime\*/gi, file: 'windsamples/Slowed_Winchimes.mp3', volume: 0.018 },
  { pattern: /\[chimeloop\]|\*chimeloop\*/gi, file: 'windsamples/Windchimes Loop.mp3', volume: 0.015 },

  // Wind samples - dream fragments
  { pattern: /\[fanpad\]|\*fanpad\*/gi, file: 'windsamples/Fan Pad Processed.mp3', volume: 0.012 },
  { pattern: /\[bottle\]|\*bottle\*/gi, file: 'windsamples/Bottle Blow.mp3', volume: 0.015 },
  { pattern: /\[mellow\]|\*mellow\*/gi, file: 'windsamples/Mellow Epiano Strum.mp3', volume: 0.015 },
  { pattern: /\[grains\]|\*grains\*/gi, file: 'windsamples/HiGrains.mp3', volume: 0.012 },
  { pattern: /\[bass\]|\*bass\*/gi, file: 'windsamples/Bass Loop.mp3', volume: 0.012 },
  { pattern: /\[drum\]|\*drum\*/gi, file: 'windsamples/Drum Loop.mp3', volume: 0.012 },

  // Piano samples - ethereal
  { pattern: /\[piano\]|\*piano\*/gi, file: 'piano/Piano Sample 1.wav', volume: 0.015 },
  { pattern: /\[piano1\]|\*piano1\*/gi, file: 'piano/Piano Sample 1.wav', volume: 0.015 },
  { pattern: /\[piano2\]|\*piano2\*/gi, file: 'piano/Piano Sample 2.wav', volume: 0.015 },
  { pattern: /\[piano3\]|\*piano3\*/gi, file: 'piano/Piano Sample 3.wav', volume: 0.015 },

  // Emotional samples - whispered feelings
  { pattern: /\[happy\]|\*happy\*/gi, file: 'happy_fairy_.mp3', volume: 0.015 },
  { pattern: /\[sad\]|\*sad\*/gi, file: 'sadman.mp3', volume: 0.015 },
  { pattern: /\[intense\]|\*intense\*/gi, file: 'tarzan.mp3', volume: 0.012 },

  // Special sounds - feather touch
  { pattern: /\[headpat\]|\*headpat\*/gi, file: 'blow.mp3', volume: 0.015 },
  { pattern: /\[cheers\]|\*cheers\*/gi, file: 'icecream.mp3', volume: 0.015 }
]

/**
 * Emotional sample mapping (from kaios-og-xi SoundManager.ts)
 * Now includes windsamples and piano
 */
export const EMOTIONAL_SAMPLES: Record<string, string[]> = {
  joy: ['happy_fairy_.mp3', 'icecream.mp3', 'windsamples/Mellow Epiano Strum.mp3'],
  sadness: ['sadman.mp3', 'natural_noise4.mp3', 'piano/Piano Sample 2.wav'],
  contemplative: ['naturalNoise4.mp3', 'blow.mp3', 'windsamples/Fan Pad Processed.mp3', 'piano/Piano Sample 1.wav'],
  intense: ['tarzan.mp3', 'zchor16.mp3', 'windsamples/Drum Loop.mp3'],
  grounded: ['yam.mp3', 'natural_noise4.mp3', 'windsamples/Bass Loop.mp3'],
  glitch: ['zchor16.mp3', 'bzzzt.mp3'],
  dreamy: ['windsamples/Slowed_Winchimes.mp3', 'windsamples/Fan Pad Processed.mp3', 'piano/Piano Sample 3.wav'],
  peaceful: ['windsamples/Raw Wind Chimes.mp3', 'windsamples/Bottle Blow.mp3', 'piano/Piano Sample 1.wav'],
  melancholic: ['piano/Piano Sample 2.wav', 'sadman.mp3', 'windsamples/Wind Howl.mp3']
}

// ════════════════════════════════════════════════════════════════════════════════
// SAMPLE PLAYER
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Sample player for terminal audio
 * Uses play-sound npm package for cross-platform audio playback
 */
export class SamplePlayer {
  private config: SamplePlayerConfig
  private player: any = null
  private isInitialized = false
  private soundsCache: Map<string, boolean> = new Map()

  constructor(config: Partial<SamplePlayerConfig> = {}) {
    // Get default sounds directory
    const defaultSoundsDir = this.getDefaultSoundsDir()

    this.config = {
      enabled: true,
      volume: 0.015,  // Ultra quiet - subliminal texture
      soundsDir: defaultSoundsDir,
      ...config
    }
  }

  /**
   * Initialize the sample player
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true

    try {
      // Dynamically import play-sound
      const playSound = await import('play-sound')
      this.player = playSound.default({})
      this.isInitialized = true

      // Pre-check which sound files exist
      await this.cacheSoundAvailability()

      return true
    } catch (error) {
      console.warn('[SamplePlayer] play-sound not available, audio disabled')
      this.config.enabled = false
      return false
    }
  }

  /**
   * Get default sounds directory
   */
  private getDefaultSoundsDir(): string {
    // Use cwd-based path (most reliable when running via tsx)
    return join(process.cwd(), 'assets/sounds')
  }

  /**
   * Cache which sound files exist
   */
  private async cacheSoundAvailability(): Promise<void> {
    for (const mapping of SOUND_MAPPINGS) {
      const filePath = join(this.config.soundsDir, mapping.file)
      this.soundsCache.set(mapping.file, existsSync(filePath))
    }
  }

  /**
   * Set enabled state
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Set sounds directory
   */
  setSoundsDir(dir: string): void {
    this.config.soundsDir = dir
    this.soundsCache.clear()
    this.cacheSoundAvailability()
  }

  /**
   * Play a specific sound file
   */
  async play(filename: string, _volume?: number): Promise<void> {
    if (!this.config.enabled || !this.isInitialized || !this.player) return

    const filePath = join(this.config.soundsDir, filename)

    // Check if file exists (use cache if available)
    const exists = this.soundsCache.has(filename)
      ? this.soundsCache.get(filename)
      : existsSync(filePath)

    if (!exists) {
      // File doesn't exist, fail silently
      return
    }

    // Emit to AudioBus for visualization
    const audioBus = getAudioBus()
    const volume = _volume ?? this.config.volume
    const duration = this.estimateDuration(filename)
    audioBus.soundStart(filename, 'sample', volume, duration)

    try {
      // play-sound doesn't support volume directly
      // Would need to use a different player like afplay on macOS with volume flag
      this.player.play(filePath, (err: Error | null) => {
        if (err) {
          // Fail silently - audio is non-critical
        }
      })
    } catch {
      // Fail silently
    }
  }

  /**
   * Estimate duration based on filename (rough heuristic)
   */
  private estimateDuration(filename: string): number {
    // Short sounds
    if (/bzzzt|click|ping|glitch/i.test(filename)) return 500
    // Medium sounds
    if (/chime|piano|blow/i.test(filename)) return 2000
    // Ambient/loops
    if (/loop|ambient|drone/i.test(filename)) return 5000
    // Default
    return 3000
  }

  /**
   * Detect and play sound markers in text
   * Returns text with markers intact (for display)
   */
  async playMarkersInText(text: string): Promise<string[]> {
    if (!this.config.enabled) return []

    const playedSounds: string[] = []

    for (const mapping of SOUND_MAPPINGS) {
      if (mapping.pattern.test(text)) {
        await this.play(mapping.file, mapping.volume)
        playedSounds.push(mapping.file)
        // Reset regex lastIndex
        mapping.pattern.lastIndex = 0
      }
    }

    return playedSounds
  }

  /**
   * Play an emotional sample based on emotion
   */
  async playEmotionalSample(emotion: string): Promise<void> {
    if (!this.config.enabled) return

    const emotionKey = emotion.toLowerCase()
    const samples = EMOTIONAL_SAMPLES[emotionKey]

    if (samples && samples.length > 0) {
      // Pick random sample from emotion category
      const sample = samples[Math.floor(Math.random() * samples.length)]
      await this.play(sample)
    }
  }

  /**
   * Play a glitch sound
   */
  async playGlitch(): Promise<void> {
    const glitchFiles = ['bzzzt.mp3', 'glitch1.mp3', 'glitch2.mp3', 'glitch3.mp3']
    const file = glitchFiles[Math.floor(Math.random() * glitchFiles.length)]
    await this.play(file)
  }

  /**
   * Play windchime
   */
  async playWindchime(): Promise<void> {
    const chimeFiles = ['windchime1.mp3', 'windchime2.mp3', 'windchime3.mp3']
    const file = chimeFiles[Math.floor(Math.random() * chimeFiles.length)]
    await this.play(file)
  }

  /**
   * Check if a sound file is available
   */
  hasSoundFile(filename: string): boolean {
    if (this.soundsCache.has(filename)) {
      return this.soundsCache.get(filename) || false
    }
    const exists = existsSync(join(this.config.soundsDir, filename))
    this.soundsCache.set(filename, exists)
    return exists
  }

  /**
   * List available sound files
   */
  getAvailableSounds(): string[] {
    return Array.from(this.soundsCache.entries())
      .filter(([, exists]) => exists)
      .map(([file]) => file)
  }

  /**
   * Get config
   */
  getConfig(): SamplePlayerConfig {
    return { ...this.config }
  }

  /**
   * Dispose and clean up
   */
  dispose(): void {
    this.config.enabled = false
    this.player = null
    this.isInitialized = false
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createSamplePlayer(config?: Partial<SamplePlayerConfig>): SamplePlayer {
  return new SamplePlayer(config)
}

/**
 * Extract sound markers from text
 */
export function extractSoundMarkers(text: string): string[] {
  const markers: string[] = []

  for (const mapping of SOUND_MAPPINGS) {
    const matches = text.match(mapping.pattern)
    if (matches) {
      markers.push(...matches)
    }
    mapping.pattern.lastIndex = 0
  }

  return markers
}
