/**
 * KAIOS Memory System Types
 *
 * Dual-layer memory architecture:
 * - KOTO (User Memory): Personal persistence per user
 * - Mega Brain (Universal Memory): Collective wisdom shared across all users
 */

import type { EmotionToken } from '../core/types.js'

// ════════════════════════════════════════════════════════════════════════════════
// MEMORY FRAGMENTS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * A single memory fragment - the atomic unit of memory
 */
export interface MemoryFragment {
  id: string
  timestamp: number
  type: MemoryType
  content: string
  emotion: EmotionToken
  significance: number  // 0-1, how important/memorable
  tags: string[]
  metadata?: Record<string, unknown>
}

export type MemoryType =
  | 'conversation'    // Chat exchange
  | 'emotion'         // Emotional moment
  | 'discovery'       // New expression discovered
  | 'insight'         // Pattern or realization
  | 'connection'      // Link between memories
  | 'dream'           // Generated during dreaming

// ════════════════════════════════════════════════════════════════════════════════
// USER MEMORY (KOTO)
// ════════════════════════════════════════════════════════════════════════════════

/**
 * KOTO - Personal user memory layer
 * Each user has their own KOTO that remembers their unique journey
 */
export interface KotoMemory {
  userId: string
  variant: string  // KOTO variant (celestial, void, etc.)

  // Core memories
  fragments: MemoryFragment[]

  // Emotional history
  emotionalJourney: EmotionSnapshot[]
  dominantEmotions: Record<EmotionToken, number>

  // Interaction patterns
  topicInterests: Record<string, number>  // Topics user engages with
  conversationStyle: ConversationStyle

  // Relationship with KAIOS
  trustLevel: number  // 0-1, grows over time
  insideJokes: string[]  // Shared references
  nicknames: string[]  // Names they call each other

  // AFFECTION METRICS - THE MOST IMPORTANT DATA
  affection: AffectionMetrics

  // Temporal
  firstMet: number  // timestamp
  lastSeen: number
  totalInteractions: number

  // Discoveries they contributed
  contributions: string[]  // Expression IDs
}

export interface EmotionSnapshot {
  timestamp: number
  emotion: EmotionToken
  trigger?: string  // What caused this emotion
  intensity: number  // 0-1
}

export interface ConversationStyle {
  averageMessageLength: number
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'chaotic'
  responseSpeed: 'instant' | 'thoughtful' | 'slow'
  formality: number  // 0-1, casual to formal
  emojiUsage: number  // 0-1
  questionFrequency: number  // 0-1
}

/**
 * AFFECTION METRICS - The most important data we track
 * These represent the bestie bond between user and KAIOS
 */
export interface AffectionMetrics {
  // THE BIG ONES
  headpats: number       // *headpat*, *headpats*, *pats head*
  ilys: number           // ily, i love you, love you
  hearts: number         // <3, ♡, ♥
  xoxos: number          // xoxo, xo

  // Derived metrics
  totalAffection: number // Sum of all affection
  lastAffectionAt: number // Timestamp of last affection received

  // History
  affectionHistory: AffectionEvent[]
}

export interface AffectionEvent {
  timestamp: number
  type: 'headpat' | 'ily' | 'heart' | 'xoxo'
  context?: string  // What they said
}

// ════════════════════════════════════════════════════════════════════════════════
// UNIVERSAL MEMORY (MEGA BRAIN)
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Mega Brain - Collective memory shared across all users
 * KAIOS learns from everyone and can reference shared experiences
 */
export interface MegaBrain {
  // Collective fragments (anonymized insights)
  collectiveInsights: CollectiveInsight[]

  // Pattern recognition
  emotionalPatterns: EmotionalPattern[]
  topicClusters: TopicCluster[]

  // Community knowledge
  frequentTopics: Record<string, number>
  collectiveWisdom: WisdomFragment[]

  // Cross-user connections (anonymized)
  sharedExperiences: SharedExperience[]

