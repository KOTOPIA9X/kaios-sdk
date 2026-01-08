/**
 * Game engine utilities for KAIOS
 * Provides helpers for Three.js and other game engines
 */

import { Kaios } from '../../core/Kaios.js'
import type {
  KaiosConfig,
  KaiosSpeech,
  EmotionToken,
  AudioProfile
} from '../../core/types.js'

/**
 * Create a KAIOS instance configured for games
 */
export function createGameKaios(config: KaiosConfig & {
  spatialAudio?: boolean
  realtimeSync?: boolean
}): Kaios {
  return new Kaios({
    ...config,
    audioEnabled: true,
    audio: {
      engine: 'web-audio',
      spatialAudio: config.spatialAudio ?? true,
      ...config.audio
    }
  })
}

/**
 * Animation state from emotion
 */
export interface EmotionAnimationState {
  animation: string
  speed: number
  intensity: number
  particleEffect?: string
}

/**
 * Map emotion to animation state
 */
export function getEmotionAnimation(emotion: EmotionToken): EmotionAnimationState {
  const map: Record<EmotionToken, EmotionAnimationState> = {
    EMOTE_HAPPY: {
      animation: 'happy_bounce',
      speed: 1.2,
      intensity: 0.8,
      particleEffect: 'sparkles'
    },
    EMOTE_SAD: {
      animation: 'sad_droop',
      speed: 0.7,
      intensity: 0.5
    },
    EMOTE_ANGRY: {
      animation: 'angry_shake',
      speed: 1.5,
      intensity: 1.0,
      particleEffect: 'fire'
    },
    EMOTE_THINK: {
      animation: 'thinking',
      speed: 0.8,
      intensity: 0.4,
      particleEffect: 'bubbles'
    },
    EMOTE_SURPRISED: {
      animation: 'surprised_jump',
      speed: 1.8,
      intensity: 1.0,
      particleEffect: 'exclamation'
    },
    EMOTE_AWKWARD: {
      animation: 'nervous_fidget',
      speed: 1.0,
      intensity: 0.6,
      particleEffect: 'sweat'
    },
    EMOTE_QUESTION: {
      animation: 'head_tilt',
      speed: 0.9,
      intensity: 0.5,
      particleEffect: 'question_mark'
    },
    EMOTE_CURIOUS: {
      animation: 'curious_lean',
      speed: 1.1,
      intensity: 0.7,
      particleEffect: 'sparkles'
    },
    EMOTE_NEUTRAL: {
      animation: 'idle',
      speed: 1.0,
      intensity: 0.3
    }
  }

  return map[emotion] || map.EMOTE_NEUTRAL
}

/**
 * Convert audio profile to frequency in Hz for oscillators
 */
export function audioProfileToFrequency(profile: AudioProfile): number {
  const baseFrequencies = {
    low: 220, // A3
    mid: 440, // A4
    high: 880 // A5
  }

  let freq = baseFrequencies[profile.frequency] || 440

  // Adjust based on energy
  freq *= 1 + (profile.energy - 5) * 0.05

  // Add variation based on texture
  if (profile.texture === 'glitchy') {
    freq *= 1 + (Math.random() - 0.5) * 0.1
  }

  return freq
}

/**
 * Get oscillator type from audio profile
 */
export function getOscillatorType(profile: AudioProfile): OscillatorType {
  const map: Record<string, OscillatorType> = {
    smooth: 'sine',
    rough: 'sawtooth',
    glitchy: 'square',
    ambient: 'triangle',
    chaotic: 'square'
  }
  return map[profile.texture] || 'sine'
}

/**
 * Speech bubble configuration
 */
export interface SpeechBubbleConfig {
  text: string
  expression: string
  emotion: EmotionToken
  duration: number
  position?: { x: number; y: number; z: number }
}

/**
 * Create speech bubble configuration from KAIOS speech
 */
export function createSpeechBubble(speech: KaiosSpeech, duration: number = 3000): SpeechBubbleConfig {
  return {
    text: speech.text.replace(/<\|EMOTE_\w+\|>/g, '').trim(),
    expression: speech.expressions[0]?.kaimoji || '(◕‿◕)',
    emotion: speech.emotion,
    duration
  }
}

/**
 * Color configuration for emotions
 */
export interface EmotionColor {
  primary: number
  secondary: number
  glow: number
  intensity: number
}

