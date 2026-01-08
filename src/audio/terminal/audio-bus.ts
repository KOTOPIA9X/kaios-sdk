/**
 * KAIOS Audio Bus
 * Central hub for tracking all sounds KAIOS produces in real-time
 *
 * This enables the visualizer to "see" what KAIOS is playing
 * instead of listening to the user's microphone
 */

import { EventEmitter } from 'events'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface PlayingSound {
  id: string
  file: string
  startTime: number
  duration: number
  volume: number
  category: 'sample' | 'tone' | 'ambient' | 'music'
}

export interface SoundEvent {
  id: string
  file: string
  timestamp: number
  category: 'sample' | 'tone' | 'ambient' | 'music'
}

export interface AudioBusState {
  isActive: boolean
  currentlyPlaying: PlayingSound[]
  recentSounds: SoundEvent[]
  frequencyData: number[]
  emotionState: string
  activity: number  // 0-1 overall audio activity level
}

export type AudioBusEventType = 'soundStart' | 'soundEnd' | 'stateChange'
export type SoundStartCallback = (sound: PlayingSound) => void
export type SoundEndCallback = (sound: PlayingSound) => void
export type StateChangeCallback = (state: AudioBusState) => void

// ════════════════════════════════════════════════════════════════════════════════
// AUDIO BUS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Central audio bus that tracks all sounds KAIOS produces
 * Used by visualizer to display internal audio state
 */
export class AudioBus extends EventEmitter {
  private currentlyPlaying: Map<string, PlayingSound> = new Map()
  private recentSounds: SoundEvent[] = []
  private frequencyData: number[] = new Array(128).fill(0)
  private emotionState: string = 'neutral'
  private soundIdCounter = 0
  private cleanupInterval: NodeJS.Timeout | null = null
  private animationInterval: NodeJS.Timeout | null = null
  private lastEmitTime = 0
  private readonly EMIT_THROTTLE_MS = 16  // ~60fps max

  // Frequency estimation for different sound categories
  private readonly CATEGORY_FREQUENCIES: Record<string, { low: number; high: number; peak: number }> = {
    sample: { low: 100, high: 4000, peak: 800 },
    tone: { low: 200, high: 2000, peak: 432 },
    ambient: { low: 50, high: 500, peak: 150 },
    music: { low: 80, high: 8000, peak: 440 }
  }

  constructor() {
    super()
    this.startCleanup()
    this.startAnimationLoop()
  }

  /**
   * Start 60fps animation loop for smooth frequency updates
   */
  private startAnimationLoop(): void {
    // Run at ~60fps for smooth visualization
    this.animationInterval = setInterval(() => {
      if (this.currentlyPlaying.size > 0) {
        this.updateFrequencies()
        this.emitThrottled()
      }
    }, 16)  // ~60fps
  }

  /**
   * Emit state change, throttled to 60fps max
   */
  private emitThrottled(): void {
    const now = Date.now()
    if (now - this.lastEmitTime >= this.EMIT_THROTTLE_MS) {
      this.lastEmitTime = now
      this.emit('stateChange', this.getState())
    }
  }

  /**
   * Register when a sound starts playing
   */
  soundStart(
    file: string,
    category: PlayingSound['category'] = 'sample',
    volume: number = 1,
    duration: number = 3000  // Default estimate
  ): string {
    const id = `sound_${++this.soundIdCounter}_${Date.now()}`

    const sound: PlayingSound = {
      id,
      file,
      startTime: Date.now(),
      duration,
      volume,
      category
    }

    this.currentlyPlaying.set(id, sound)
    this.recentSounds.push({
      id,
      file,
      timestamp: Date.now(),
      category
    })

    // Keep only last 50 recent sounds
    if (this.recentSounds.length > 50) {
      this.recentSounds = this.recentSounds.slice(-50)
    }

    // Update frequency simulation
    this.simulateFrequencies()

    this.emit('soundStart', sound)
    this.emit('stateChange', this.getState())

    // Auto-remove after duration
    setTimeout(() => {
      this.soundEnd(id)
    }, duration)

    return id
  }

  /**
   * Register when a sound stops playing
   */
  soundEnd(id: string): void {
    const sound = this.currentlyPlaying.get(id)
    if (sound) {
      this.currentlyPlaying.delete(id)
      this.simulateFrequencies()
      this.emit('soundEnd', sound)
      this.emit('stateChange', this.getState())
    }
  }

  /**
   * Set current emotion state (affects visualization)
   */
  setEmotion(emotion: string): void {
    this.emotionState = emotion
    this.emit('stateChange', this.getState())
  }

