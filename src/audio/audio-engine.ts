/**
 * Audio Engine - Core sound intelligence processing
 * Handles audio generation, effects, and sound synthesis
 */

import type {
  SentimentData,
  AudioProfile,
  GeneratedAudio,
  AudioConfig
} from '../core/types.js'
import { emotionToSound, buildMusicPrompt } from './emotion-mapper.js'

export interface AudioEngineConfig extends AudioConfig {
  sampleRate?: number
  channels?: number
}

/**
 * Main audio engine for Sound Intelligence
 */
export class AudioEngine {
  private config: AudioEngineConfig
  private audioContext: AudioContext | null = null
  private isInitialized = false

  constructor(config: AudioEngineConfig) {
    this.config = {
      sampleRate: 44100,
      channels: 2,
      ...config
    }
  }

  /**
   * Initialize audio context (must be called after user interaction in browser)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    if (typeof AudioContext !== 'undefined') {
      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate
      })
      this.isInitialized = true
    } else {
      console.warn('AudioContext not available in this environment')
    }
  }

  /**
   * Map emotions to sound characteristics
   */
  mapEmotionToSound(params: {
    emotion: string
    valence: number
    arousal: number
    intensity: number
  }): AudioProfile {
    const sentiment: SentimentData = {
      emotion: params.emotion,
      valence: params.valence,
      arousal: params.arousal,
      intensity: params.intensity
    }

    return emotionToSound(sentiment)
  }

  /**
   * Generate sentiment-driven music
   * In production, this would integrate with audio generation APIs
   */
  async generateMusic(params: {
    sentiment: SentimentData
    style: string
    duration: number
  }): Promise<GeneratedAudio | null> {
    if (!this.config.musicGeneration) {
      return null
    }

    // Build prompt for music generation
    const prompt = buildMusicPrompt(params.sentiment, params.style)

    // In production, this would call an audio generation API
    // (e.g., Stable Audio, MusicGen, etc.)
    console.log('Music generation prompt:', prompt)

    return {
      metadata: {
        sentiment: params.sentiment,
        style: params.style,
        duration: params.duration,
        timestamp: Date.now()
      }
    }
  }

  /**
   * Generate a simple tone based on emotion
   * This is a basic example - real implementation would be more sophisticated
   */
  async generateTone(params: {
    frequency: number
    duration: number
    type?: OscillatorType
  }): Promise<void> {
    if (!this.audioContext) {
      await this.initialize()
    }

    if (!this.audioContext) {
      throw new Error('AudioContext not available')
    }

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = params.type || 'sine'
    oscillator.frequency.value = params.frequency

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + params.duration
    )

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + params.duration)
  }

  /**
   * Play a sound effect based on emotion
   */
  async playSoundEffect(emotion: string, intensity: number = 0.5): Promise<void> {
    const profile = this.mapEmotionToSound({
      emotion,
      valence: emotion === 'happy' ? 0.5 : emotion === 'sad' ? -0.5 : 0,
      arousal: intensity,
      intensity
    })

    // Map frequency range to Hz
    const freqMap = {
      low: 220,
      mid: 440,
      high: 880
    }

    const freq = freqMap[profile.frequency] || 440

    // Map texture to oscillator type
    const typeMap: Record<string, OscillatorType> = {
      smooth: 'sine',
      rough: 'sawtooth',
      glitchy: 'square',
      ambient: 'triangle',
      chaotic: 'square'
    }

    const type = typeMap[profile.texture] || 'sine'

    await this.generateTone({
      frequency: freq,
      duration: 0.5,
      type
    })
  }

  /**
   * Get current capabilities
   */
  getCapabilities(): {
    musicGeneration: boolean
    voiceSynthesis: boolean
    spatialAudio: boolean
    effectsChain: string[]
  } {
    return {
      musicGeneration: this.config.musicGeneration || false,
      voiceSynthesis: this.config.voiceSynthesis || false,
      spatialAudio: this.config.spatialAudio || false,
      effectsChain: ['reverb', 'delay', 'chorus', 'distortion', 'glitch', 'filter']
    }
  }

  /**
   * Suspend audio context (save resources)
   */
  async suspend(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'running') {
      await this.audioContext.suspend()
    }
  }

  /**
   * Resume audio context
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
      this.isInitialized = false
    }
  }
}
