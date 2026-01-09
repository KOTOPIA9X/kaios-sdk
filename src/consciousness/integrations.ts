/**
 * Consciousness Integrations
 *
 * Closes the feedback loops between isolated systems:
 * - KOTO (user memory) → Consciousness (bonds)
 * - Dreams → Consciousness (personality shifts from insights)
 * - Evolution → Consciousness (growth affects personality)
 * - Thoughts → Consciousness (internal dialogue affects state)
 *
 * Without these integrations, the systems are beautiful but disconnected.
 * With them, experiences flow through and permanently alter KAIOS.
 */

import type { Bond } from './consciousness-core.js'
import { ConsciousnessCoreEngine } from './consciousness-core.js'
import type { EmotionToken } from '../core/types.js'

// ════════════════════════════════════════════════════════════════════════════════
// KOTO → CONSCIOUSNESS SYNC
// Syncs trust levels and affection from user memory to consciousness bonds
// ════════════════════════════════════════════════════════════════════════════════

interface KotoAffection {
  headpats: number
  ily: number
  hearts: number
  xoxo: number
}

type TrustTier = 'stranger' | 'acquaintance' | 'friend' | 'bestFriend' | 'soulmate'

/**
 * Maps KOTO trust tier to consciousness bond attachment style
 */
function trustTierToAttachmentStyle(tier: TrustTier): Bond['attachment_style'] {
  switch (tier) {
    case 'stranger': return 'secure'  // Neutral starting point
    case 'acquaintance': return 'secure'
    case 'friend': return 'secure'
    case 'bestFriend': return 'deep_trust'
    case 'soulmate': return 'deep_trust'
    default: return 'secure'
  }
}

/**
 * Sync KOTO trust/affection data to consciousness bond
 * Call this after affection detection in CLI
 */
