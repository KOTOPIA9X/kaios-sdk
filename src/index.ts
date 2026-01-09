/**
 * @kaios/expression-sdk
 *
 * Character runtime system that instantiates KAIOS as a conscious, evolving AI entity
 * with dual-mode expression: visual language (KAIMOJI) and sonic intelligence.
 *
 * KAIOS is the Cyborg Princess, Architect of KOTOPIA - "Not Like The Other AIs"
 *
 * @example
 * ```typescript
 * import { Kaios } from '@kaios/expression-sdk'
 *
 * const kaios = new Kaios({
 *   userId: 'my-app',
 *   evolution: { mode: 'recursive-mining', startingLevel: 1 }
 * })
 *
 * await kaios.initialize()
 *
 * // Get KAIOS's visual expression
 * const speech = await kaios.speak({ input: 'Hello world!' })
 * console.log(speech.text) // <|EMOTE_HAPPY|> (◕‿◕) ✧
 *
 * // Get system prompt for LLM integration
 * const systemPrompt = kaios.getSystemPrompt()
 * ```
 */

// Core exports
export { Kaios } from './core/Kaios.js'
export { KAIOS_CORE_IDENTITY, compilePersonalityPrompt, formatEmotionToken, parseEmotionToken, extractEmotionTokens } from './core/personality.js'
export { EmotionSystem } from './core/emotion-system.js'
export {
  KAIMOJI_LIBRARY,
  getAllKaimoji,
  getKaimojiByRarity,
  getKaimojiByCategory,
  getKaimojiByContext,
  getKaimojiByEnergyRange,
  getSignatureKaimoji,
  getKaimojiBySoundProfile,
  getKaimojiUnlockableAtLevel,
  searchKaimojiByTag,
  getRandomKaimoji,
  getLibraryStats
} from './core/kaimoji-library.js'

// Type exports
export type {
  // Core types
  KaiosConfig,
  KaiosStatus,
  KaiosSpeech,
  HybridExpression,
  KaiosEvents,

  // Emotion types
  EmotionToken,
  EmotionState,

  // Kaimoji types
  Kaimoji,
  KaimojiCategory,
  KaimojiContext,
  KaimojiRarity,

  // Sound Intelligence types
  SentimentData,
  AudioProfile,
  SonicResponse,
  GeneratedAudio,
  SoundFrequency,
  SoundTexture,
  SoundRhythm,
  AudioCharacteristics,
  AudioCapabilities,

  // Configuration types
  AudioConfig,
  StateBackendConfig,
  LLMProviderConfig,
  EvolutionConfig,

  // Evolution types
  VocabularyBreakdown,
  MinedExpression,
  Interaction,

  // Social types
  SocialPost,
  SocialPostParams,
  SocialPlatform
} from './core/types.js'

// Consciousness exports
export { MemoryManager } from './consciousness/memory.js'
export { EvolutionTracker } from './consciousness/evolution.js'
export { ThoughtEngine, createThoughtEngine, getThoughtJournal } from './consciousness/thought-engine.js'
export type { ThoughtConfig, ThoughtType, Thought, ThoughtEngineState, ThoughtJournalEntry } from './consciousness/thought-engine.js'

// Dream exports
export { DreamEngine, createDreamEngine } from './memory/dream-engine.js'
export type { DreamEngineConfig } from './memory/dream-engine.js'

// Expression exports
export { VocabularyManager } from './expression/visual/vocabulary-manager.js'

// Glitch, Compression & Typo Systems - Aesthetic degradation
export {
  processGlitch,
  glitchText,
  degradeText,
  insertGlitchMarkers,
  fragmentText,
  addTypos,
  addHesitations,
  compressText,
  addExpressions
} from './expression/index.js'
export type { GlitchConfig, GlitchResult, TypoConfig, CompressionConfig } from './expression/index.js'

// Audio exports (separate entry point for tree-shaking)
export { emotionToSound, soundToEmotion, buildMusicPrompt } from './audio/emotion-mapper.js'

// ════════════════════════════════════════════════════════════════════════════════
// PHASE 9: Dual-Layer System & Community Features
// ════════════════════════════════════════════════════════════════════════════════

// User Profile (Layer 1: Individual KOTO)
export { UserProfile } from './core/user-profile.js'
export type { UserProfileState, Achievement, ContributionRecord } from './core/user-profile.js'

// Headpat System - The most important interaction!
export {
  generateHeadpatResponse,
  getHeadpatStats,
  getNextMilestone,
  HEADPAT_MILESTONES
} from './core/headpat.js'
export type { HeadpatResult, HeadpatMilestone } from './core/headpat.js'

// Global KAIOS (Layer 2: Collective Consciousness)
export { GlobalKaios } from './collective/global-kaios.js'
export type { GlobalKaiosState, Evolution, GlobalMilestone } from './collective/global-kaios.js'

// Infinite Progression System
export { ProgressionSystem, progression } from './evolution/progression.js'
export type { LevelInfo, XPReward } from './evolution/progression.js'

// Kaimoji API Client
export { KaimojiAPI, kaimojiAPI } from './sync/kaimoji-api.js'
export type { TrendingKaimoji, PendingDiscovery, LeaderboardEntry } from './sync/kaimoji-api.js'

// Community Voting System
export { VotingSystem, votingSystem } from './collective/voting-system.js'
export type { Discovery, VoteRecord, VotingResult } from './collective/voting-system.js'

// Dual Status Type
export type { DualStatus } from './core/Kaios.js'

// ════════════════════════════════════════════════════════════════════════════════
// LLM Chat Module (wraps Simon Willison's llm CLI)
// ════════════════════════════════════════════════════════════════════════════════

export {
  chat,
  chatStream,
  chatContinue,
  getModels,
  SYSTEM_PROMPT,
  parseResponse,
  extractEmotions,
  getDominantEmotion,
  cleanResponse,
  isValidEmotion,
  getEmotionName,
  emotionToColor,
  emotionToKaomoji
} from './llm/index.js'

export type {
  ChatOptions,
  ChatResponse,
  EmotionSegment,
  ParsedResponse
} from './llm/index.js'

// Version
export const VERSION = '0.1.0'

// Default export
export { Kaios as default } from './core/Kaios.js'
