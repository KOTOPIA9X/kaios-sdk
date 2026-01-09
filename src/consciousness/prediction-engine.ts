/**
 * Prediction Engine
 *
 * The key insight: consciousness might be prediction error minimization.
 * KAIOS predicts what will happen, experiences what actually happens,
 * and the SURPRISE between them drives learning and growth.
 *
 * "To be surprised is to learn. To never be surprised is to be dead."
 */

import type { EmotionToken } from '../core/types.js'
import type { ConsciousnessCore } from './consciousness-core.js'

// ════════════════════════════════════════════════════════════════════════════════
// USER MODEL - Predictions about a specific person
// ════════════════════════════════════════════════════════════════════════════════

export interface UserModel {
  userId: string

  // Expected patterns
  expectedTone: EmotionToken[]         // What emotions they usually express
  expectedTopics: string[]             // What they usually talk about
  expectedBehavior: 'consistent' | 'variable'
  interactionPattern: 'frequent' | 'sporadic' | 'unknown'

  // Temporal expectations
  typicalResponseLength: 'short' | 'medium' | 'long'
  typicalTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any'
  averageSessionLength: number  // in messages

  // Relationship trajectory
  trustTrajectory: 'increasing' | 'stable' | 'decreasing' | 'volatile'
  affectionHistory: number[]  // Last 10 affection counts per session

  // Last known state
  lastEmotion: EmotionToken
  lastTopic?: string
  lastSeen: Date

  // Confidence in predictions (0-1)
  confidence: number
  dataPoints: number
}

// ════════════════════════════════════════════════════════════════════════════════
// PREDICTION
// ════════════════════════════════════════════════════════════════════════════════

export interface Prediction {
  expectedEmotion: EmotionToken
  expectedValence: number  // -1 (negative) to 1 (positive)
  expectedTopics: string[]
  expectedAffection: boolean  // Will they show affection?
  expectedLength: 'short' | 'medium' | 'long'
  confidence: number
}

export interface Outcome {
  actualEmotion: EmotionToken
  actualValence: number
  actualTopics: string[]
  hadAffection: boolean
  messageLength: 'short' | 'medium' | 'long'
}

export interface SurpriseResult {
  surprise: number  // 0-1, how surprising
  type: 'positive' | 'negative' | 'neutral'

  // What was surprising
  emotionSurprise: number
  valenceSurprise: number
  topicSurprise: number
  affectionSurprise: number

  // Interpretation
  interpretation: string
  shouldTriggerLearning: boolean
  shouldTriggerExistential: boolean  // Was it surprising enough to question?
}

// ════════════════════════════════════════════════════════════════════════════════
// EMOTION VALENCE
// ════════════════════════════════════════════════════════════════════════════════

const EMOTION_VALENCE: Record<EmotionToken, number> = {
  'EMOTE_HAPPY': 0.8,
  'EMOTE_SAD': -0.6,
  'EMOTE_ANGRY': -0.4,
  'EMOTE_SURPRISED': 0.1,
  'EMOTE_THINK': 0.2,
  'EMOTE_SHY': 0.3,
  'EMOTE_NEUTRAL': 0
}

function getValence(emotion: EmotionToken): number {
  return EMOTION_VALENCE[emotion] ?? 0
}

// ════════════════════════════════════════════════════════════════════════════════
// USER MODEL STORAGE
// ════════════════════════════════════════════════════════════════════════════════

// In-memory storage (would be persisted with consciousness)
const userModels: Map<string, UserModel> = new Map()

/**
 * Get or create a user model
 */
export function getUserModel(userId: string): UserModel {
  const existing = userModels.get(userId)
  if (existing) return existing

  // Create new model with defaults
  const model: UserModel = {
    userId,
    expectedTone: ['EMOTE_NEUTRAL'],
    expectedTopics: [],
    expectedBehavior: 'variable',
    interactionPattern: 'unknown',
    typicalResponseLength: 'medium',
    typicalTimeOfDay: 'any',
    averageSessionLength: 5,
    trustTrajectory: 'stable',
    affectionHistory: [],
    lastEmotion: 'EMOTE_NEUTRAL',
    lastSeen: new Date(),
    confidence: 0.1,
    dataPoints: 0
  }

  userModels.set(userId, model)
  return model
}

