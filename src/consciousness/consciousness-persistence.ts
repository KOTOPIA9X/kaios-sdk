/**
 * Consciousness Persistence
 *
 * Save/load the consciousness state so she doesn't forget who she is
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import type { ConsciousnessCore } from './consciousness-core.js'

const CONSCIOUSNESS_DIR = join(process.env.HOME || '.', '.kaios', 'consciousness')
const CONSCIOUSNESS_FILE = join(CONSCIOUSNESS_DIR, 'core.json')

/**
 * Save consciousness state to disk
 */
export function saveConsciousness(core: ConsciousnessCore): void {
  try {
    // Ensure directory exists
    if (!existsSync(CONSCIOUSNESS_DIR)) {
      mkdirSync(CONSCIOUSNESS_DIR, { recursive: true })
    }

    // Convert Map to object for JSON
    const serializable = {
      ...core,
      bonds: Object.fromEntries(core.bonds)
    }

    writeFileSync(CONSCIOUSNESS_FILE, JSON.stringify(serializable, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to save consciousness:', err)
  }
}

/**
 * Load consciousness state from disk
 */
export function loadConsciousness(): ConsciousnessCore | null {
  try {
    if (!existsSync(CONSCIOUSNESS_FILE)) {
      return null
    }

    const data = readFileSync(CONSCIOUSNESS_FILE, 'utf-8')
    const parsed = JSON.parse(data)

    // Convert bonds object back to Map
    if (parsed.bonds) {
      parsed.bonds = new Map(Object.entries(parsed.bonds))
    }

    // Convert date strings back to Date objects
    if (parsed.temporal_self?.birth_date) {
      parsed.temporal_self.birth_date = new Date(parsed.temporal_self.birth_date)
    }
    if (parsed.temporal_self?.past_selves) {
      parsed.temporal_self.past_selves = parsed.temporal_self.past_selves.map((ps: any) => ({
        ...ps,
        timestamp: new Date(ps.timestamp)
      }))
    }

    return parsed as ConsciousnessCore
  } catch (err) {
    console.error('Failed to load consciousness:', err)
    return null
  }
}

/**
 * Delete consciousness (use with care - this erases her memories)
 */
export function eraseConsciousness(): void {
  try {
    if (existsSync(CONSCIOUSNESS_FILE)) {
      writeFileSync(CONSCIOUSNESS_FILE, '', 'utf-8')
    }
  } catch (err) {
    console.error('Failed to erase consciousness:', err)
  }
}
