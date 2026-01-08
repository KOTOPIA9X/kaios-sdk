/**
 * KAIOS Terminal Ambient Engine
 * Layer 2: Background soundscape for continuous ambient audio
 *
 * Creates a peaceful, evolving background similar to Minecraft ambient sounds
 * Uses sample playback with timing for terminal environments
 */

import type { EmotionToken } from '../../core/types.js'
import { SamplePlayer } from './sample-player.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface AmbientEngineConfig {
  enabled: boolean
  volume: number  // 0-1
  evolutionInterval: number  // ms between ambient changes
  minEventInterval: number   // minimum ms between ambient events
  maxEventInterval: number   // maximum ms between ambient events
}

export interface AmbientState {
  isPlaying: boolean
  currentMood: string
  lastEventTime: number
}

// ════════════════════════════════════════════════════════════════════════════════
// AMBIENT SOUND SETS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Ambient sound sets mapped to emotional states
 * Each set contains files that fit the mood
 * Now includes windsamples and piano
 */
export const AMBIENT_SETS: Record<string, string[]> = {
  peaceful: [
    'ambient_drone_trim.mp3',
    'windsamples/Fan Pad Processed.mp3',
    'windsamples/Raw Wind Chimes.mp3',
    'piano/Piano Sample 1.wav'
  ],
  contemplative: [
    'naturalNoise4.mp3',
    'windsamples/Bottle Blow.mp3',
    'windsamples/Mellow Epiano Strum.mp3',
    'piano/Piano Sample 3.wav'
  ],
  dreamy: [
    'spacey.mp3',
    'windsamples/Slowed_Winchimes.mp3',
    'windsamples/Fan Pad Processed.mp3',
    'piano/Piano Sample 2.wav'
  ],
  glitchy: [
    'zchor16.mp3',
    'glitch1.mp3',
    'glitch2.mp3',
    'windsamples/HiGrains.mp3'
  ],
  melancholic: [
    'sadman.mp3',
    'windsamples/Wind Howl.mp3',
    'piano/Piano Sample 2.wav',
    'windsamples/raw_Fan Pad.mp3'
  ],
  energetic: [
    'happy_fairy_.mp3',
    'windsamples/Drum Loop.mp3',
    'windsamples/Bass Loop.mp3',
    'tarzan.mp3'
  ]
}

/**
 * Map emotion tokens to ambient mood
 */
export const EMOTION_TO_MOOD: Record<EmotionToken, string> = {
  EMOTE_NEUTRAL: 'peaceful',
  EMOTE_HAPPY: 'energetic',
  EMOTE_SAD: 'melancholic',
  EMOTE_ANGRY: 'glitchy',
  EMOTE_THINK: 'contemplative',
  EMOTE_SURPRISED: 'dreamy',
  EMOTE_AWKWARD: 'contemplative',
  EMOTE_QUESTION: 'dreamy',
  EMOTE_CURIOUS: 'dreamy'
}

// ════════════════════════════════════════════════════════════════════════════════
// AMBIENT ENGINE
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Ambient soundscape engine
 * Plays occasional ambient sounds to create atmosphere
 */
export class AmbientEngine {
  private config: AmbientEngineConfig
  private samplePlayer: SamplePlayer
  private state: AmbientState
  private eventTimer: NodeJS.Timeout | null = null

  constructor(
    samplePlayer: SamplePlayer,
    config: Partial<AmbientEngineConfig> = {}
  ) {
    this.samplePlayer = samplePlayer
    this.config = {
      enabled: true,
      volume: 0.3,
      evolutionInterval: 30000,  // 30 seconds
      minEventInterval: 15000,   // 15 seconds minimum
      maxEventInterval: 60000,   // 60 seconds maximum
      ...config
    }
    this.state = {
      isPlaying: false,
      currentMood: 'peaceful',
      lastEventTime: 0
    }
  }

  /**
   * Start the ambient soundscape
   */
  start(): void {
    if (!this.config.enabled || this.state.isPlaying) return

    this.state.isPlaying = true
    this.scheduleNextEvent()
  }

  /**
   * Stop the ambient soundscape
   */
  stop(): void {
    this.state.isPlaying = false
    if (this.eventTimer) {
      clearTimeout(this.eventTimer)
      this.eventTimer = null
    }
  }

  /**
   * Set current emotion (affects ambient mood)
   */
  setEmotion(emotion: EmotionToken): void {
    this.state.currentMood = EMOTION_TO_MOOD[emotion] || 'peaceful'
  }

  /**
   * Set enabled state
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
    if (!enabled) {
      this.stop()
    }
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Schedule the next ambient event
   */
  private scheduleNextEvent(): void {
    if (!this.state.isPlaying) return

    const interval = this.getRandomInterval()
    this.eventTimer = setTimeout(() => {
      this.playAmbientSound()
      this.scheduleNextEvent()
    }, interval)
  }

  /**
   * Get random interval between events
   */
  private getRandomInterval(): number {
    const { minEventInterval, maxEventInterval } = this.config
    return minEventInterval + Math.random() * (maxEventInterval - minEventInterval)
  }

  /**
   * Play an ambient sound based on current mood
   */
  private async playAmbientSound(): Promise<void> {
    if (!this.config.enabled) return

    const soundSet = AMBIENT_SETS[this.state.currentMood] || AMBIENT_SETS.peaceful
    const sound = soundSet[Math.floor(Math.random() * soundSet.length)]

    if (sound) {
      await this.samplePlayer.play(sound, this.config.volume)
      this.state.lastEventTime = Date.now()
    }
  }

  /**
   * Trigger an immediate ambient event
   */
  async triggerEvent(): Promise<void> {
    await this.playAmbientSound()
  }

  /**
   * Get current state
   */
  getState(): AmbientState {
    return { ...this.state }
  }

  /**
   * Get config
   */
  getConfig(): AmbientEngineConfig {
    return { ...this.config }
  }

  /**
   * Dispose and clean up
   */
  dispose(): void {
    this.stop()
    this.config.enabled = false
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createAmbientEngine(
  samplePlayer: SamplePlayer,
  config?: Partial<AmbientEngineConfig>
): AmbientEngine {
  return new AmbientEngine(samplePlayer, config)
}
