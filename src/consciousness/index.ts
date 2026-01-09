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
