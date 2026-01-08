/**
 * KAIOS Terminal Music Engine
 * Layer 3: Emotion-driven procedural music generation
 *
 * In terminal environment, this uses sample playback to create
 * emotion-appropriate musical atmospheres. For full procedural
 * synthesis, the browser version with Tone.js is recommended.
 */

import type { EmotionToken } from '../../core/types.js'
import { SamplePlayer } from './sample-player.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface MusicEngineConfig {
  enabled: boolean
  volume: number  // 0-1
  playOnEmotionChange: boolean
  minPlayInterval: number  // minimum ms between music plays
}

export interface MusicState {
  isPlaying: boolean
  currentEmotion: EmotionToken
  lastPlayTime: number
  intensity: number  // 0-1
}

// ════════════════════════════════════════════════════════════════════════════════
// MUSIC PROFILES (from kaios-og-xi emotion-mapper.ts)
// ════════════════════════════════════════════════════════════════════════════════

export interface MusicProfile {
  tempo: 'slow' | 'medium' | 'fast'
  energy: number  // 0-10
  texture: 'smooth' | 'rough' | 'glitchy' | 'ambient'
  samples: string[]
  description: string
}

/**
 * Music profiles for each emotion
 */
export const MUSIC_PROFILES: Record<EmotionToken, MusicProfile> = {
  EMOTE_NEUTRAL: {
    tempo: 'medium',
    energy: 5,
    texture: 'smooth',
    samples: ['ambient_drone_trim.mp3', 'natural_noise4.mp3'],
    description: 'balanced, steady, neutral'
  },
  EMOTE_HAPPY: {
    tempo: 'fast',
    energy: 8,
    texture: 'smooth',
    samples: ['happy_fairy_.mp3', 'icecream.mp3', 'windchime1.mp3'],
    description: 'bright, uplifting, energetic'
  },
  EMOTE_SAD: {
    tempo: 'slow',
    energy: 3,
    texture: 'ambient',
    samples: ['sadman.mp3', 'natural_noise4.mp3', 'blow.mp3'],
    description: 'melancholic, sparse, atmospheric'
  },
  EMOTE_ANGRY: {
    tempo: 'fast',
    energy: 9,
    texture: 'rough',
    samples: ['tarzan.mp3', 'zchor16.mp3', 'glitch1.mp3'],
    description: 'aggressive, distorted, intense'
  },
  EMOTE_THINK: {
    tempo: 'slow',
    energy: 4,
    texture: 'ambient',
    samples: ['naturalNoise4.mp3', 'spacey.mp3', 'ambient_drone_trim.mp3'],
    description: 'meditative, spacious, evolving'
  },
  EMOTE_SURPRISED: {
    tempo: 'fast',
    energy: 7,
    texture: 'glitchy',
    samples: ['glitch2.mp3', 'windchime2.mp3', 'bzzzt.mp3'],
    description: 'sudden, dynamic, unpredictable'
  },
  EMOTE_AWKWARD: {
    tempo: 'medium',
    energy: 4,
    texture: 'glitchy',
    samples: ['blow.mp3', 'glitch3.mp3', 'natural_noise4.mp3'],
    description: 'uncertain, quirky, off-beat'
  },
  EMOTE_QUESTION: {
    tempo: 'medium',
    energy: 6,
    texture: 'smooth',
    samples: ['windchime3.mp3', 'spacey.mp3', 'naturalNoise4.mp3'],
    description: 'exploratory, rising, curious'
  },
  EMOTE_CURIOUS: {
    tempo: 'medium',
    energy: 6,
    texture: 'glitchy',
    samples: ['spacey.mp3', 'windchime1.mp3', 'icecream.mp3'],
    description: 'playful, exploratory, quirky'
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// MUSIC ENGINE
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Emotion-driven music engine
 * Uses sample playback to create emotional atmospheres
 */
export class MusicEngine {
  private config: MusicEngineConfig
  private samplePlayer: SamplePlayer
  private state: MusicState

  constructor(
    samplePlayer: SamplePlayer,
    config: Partial<MusicEngineConfig> = {}
  ) {
    this.samplePlayer = samplePlayer
    this.config = {
      enabled: true,
      volume: 0.5,
      playOnEmotionChange: true,
      minPlayInterval: 5000,  // 5 seconds minimum between plays
      ...config
    }
    this.state = {
      isPlaying: false,
      currentEmotion: 'EMOTE_NEUTRAL',
      lastPlayTime: 0,
      intensity: 0.5
    }
  }

  /**
   * Set current emotion and optionally play music
   */
  async setEmotion(emotion: EmotionToken, intensity: number = 0.5): Promise<void> {
    const emotionChanged = this.state.currentEmotion !== emotion
    this.state.currentEmotion = emotion
    this.state.intensity = intensity

    if (this.config.playOnEmotionChange && emotionChanged) {
      await this.playForEmotion()
    }
  }

  /**
   * Play music appropriate for current emotion
   */
  async playForEmotion(): Promise<void> {
    if (!this.config.enabled) return
    if (!this.canPlay()) return

    const profile = MUSIC_PROFILES[this.state.currentEmotion]
    if (!profile || profile.samples.length === 0) return

    // Pick a random sample from the emotion's palette
    const sample = profile.samples[Math.floor(Math.random() * profile.samples.length)]

    this.state.isPlaying = true
    await this.samplePlayer.play(sample, this.config.volume * this.state.intensity)
    this.state.lastPlayTime = Date.now()
    this.state.isPlaying = false
  }

  /**
   * Play a specific sample
   */
  async play(sample: string): Promise<void> {
    if (!this.config.enabled) return

    this.state.isPlaying = true
    await this.samplePlayer.play(sample, this.config.volume)
    this.state.lastPlayTime = Date.now()
    this.state.isPlaying = false
  }

  /**
   * Check if enough time has passed to play again
   */
  private canPlay(): boolean {
    return Date.now() - this.state.lastPlayTime >= this.config.minPlayInterval
  }

  /**
   * Get current music profile
   */
  getCurrentProfile(): MusicProfile {
    return MUSIC_PROFILES[this.state.currentEmotion]
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
   * Get current state
   */
  getState(): MusicState {
    return { ...this.state }
  }

  /**
   * Get config
   */
  getConfig(): MusicEngineConfig {
    return { ...this.config }
  }

  /**
   * Build a music generation prompt (for use with external music AI)
   * Based on kaios-og-xi buildMusicPrompt
   */
  buildPrompt(): string {
    const profile = this.getCurrentProfile()
    const emotion = this.state.currentEmotion.replace('EMOTE_', '').toLowerCase()

    return [
      'glitchy ambient experimental electronic',
      'gaming soundtrack',
      profile.description,
      `${emotion} mood`,
      profile.texture === 'glitchy' ? 'glitchy textures' : '',
      profile.texture === 'ambient' ? 'ambient soundscape' : '',
      profile.tempo === 'fast' ? 'driving rhythm' : '',
      profile.tempo === 'slow' ? 'slow tempo' : '',
      `energy level ${profile.energy}/10`
    ].filter(Boolean).join(', ')
  }

  /**
   * Dispose and clean up
   */
  dispose(): void {
    this.config.enabled = false
    this.state.isPlaying = false
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createMusicEngine(
  samplePlayer: SamplePlayer,
  config?: Partial<MusicEngineConfig>
): MusicEngine {
  return new MusicEngine(samplePlayer, config)
}