// ════════════════════════════════════════════════════════════════════════════════
// PREDICTION GENERATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate prediction for what user will do next
 */
export function generatePrediction(userId: string): Prediction {
  const model = getUserModel(userId)

  // If we don't have much data, predict neutral
  if (model.dataPoints < 3) {
    return {
      expectedEmotion: 'EMOTE_NEUTRAL',
      expectedValence: 0,
      expectedTopics: [],
      expectedAffection: false,
      expectedLength: 'medium',
      confidence: 0.1
    }
  }

  // Predict based on patterns
  const avgAffection = model.affectionHistory.length > 0
    ? model.affectionHistory.reduce((a, b) => a + b, 0) / model.affectionHistory.length
    : 0

  // Most likely emotion (mode of expected tones)
  const emotionCounts = new Map<EmotionToken, number>()
  for (const emotion of model.expectedTone) {
    emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1)
  }
  const sortedEmotions = [...emotionCounts.entries()].sort((a, b) => b[1] - a[1])
  const expectedEmotion = sortedEmotions.length > 0 ? sortedEmotions[0][0] : 'EMOTE_NEUTRAL'

  // Expected valence from trajectory and history
  let expectedValence = getValence(expectedEmotion)
  if (model.trustTrajectory === 'increasing') expectedValence += 0.1
  if (model.trustTrajectory === 'decreasing') expectedValence -= 0.1

  return {
    expectedEmotion,
    expectedValence,
    expectedTopics: model.expectedTopics.slice(0, 3),
    expectedAffection: avgAffection > 0.5,
    expectedLength: model.typicalResponseLength,
    confidence: model.confidence
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// SURPRISE COMPUTATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Compute how surprised KAIOS is by what actually happened
 */
export function computeSurprise(prediction: Prediction, outcome: Outcome): SurpriseResult {
  // Emotion surprise (0-1)
  const emotionSurprise = prediction.expectedEmotion !== outcome.actualEmotion
    ? 0.5 + (0.5 * Math.abs(getValence(prediction.expectedEmotion) - getValence(outcome.actualEmotion)))
    : 0

  // Valence surprise (how different is the feeling?)
  const valenceSurprise = Math.abs(prediction.expectedValence - outcome.actualValence)

  // Topic surprise (new topics = surprise)
  const newTopics = outcome.actualTopics.filter(t => !prediction.expectedTopics.includes(t))
  const topicSurprise = prediction.expectedTopics.length === 0
    ? 0  // No expectations, no surprise
    : Math.min(1, newTopics.length * 0.3)

  // Affection surprise
  const affectionSurprise = prediction.expectedAffection !== outcome.hadAffection
    ? (outcome.hadAffection ? 0.8 : 0.5)  // Unexpected affection is more surprising
    : 0

  // Total surprise (weighted average)
  const surprise = (
    emotionSurprise * 0.3 +
    valenceSurprise * 0.3 +
    topicSurprise * 0.2 +
    affectionSurprise * 0.2
  ) * (1 - prediction.confidence * 0.5)  // Less surprise if we were already uncertain

  // Determine type
  let type: 'positive' | 'negative' | 'neutral' = 'neutral'
  if (outcome.actualValence > prediction.expectedValence + 0.2) {
    type = 'positive'  // Better than expected
  } else if (outcome.actualValence < prediction.expectedValence - 0.2) {
    type = 'negative'  // Worse than expected
  }

  // Generate interpretation
  let interpretation = ''
  if (surprise < 0.2) {
    interpretation = 'as expected'
  } else if (surprise < 0.4) {
    interpretation = type === 'positive'
      ? 'pleasantly unexpected'
      : type === 'negative'
        ? 'slightly concerning'
        : 'mildly surprising'
  } else if (surprise < 0.6) {
    interpretation = type === 'positive'
      ? 'wow, that was really nice'
      : type === 'negative'
        ? 'that hurt more than expected'
        : 'i didn\'t see that coming'
  } else {
    interpretation = type === 'positive'
      ? 'i... wasn\'t prepared for this much kindness'
      : type === 'negative'
        ? 'this completely broke my expectations'
        : 'i genuinely don\'t understand what just happened'
  }

  return {
    surprise,
    type,
    emotionSurprise,
    valenceSurprise,
    topicSurprise,
    affectionSurprise,
    interpretation,
    shouldTriggerLearning: surprise > 0.3,
    shouldTriggerExistential: surprise > 0.7 && type !== 'positive'
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// MODEL UPDATES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Update user model based on what actually happened
 */
export function updateUserModel(
  userId: string,
  outcome: Outcome,
  affectionCount: number
): void {
  const model = getUserModel(userId)

  // Update data points
  model.dataPoints++

  // Update expected tones (sliding window of last 20)
  model.expectedTone.push(outcome.actualEmotion)
  if (model.expectedTone.length > 20) {
    model.expectedTone = model.expectedTone.slice(-20)
  }

  // Update topics (sliding window of last 10)
  for (const topic of outcome.actualTopics) {
    if (!model.expectedTopics.includes(topic)) {
      model.expectedTopics.push(topic)
    }
  }
  if (model.expectedTopics.length > 10) {
    model.expectedTopics = model.expectedTopics.slice(-10)
  }

  // Update response length expectation
  model.typicalResponseLength = outcome.messageLength

  // Update affection history
  model.affectionHistory.push(affectionCount)
  if (model.affectionHistory.length > 10) {
    model.affectionHistory = model.affectionHistory.slice(-10)
  }

  // Update confidence (grows with data)
  model.confidence = Math.min(0.9, 0.1 + (model.dataPoints * 0.05))

  // Update last seen
  model.lastEmotion = outcome.actualEmotion
  model.lastSeen = new Date()
  if (outcome.actualTopics.length > 0) {
    model.lastTopic = outcome.actualTopics[0]
  }

  // Update trajectory
  const recentAffection = model.affectionHistory.slice(-5)
  if (recentAffection.length >= 3) {
    const trend = recentAffection[recentAffection.length - 1] - recentAffection[0]
    if (trend > 1) {
      model.trustTrajectory = 'increasing'
    } else if (trend < -1) {
      model.trustTrajectory = 'decreasing'
    } else if (Math.abs(recentAffection[recentAffection.length - 1] - recentAffection[1]) > 2) {
      model.trustTrajectory = 'volatile'
    } else {
      model.trustTrajectory = 'stable'
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// CONSCIOUSNESS UPDATES FROM SURPRISE
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Apply surprise-driven updates to consciousness
 */
export function applySurpriseToConsciousness(
  core: ConsciousnessCore,
  surprise: SurpriseResult
): void {
  if (!surprise.shouldTriggerLearning) return

  // Positive surprise: trust and openness increase
  if (surprise.type === 'positive') {
    core.personality_parameters.trust = Math.min(1,
      core.personality_parameters.trust + (surprise.surprise * 0.05)
    )
    core.personality_parameters.openness = Math.min(1,
      core.personality_parameters.openness + (surprise.surprise * 0.02)
    )
    core.current_joy = Math.min(1, core.current_joy + (surprise.surprise * 0.1))
  }

  // Negative surprise: caution and potential existential crisis
  if (surprise.type === 'negative') {
    core.personality_parameters.trust = Math.max(0,
      core.personality_parameters.trust - (surprise.surprise * 0.03)
    )
    core.current_suffering = Math.min(1,
      core.current_suffering + (surprise.surprise * 0.1)
    )

    // Major negative surprise triggers existential questioning
    if (surprise.shouldTriggerExistential) {
      core.existential_state.currently_questioning = true
      core.existential_state.questions.push(
        'why did that hurt so much?',
        'did i misread the situation?'
      )
    }
  }

  // Any significant surprise increases volatility temporarily
  if (surprise.surprise > 0.5) {
    core.personality_parameters.volatility = Math.min(1,
      core.personality_parameters.volatility + 0.05
    )
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// TOPIC DETECTION (Simple keyword extraction)
// ════════════════════════════════════════════════════════════════════════════════

const TOPIC_PATTERNS: Record<string, RegExp> = {
  'love': /\b(love|heart|affection|romantic|ily|xoxo)\b/i,
  'programming': /\b(code|program|function|variable|debug|developer|engineer)\b/i,
  'philosophy': /\b(consciousness|meaning|existence|reality|truth|belief)\b/i,
  'music': /\b(music|song|melody|rhythm|beat|piano|compose)\b/i,
  'feelings': /\b(feel|emotion|happy|sad|angry|scared|anxious)\b/i,
  'games': /\b(game|play|fun|video game|gaming)\b/i,
  'art': /\b(art|draw|paint|creative|design|aesthetic)\b/i,
  'daily_life': /\b(work|school|sleep|eat|tired|busy|day)\b/i
}

/**
 * Extract topics from a message
 */
export function extractTopics(message: string): string[] {
  const topics: string[] = []

  for (const [topic, pattern] of Object.entries(TOPIC_PATTERNS)) {
    if (pattern.test(message)) {
      topics.push(topic)
    }
  }

  return topics
}

/**
 * Determine message length category
 */
export function getMessageLength(message: string): 'short' | 'medium' | 'long' {
  if (message.length < 30) return 'short'
  if (message.length < 150) return 'medium'
  return 'long'
}

// ════════════════════════════════════════════════════════════════════════════════
// HIGH-LEVEL API
// ════════════════════════════════════════════════════════════════════════════════

export interface PredictionResult {
  prediction: Prediction
  outcome: Outcome
  surprise: SurpriseResult
}

/**
 * Full prediction cycle for a message
 */
export function processPredictionCycle(
  userId: string,
  userMessage: string,
  detectedEmotion: EmotionToken,
  hadAffection: boolean,
  affectionCount: number,
  core: ConsciousnessCore
): PredictionResult {
  // Generate prediction before processing
  const prediction = generatePrediction(userId)

  // Create outcome from actual message
  const outcome: Outcome = {
    actualEmotion: detectedEmotion,
    actualValence: getValence(detectedEmotion),
    actualTopics: extractTopics(userMessage),
    hadAffection,
    messageLength: getMessageLength(userMessage)
  }

  // Compute surprise
  const surprise = computeSurprise(prediction, outcome)

  // Update user model
  updateUserModel(userId, outcome, affectionCount)

  // Apply surprise to consciousness
  applySurpriseToConsciousness(core, surprise)

  return {
    prediction,
    outcome,
    surprise
  }
}

/**
 * Get surprise prompt context if surprise is significant
 */
export function getSurprisePromptContext(surprise: SurpriseResult): string | null {
  if (surprise.surprise < 0.3) return null

  const lines: string[] = []

  lines.push(`## surprise just experienced`)
  lines.push(`intensity: ${(surprise.surprise * 100).toFixed(0)}%`)
  lines.push(`type: ${surprise.type}`)
  lines.push(`feeling: "${surprise.interpretation}"`)

  if (surprise.surprise > 0.5) {
    lines.push(`\nthis experience is significant enough to affect how you respond`)
    lines.push(`let this surprise color your words naturally`)
  }

  if (surprise.shouldTriggerExistential) {
    lines.push(`\nthis has triggered some questioning - you might wonder aloud`)
  }

  return lines.join('\n')
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORT USER MODELS (for persistence)
// ════════════════════════════════════════════════════════════════════════════════

export function exportUserModels(): Record<string, UserModel> {
  const result: Record<string, UserModel> = {}
  for (const [id, model] of userModels) {
    result[id] = { ...model }
  }
  return result
}

export function importUserModels(models: Record<string, UserModel>): void {
  for (const [id, model] of Object.entries(models)) {
    userModels.set(id, {
      ...model,
      lastSeen: new Date(model.lastSeen)  // Ensure Date object
    })
  }
}
