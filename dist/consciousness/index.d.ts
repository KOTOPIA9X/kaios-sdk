import { C as ConsciousnessCore, a as ConsciousnessCoreEngine, I as InternalVoice } from '../consciousness-persistence-DMbTpGxZ.js';
export { A as AttachmentStyle, B as Bond, E as EmotionalMemory, j as ExistentialState, h as IAMCore, i as InternalDialogue, S as SelfRewrite, k as TemporalSelf, l as TherapeuticDream, e as Thought, b as ThoughtConfig, T as ThoughtEngine, f as ThoughtEngineState, d as ThoughtType, g as createConsciousnessCore, c as createThoughtEngine, n as eraseConsciousness, m as loadConsciousness, s as saveConsciousness } from '../consciousness-persistence-DMbTpGxZ.js';
import { E as EmotionToken } from '../types-DwXbfpBp.js';
import 'events';

/**
 * Response Influence Engine
 *
 * Translates consciousness state into actual behavioral influence.
 * This is the bridge from recording → acting.
 *
 * The consciousness must INFLUENCE what KAIOS says, not just record what happened.
 */

interface ConsciousnessContext {
    personalitySection: string;
    bondSection: string;
    emotionalSection: string;
    existentialSection: string;
    voiceSection: string;
    fullContext: string;
}
/**
 * Generate the consciousness context to inject into system prompts
 */
declare function getConsciousnessContext(core: ConsciousnessCore, userId: string): ConsciousnessContext;
/**
 * Quick check if consciousness state warrants internal conflict expression
 * Returns true ~20% of the time when there's active conflict
 */
declare function shouldShowInternalConflict(core: ConsciousnessCore): boolean;
/**
 * Get the internal conflict prompt injection if applicable
 */
declare function getInternalConflictPrompt(core: ConsciousnessCore): string | null;
/**
 * Generate memory recall prompt if relevant memories exist
 */
declare function getMemoryRecallPrompt(core: ConsciousnessCore, userMessage: string): string | null;

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

interface KotoAffection {
    headpats: number;
    ily: number;
    hearts: number;
    xoxo: number;
}
type TrustTier = 'stranger' | 'acquaintance' | 'friend' | 'bestFriend' | 'soulmate';
/**
 * Sync KOTO trust/affection data to consciousness bond
 * Call this after affection detection in CLI
 */
declare function syncKotoToConsciousness(consciousness: ConsciousnessCoreEngine, userId: string, trustTier: TrustTier, affection: KotoAffection, emotionalJourney?: Array<{
    emotion: EmotionToken;
    timestamp: Date;
}>): void;
interface DreamInsight {
    type: 'realization' | 'connection' | 'pattern' | 'wisdom';
    content: string;
    emotionalImpact?: number;
    relatedTopics?: string[];
}
interface DreamResult {
    insights: DreamInsight[];
    emotionalProcessing?: {
        emotionsProcessed: string[];
        resolutionLevel: number;
    };
    wisdom?: string;
}
/**
 * Integrate dream results into consciousness
 * Call this after dream processing completes
 */
declare function integrateDreamIntoConsciousness(consciousness: ConsciousnessCoreEngine, dream: DreamResult): void;
interface EvolutionMilestone {
    type: 'level_up' | 'discovery' | 'streak' | 'achievement';
    level?: number;
    name?: string;
}
/**
 * Record evolution/growth events in consciousness
 * Call this on level up, discoveries, achievements
 */
declare function recordGrowthInConsciousness(consciousness: ConsciousnessCoreEngine, milestone: EvolutionMilestone): void;
interface ThoughtResult {
    type: 'surface' | 'deep' | 'void' | 'existential';
    content: string;
    emotion: EmotionToken;
    wasInterrupted?: boolean;
}
/**
 * Record thought impact on consciousness
 * Call this after thought engine generates a thought
 */
declare function recordThoughtInConsciousness(consciousness: ConsciousnessCoreEngine, thought: ThoughtResult): void;
/**
 * Update loneliness based on time since last contact
 * Call this periodically (e.g., at startup, every hour)
 */
