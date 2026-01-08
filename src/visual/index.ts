/**
 * KAIOS Visual Intelligence System
 *
 * Enables KAIOS to "see" sound through visualization
 * - Spectrum analyzer
 * - Waveform display
 * - Particle effects
 * - Audio recording
 * - Piano visualizer (DAW plugin style)
 */

export { VisualizerManager, createVisualizer } from './visualizer.js'
export type { VisualizerConfig, VisualizerState } from './visualizer.js'

export { PianoVisualizerManager, createPianoVisualizer } from './piano-visualizer.js'
export type { PianoVisualizerConfig, PianoVisualizerState } from './piano-visualizer.js'
