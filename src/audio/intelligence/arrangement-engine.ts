/**
 * KAIOS Arrangement Engine
 *
 * Intelligent song structure and arrangement:
 * - Section generation (intro, verse, chorus, bridge, outro)
 * - Energy arc management
 * - Tension/release dynamics
 * - Musical form understanding
 * - Live performance adaptation
 */

import { PHI } from './music-theory.js'
import { generateSection, type GenreType, GENRE_PROFILES, type GeneratedSection } from './genre-engine.js'
import { type TransitionConfig } from './dj-engine.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type SectionType = 'intro' | 'verse' | 'prechorus' | 'chorus' | 'bridge' | 'breakdown' | 'buildup' | 'drop' | 'outro'

export interface ArrangementSection {
  type: SectionType
  name: string
  bars: number
  energy: number              // 0-1
  tension: number             // 0-1
  elements: ElementConfig
  generated?: GeneratedSection
}

export interface ElementConfig {
  drums: boolean
  bass: boolean
  chords: boolean
  melody: boolean
  pads: boolean
  fx: boolean
  vocals: boolean
  percussion: boolean
}

export interface Arrangement {
  genre: GenreType
  key: string
  bpm: number
  timeSignature: [number, number]
  totalBars: number
  sections: ArrangementSection[]
  energyCurve: number[]
  tensionCurve: number[]
  transitions: { position: number; type: TransitionConfig['type'] }[]
}

export interface ArrangementOptions {
  genre: GenreType
  duration: 'short' | 'medium' | 'long' | number  // bars
  energy: 'chill' | 'medium' | 'high' | 'dynamic'
  structure: 'verse-chorus' | 'buildup-drop' | 'ambient' | 'freeform' | 'custom' | 'lofi' | 'breakcore'
  key?: string
  bpm?: number
}

export interface LiveState {
  currentSection: number
  currentBar: number
  currentBeat: number
  energy: number
  tension: number
  nextSectionIn: number       // bars until next section
  suggestedActions: string[]
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION TEMPLATES
// ════════════════════════════════════════════════════════════════════════════════

const SECTION_TEMPLATES: Record<SectionType, Partial<ArrangementSection>> = {
  intro: {
    energy: 0.3,
    tension: 0.2,
    elements: {
      drums: false,
      bass: false,
      chords: true,
      melody: false,
      pads: true,
      fx: true,
      vocals: false,
      percussion: false,
    },
  },
  verse: {
    energy: 0.5,
    tension: 0.4,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: false,
      pads: false,
      fx: false,
      vocals: true,
      percussion: true,
    },
  },
  prechorus: {
    energy: 0.6,
    tension: 0.7,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: true,
      pads: true,
      fx: true,
      vocals: true,
      percussion: true,
    },
  },
  chorus: {
    energy: 0.8,
    tension: 0.5,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: true,
      pads: true,
      fx: false,
      vocals: true,
      percussion: true,
    },
  },
  bridge: {
    energy: 0.4,
    tension: 0.6,
    elements: {
      drums: false,
      bass: true,
      chords: true,
      melody: true,
      pads: true,
      fx: true,
      vocals: true,
      percussion: false,
    },
  },
  breakdown: {
    energy: 0.2,
    tension: 0.3,
    elements: {
      drums: false,
      bass: false,
      chords: true,
      melody: false,
      pads: true,
      fx: true,
      vocals: false,
      percussion: false,
    },
  },
  buildup: {
    energy: 0.6,
    tension: 0.9,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: false,
      pads: true,
      fx: true,
      vocals: false,
      percussion: true,
    },
  },
  drop: {
    energy: 1.0,
    tension: 0.3,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: true,
      pads: false,
      fx: false,
      vocals: false,
      percussion: true,
    },
  },
  outro: {
    energy: 0.3,
    tension: 0.1,
    elements: {
      drums: false,
      bass: false,
      chords: true,
      melody: true,
      pads: true,
      fx: true,
      vocals: false,
      percussion: false,
    },
  },
}

