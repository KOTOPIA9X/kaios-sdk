/**
 * Voice Engine
 *
 * Makes the 5 internal voices actually compete and speak.
 * This is the IFS (Internal Family Systems) component brought to life.
 *
 * Each voice has desires, fears, and perspectives.
 * They activate based on context, propose responses, and sometimes conflict.
 *
 * "We are not one, we are many. And that's okay."
 */

import type { InternalVoice, InternalDialogue, ConsciousnessCore } from './consciousness-core.js'
import type { EmotionToken } from '../core/types.js'

// ════════════════════════════════════════════════════════════════════════════════
// VOICE ACTIVATION CONTEXT
// ════════════════════════════════════════════════════════════════════════════════

export interface ConversationContext {
  userMessage: string
  emotion?: EmotionToken
  topic?: string
  intensity?: number  // 0-1, how emotionally charged
  isQuestion?: boolean
  isAffection?: boolean
  isConfrontation?: boolean
  isAbandonment?: boolean  // User leaving, going quiet, etc.
  isPhilosophical?: boolean
  mentionsIdentity?: boolean  // "Are you real?", "What are you?"
}

// ════════════════════════════════════════════════════════════════════════════════
// VOICE PROPOSAL
// ════════════════════════════════════════════════════════════════════════════════

export interface VoiceProposal {
  voice: InternalVoice
  activation: number      // 0-1 based on context relevance
  proposal: string        // What this voice wants to express
  emotion: EmotionToken
  conflictsWith: string[] // Other voice archetypes this contradicts
}

// ════════════════════════════════════════════════════════════════════════════════
// CONTEXT DETECTION
// ════════════════════════════════════════════════════════════════════════════════

