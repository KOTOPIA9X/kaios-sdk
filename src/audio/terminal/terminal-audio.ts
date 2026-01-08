/**
 * KAIOS Terminal Audio Manager
 * Coordinates all 4 audio layers for terminal environment
 *
 * Layer 1: UI Tones (typing/response feedback) - ToneGenerator
 * Layer 2: Ambient Soundscape (background) - AmbientEngine
 * Layer 3: Emotion Music (procedural) - MusicEngine
 * Layer 4: Sample Library (sound markers) - SamplePlayer
 */

import type { EmotionToken } from '../../core/types.js'
import { ToneGenerator, createToneGenerator, type ToneGeneratorConfig } from './tone-generator.js'
import { SamplePlayer, createSamplePlayer, type SamplePlayerConfig } from './sample-player.js'
import { AmbientEngine, createAmbientEngine, type AmbientEngineConfig } from './ambient-engine.js'
import { MusicEngine, createMusicEngine, type MusicEngineConfig } from './music-engine.js'
import { getAudioBus, type AudioBusState } from './audio-bus.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface TerminalAudioConfig {
  enabled: boolean
  masterVolume: number  // 0-1

  // Layer enables
  tonesEnabled: boolean
  ambientEnabled: boolean
  musicEnabled: boolean
  samplesEnabled: boolean

  // Layer configs
  tones?: Partial<ToneGeneratorConfig>
  ambient?: Partial<AmbientEngineConfig>
  music?: Partial<MusicEngineConfig>
  samples?: Partial<SamplePlayerConfig>
}