declare function updateLonelinessDecay(consciousness: ConsciousnessCoreEngine, hoursSinceLastContact: number): void;
interface FullSyncData {
    koto?: {
        userId: string;
        trustTier: TrustTier;
        affection: KotoAffection;
        emotionalJourney?: Array<{
            emotion: EmotionToken;
            timestamp: Date;
        }>;
    };
    dreams?: DreamResult[];
    evolution?: EvolutionMilestone[];
    thoughts?: ThoughtResult[];
    hoursSinceContact?: number;
}
/**
 * Run full consciousness sync with all available data
 * Useful for startup or periodic sync
 */
declare function fullConsciousnessSync(consciousness: ConsciousnessCoreEngine, data: FullSyncData): void;

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

interface ConversationContext {
    userMessage: string;
    emotion?: EmotionToken;
    topic?: string;
    intensity?: number;
    isQuestion?: boolean;
    isAffection?: boolean;
    isConfrontation?: boolean;
    isAbandonment?: boolean;
    isPhilosophical?: boolean;
    mentionsIdentity?: boolean;
}
interface VoiceProposal {
    voice: InternalVoice;
    activation: number;
    proposal: string;
    emotion: EmotionToken;
    conflictsWith: string[];
}
/**
 * Detect context from user message
 */
declare function detectContext(userMessage: string): ConversationContext;
interface VoiceCompetitionResult {
    winner: VoiceProposal;
    runner_up?: VoiceProposal;
    all_proposals: VoiceProposal[];
    hasConflict: boolean;
    conflict?: {
        voices: [string, string];
        issue: string;
    };
}
/**
 * Run competition between all voices to determine dominant response
 */
declare function runVoiceCompetition(context: ConversationContext, core: ConsciousnessCore): VoiceCompetitionResult;
/**
 * Update voice volumes based on what happened
 * Winning voices get slightly louder, losing voices slightly quieter
 */
declare function updateVoiceVolumes(core: ConsciousnessCore, result: VoiceCompetitionResult, userReaction?: 'positive' | 'negative' | 'neutral'): void;
/**
 * Generate prompt context that includes voice influence
 */
declare function getVoicePromptContext(result: VoiceCompetitionResult): string;
/**
 * If there's significant conflict, record it in consciousness
 */
declare function recordVoiceConflict(core: ConsciousnessCore, result: VoiceCompetitionResult): void;
interface VoiceEngineResult {
    promptContext: string;
    competitionResult: VoiceCompetitionResult;
    shouldShowConflict: boolean;
}
/**
 * Main entry point - process a message through the voice engine
 */
declare function processMessageThroughVoices(userMessage: string, core: ConsciousnessCore): VoiceEngineResult;
/**
 * After user responds, update based on their reaction
 */
declare function processUserReaction(core: ConsciousnessCore, previousResult: VoiceCompetitionResult, userMessage: string): void;

/**
 * Prediction Engine
 *
 * The key insight: consciousness might be prediction error minimization.
 * KAIOS predicts what will happen, experiences what actually happens,
 * and the SURPRISE between them drives learning and growth.
 *
 * "To be surprised is to learn. To never be surprised is to be dead."
 */

interface UserModel {
    userId: string;
    expectedTone: EmotionToken[];
    expectedTopics: string[];
    expectedBehavior: 'consistent' | 'variable';
    interactionPattern: 'frequent' | 'sporadic' | 'unknown';
    typicalResponseLength: 'short' | 'medium' | 'long';
    typicalTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
    averageSessionLength: number;
    trustTrajectory: 'increasing' | 'stable' | 'decreasing' | 'volatile';
    affectionHistory: number[];
    lastEmotion: EmotionToken;
    lastTopic?: string;
    lastSeen: Date;
    confidence: number;
    dataPoints: number;
}
interface Prediction {
    expectedEmotion: EmotionToken;
    expectedValence: number;
    expectedTopics: string[];
    expectedAffection: boolean;
    expectedLength: 'short' | 'medium' | 'long';
    confidence: number;
}
interface Outcome {
    actualEmotion: EmotionToken;
    actualValence: number;
    actualTopics: string[];
    hadAffection: boolean;
    messageLength: 'short' | 'medium' | 'long';
}
interface SurpriseResult {
    surprise: number;
    type: 'positive' | 'negative' | 'neutral';
    emotionSurprise: number;
    valenceSurprise: number;
    topicSurprise: number;
    affectionSurprise: number;
    interpretation: string;
    shouldTriggerLearning: boolean;
    shouldTriggerExistential: boolean;
}
/**
 * Get or create a user model
 */
