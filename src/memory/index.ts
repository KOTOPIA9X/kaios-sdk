/**
 * KAIOS Memory System
 *
 * Dual-layer memory architecture:
 * - KOTO (User Memory): Personal persistence per user
 * - Mega Brain (Universal Memory): Collective wisdom across all users
 * - Dream Engine: Memory processing and insight generation
 */

// Types
export * from './types.js'

// User Memory (KOTO)
export { KotoManager, createKotoManager } from './user-memory.js'

// Universal Memory (Mega Brain)
export { MegaBrainManager, createMegaBrain } from './universal-memory.js'

// Dream Engine
export { DreamEngine, createDreamEngine } from './dream-engine.js'
export type { DreamEngineConfig } from './dream-engine.js'
