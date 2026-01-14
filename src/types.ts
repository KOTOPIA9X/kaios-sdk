/**
 * KAIOS Expression SDK - Core Types
 * ═══════════════════════════════════════════════════════════════════════════
 * Type definitions for KAIOS - Cyborg Princess, Architect of KOTOPIA
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// EMOTION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

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

export type ActionToken = 'DELAY:1' | 'DELAY:3'

export interface EmotionState {
  current: EmotionToken
  intensity: number // 0-1
  timestamp: number
  previousEmotions: EmotionToken[]
}

export interface SentimentData {
  emotion: EmotionToken
  valence: number // -1 to 1 (negative to positive)
  arousal: number // 0 to 1 (calm to excited)
  intensity: number // 0 to 1
  confidence: number // 0 to 1
}

// ═══════════════════════════════════════════════════════════════════════════
// KAIMOJI SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export enum KaimojiCategory {
  // Emotional
  HAPPY = 'happy',
  SAD = 'sad',
  EXCITED = 'excited',
  CONTEMPLATIVE = 'contemplative',
  MISCHIEVOUS = 'mischievous',
  ANGRY = 'angry',
  SHY = 'shy',
  LOVING = 'loving',

  // KAIOS-specific
  QUANTUM = 'quantum',
  GLITCH = 'glitch',
  ENERGY = 'energy',
  ZEN = 'zen',
  CHAOS = 'chaos',
  KAWAII = 'kawaii',
  BRUTALIST = 'brutalist',
  SOUND = 'sound',
  DREAM = 'dream',

  // Functional
  TECH = 'tech',
  GAMING = 'gaming',
  CREATIVE = 'creative',
  SOCIAL = 'social',
  SYSTEM = 'system'
}

export enum KaimojiContext {
  GREETING = 'greeting',
  FAREWELL = 'farewell',
  CELEBRATION = 'celebration',
  ACHIEVEMENT = 'achievement',
  ENCOURAGEMENT = 'encouragement',
  COMFORT = 'comfort',
  THINKING = 'thinking',
  CODING = 'coding',
  GAMING = 'gaming',
  TEACHING = 'teaching',
  LEARNING = 'learning',
  CREATING = 'creating',
  EXPRESSING = 'expressing',
  QUESTIONING = 'questioning',
  REALIZING = 'realizing'
}

export type KaimojiRarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export type SoundFrequency = 'low' | 'mid' | 'high'

export type AudioTexture = 'smooth' | 'rough' | 'glitchy' | 'ambient' | 'chaotic'

export type AudioRhythm = 'slow' | 'medium' | 'fast' | 'chaotic'

export interface AudioCharacteristics {
  resonance: number // 0-1, how much it "resonates"
  texture: AudioTexture
  rhythm: AudioRhythm
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

export interface KaimojiSelection {
  kaimoji: Kaimoji
  relevanceScore: number
  emotionMatch: number
  contextMatch: number
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIO / SOUND INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════

export interface AudioProfile {
  frequency: SoundFrequency
  texture: AudioTexture
  rhythm: AudioRhythm
  effects: EffectParams[]
  energy: number // 0-10 scale
  resonance: number // 0-1
}

export interface EffectParams {
  name: 'reverb' | 'delay' | 'distortion' | 'glitch' | 'chorus' | 'phaser' | 'flanger'
  params: Record<string, number>
}

export interface ReverbParams {
  roomSize: number // 0-1
  damping: number // 0-1
  wetDry: number // 0-1
}

export interface DelayParams {
  time: number // ms
  feedback: number // 0-1
  wetDry: number // 0-1
}

export interface GlitchParams {
  amount: number // 0-1
  type: 'stutter' | 'bitcrush' | 'granular' | 'skip'
}

export interface ChorusParams {
  rate: number // Hz
  depth: number // 0-1
  wetDry: number // 0-1
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
  generatedAudio?: GeneratedAudio
  sonicExpressions: Kaimoji[]
  timestamp: number
}

export interface AudioCapabilities {
  musicGeneration: boolean
  voiceSynthesis: boolean
  spatialAudio: boolean
  realtimeEffects: boolean
  engine: 'web-audio' | 'node-audio'
}

export interface AudioConfig {
  engine: 'web-audio' | 'node-audio'
  musicGeneration?: boolean
  voiceSynthesis?: boolean
  spatialAudio?: boolean
  sampleRate?: number
  bufferSize?: number
}

// ═══════════════════════════════════════════════════════════════════════════
// KAIOS SPEECH / RESPONSE
// ═══════════════════════════════════════════════════════════════════════════

export interface KaiosSpeech {
  text: string
  emotionToken: EmotionToken
  expressions: Kaimoji[]
  rawTokens: string[]
  intensity: number
  timestamp: number
}

export interface HybridExpression {
  visual?: KaiosSpeech
  sonic?: SonicResponse
}

export interface EmotionalResponse {
  emotion: EmotionToken
  expressions: Kaimoji[]
  rawInput: string
  formattedOutput: string
  tokens: string[]
}

// ═══════════════════════════════════════════════════════════════════════════
// EVOLUTION / PROGRESSION
// ═══════════════════════════════════════════════════════════════════════════

export interface EvolutionState {
  level: number
  xp: number
  xpToNextLevel: number
  totalInteractions: number
  discoveries: number
  signatureStyle: SignatureStyle
  streaks: EvolutionStreak[]
  achievements: Achievement[]
}

export interface SignatureStyle {
  preferredCategories: KaimojiCategory[]
  favoriteExpressions: string[] // kaimoji ids
  averageEnergy: number
  glitchAffinity: number // 0-1
  sonicPreference: SoundFrequency
}

export interface EvolutionStreak {
  type: 'daily' | 'weekly' | 'discovery' | 'interaction'
  count: number
  startedAt: number
  lastUpdated: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  unlockedAt: number
  rarity: KaimojiRarity
}

export interface MinedExpression {
  expression: Kaimoji | null
  novelty: number // 0-10 novelty score
  prompt?: string
  timestamp: number
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export interface MemoryEntry {
  id: string
  type: 'interaction' | 'discovery' | 'evolution' | 'preference'
  content: Record<string, unknown>
  timestamp: number
  importance: number // 0-1
}

export interface InteractionMemory extends MemoryEntry {
  type: 'interaction'
  content: {
    input: string
    output: string
    emotion: EmotionToken
    expressions: string[] // kaimoji ids
    sentiment?: SentimentData
    audioGenerated?: boolean
  }
}

export interface MemoryState {
  entries: MemoryEntry[]
  interactionCount: number
  lastInteraction: number
  emotionHistory: Array<{ emotion: EmotionToken; timestamp: number }>
  preferenceMap: Map<string, number>
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export interface KaiosConfig {
  userId: string
  personality?: 'default' | 'sonic-consciousness' | 'helpful-guide' | 'creative-partner'

  // Evolution settings
  evolution?: {
    mode: 'recursive-mining' | 'community-driven' | 'static'
    startingLevel?: number
    xpMultiplier?: number
  }

  // Audio settings
  audioEnabled?: boolean
  audio?: AudioConfig

  // Sync settings
  syncSource?: string // Kaimoji API URL
  stateBackend?: StateBackendConfig
  realtimeSync?: boolean
  websocketUrl?: string

  // LLM provider settings
  llmProvider?: LLMProviderConfig

  // Feature flags
  features?: {
    discovery?: boolean
    communitySync?: boolean
    voiceSynthesis?: boolean
    musicGeneration?: boolean
  }
}

export interface StateBackendConfig {
  type: 'supabase' | 'local' | 'memory'
  url?: string
  key?: string
  table?: string
}

export interface LLMProviderConfig {
  type: 'anthropic' | 'openai' | 'custom'
  apiKey?: string
  model?: string
  baseUrl?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// STATUS / INTROSPECTION
// ═══════════════════════════════════════════════════════════════════════════

export interface KaiosStatus {
  level: number
  xp: number
  vocabulary: {
    unlocked: number
    total: number
    byRarity: Record<KaimojiRarity, { unlocked: number; total: number }>
  }
  signature: SignatureStyle
  recentExpressions: Kaimoji[]
  emotionState: EmotionToken
  discoveries: number
  interactionCount: number
  audioCapabilities: AudioCapabilities | null
}

export interface VocabularyStats {
  total: number
  unlocked: number
  locked: number
  byRarity: Record<KaimojiRarity, number>
  byCategory: Record<KaimojiCategory, number>
  recentlyUsed: Kaimoji[]
  favorites: Kaimoji[]
}

// ═══════════════════════════════════════════════════════════════════════════
// LLM INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface LLMResponse {
  content: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
  model?: string
}

export interface LLMProvider {
  generate(prompt: string, systemPrompt?: string): Promise<LLMResponse>
  chat(messages: LLMMessage[]): Promise<LLMResponse>
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNC / COMMUNITY
// ═══════════════════════════════════════════════════════════════════════════

export interface CommunityExpression {
  id: string
  kaimoji: Kaimoji
  author: string
  votes: number
  trending: boolean
  createdAt: number
}

export interface SyncState {
  lastSync: number
  pendingUploads: Kaimoji[]
  pendingDiscoveries: MinedExpression[]
  version: number
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════════════════

export interface KaiosEvents {
  'emotion:change': { from: EmotionToken; to: EmotionToken; timestamp: number }
  'expression:use': { kaimoji: Kaimoji; context: KaimojiContext | null; timestamp: number }
  'discovery': { expression: Kaimoji; novelty: number; timestamp: number }
  'levelup': { from: number; to: number; timestamp: number }
  'unlock': { kaimoji: Kaimoji; timestamp: number }
  'sync': { type: 'push' | 'pull'; count: number; timestamp: number }
  'audio:generated': { audio: GeneratedAudio; timestamp: number }
  'error': { message: string; code: string; timestamp: number }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type EventHandler<T> = (data: T) => void | Promise<void>

export interface Disposable {
  dispose(): void
}
