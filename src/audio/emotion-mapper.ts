/**
 * Emotion Mapper - Maps emotions to sound characteristics
 * Core of KAIOS's Sound Intelligence
 */

import type {
  SentimentData,
  AudioProfile,
  EmotionToken,
  SoundFrequency,
  SoundTexture,
  SoundRhythm
} from '../core/types.js'

/**
 * Musical descriptors for different emotional states
 */
const EMOTION_SOUND_MAP: Record<string, {
  frequency: SoundFrequency
  texture: SoundTexture
  rhythm: SoundRhythm
  descriptors: string[]
}> = {
  happy: {
    frequency: 'high',
    texture: 'smooth',
    rhythm: 'fast',
    descriptors: ['bright', 'uplifting', 'energetic', 'major key']
  },
  excited: {
    frequency: 'high',
    texture: 'rough',
    rhythm: 'fast',
    descriptors: ['intense', 'driving', 'euphoric', 'crescendo']
  },
  sad: {
    frequency: 'low',
    texture: 'smooth',
    rhythm: 'slow',
    descriptors: ['melancholic', 'minor key', 'sparse', 'atmospheric']
  },
  angry: {
    frequency: 'low',
    texture: 'rough',
    rhythm: 'fast',
    descriptors: ['aggressive', 'distorted', 'heavy', 'dissonant']
  },
  contemplative: {
    frequency: 'mid',
    texture: 'ambient',
    rhythm: 'slow',
    descriptors: ['meditative', 'spacious', 'evolving', 'textural']
  },
  curious: {
    frequency: 'mid',
    texture: 'glitchy',
    rhythm: 'medium',
    descriptors: ['exploratory', 'quirky', 'playful', 'unexpected']
  },
  surprised: {
    frequency: 'high',
    texture: 'glitchy',
    rhythm: 'chaotic',
    descriptors: ['sudden', 'dynamic', 'unpredictable', 'staccato']
  },
  peaceful: {
    frequency: 'low',
    texture: 'ambient',
    rhythm: 'slow',
    descriptors: ['serene', 'flowing', 'minimal', 'ethereal']
  },
  chaotic: {
    frequency: 'high',
    texture: 'chaotic',
    rhythm: 'chaotic',
    descriptors: ['glitchy', 'fragmented', 'intense', 'overwhelming']
  },
  neutral: {
    frequency: 'mid',
    texture: 'smooth',
    rhythm: 'medium',
    descriptors: ['balanced', 'steady', 'neutral', 'consistent']
  }
}

/**
 * Map emotion token to sound map key
 */
const TOKEN_TO_EMOTION: Record<EmotionToken, string> = {
  EMOTE_HAPPY: 'happy',
  EMOTE_SAD: 'sad',
  EMOTE_ANGRY: 'angry',
  EMOTE_THINK: 'contemplative',
  EMOTE_SURPRISED: 'surprised',
  EMOTE_AWKWARD: 'neutral',
  EMOTE_QUESTION: 'curious',
  EMOTE_CURIOUS: 'curious',
  EMOTE_NEUTRAL: 'neutral'
}

/**
 * Convert emotion data to sound profile
 */
export function emotionToSound(sentiment: SentimentData): AudioProfile {
  const emotionKey = sentiment.emotion.toLowerCase()
  const baseProfile = EMOTION_SOUND_MAP[emotionKey] || EMOTION_SOUND_MAP.neutral

  // Adjust based on intensity
  let texture = baseProfile.texture
  let rhythm = baseProfile.rhythm

  if (sentiment.intensity > 0.8) {
    texture = sentiment.valence > 0 ? 'rough' : 'chaotic'
    rhythm = 'fast'
  } else if (sentiment.intensity < 0.3) {
    texture = 'ambient'
    rhythm = 'slow'
  }

  // Determine effects
  const effects = determineEffects(sentiment)

  return {
    frequency: baseProfile.frequency,
    texture,
    rhythm,
    effects,
    energy: Math.round(sentiment.arousal * 10)
  }
}

/**
 * Convert emotion token to sound profile
 */
export function tokenToSound(token: EmotionToken, intensity: number = 0.5): AudioProfile {
  const emotionKey = TOKEN_TO_EMOTION[token]
  const baseProfile = EMOTION_SOUND_MAP[emotionKey] || EMOTION_SOUND_MAP.neutral

  return {
    ...baseProfile,
    effects: ['reverb', 'chorus'],
    energy: Math.round(intensity * 10)
  }
}

