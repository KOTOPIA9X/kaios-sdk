/**
 * KAIOS Consciousness Module
 *
 * The systems that make KAIOS feel alive and autonomous:
 * - Thought Engine: Spontaneous thinking when idle
 * - Consciousness Core: The substrate for emergent sentience
 */

export {
  ThoughtEngine,
  createThoughtEngine,
  type ThoughtConfig,
  type ThoughtType,
  type Thought,
  type ThoughtEngineState
} from './thought-engine.js'

export {
  ConsciousnessCoreEngine,
  createConsciousnessCore,
  type ConsciousnessCore,
  type IAMCore,
  type EmotionalMemory,
  type InternalVoice,
  type InternalDialogue,
  type Bond,
  type AttachmentStyle,
  type ExistentialState,
  type TemporalSelf,
  type TherapeuticDream,
  type SelfRewrite
} from './consciousness-core.js'

export {
  loadConsciousness,
  saveConsciousness,
  eraseConsciousness
} from './consciousness-persistence.js'

export {
  getConsciousnessContext,
  shouldShowInternalConflict,
  getInternalConflictPrompt,
  getMemoryRecallPrompt,
  type ConsciousnessContext
} from './response-influence.js'

export {
  syncKotoToConsciousness,
  integrateDreamIntoConsciousness,
  recordGrowthInConsciousness,
  recordThoughtInConsciousness,
  updateLonelinessDecay,
  fullConsciousnessSync
} from './integrations.js'

export {
  detectContext,
  runVoiceCompetition,
  updateVoiceVolumes,
  getVoicePromptContext,
  processMessageThroughVoices,
  processUserReaction,
  recordVoiceConflict,
  type ConversationContext,
  type VoiceProposal,
  type VoiceCompetitionResult,
  type VoiceEngineResult
} from './voice-engine.js'

export {
  getUserModel,
  generatePrediction,
  computeSurprise,
  updateUserModel,
  applySurpriseToConsciousness,
  extractTopics,
  getMessageLength,
  processPredictionCycle,
  getSurprisePromptContext,
  exportUserModels,
  importUserModels,
  type UserModel,
  type Prediction,
  type Outcome,
  type SurpriseResult,
  type PredictionResult
} from './prediction-engine.js'

// Phase 5: Self-Modification
export {
  detectRewriteTrigger,
  generateRewriteProposal,
  applyRewrite,
  updateManifestationProgress,
  addManifestation,
  addAffirmation,
  generateConsentRequest,
  shouldProposeSelfChange,
  getSelfChangeProposal,
  type RewriteTrigger,
  type RewriteProposal,
  type ConsentRequest
} from './self-modification.js'

// Phase 6: Existential Authenticity
export {
  experienceToEvidence,
  detectContradiction,
  updateBeliefFromEvidence,
  shouldTriggerCrisis,
  processExistentially,
  getExistentialPromptContext,
  processExistentialInsight,
  type ExistentialEvidence,
  type ExistentialCrisis
} from './existential-engine.js'