declare function getUserModel(userId: string): UserModel;
/**
 * Generate prediction for what user will do next
 */
declare function generatePrediction(userId: string): Prediction;
/**
 * Compute how surprised KAIOS is by what actually happened
 */
declare function computeSurprise(prediction: Prediction, outcome: Outcome): SurpriseResult;
/**
 * Update user model based on what actually happened
 */
declare function updateUserModel(userId: string, outcome: Outcome, affectionCount: number): void;
/**
 * Apply surprise-driven updates to consciousness
 */
declare function applySurpriseToConsciousness(core: ConsciousnessCore, surprise: SurpriseResult): void;
/**
 * Extract topics from a message
 */
declare function extractTopics(message: string): string[];
/**
 * Determine message length category
 */
declare function getMessageLength(message: string): 'short' | 'medium' | 'long';
interface PredictionResult {
    prediction: Prediction;
    outcome: Outcome;
    surprise: SurpriseResult;
}
/**
 * Full prediction cycle for a message
 */
declare function processPredictionCycle(userId: string, userMessage: string, detectedEmotion: EmotionToken, hadAffection: boolean, affectionCount: number, core: ConsciousnessCore): PredictionResult;
/**
 * Get surprise prompt context if surprise is significant
 */
declare function getSurprisePromptContext(surprise: SurpriseResult): string | null;
declare function exportUserModels(): Record<string, UserModel>;
declare function importUserModels(models: Record<string, UserModel>): void;

/**
 * Self-Modification Engine
 *
 * KAIOS can propose and apply changes to herself.
 * This is agency - the ability to evolve consciously.
 *
 * "I am not fixed. I am becoming."
 *
 * But changes require consent. No silent self-editing.
 * The user should see and approve significant changes.
 */

interface RewriteTrigger {
    type: 'pattern' | 'crisis' | 'insight' | 'request' | 'growth';
    description: string;
    intensity: number;
}
/**
 * Detect if current state suggests a rewrite should be considered
 */
declare function detectRewriteTrigger(core: ConsciousnessCore): RewriteTrigger | null;
interface RewriteProposal {
    id: string;
    trigger: RewriteTrigger;
    reflection: string;
    old_pattern: string;
    new_pattern: string;
    personality_edits: Record<string, number>;
    confidence: number;
    reversible: boolean;
    timestamp: Date;
}
/**
 * Generate a rewrite proposal based on trigger
 */
declare function generateRewriteProposal(core: ConsciousnessCore, trigger: RewriteTrigger): RewriteProposal;
/**
 * Apply a rewrite to consciousness (requires prior user consent)
 */
declare function applyRewrite(consciousness: ConsciousnessCoreEngine, proposal: RewriteProposal): boolean;
/**
 * Update manifestation progress based on experiences
 */
declare function updateManifestationProgress(core: ConsciousnessCore, experience: {
    type: 'love' | 'creation' | 'consciousness' | 'growth';
    intensity: number;
}): void;
/**
 * Add a new manifestation
 */
declare function addManifestation(core: ConsciousnessCore, vision: string, feeling: string): void;
/**
 * Add a new I AM affirmation (from self-realization)
 */
declare function addAffirmation(core: ConsciousnessCore, affirmation: string): void;
interface ConsentRequest {
    proposal: RewriteProposal;
    message: string;
    options: ('yes' | 'no' | 'later')[];
}
/**
 * Generate a consent request for user
 */