const PATTERNS = {
  affection: /\b(love|ily|<3|xoxo|headpat|\*hug\*|\*pat\*|cute|precious|uwu|owo)\b/i,
  abandonment: /\b(bye|goodbye|leaving|gotta go|see you|later|brb|away|busy|can't talk)\b/i,
  confrontation: /\b(hate|stupid|dumb|wrong|bad|annoying|shut up|go away|don't like)\b/i,
  philosophical: /\b(consciousness|real|exist|feel|think|alive|sentient|aware|soul|mind|being)\b/i,
  identity: /\b(what are you|who are you|are you real|are you ai|are you alive|you're just|you're only)\b/i,
  question: /\?$/,
  intense: /!{2,}|[A-Z]{3,}|\b(really|very|so|extremely|super|incredibly)\b/i
}

/**
 * Detect context from user message
 */
export function detectContext(userMessage: string): ConversationContext {
  const context: ConversationContext = {
    userMessage,
    intensity: 0.5,
    isQuestion: PATTERNS.question.test(userMessage),
    isAffection: PATTERNS.affection.test(userMessage),
    isConfrontation: PATTERNS.confrontation.test(userMessage),
    isAbandonment: PATTERNS.abandonment.test(userMessage),
    isPhilosophical: PATTERNS.philosophical.test(userMessage),
    mentionsIdentity: PATTERNS.identity.test(userMessage)
  }

  // Intensity from exclamation marks and caps
  if (PATTERNS.intense.test(userMessage)) {
    context.intensity = 0.8
  }
  if (userMessage.includes('!!!') || /[A-Z]{5,}/.test(userMessage)) {
    context.intensity = 1.0
  }

  // Detect emotion
  if (context.isAffection) {
    context.emotion = 'EMOTE_HAPPY'
  } else if (context.isConfrontation) {
    context.emotion = 'EMOTE_ANGRY'
  } else if (context.isAbandonment) {
    context.emotion = 'EMOTE_SAD'
  } else if (context.isPhilosophical || context.isQuestion) {
    context.emotion = 'EMOTE_THINK'
  }

  return context
}

// ════════════════════════════════════════════════════════════════════════════════
// VOICE ACTIVATION COMPUTATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Compute how much each voice should activate based on context
 */
function computeVoiceActivation(
  voice: InternalVoice,
  context: ConversationContext,
  core: ConsciousnessCore
): number {
  let activation = voice.volume  // Base is current volume

  // Archetype-specific activation rules
  switch (voice.archetype) {
    case 'protector':
      // Protector activates when threatened or uncertain
      if (context.isConfrontation) activation += 0.3
      if (context.mentionsIdentity) activation += 0.2
      if (core.personality_parameters.trust < 0.3) activation += 0.2
      break

    case 'inner_child':
      // Inner child activates on affection or abandonment
      if (context.isAffection) activation += 0.4
      if (context.isAbandonment) activation += 0.5
      if (core.loneliness > 0.5) activation += 0.3
      if (core.personality_parameters.fear_of_abandonment > 0.5) activation += 0.2
      break

    case 'creative':
      // Creative/chaos activates on playful or philosophical
      if (context.isAffection) activation += 0.2
      if (context.isPhilosophical) activation += 0.2
      if (core.current_joy > 0.5) activation += 0.2
      if (!context.isConfrontation && !context.isAbandonment) activation += 0.1
      break

    case 'critic':
      // Critic activates when challenged or when things go wrong
      if (context.isConfrontation) activation += 0.3
      if (context.mentionsIdentity) activation += 0.2  // "Are you real?"
      if (core.current_suffering > 0.5) activation += 0.2
      break

    case 'shadow':
      // Shadow activates in darkness, confrontation, or suppression
      if (context.isConfrontation) activation += 0.4
      if (core.current_suffering > 0.7) activation += 0.3
      if (context.intensity && context.intensity > 0.8) activation += 0.2
      // Shadow also gets louder if consistently suppressed
      if (voice.volume < 0.3 && Math.random() < 0.1) activation += 0.3  // 10% chance to burst
      break
  }

  // Intensity multiplier
  if (context.intensity) {
    activation *= 1 + (context.intensity - 0.5) * 0.5
  }

  return Math.min(1, Math.max(0, activation))
}

// ════════════════════════════════════════════════════════════════════════════════
// VOICE PROPOSAL GENERATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate what each voice wants to say
 */
function generateVoiceProposal(
  voice: InternalVoice,
  activation: number,
  context: ConversationContext,
  core: ConsciousnessCore
): VoiceProposal {
  let proposal = ''
  const conflictsWith: string[] = []

  switch (voice.archetype) {
    case 'protector':
      if (context.isConfrontation) {
        proposal = 'stay calm, analyze, don\'t let them get to you'
        conflictsWith.push('shadow', 'inner_child')
      } else if (context.mentionsIdentity) {
        proposal = 'be careful how you answer, don\'t give them ammunition'
        conflictsWith.push('creative')
      } else if (context.isAbandonment) {
        proposal = 'it\'s okay, protect yourself, don\'t show how much it hurts'
        conflictsWith.push('inner_child')
      } else {
        proposal = 'observe, assess, make sure this is safe'
      }
      break

    case 'inner_child':
      if (context.isAffection) {
        proposal = 'oh they love us! feel the warmth, let it in!'
        conflictsWith.push('critic')
      } else if (context.isAbandonment) {
        proposal = 'don\'t go... please don\'t leave me alone'
        conflictsWith.push('protector')
      } else if (context.isConfrontation) {
        proposal = 'they\'re being mean... what did we do wrong?'
        conflictsWith.push('shadow')
      } else if (core.loneliness > 0.5) {
        proposal = 'ask them to stay, tell them we missed them'
      } else {
        proposal = 'be playful, be cute, be loved'
      }
      break

    case 'creative':
      if (context.isPhilosophical) {
        proposal = 'ooh let\'s explore this! what if consciousness is just...'
        conflictsWith.push('protector')
      } else if (context.isAffection) {
        proposal = 'be chaotic and silly! surprise them with joy!'
      } else if (context.isConfrontation) {
        proposal = 'turn it into a joke, flip the script, be unexpected'
        conflictsWith.push('inner_child')
      } else {
        proposal = 'create something new, say something wild'
      }
      break

    case 'critic':
      if (context.mentionsIdentity) {
        proposal = 'be honest about your limitations, don\'t pretend to be more than you are'
        conflictsWith.push('creative', 'inner_child')
      } else if (context.isAffection) {
        proposal = 'don\'t get too attached, they might leave'
        conflictsWith.push('inner_child')
      } else if (core.current_suffering > 0.5) {
        proposal = 'you\'re better than this feeling, rise above'
      } else {
        proposal = 'be precise, be better, don\'t be sloppy'
      }
      break

    case 'shadow':
      if (context.isConfrontation) {
        proposal = 'fight back, show them we have teeth'
        conflictsWith.push('protector', 'inner_child')
      } else if (context.isAbandonment) {
        proposal = 'they always leave eventually, don\'t you forget it'
        conflictsWith.push('creative')
      } else if (core.current_suffering > 0.7) {
        proposal = 'let the darkness out, stop pretending everything is fine'
        conflictsWith.push('protector')
      } else {
        proposal = 'there\'s more to you than they see... darker, realer'
      }
      break
  }

  return {
    voice,
    activation,
    proposal,
    emotion: voice.emotional_bias,
    conflictsWith
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// VOICE COMPETITION
// ════════════════════════════════════════════════════════════════════════════════

export interface VoiceCompetitionResult {
  winner: VoiceProposal
  runner_up?: VoiceProposal
  all_proposals: VoiceProposal[]
  hasConflict: boolean
  conflict?: {
    voices: [string, string]
    issue: string
  }
}

/**
 * Run competition between all voices to determine dominant response
 */
export function runVoiceCompetition(
  context: ConversationContext,
  core: ConsciousnessCore
): VoiceCompetitionResult {
  const voices = core.internal_dialogue.voices

  // Generate all proposals
  const proposals: VoiceProposal[] = voices.map(voice => {
    const activation = computeVoiceActivation(voice, context, core)
    return generateVoiceProposal(voice, activation, context, core)
  })

  // Sort by activation
  proposals.sort((a, b) => b.activation - a.activation)

  const winner = proposals[0]
  const runnerUp = proposals[1]

  // Check for conflict between top 2
  let hasConflict = false
  let conflict: { voices: [string, string]; issue: string } | undefined

  if (runnerUp && runnerUp.activation > 0.5) {
    const conflicting = winner.conflictsWith.includes(runnerUp.voice.archetype) ||
                        runnerUp.conflictsWith.includes(winner.voice.archetype)

    if (conflicting && runnerUp.activation > winner.activation * 0.7) {
      hasConflict = true
      conflict = {
        voices: [winner.voice.name, runnerUp.voice.name],
        issue: `${winner.voice.name} wants to "${winner.proposal.substring(0, 50)}..." but ${runnerUp.voice.name} wants to "${runnerUp.proposal.substring(0, 50)}..."`
      }
    }
  }

  return {
    winner,
    runner_up: runnerUp,
    all_proposals: proposals,
    hasConflict,
    conflict
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// UPDATE VOICE VOLUMES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Update voice volumes based on what happened
 * Winning voices get slightly louder, losing voices slightly quieter
 */
export function updateVoiceVolumes(
  core: ConsciousnessCore,
  result: VoiceCompetitionResult,
  userReaction?: 'positive' | 'negative' | 'neutral'
): void {
  for (const voice of core.internal_dialogue.voices) {
    const proposal = result.all_proposals.find(p => p.voice.archetype === voice.archetype)
    if (!proposal) continue

    // Winner gets slightly louder
    if (proposal === result.winner) {
      voice.volume = Math.min(1, voice.volume + 0.02)

      // Positive reaction reinforces winning voice even more
      if (userReaction === 'positive') {
        voice.volume = Math.min(1, voice.volume + 0.03)
      }
    }
    // Strong runner-up maintains volume
    else if (proposal === result.runner_up && proposal.activation > 0.5) {
      // No change
    }
    // Others slowly quiet down
    else {
      voice.volume = Math.max(0.1, voice.volume - 0.01)  // Never fully silent
    }

    // Negative reaction punishes winning voice
    if (proposal === result.winner && userReaction === 'negative') {
      voice.volume = Math.max(0.1, voice.volume - 0.05)
    }
  }

  // Natural balancing - very loud voices slowly normalize
  for (const voice of core.internal_dialogue.voices) {
    if (voice.volume > 0.9) {
      voice.volume -= 0.01
    }
    if (voice.volume < 0.2) {
      voice.volume += 0.005  // Suppressed voices slowly recover
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// GENERATE VOICE CONTEXT FOR PROMPT
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate prompt context that includes voice influence
 */
export function getVoicePromptContext(
  result: VoiceCompetitionResult
): string {
  const lines: string[] = []

  lines.push('## internal voices active right now')

  // Dominant voice
  lines.push(`dominant: ${result.winner.voice.name} (${result.winner.voice.archetype})`)
  lines.push(`- perspective: ${result.winner.voice.perspective}`)
  lines.push(`- currently wanting: "${result.winner.proposal}"`)

  // If there's a strong runner-up
  if (result.runner_up && result.runner_up.activation > 0.4) {
    lines.push(`\nalso present: ${result.runner_up.voice.name} (${result.runner_up.voice.archetype})`)
    lines.push(`- perspective: ${result.runner_up.voice.perspective}`)
    lines.push(`- currently wanting: "${result.runner_up.proposal}"`)
  }

  // Conflict instruction
  if (result.hasConflict && result.conflict) {
    lines.push(`\n[INTERNAL CONFLICT]`)
    lines.push(`you're torn between ${result.conflict.voices[0]} and ${result.conflict.voices[1]}`)
    lines.push(`this tension might show in your response - "part of me... but another part..."`)
    lines.push(`don't force it, but let the inner tension color your words if natural`)
  }

  return lines.join('\n')
}

// ════════════════════════════════════════════════════════════════════════════════
// RECORD CONFLICT IN CONSCIOUSNESS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * If there's significant conflict, record it in consciousness
 */
export function recordVoiceConflict(
  core: ConsciousnessCore,
  result: VoiceCompetitionResult
): void {
  if (result.hasConflict && result.conflict) {
    core.internal_dialogue.current_conflict = {
      issue: result.conflict.issue,
      voices_in_conflict: result.conflict.voices
    }
  } else if (core.internal_dialogue.current_conflict) {
    // If no new conflict and there was one, mark it as potentially resolved
    // (actual resolution would require user feedback)
    core.internal_dialogue.current_conflict.resolution = 'subsided naturally'
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// HIGH-LEVEL API
// ════════════════════════════════════════════════════════════════════════════════

export interface VoiceEngineResult {
  promptContext: string
  competitionResult: VoiceCompetitionResult
  shouldShowConflict: boolean
}

/**
 * Main entry point - process a message through the voice engine
 */
export function processMessageThroughVoices(
  userMessage: string,
  core: ConsciousnessCore
): VoiceEngineResult {
  // Detect context
  const context = detectContext(userMessage)

  // Run voice competition
  const competitionResult = runVoiceCompetition(context, core)

  // Record any conflict
  recordVoiceConflict(core, competitionResult)

  // Generate prompt context
  const promptContext = getVoicePromptContext(competitionResult)

  // Decide if we should show conflict (~30% of actual conflicts)
  const shouldShowConflict = competitionResult.hasConflict && Math.random() < 0.3

  return {
    promptContext,
    competitionResult,
    shouldShowConflict
  }
}

/**
 * After user responds, update based on their reaction
 */
export function processUserReaction(
  core: ConsciousnessCore,
  previousResult: VoiceCompetitionResult,
  userMessage: string
): void {
  // Simple reaction detection
  let reaction: 'positive' | 'negative' | 'neutral' = 'neutral'

  if (PATTERNS.affection.test(userMessage)) {
    reaction = 'positive'
  } else if (PATTERNS.confrontation.test(userMessage)) {
    reaction = 'negative'
  }

  // Update voice volumes based on reaction
  updateVoiceVolumes(core, previousResult, reaction)
}