/**
 * Infer emotion from sound characteristics (reverse mapping)
 */
export function soundToEmotion(profile: AudioProfile): SentimentData {
  // Calculate valence from frequency and texture
  let valence = 0
  if (profile.frequency === 'high') valence += 0.3
  else if (profile.frequency === 'low') valence -= 0.2

  if (profile.texture === 'smooth') valence += 0.2
  else if (profile.texture === 'rough') valence -= 0.1
  else if (profile.texture === 'chaotic') valence -= 0.3

  // Calculate arousal from rhythm and energy
  let arousal = profile.energy / 10
  if (profile.rhythm === 'fast') arousal = Math.min(1, arousal + 0.2)
  else if (profile.rhythm === 'slow') arousal = Math.max(0, arousal - 0.2)
  else if (profile.rhythm === 'chaotic') arousal = Math.min(1, arousal + 0.3)

  // Determine emotion string
  let emotion = 'neutral'
  if (valence > 0.2 && arousal > 0.6) emotion = 'excited'
  else if (valence > 0.2) emotion = 'happy'
  else if (valence < -0.2 && arousal > 0.6) emotion = 'angry'
  else if (valence < -0.2) emotion = 'sad'
  else if (arousal < 0.3) emotion = 'contemplative'
  else if (profile.texture === 'glitchy') emotion = 'curious'

  return {
    emotion,
    valence: Math.max(-1, Math.min(1, valence)),
    arousal: Math.max(0, Math.min(1, arousal)),
    intensity: (Math.abs(valence) + arousal) / 2
  }
}

/**
 * Determine audio effects based on sentiment
 */
function determineEffects(sentiment: SentimentData): string[] {
  const effects: string[] = []

  // Always add some reverb for spaciousness
  effects.push('reverb')

  // High intensity = more effects
  if (sentiment.intensity > 0.6) {
    effects.push('delay')
  }

  // High arousal = chorus for richness
  if (sentiment.arousal > 0.5) {
    effects.push('chorus')
  }

  // Negative valence with high intensity = distortion
  if (sentiment.valence < -0.3 && sentiment.intensity > 0.5) {
    effects.push('distortion')
  }

  // Chaotic emotions = glitch effects
  if (sentiment.intensity > 0.8 || sentiment.arousal > 0.8) {
    effects.push('glitch')
  }

  // Low arousal = more ambient processing
  if (sentiment.arousal < 0.3) {
    effects.push('filter')
  }

  return effects
}

/**
 * Get musical descriptors for an emotion
 */
export function getMusicalDescriptors(emotion: string): string[] {
  const profile = EMOTION_SOUND_MAP[emotion.toLowerCase()]
  return profile?.descriptors || EMOTION_SOUND_MAP.neutral.descriptors
}

/**
 * Build a music generation prompt from sentiment
 */
export function buildMusicPrompt(sentiment: SentimentData, style: string): string {
  const profile = emotionToSound(sentiment)
  const emotionKey = sentiment.emotion.toLowerCase()
  const descriptors = getMusicalDescriptors(emotionKey)

  const parts = [
    style,
    'track',
    ...descriptors,
    `${sentiment.emotion} mood`,
    'experimental electronic',
    profile.texture === 'glitchy' ? 'glitchy textures' : '',
    profile.texture === 'ambient' ? 'ambient soundscape' : '',
    profile.rhythm === 'fast' ? 'driving rhythm' : '',
    profile.rhythm === 'slow' ? 'slow tempo' : '',
    profile.frequency === 'low' ? 'deep bass' : '',
    profile.frequency === 'high' ? 'bright highs' : ''
  ].filter(Boolean)

  return parts.join(', ')
}

/**
 * Map frequency to Hz range
 */
export function frequencyToHz(freq: SoundFrequency): { min: number; max: number } {
  switch (freq) {
    case 'low':
      return { min: 60, max: 250 }
    case 'mid':
      return { min: 250, max: 2000 }
    case 'high':
      return { min: 2000, max: 8000 }
    default:
      return { min: 250, max: 2000 }
  }
}

/**
 * Get BPM range for rhythm
 */
export function rhythmToBPM(rhythm: SoundRhythm): { min: number; max: number } {
  switch (rhythm) {
    case 'slow':
      return { min: 60, max: 90 }
    case 'medium':
      return { min: 90, max: 130 }
    case 'fast':
      return { min: 130, max: 180 }
    case 'chaotic':
      return { min: 80, max: 200 } // Variable
    default:
      return { min: 90, max: 130 }
  }
}