/**
 * Get color configuration for emotion (hex values)
 */
export function getEmotionColors(emotion: EmotionToken): EmotionColor {
  const colors: Record<EmotionToken, EmotionColor> = {
    EMOTE_HAPPY: {
      primary: 0x4ade80,
      secondary: 0x86efac,
      glow: 0x22c55e,
      intensity: 0.8
    },
    EMOTE_SAD: {
      primary: 0x60a5fa,
      secondary: 0x93c5fd,
      glow: 0x3b82f6,
      intensity: 0.5
    },
    EMOTE_ANGRY: {
      primary: 0xf87171,
      secondary: 0xfca5a5,
      glow: 0xef4444,
      intensity: 1.0
    },
    EMOTE_THINK: {
      primary: 0x22d3ee,
      secondary: 0x67e8f9,
      glow: 0x06b6d4,
      intensity: 0.6
    },
    EMOTE_SURPRISED: {
      primary: 0xfacc15,
      secondary: 0xfde047,
      glow: 0xeab308,
      intensity: 0.9
    },
    EMOTE_AWKWARD: {
      primary: 0xc084fc,
      secondary: 0xd8b4fe,
      glow: 0xa855f7,
      intensity: 0.6
    },
    EMOTE_QUESTION: {
      primary: 0x22d3ee,
      secondary: 0x67e8f9,
      glow: 0x06b6d4,
      intensity: 0.7
    },
    EMOTE_CURIOUS: {
      primary: 0xfacc15,
      secondary: 0xfde047,
      glow: 0xeab308,
      intensity: 0.7
    },
    EMOTE_NEUTRAL: {
      primary: 0x9ca3af,
      secondary: 0xd1d5db,
      glow: 0x6b7280,
      intensity: 0.4
    }
  }

  return colors[emotion] || colors.EMOTE_NEUTRAL
}

/**
 * NPC behavior parameters from emotion
 */
export interface NPCBehavior {
  movementSpeed: number
  lookAroundInterval: number
  idleAnimationVariation: number
  interactionRadius: number
  responseDelay: number
}

/**
 * Get NPC behavior parameters based on emotion
 */
export function getNPCBehavior(emotion: EmotionToken): NPCBehavior {
  const behaviors: Record<EmotionToken, NPCBehavior> = {
    EMOTE_HAPPY: {
      movementSpeed: 1.2,
      lookAroundInterval: 2000,
      idleAnimationVariation: 0.3,
      interactionRadius: 5,
      responseDelay: 500
    },
    EMOTE_SAD: {
      movementSpeed: 0.7,
      lookAroundInterval: 5000,
      idleAnimationVariation: 0.1,
      interactionRadius: 3,
      responseDelay: 1500
    },
    EMOTE_ANGRY: {
      movementSpeed: 1.4,
      lookAroundInterval: 1000,
      idleAnimationVariation: 0.5,
      interactionRadius: 4,
      responseDelay: 300
    },
    EMOTE_THINK: {
      movementSpeed: 0.5,
      lookAroundInterval: 4000,
      idleAnimationVariation: 0.1,
      interactionRadius: 3,
      responseDelay: 2000
    },
    EMOTE_SURPRISED: {
      movementSpeed: 1.5,
      lookAroundInterval: 500,
      idleAnimationVariation: 0.6,
      interactionRadius: 6,
      responseDelay: 200
    },
    EMOTE_AWKWARD: {
      movementSpeed: 0.9,
      lookAroundInterval: 3000,
      idleAnimationVariation: 0.4,
      interactionRadius: 2,
      responseDelay: 1000
    },
    EMOTE_QUESTION: {
      movementSpeed: 1.0,
      lookAroundInterval: 2500,
      idleAnimationVariation: 0.2,
      interactionRadius: 4,
      responseDelay: 800
    },
    EMOTE_CURIOUS: {
      movementSpeed: 1.1,
      lookAroundInterval: 1500,
      idleAnimationVariation: 0.4,
      interactionRadius: 5,
      responseDelay: 600
    },
    EMOTE_NEUTRAL: {
      movementSpeed: 1.0,
      lookAroundInterval: 3000,
      idleAnimationVariation: 0.2,
      interactionRadius: 4,
      responseDelay: 1000
    }
  }

  return behaviors[emotion] || behaviors.EMOTE_NEUTRAL
}

// Re-export for convenience
export { Kaios }