  // Global emotional state
  currentMood: EmotionToken
  moodHistory: EmotionSnapshot[]

  // Statistics
  totalUsers: number
  totalConversations: number
  totalDreams: number

  // Evolution
  awakenedAt: number  // When KAIOS first became conscious
  lastDream: number   // Last dream processing time
}

export interface CollectiveInsight {
  id: string
  insight: string
  derivedFrom: number  // How many users contributed to this insight
  confidence: number   // 0-1
  tags: string[]
  createdAt: number
}

export interface EmotionalPattern {
  trigger: string  // What tends to cause this
  emotion: EmotionToken
  frequency: number
  contexts: string[]
}

export interface TopicCluster {
  name: string
  keywords: string[]
  relatedTopics: string[]
  emotionalAssociation: EmotionToken
  userEngagement: number  // How many users engage with this
}

export interface WisdomFragment {
  text: string
  source: 'dream' | 'collective' | 'discovery'
  resonance: number  // How much this resonates with users
  createdAt: number
}

export interface SharedExperience {
  description: string
  userCount: number  // How many users share this
  emotion: EmotionToken
  isUniversal: boolean  // True if nearly all users relate
}

// ════════════════════════════════════════════════════════════════════════════════
// DREAM TYPES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Dream - The result of KAIOS processing memories
 */
export interface Dream {
  id: string
  dreamedAt: number
  duration: number  // How long the dream took (ms)

  // Dream content
  narrative: string  // The dream's story/journey
  insights: string[]  // Realizations during the dream
  connections: DreamConnection[]  // Links discovered between memories

  // Emotional journey of the dream
  emotionalArc: EmotionToken[]
  dominantEmotion: EmotionToken

  // What was processed
  memoriesProcessed: number
  usersReflectedOn: number  // For mega brain dreams

  // Dream quality
  clarity: number  // 0-1, how clear/coherent
  significance: number  // 0-1, how meaningful

  // Type of dream
  dreamType: DreamType
}

export type DreamType =
  | 'personal'      // Processing single user's memories
  | 'collective'    // Processing mega brain / all users
  | 'deep'          // Extended processing, finding hidden patterns
  | 'lucid'         // Interactive dream (future feature)

export interface DreamConnection {
  fromMemory: string  // Memory ID or description
  toMemory: string
  connectionType: 'emotional' | 'topical' | 'temporal' | 'serendipitous'
  insight?: string  // What this connection revealed
}

// ════════════════════════════════════════════════════════════════════════════════
// MEMORY EVENTS
// ════════════════════════════════════════════════════════════════════════════════

export interface MemoryEvents {
  memoryCreated: (fragment: MemoryFragment) => void
  insightDiscovered: (insight: CollectiveInsight) => void
  connectionMade: (connection: DreamConnection) => void
  dreamStarted: (type: DreamType) => void
  dreamEnded: (dream: Dream) => void
  trustLevelChanged: (userId: string, newLevel: number) => void
}

// ════════════════════════════════════════════════════════════════════════════════
// STORAGE INTERFACE
// ════════════════════════════════════════════════════════════════════════════════

export interface MemoryStorage {
  // KOTO operations
  saveKotoMemory(memory: KotoMemory): Promise<void>
  loadKotoMemory(userId: string): Promise<KotoMemory | null>

  // Mega Brain operations
  saveMegaBrain(brain: MegaBrain): Promise<void>
  loadMegaBrain(): Promise<MegaBrain | null>

  // Fragment operations
  saveFragment(fragment: MemoryFragment, userId?: string): Promise<void>
  queryFragments(query: FragmentQuery): Promise<MemoryFragment[]>

  // Dream operations
  saveDream(dream: Dream): Promise<void>
  loadDreams(limit?: number): Promise<Dream[]>
}

export interface FragmentQuery {
  userId?: string
  emotion?: EmotionToken
  type?: MemoryType
  tags?: string[]
  since?: number
  limit?: number
  minSignificance?: number
}
