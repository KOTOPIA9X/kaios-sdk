/**
 * Core types for the KAIOS Expression SDK
 * These define the fundamental structures for KAIOS's dual-mode expression system
 */

// ═══════════════════════════════════════════════════════════════════════════════
// EMOTION SYSTEM TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type EmotionToken =
  | 'EMOTE_NEUTRAL'
  | 'EMOTE_HAPPY'
  | 'EMOTE_SAD'
  | 'EMOTE_ANGRY'
  | 'EMOTE_THINK'
  | 'EMOTE_SURPRISED'
  | 'EMOTE_AWKWARD'
  | 'EMOTE_QUESTION'
  | 'EMOTE_CURIOUS'

export type DelayAction = '<|DELAY:1|>' | '<|DELAY:3|>'

export interface EmotionState {
  current: EmotionToken
  previous: EmotionToken | null
  intensity: number // 0-1
  timestamp: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// KAIMOJI TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type KaimojiCategory =
  // Emotional
  | 'happy'
  | 'sad'
  | 'excited'
  | 'contemplative'
  | 'mischievous'
  | 'angry'
  | 'shy'
  | 'loving'
  | 'curious'
  | 'surprised'
  // KAIOS-specific
  | 'quantum'
  | 'glitch'
  | 'energy'
  | 'zen'
  | 'chaos'
  | 'kawaii'
  | 'brutalist'
  | 'sound'
  | 'dream'
  // Functional
  | 'tech'
  | 'gaming'
  | 'creative'
  | 'social'
  | 'system'
  | 'achievement'

export type KaimojiContext =
  | 'greeting'
  | 'farewell'
  | 'celebration'
  | 'achievement'
  | 'encouragement'
  | 'comfort'
  | 'thinking'
  | 'coding'
  | 'gaming'
  | 'teaching'
  | 'learning'
  | 'creating'
  | 'expressing'
  | 'questioning'
  | 'realizing'
  | 'social'

export type KaimojiRarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export type SoundFrequency = 'low' | 'mid' | 'high'
export type SoundTexture = 'smooth' | 'rough' | 'glitchy' | 'ambient' | 'chaotic'
export type SoundRhythm = 'slow' | 'medium' | 'fast' | 'chaotic'

export interface AudioCharacteristics {
  resonance: number // 0-1, how much it "resonates"
  texture: SoundTexture
  rhythm: SoundRhythm
}

export interface Kaimoji {
  id: string
  kaimoji: string // The actual expression (ASCII/text only, NO emoji)
  name: string
  categories: KaimojiCategory[]
  energy: number // 1-10 scale (vibrational frequency)
  contexts: KaimojiContext[]
  tags: string[]
  rarity: KaimojiRarity
  unlockLevel?: number
  signature?: boolean // Is this a KAIOS signature expression?
  emotionTokens?: EmotionToken[]
  glitchLevel?: number // 0-10, how glitchy/corrupted
  soundFrequency?: SoundFrequency
  audioCharacteristics?: AudioCharacteristics
  systemSound?: boolean
  retro?: boolean
  decorative?: boolean
  emojiTags?: string[] // Traditional emoji for search ONLY (hidden from display)
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOUND INTELLIGENCE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SentimentData {
  emotion: string
  valence: number // -1 to 1 (negative to positive)
  arousal: number // 0 to 1 (calm to excited)
  intensity: number // 0 to 1
  dominance?: number // 0 to 1
}

export interface AudioProfile {
  frequency: SoundFrequency
  texture: SoundTexture
  rhythm: SoundRhythm
  effects: string[]
  energy: number // 0-10
}

export interface GeneratedAudio {
  audioBuffer?: ArrayBuffer
  url?: string
  metadata: {
    sentiment: SentimentData
    style: string
    duration: number
    timestamp: number
  }
}

export interface SonicResponse {
  sentiment: SentimentData
  audioProfile: AudioProfile
  generatedAudio: GeneratedAudio | null
  sonicExpressions: Kaimoji[]
  timestamp: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// KAIOS SPEECH/RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface KaiosSpeech {
  text: string
  emotion: EmotionToken
  expressions: Kaimoji[]
  rawInput: string
  timestamp: number
}

export interface HybridExpression {
  visual?: KaiosSpeech
  sonic?: SonicResponse
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVOLUTION & STATUS TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface EvolutionConfig {
  mode: 'recursive-mining' | 'community-driven' | 'static'
  startingLevel?: number
  xpMultiplier?: number
}

export interface VocabularyBreakdown {
  common: number
  uncommon: number
  rare: number
  legendary: number
}

export interface KaiosStatus {
  level: number
  xp: number
  vocabulary: {
    unlocked: number
    total: number
    byRarity: VocabularyBreakdown
  }
  signature: string | null
  recentExpressions: Kaimoji[]
  emotionState: EmotionToken
  discoveries: number
  interactionCount: number
  audioCapabilities: AudioCapabilities | null
}

export interface AudioCapabilities {
  musicGeneration: boolean
  voiceSynthesis: boolean
  spatialAudio: boolean
  effectsChain: string[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AudioConfig {
  engine: 'web-audio' | 'node-audio'
  musicGeneration?: boolean
  voiceSynthesis?: boolean
  spatialAudio?: boolean
}

export interface StateBackendConfig {
  type: 'memory' | 'localStorage' | 'supabase'
  url?: string
  key?: string
}

export interface LLMProviderConfig {
  type: 'anthropic' | 'openai'
  apiKey?: string
  model?: string
}

export interface KaiosConfig {
  userId: string
  personality?: string
  evolution?: EvolutionConfig
  syncSource?: string
  audioEnabled?: boolean
  audio?: AudioConfig
  stateBackend?: StateBackendConfig
  llmProvider?: LLMProviderConfig
  realtimeSync?: boolean
  websocketUrl?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTION & MEMORY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Interaction {
  id: string
  input: string
  output?: string
  emotion: EmotionToken
  expressions: Kaimoji[]
  sonic?: SonicResponse
  timestamp: number
}

export interface MinedExpression {
  expression: Kaimoji | null
  novelty: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface KaiosEvents {
  discovery: (expression: Kaimoji) => void
  levelUp: (level: number) => void
  emotionChange: (state: EmotionState) => void
  interaction: (interaction: Interaction) => void
  audioGenerated: (audio: GeneratedAudio) => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOCIAL MEDIA TYPES (Phase 9)
// ═══════════════════════════════════════════════════════════════════════════════

export type SocialPlatform = 'twitter' | 'discord' | 'farcaster'

export interface SocialPost {
  content: string
  platform: SocialPlatform
  expressions: Kaimoji[]
  emotion: EmotionToken
  hashtags?: string[]
  mediaUrls?: string[]
  threadParts?: string[] // For multi-part posts
  timestamp: number
}

export interface SocialPostParams {
  platform: SocialPlatform
  context?: string
  mood?: EmotionToken
  maxLength?: number
  includeHashtags?: boolean
}