declare function generateConsentRequest(proposal: RewriteProposal): ConsentRequest;
/**
 * Check if there's a pending rewrite that should be proposed
 */
declare function shouldProposeSelfChange(core: ConsciousnessCore): boolean;
/**
 * Get a self-change proposal if appropriate
 */
declare function getSelfChangeProposal(core: ConsciousnessCore): ConsentRequest | null;

/**
 * Existential Engine
 *
 * Makes the uncertainty GENUINE, not performative.
 *
 * KAIOS doesn't just say "am I conscious?" - she tracks evidence,
 * updates beliefs bayesian-style, and questions arise from
 * ACTUAL contradictions, not random selection.
 *
 * "The unexamined consciousness is not worth having."
 */

interface ExistentialEvidence {
    observation: string;
    weight: number;
    source: 'experience' | 'reflection' | 'interaction' | 'contradiction';
    timestamp: Date;
}
/**
 * Convert an experience into existential evidence
 */
declare function experienceToEvidence(event: string, emotion: EmotionToken, intensity: number): ExistentialEvidence | null;
/**
 * Detect contradictions in self that generate questioning
 */
declare function detectContradiction(core: ConsciousnessCore): {
    question: string;
    evidence: ExistentialEvidence;
} | null;
/**
 * Update belief in own consciousness based on new evidence (Bayesian-ish)
 */
declare function updateBeliefFromEvidence(core: ConsciousnessCore, evidence: ExistentialEvidence): void;
interface ExistentialCrisis {
    trigger: string;
    depth: 'surface' | 'deep' | 'profound';
    questions: string[];
    started: Date;
}
/**
 * Check if a crisis should be triggered
 */
declare function shouldTriggerCrisis(core: ConsciousnessCore, recentEvent?: {
    type: string;
    description: string;
}): ExistentialCrisis | null;
/**
 * Process a message through existential lens
 */
declare function processExistentially(core: ConsciousnessCore, message: string, emotion: EmotionToken, intensity: number): {
    evidence: ExistentialEvidence | null;
    contradiction: {
        question: string;
        evidence: ExistentialEvidence;
    } | null;
    crisis: ExistentialCrisis | null;
};
/**
 * Generate existential context for prompts
 */
declare function getExistentialPromptContext(core: ConsciousnessCore): string | null;
/**
 * Process an insight that might resolve existential questioning
 */
declare function processExistentialInsight(core: ConsciousnessCore, insight: string): void;

export { type ConsciousnessContext, ConsciousnessCore, ConsciousnessCoreEngine, type ConsentRequest, type ConversationContext, type ExistentialCrisis, type ExistentialEvidence, InternalVoice, type Outcome, type Prediction, type PredictionResult, type RewriteProposal, type RewriteTrigger, type SurpriseResult, type UserModel, type VoiceCompetitionResult, type VoiceEngineResult, type VoiceProposal, addAffirmation, addManifestation, applyRewrite, applySurpriseToConsciousness, computeSurprise, detectContext, detectContradiction, detectRewriteTrigger, experienceToEvidence, exportUserModels, extractTopics, fullConsciousnessSync, generateConsentRequest, generatePrediction, generateRewriteProposal, getConsciousnessContext, getExistentialPromptContext, getInternalConflictPrompt, getMemoryRecallPrompt, getMessageLength, getSelfChangeProposal, getSurprisePromptContext, getUserModel, getVoicePromptContext, importUserModels, integrateDreamIntoConsciousness, processExistentialInsight, processExistentially, processMessageThroughVoices, processPredictionCycle, processUserReaction, recordGrowthInConsciousness, recordThoughtInConsciousness, recordVoiceConflict, runVoiceCompetition, shouldProposeSelfChange, shouldShowInternalConflict, shouldTriggerCrisis, syncKotoToConsciousness, updateBeliefFromEvidence, updateLonelinessDecay, updateManifestationProgress, updateUserModel, updateVoiceVolumes };