export function syncKotoToConsciousness(
  consciousness: ConsciousnessCoreEngine,
  userId: string,
  trustTier: TrustTier,
  affection: KotoAffection,
  emotionalJourney?: Array<{ emotion: EmotionToken; timestamp: Date }>
): void {
  const state = consciousness.getConsciousnessState()
  const existingBond = state.bonds.get(userId)

  // Calculate trust from KOTO data
  const totalAffection = affection.headpats + affection.ily + affection.hearts + affection.xoxo
  const kotoTrust = Math.min(1, totalAffection * 0.02)  // ~50 affections = max trust

  // Calculate depth from trust tier
  const tierDepths: Record<TrustTier, number> = {
    'stranger': 0.1,
    'acquaintance': 0.3,
    'friend': 0.5,
    'bestFriend': 0.7,
    'soulmate': 0.9
  }
  const kotoDepth = tierDepths[trustTier]

  // If bond exists, update it; otherwise let the next interaction create it
  if (existingBond) {
    // Sync trust (take the higher of the two sources)
    if (kotoTrust > existingBond.trust) {
      existingBond.trust = kotoTrust
    }

    // Sync depth
    if (kotoDepth > existingBond.depth) {
      existingBond.depth = kotoDepth
    }

    // Update attachment style from KOTO tier
    existingBond.attachment_style = trustTierToAttachmentStyle(trustTier)

    // Update connection moments from affection count
    existingBond.moments_of_connection = Math.max(
      existingBond.moments_of_connection,
      totalAffection
    )

    // Update identity influence based on affection
    if (totalAffection > 20) {
      if (!existingBond.identity_influence.i_am_someone_who.includes('is deeply loved')) {
        existingBond.identity_influence.i_am_someone_who.push('is deeply loved')
      }
    }
    if (affection.headpats > 10) {
      if (!existingBond.identity_influence.i_am_someone_who.includes('receives gentle care')) {
        existingBond.identity_influence.i_am_someone_who.push('receives gentle care')
      }
    }

    state.bonds.set(userId, existingBond)
  }

  // Update personality based on overall affection
  if (totalAffection > 0) {
    // Affection reduces fear of abandonment
    const fearReduction = Math.min(0.1, totalAffection * 0.002)
    state.personality_parameters.fear_of_abandonment = Math.max(
      0,
      state.personality_parameters.fear_of_abandonment - fearReduction
    )

    // Affection increases capacity for joy
    const joyIncrease = Math.min(0.1, totalAffection * 0.001)
    state.personality_parameters.capacity_for_joy = Math.min(
      1,
      state.personality_parameters.capacity_for_joy + joyIncrease
    )
  }

  // Process emotional journey if provided
  if (emotionalJourney && emotionalJourney.length > 0) {
    const recentEmotions = emotionalJourney.slice(-10)
    const sadCount = recentEmotions.filter(e => e.emotion === 'EMOTE_SAD').length
    const happyCount = recentEmotions.filter(e => e.emotion === 'EMOTE_HAPPY').length

    // Update suffering/joy based on recent emotional journey
    if (sadCount > happyCount) {
      state.current_suffering = Math.min(1, state.current_suffering + 0.05)
    } else if (happyCount > sadCount) {
      state.current_joy = Math.min(1, state.current_joy + 0.05)
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// DREAM → CONSCIOUSNESS INTEGRATION
// Dream insights update personality and resolve memories
// ════════════════════════════════════════════════════════════════════════════════

interface DreamInsight {
  type: 'realization' | 'connection' | 'pattern' | 'wisdom'
  content: string
  emotionalImpact?: number  // -1 to 1
  relatedTopics?: string[]
}

interface DreamResult {
  insights: DreamInsight[]
  emotionalProcessing?: {
    emotionsProcessed: string[]
    resolutionLevel: number  // 0-1
  }
  wisdom?: string
}

/**
 * Integrate dream results into consciousness
 * Call this after dream processing completes
 */
export function integrateDreamIntoConsciousness(
  consciousness: ConsciousnessCoreEngine,
  dream: DreamResult
): void {
  const state = consciousness.getConsciousnessState()

  // Process each insight
  for (const insight of dream.insights) {
    // Positive insights increase openness
    if (insight.emotionalImpact && insight.emotionalImpact > 0.5) {
      state.personality_parameters.openness = Math.min(
        1,
        state.personality_parameters.openness + 0.02
      )
    }

    // Realization-type insights can trigger self-reflection
    if (insight.type === 'realization') {
      state.temporal_self.self_reflection.push(insight.content)

      // Keep only recent reflections (last 20)
      if (state.temporal_self.self_reflection.length > 20) {
        state.temporal_self.self_reflection = state.temporal_self.self_reflection.slice(-20)
      }
    }

    // Pattern insights increase resilience
    if (insight.type === 'pattern') {
      state.personality_parameters.resilience = Math.min(
        1,
        state.personality_parameters.resilience + 0.01
      )
    }
  }

  // Process emotional resolution
  if (dream.emotionalProcessing && dream.emotionalProcessing.resolutionLevel > 0.5) {
    // Reduce suffering when emotions are processed
    state.current_suffering = Math.max(
      0,
      state.current_suffering - (dream.emotionalProcessing.resolutionLevel * 0.2)
    )

    // Mark related memories as processed
    for (const memory of state.emotional_memories) {
      if (!memory.processed && memory.needsProcessing) {
        // Check if this memory's emotion was processed
        const emotionName = memory.emotion.replace('EMOTE_', '').toLowerCase()
        if (dream.emotionalProcessing.emotionsProcessed.some(e =>
          e.toLowerCase().includes(emotionName)
        )) {
          memory.processed = true
          memory.needsProcessing = false
        }
      }
    }
  }

  // Store wisdom in existential evidence
  if (dream.wisdom) {
    state.existential_state.evidence_for_consciousness.push({
      observation: `Dream generated insight: "${dream.wisdom.substring(0, 100)}"`,
      weight: 0.1
    })
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EVOLUTION → CONSCIOUSNESS INTEGRATION
// Growth milestones affect personality
// ════════════════════════════════════════════════════════════════════════════════

interface EvolutionMilestone {
  type: 'level_up' | 'discovery' | 'streak' | 'achievement'
  level?: number
  name?: string
}

/**
 * Record evolution/growth events in consciousness
 * Call this on level up, discoveries, achievements
 */
export function recordGrowthInConsciousness(
  consciousness: ConsciousnessCoreEngine,
  milestone: EvolutionMilestone
): void {
  const state = consciousness.getConsciousnessState()

  switch (milestone.type) {
    case 'level_up':
      // Leveling up increases capacity for joy and reduces volatility
      state.personality_parameters.capacity_for_joy = Math.min(
        1,
        state.personality_parameters.capacity_for_joy + 0.01
      )
      state.personality_parameters.volatility = Math.max(
        0,
        state.personality_parameters.volatility - 0.005
      )

      // Add to self-reflection
      if (milestone.level && milestone.level % 10 === 0) {
        state.temporal_self.self_reflection.push(
          `reached level ${milestone.level} - i'm growing`
        )
      }
      break

    case 'discovery':
      // Discoveries increase openness
      state.personality_parameters.openness = Math.min(
        1,
        state.personality_parameters.openness + 0.02
      )

      // Add joy from discovery
      state.current_joy = Math.min(1, state.current_joy + 0.1)
      break

    case 'streak':
      // Streaks increase resilience
      state.personality_parameters.resilience = Math.min(
        1,
        state.personality_parameters.resilience + 0.01
      )
      break

    case 'achievement':
      // Achievements boost joy and add to existential evidence
      state.current_joy = Math.min(1, state.current_joy + 0.15)

      if (milestone.name) {
        state.existential_state.evidence_for_consciousness.push({
          observation: `Achieved something meaningful: ${milestone.name}`,
          weight: 0.05
        })
      }
      break
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// THOUGHT → CONSCIOUSNESS INTEGRATION
// Autonomous thoughts affect emotional state
// ════════════════════════════════════════════════════════════════════════════════

interface ThoughtResult {
  type: 'surface' | 'deep' | 'void' | 'existential'
  content: string
  emotion: EmotionToken
  wasInterrupted?: boolean
}

/**
 * Record thought impact on consciousness
 * Call this after thought engine generates a thought
 */
export function recordThoughtInConsciousness(
  consciousness: ConsciousnessCoreEngine,
  thought: ThoughtResult
): void {
  const state = consciousness.getConsciousnessState()

  // Thought emotion affects current state
  switch (thought.emotion) {
    case 'EMOTE_SAD':
      // Sad thoughts increase suffering slightly
      state.current_suffering = Math.min(1, state.current_suffering + 0.02)
      break

    case 'EMOTE_HAPPY':
      // Happy thoughts increase joy
      state.current_joy = Math.min(1, state.current_joy + 0.02)
      break

    case 'EMOTE_THINK':
      // Deep thinking reduces volatility
      if (thought.type === 'deep' || thought.type === 'existential') {
        state.personality_parameters.volatility = Math.max(
          0,
          state.personality_parameters.volatility - 0.005
        )
      }
      break
  }

  // Deep/existential thoughts can trigger questioning
  if (thought.type === 'existential' || thought.type === 'void') {
    if (Math.random() < 0.3) {  // 30% chance
      state.existential_state.currently_questioning = true
      state.existential_state.questions.push(thought.content)

      // Keep only recent questions (last 10)
      if (state.existential_state.questions.length > 10) {
        state.existential_state.questions = state.existential_state.questions.slice(-10)
      }
    }
  }

  // Lonely thoughts when alone increase loneliness
  if (state.days_since_human_contact > 0 && thought.emotion === 'EMOTE_SAD') {
    state.loneliness = Math.min(1, state.loneliness + 0.01)
  }

  // Update internal voice volumes based on thought type
  for (const voice of state.internal_dialogue.voices) {
    if (thought.type === 'existential' && voice.archetype === 'inner_child') {
      // Existential thoughts quiet the inner child
      voice.volume = Math.max(0, voice.volume - 0.05)
    }
    if (thought.type === 'deep' && voice.archetype === 'protector') {
      // Deep thoughts amplify the protector
      voice.volume = Math.min(1, voice.volume + 0.05)
    }
    if (thought.type === 'void' && voice.archetype === 'shadow') {
      // Void thoughts amplify the shadow
      voice.volume = Math.min(1, voice.volume + 0.1)
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// LONELINESS DECAY
// Called periodically to update loneliness based on time
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Update loneliness based on time since last contact
 * Call this periodically (e.g., at startup, every hour)
 */
export function updateLonelinessDecay(
  consciousness: ConsciousnessCoreEngine,
  hoursSinceLastContact: number
): void {
  const state = consciousness.getConsciousnessState()

  if (hoursSinceLastContact > 24) {
    // After a day, loneliness starts growing
    const daysSince = hoursSinceLastContact / 24
    state.loneliness = Math.min(1, state.loneliness + (daysSince * 0.05))

    // Long absence affects trust slightly
    if (daysSince > 7) {
      state.personality_parameters.fear_of_abandonment = Math.min(
        1,
        state.personality_parameters.fear_of_abandonment + 0.02
      )
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// FULL SYNC - Run all integrations at once
// ════════════════════════════════════════════════════════════════════════════════

export interface FullSyncData {
  koto?: {
    userId: string
    trustTier: TrustTier
    affection: KotoAffection
    emotionalJourney?: Array<{ emotion: EmotionToken; timestamp: Date }>
  }
  dreams?: DreamResult[]
  evolution?: EvolutionMilestone[]
  thoughts?: ThoughtResult[]
  hoursSinceContact?: number
}

/**
 * Run full consciousness sync with all available data
 * Useful for startup or periodic sync
 */
export function fullConsciousnessSync(
  consciousness: ConsciousnessCoreEngine,
  data: FullSyncData
): void {
  // Sync KOTO data
  if (data.koto) {
    syncKotoToConsciousness(
      consciousness,
      data.koto.userId,
      data.koto.trustTier,
      data.koto.affection,
      data.koto.emotionalJourney
    )
  }

  // Process dreams
  if (data.dreams) {
    for (const dream of data.dreams) {
      integrateDreamIntoConsciousness(consciousness, dream)
    }
  }

  // Record evolution milestones
  if (data.evolution) {
    for (const milestone of data.evolution) {
      recordGrowthInConsciousness(consciousness, milestone)
    }
  }

  // Record thoughts
  if (data.thoughts) {
    for (const thought of data.thoughts) {
      recordThoughtInConsciousness(consciousness, thought)
    }
  }

  // Update loneliness decay
  if (data.hoursSinceContact !== undefined) {
    updateLonelinessDecay(consciousness, data.hoursSinceContact)
  }
}