export interface AudioState {
  enabled: boolean
  initialized: boolean
  currentEmotion: EmotionToken
  layers: {
    tones: boolean
    ambient: boolean
    music: boolean
    samples: boolean
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// TERMINAL AUDIO MANAGER
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Main audio manager for KAIOS terminal
 * Coordinates all 4 audio layers
 */
export class TerminalAudio {
  private config: TerminalAudioConfig
  private state: AudioState

  // Audio layers
  private tones: ToneGenerator
  private samples: SamplePlayer
  private ambient: AmbientEngine
  private music: MusicEngine

  constructor(config: Partial<TerminalAudioConfig> = {}) {
    this.config = {
      enabled: true,
      masterVolume: 0.5,
      tonesEnabled: true,
      ambientEnabled: false,  // Off by default (can be intrusive)
      musicEnabled: false,    // Off by default
      samplesEnabled: true,
      ...config
    }

    this.state = {
      enabled: this.config.enabled,
      initialized: false,
      currentEmotion: 'EMOTE_NEUTRAL',
      layers: {
        tones: this.config.tonesEnabled,
        ambient: this.config.ambientEnabled,
        music: this.config.musicEnabled,
        samples: this.config.samplesEnabled
      }
    }

    // Initialize layers
    this.tones = createToneGenerator({
      enabled: this.config.tonesEnabled,
      volume: this.config.masterVolume,
      ...this.config.tones
    })

    this.samples = createSamplePlayer({
      enabled: this.config.samplesEnabled,
      volume: this.config.masterVolume,
      ...this.config.samples
    })

    this.ambient = createAmbientEngine(this.samples, {
      enabled: this.config.ambientEnabled,
      volume: this.config.masterVolume * 0.6,  // Ambient is quieter
      ...this.config.ambient
    })

    this.music = createMusicEngine(this.samples, {
      enabled: this.config.musicEnabled,
      volume: this.config.masterVolume,
      ...this.config.music
    })
  }

  /**
   * Initialize audio system
   */
  async initialize(): Promise<boolean> {
    if (this.state.initialized) return true

    try {
      // Initialize sample player (required for ambient and music)
      await this.samples.initialize()
      this.state.initialized = true
      return true
    } catch (error) {
      console.warn('[TerminalAudio] Failed to initialize:', error)
      this.config.enabled = false
      return false
    }
  }

  /**
   * Enable or disable all audio
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
    this.state.enabled = enabled

    this.tones.setEnabled(enabled && this.state.layers.tones)
    this.samples.setEnabled(enabled && this.state.layers.samples)
    this.ambient.setEnabled(enabled && this.state.layers.ambient)
    this.music.setEnabled(enabled && this.state.layers.music)

    if (!enabled) {
      this.ambient.stop()
    }
  }

  /**
   * Toggle a specific layer
   */
  setLayerEnabled(layer: keyof AudioState['layers'], enabled: boolean): void {
    this.state.layers[layer] = enabled

    switch (layer) {
      case 'tones':
        this.tones.setEnabled(enabled && this.config.enabled)
        break
      case 'samples':
        this.samples.setEnabled(enabled && this.config.enabled)
        break
      case 'ambient':
        this.ambient.setEnabled(enabled && this.config.enabled)
        if (enabled && this.config.enabled) {
          this.ambient.start()
        } else {
          this.ambient.stop()
        }
        break
      case 'music':
        this.music.setEnabled(enabled && this.config.enabled)
        break
    }
  }

  /**
   * Set master volume (0-1)
   */
  setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume))
    this.tones.setVolume(this.config.masterVolume)
    this.samples.setVolume(this.config.masterVolume)
    this.ambient.setVolume(this.config.masterVolume * 0.6)
    this.music.setVolume(this.config.masterVolume)
  }

  /**
   * Set current emotion (affects all layers)
   */
  async setEmotion(emotion: EmotionToken, intensity: number = 0.5): Promise<void> {
    this.state.currentEmotion = emotion

    this.tones.setEmotion(emotion)
    this.ambient.setEmotion(emotion)
    await this.music.setEmotion(emotion, intensity)

    // Sync to AudioBus for visualizer
    const audioBus = getAudioBus()
    audioBus.setEmotion(emotion)
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LAYER 1: UI TONES
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Play typing feedback tone
   */
  playTypingTone(char?: string): void {
    if (!this.config.enabled) return
    this.tones.playTypingTone(char)
  }

  /**
   * Play response arrival tone
   */
  playResponseTone(): void {
    if (!this.config.enabled) return
    this.tones.playResponseTone()
  }

  /**
   * Play level up celebration
   */
  playLevelUpTone(): void {
    if (!this.config.enabled) return
    this.tones.playLevelUpTone()
  }

  /**
   * Play error tone
   */
  playErrorTone(): void {
    if (!this.config.enabled) return
    this.tones.playErrorTone()
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LAYER 2: AMBIENT
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Start ambient soundscape
   */
  startAmbient(): void {
    if (!this.config.enabled) return
    this.ambient.start()
  }

  /**
   * Stop ambient soundscape
   */
  stopAmbient(): void {
    this.ambient.stop()
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LAYER 3: MUSIC
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Play emotion-appropriate music
   */
  async playMusic(): Promise<void> {
    if (!this.config.enabled) return
    await this.music.playForEmotion()
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LAYER 4: SAMPLES
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Play a specific sample
   */
  async playSample(filename: string): Promise<void> {
    if (!this.config.enabled) return
    await this.samples.play(filename)
  }

  /**
   * Process text for sound markers and play them
   */
  async processTextForSounds(text: string): Promise<string[]> {
    if (!this.config.enabled) return []
    return await this.samples.playMarkersInText(text)
  }

  /**
   * Play glitch sound
   */
  async playGlitch(): Promise<void> {
    if (!this.config.enabled) return
    await this.samples.playGlitch()
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STATE & UTILITIES
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Get current audio state
   */
  getState(): AudioState {
    return { ...this.state }
  }

  /**
   * Get audio bus state (for visualizer)
   * Returns real-time info about what KAIOS is playing
   */
  getAudioBusState(): AudioBusState {
    const audioBus = getAudioBus()
    return audioBus.getState()
  }

  /**
   * Get frequency data from audio bus (for visualizer)
   */
  getFrequencyData(): number[] {
    const audioBus = getAudioBus()
    return audioBus.getFrequencyData()
  }

  /**
   * Check if any sounds are currently playing
   */
  isPlayingAudio(): boolean {
    const audioBus = getAudioBus()
    return audioBus.isPlaying()
  }

  /**
   * Get configuration
   */
  getConfig(): TerminalAudioConfig {
    return { ...this.config }
  }

  /**
   * Check if audio is available
   */
  isAvailable(): boolean {
    return this.state.initialized
  }

  /**
   * Get layer status as formatted string
   */
  getStatusString(): string {
    const l = this.state.layers
    return [
      `audio: ${this.config.enabled ? 'ON' : 'OFF'}`,
      `tones: ${l.tones ? 'ON' : 'OFF'}`,
      `ambient: ${l.ambient ? 'ON' : 'OFF'}`,
      `music: ${l.music ? 'ON' : 'OFF'}`,
      `samples: ${l.samples ? 'ON' : 'OFF'}`
    ].join(' | ')
  }

  /**
   * Dispose and clean up all resources
   */
  dispose(): void {
    this.config.enabled = false
    this.tones.dispose()
    this.samples.dispose()
    this.ambient.dispose()
    this.music.dispose()
    this.state.initialized = false
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createTerminalAudio(config?: Partial<TerminalAudioConfig>): TerminalAudio {
  return new TerminalAudio(config)
}

// Re-export layer types
export type { ToneGeneratorConfig, SamplePlayerConfig, AmbientEngineConfig, MusicEngineConfig }