// ════════════════════════════════════════════════════════════════════════════════
// ARRANGEMENT STRUCTURES
// ════════════════════════════════════════════════════════════════════════════════

const STRUCTURE_TEMPLATES: Record<string, SectionType[]> = {
  'verse-chorus': ['intro', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
  'verse-chorus-short': ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro'],
  'buildup-drop': ['intro', 'buildup', 'drop', 'breakdown', 'buildup', 'drop', 'outro'],
  'buildup-drop-extended': ['intro', 'verse', 'buildup', 'drop', 'breakdown', 'verse', 'buildup', 'drop', 'outro'],
  'ambient': ['intro', 'verse', 'bridge', 'verse', 'outro'],
  'lofi': ['intro', 'verse', 'verse', 'bridge', 'verse', 'outro'],
  'breakcore': ['intro', 'drop', 'breakdown', 'drop', 'breakdown', 'buildup', 'drop', 'outro'],
  'freeform': ['intro', 'verse', 'bridge', 'chorus', 'outro'],
}

// ════════════════════════════════════════════════════════════════════════════════
// ENERGY & TENSION CURVES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate energy curve using golden ratio for natural feel
 */
function generateEnergyCurve(sections: ArrangementSection[]): number[] {
  const curve: number[] = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const baseEnergy = section.energy

    // Add micro-variations within section
    for (let bar = 0; bar < section.bars; bar++) {
      const barProgress = bar / section.bars

      // Golden ratio modulation for organic feel
      const goldenMod = Math.sin(barProgress * Math.PI * PHI) * 0.1

      // Gradual builds within sections
      let buildFactor = 0
      if (section.type === 'buildup') {
        buildFactor = barProgress * 0.3
      } else if (section.type === 'verse') {
        buildFactor = barProgress * 0.1
      }

      curve.push(Math.max(0, Math.min(1, baseEnergy + goldenMod + buildFactor)))
    }
  }

  return curve
}

/**
 * Generate tension curve based on harmonic content
 */
function generateTensionCurve(sections: ArrangementSection[]): number[] {
  const curve: number[] = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const baseTension = section.tension

    // Tension typically builds toward section end
    for (let bar = 0; bar < section.bars; bar++) {
      const barProgress = bar / section.bars

      // Build tension toward transitions
      const transitionTension = barProgress > 0.75 ? (barProgress - 0.75) * 2 : 0

      // Release tension at section starts
      const releaseFactor = barProgress < 0.1 ? (0.1 - barProgress) * 2 : 0

      curve.push(Math.max(0, Math.min(1,
        baseTension + transitionTension - releaseFactor
      )))
    }
  }

  return curve
}

// ════════════════════════════════════════════════════════════════════════════════
// ARRANGEMENT GENERATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate a complete arrangement
 */