  /**
   * Get current audio state
   */
  getState(): AudioBusState {
    return {
      isActive: this.currentlyPlaying.size > 0,
      currentlyPlaying: Array.from(this.currentlyPlaying.values()),
      recentSounds: [...this.recentSounds],
      frequencyData: [...this.frequencyData],
      emotionState: this.emotionState,
      activity: this.calculateActivity()
    }
  }

  /**
   * Get frequency data for visualization (simulated based on playing sounds)
   */
  getFrequencyData(): number[] {
    return [...this.frequencyData]
  }

  /**
   * Get list of currently playing files
   */
  getPlayingFiles(): string[] {
    return Array.from(this.currentlyPlaying.values()).map(s => s.file)
  }

  /**
   * Check if any sounds are playing
   */
  isPlaying(): boolean {
    return this.currentlyPlaying.size > 0
  }

  /**
   * Event subscription helpers
   */
  onSoundStart(callback: SoundStartCallback): void {
    this.on('soundStart', callback)
  }

  onSoundEnd(callback: SoundEndCallback): void {
    this.on('soundEnd', callback)
  }

  onStateChange(callback: StateChangeCallback): void {
    this.on('stateChange', callback)
  }

  /**
   * Clear all playing sounds
   */
  clear(): void {
    this.currentlyPlaying.clear()
    this.frequencyData = new Array(128).fill(0)
    this.emit('stateChange', this.getState())
  }

  /**
   * Dispose and clean up
   */
  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
    }
    this.clear()
    this.removeAllListeners()
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Update frequency data with smooth animation
   * Called at 60fps from animation loop for fluid visualization
   */
  private updateFrequencies(): void {
    // Smooth decay existing values (creates trailing effect)
    const DECAY_RATE = 0.85  // Adjust for faster/slower decay
    for (let i = 0; i < 128; i++) {
      this.frequencyData[i] *= DECAY_RATE
    }

    if (this.currentlyPlaying.size === 0) return

    // Add frequency content from currently playing sounds
    for (const sound of this.currentlyPlaying.values()) {
      const freqProfile = this.CATEGORY_FREQUENCIES[sound.category] || this.CATEGORY_FREQUENCIES.sample

      // Calculate how far into the sound we are (0-1)
      const elapsed = Date.now() - sound.startTime
      const progress = Math.min(1, elapsed / sound.duration)

      // Attack-decay-sustain-release envelope
      let envelope = 1
      if (progress < 0.05) {
        envelope = progress / 0.05  // Fast attack
      } else if (progress < 0.15) {
        envelope = 1 - (progress - 0.05) * 2  // Quick decay to sustain
      } else if (progress < 0.7) {
        envelope = 0.8  // Sustain
      } else {
        envelope = 0.8 * (1 - (progress - 0.7) / 0.3)  // Release
      }

      // Add frequency content with variation
      const time = Date.now() / 1000
      for (let i = 0; i < 128; i++) {
        const freq = (i / 128) * 10000  // 0 - 10kHz

        if (freq >= freqProfile.low && freq <= freqProfile.high) {
          // Bell curve around peak frequency
          const distance = Math.abs(freq - freqProfile.peak) / (freqProfile.high - freqProfile.low)
          const baseAmplitude = Math.exp(-distance * 3) * sound.volume * envelope * 180

          // Add organic movement with sin waves at different frequencies
          const wobble1 = Math.sin(time * 8 + i * 0.1) * 15
          const wobble2 = Math.sin(time * 13 + i * 0.2) * 10
          const noise = (Math.random() - 0.5) * 25

          const amplitude = baseAmplitude + wobble1 + wobble2 + noise

          this.frequencyData[i] = Math.min(255, Math.max(0, this.frequencyData[i] + amplitude * 0.3))
        }
      }
    }
  }

  /**
   * Simulate frequency data (for initial state - called on sound start)
   */
  private simulateFrequencies(): void {
    // Just trigger an immediate update
    this.updateFrequencies()
  }

  /**
   * Calculate overall audio activity level (0-1)
   */
  private calculateActivity(): number {
    if (this.currentlyPlaying.size === 0) return 0

    const avgFreq = this.frequencyData.reduce((a, b) => a + b, 0) / this.frequencyData.length
    return Math.min(1, avgFreq / 128)
  }

  /**
   * Start cleanup interval for expired sounds
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()

      for (const [id, sound] of this.currentlyPlaying) {
        if (now - sound.startTime > sound.duration) {
          this.soundEnd(id)
        }
      }
    }, 100)
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// SINGLETON & EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

// Global singleton instance
let globalAudioBus: AudioBus | null = null

/**
 * Get the global AudioBus instance
 */
export function getAudioBus(): AudioBus {
  if (!globalAudioBus) {
    globalAudioBus = new AudioBus()
  }
  return globalAudioBus
}

/**
 * Create a new AudioBus instance (for isolated use)
 */
export function createAudioBus(): AudioBus {
  return new AudioBus()
}