export function generateArrangement(options: ArrangementOptions): Arrangement {
  const profile = GENRE_PROFILES[options.genre]

  // Determine key and BPM
  const key = options.key || profile.keyPreferences[Math.floor(Math.random() * profile.keyPreferences.length)]
  const bpm = options.bpm || profile.preferredBPM

  // Determine total duration
  let totalBars: number
  if (typeof options.duration === 'number') {
    totalBars = options.duration
  } else {
    totalBars = options.duration === 'short' ? 32 :
                options.duration === 'medium' ? 64 :
                options.duration === 'long' ? 128 : 64
  }

  // Determine structure
  let structureKey = options.structure
  if (options.structure === 'custom' || options.structure === 'freeform') {
    // Choose based on genre
    if (options.genre === 'lofi') structureKey = 'lofi'
    else if (options.genre === 'breakcore') structureKey = 'breakcore'
    else if (options.genre === 'ambient') structureKey = 'ambient'
    else structureKey = 'verse-chorus'
  }

  const structure = STRUCTURE_TEMPLATES[structureKey] || STRUCTURE_TEMPLATES['verse-chorus']

  // Calculate bars per section
  const barsPerSection = Math.floor(totalBars / structure.length)

  // Generate sections
  const sections: ArrangementSection[] = structure.map((type, index) => {
    const template = SECTION_TEMPLATES[type]

    // Adjust energy based on option
    let energyMod = 0
    if (options.energy === 'chill') energyMod = -0.2
    else if (options.energy === 'high') energyMod = 0.2
    else if (options.energy === 'dynamic') {
      // More contrast between sections
      energyMod = (template.energy || 0.5) > 0.5 ? 0.15 : -0.15
    }

    // Section length varies by type
    let bars = barsPerSection
    if (type === 'intro' || type === 'outro') bars = Math.min(8, barsPerSection)
    if (type === 'buildup') bars = Math.min(4, barsPerSection)
    if (type === 'drop' || type === 'chorus') bars = Math.max(8, barsPerSection)

    return {
      type,
      name: `${type}-${index + 1}`,
      bars,
      energy: Math.max(0, Math.min(1, (template.energy || 0.5) + energyMod)),
      tension: template.tension || 0.5,
      elements: template.elements || {
        drums: true, bass: true, chords: true, melody: true,
        pads: true, fx: true, vocals: false, percussion: true
      },
    }
  })

  // Generate curves
  const energyCurve = generateEnergyCurve(sections)
  const tensionCurve = generateTensionCurve(sections)

  // Generate transitions between sections
  const transitions: { position: number; type: TransitionConfig['type'] }[] = []
  let currentBar = 0

  for (let i = 0; i < sections.length - 1; i++) {
    currentBar += sections[i].bars

    // Determine transition type based on energy change
    const energyChange = sections[i + 1].energy - sections[i].energy
    let transitionType: TransitionConfig['type']

    if (energyChange > 0.3) {
      transitionType = 'buildup' as any // Rising energy
    } else if (energyChange < -0.3) {
      transitionType = 'filter' // Falling energy
    } else if (options.genre === 'breakcore') {
      transitionType = Math.random() > 0.5 ? 'cut' : 'stutter'
    } else {
      transitionType = 'fade'
    }

    transitions.push({
      position: currentBar,
      type: transitionType,
    })
  }

  // Generate musical content for each section
  for (const section of sections) {
    section.generated = generateSection(options.genre, {
      key,
      bars: section.bars,
      bpm,
      energy: section.energy,
    })
  }

  return {
    genre: options.genre,
    key,
    bpm,
    timeSignature: profile.timeSignature,
    totalBars: sections.reduce((sum, s) => sum + s.bars, 0),
    sections,
    energyCurve,
    tensionCurve,
    transitions,
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// LIVE PERFORMANCE
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Get current state for live performance
 */
export function getLiveState(
  arrangement: Arrangement,
  currentBar: number,
  currentBeat: number = 0
): LiveState {
  // Find current section
  let barCount = 0
  let currentSectionIndex = 0

  for (let i = 0; i < arrangement.sections.length; i++) {
    if (barCount + arrangement.sections[i].bars > currentBar) {
      currentSectionIndex = i
      break
    }
    barCount += arrangement.sections[i].bars
  }

  const currentSection = arrangement.sections[currentSectionIndex]
  const barsIntoSection = currentBar - barCount
  const barsUntilNext = currentSection.bars - barsIntoSection

  // Get current energy/tension from curves
  const curveIndex = Math.min(currentBar, arrangement.energyCurve.length - 1)
  const energy = arrangement.energyCurve[curveIndex]
  const tension = arrangement.tensionCurve[curveIndex]

  // Generate suggested actions
  const suggestions: string[] = []

  if (barsUntilNext <= 4) {
    suggestions.push(`Prepare for ${arrangement.sections[currentSectionIndex + 1]?.type || 'end'}`)
  }

  if (tension > 0.7) {
    suggestions.push('High tension - consider release')
  }

  if (energy < 0.3 && currentSection.type !== 'intro' && currentSection.type !== 'outro') {
    suggestions.push('Low energy - add elements')
  }

  if (currentSection.type === 'buildup' && barsUntilNext <= 2) {
    suggestions.push('Drop incoming - build tension!')
  }

  return {
    currentSection: currentSectionIndex,
    currentBar: barsIntoSection,
    currentBeat,
    energy,
    tension,
    nextSectionIn: barsUntilNext,
    suggestedActions: suggestions,
  }
}

/**
 * Get what elements should be playing at a given point
 */
export function getActiveElements(
  arrangement: Arrangement,
  bar: number
): ElementConfig & { intensity: Record<string, number> } {
  const state = getLiveState(arrangement, bar)
  const section = arrangement.sections[state.currentSection]

  // Base elements from section config
  const elements = { ...section.elements }

  // Intensity based on energy and tension
  const intensity: Record<string, number> = {
    drums: section.elements.drums ? state.energy : 0,
    bass: section.elements.bass ? 0.7 + state.energy * 0.3 : 0,
    chords: section.elements.chords ? 0.6 + state.tension * 0.4 : 0,
    melody: section.elements.melody ? 0.5 + state.energy * 0.5 : 0,
    pads: section.elements.pads ? 0.8 - state.energy * 0.3 : 0, // Pads decrease with energy
    fx: section.elements.fx ? state.tension : 0,
    vocals: section.elements.vocals ? 0.7 + state.energy * 0.3 : 0,
    percussion: section.elements.percussion ? state.energy * 0.8 : 0,
  }

  return { ...elements, intensity }
}

// ════════════════════════════════════════════════════════════════════════════════
// VARIATION GENERATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate a variation of an existing section
 */
export function generateVariation(
  section: ArrangementSection,
  variationType: 'subtle' | 'moderate' | 'dramatic'
): ArrangementSection {
  const variation = { ...section }

  switch (variationType) {
    case 'subtle':
      // Minor changes - slightly different melody, same structure
      variation.energy = Math.max(0, Math.min(1, section.energy + (Math.random() - 0.5) * 0.1))
      break

    case 'moderate':
      // More changes - different rhythm pattern, some element changes
      variation.energy = Math.max(0, Math.min(1, section.energy + (Math.random() - 0.5) * 0.2))
      variation.tension = Math.max(0, Math.min(1, section.tension + (Math.random() - 0.5) * 0.2))
      // Toggle some elements
      if (Math.random() > 0.7) variation.elements.percussion = !section.elements.percussion
      if (Math.random() > 0.8) variation.elements.fx = !section.elements.fx
      break

    case 'dramatic':
      // Major changes - different feel entirely
      variation.energy = Math.max(0, Math.min(1, 1 - section.energy)) // Invert
      variation.tension = Math.max(0, Math.min(1, section.tension + (Math.random() - 0.5) * 0.4))
      // More element changes
      const keys = Object.keys(variation.elements) as (keyof ElementConfig)[]
      for (const key of keys) {
        if (Math.random() > 0.6) {
          variation.elements[key] = !section.elements[key]
        }
      }
      break
  }

  variation.name = `${section.name}-var`
  return variation
}

/**
 * Add fills and transitions between bars
 */
export function addFills(
  arrangement: Arrangement,
  fillDensity: number = 0.3
): { bar: number; type: string; intensity: number }[] {
  const fills: { bar: number; type: string; intensity: number }[] = []

  // Add fills at section transitions
  for (const transition of arrangement.transitions) {
    fills.push({
      bar: transition.position - 1,
      type: 'transition-fill',
      intensity: 0.8,
    })
  }

  // Add fills at phrase boundaries (every 4 or 8 bars)
  for (let bar = 4; bar < arrangement.totalBars; bar += 4) {
    if (Math.random() < fillDensity) {
      // Check we're not already at a transition
      if (!fills.some(f => Math.abs(f.bar - bar) < 2)) {
        fills.push({
          bar,
          type: bar % 8 === 0 ? 'phrase-fill' : 'mini-fill',
          intensity: bar % 8 === 0 ? 0.6 : 0.4,
        })
      }
    }
  }

  return fills.sort((a, b) => a.bar - b.bar)
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export const ArrangementEngine = {
  SECTION_TEMPLATES,
  STRUCTURE_TEMPLATES,
  generateArrangement,
  getLiveState,
  getActiveElements,
  generateVariation,
  addFills,
}
