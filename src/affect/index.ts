/** Portable, opt-in affect contracts. No timers, audio devices, or transport. */
import { AffectiveSynthV2 } from '../audio/intelligence/affect-clock-v2.js'
import type { AffectClockOptions, AffectClockResult } from '../audio/intelligence/affect-clock-v2.js'
import type { Affect, PerformanceState } from '../audio/intelligence/affect-engine.js'

export { AffectiveSynthV2 }
export type { AffectClockOptions, AffectClockResult, AffectClockEvent } from '../audio/intelligence/affect-clock-v2.js'
export type { Affect, ArcPhase, MusicParams, VisualParams, PerformanceState } from '../audio/intelligence/affect-engine.js'

export type DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T

/** Version 1 frames are full snapshots. Sequence numbers belong to sourceId. */
export interface AffectFrame {
  readonly version: 1
  readonly sourceId: string
  readonly sequence: number
  readonly state: DeepReadonly<PerformanceState>
  readonly events: DeepReadonly<AffectClockResult['events']>
  readonly clock: DeepReadonly<AffectClockResult['clock']>
}

export interface AffectBusOptions extends AffectClockOptions {
  sourceId?: string
}

export interface ExternalAffectOwner {
  /** Host-clock arrival time; remote clock values remain in the supplied frame. */
  receive(frame: unknown, receivedAtSeconds: number): AffectFrame
  /** Idempotent. An old lease can never release a newer owner. */
  release(): void
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function shape(value: unknown, keys: string[]): value is Record<string, unknown> {
  return record(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key))
}
function numberIn(value: unknown, min: number, max = Number.MAX_VALUE): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
}
function integer(value: unknown, min = 0): value is number {
  return numberIn(value, min, Number.MAX_SAFE_INTEGER) && Number.isSafeInteger(value)
}
function label(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 128
}

/** Strict v1 receiver validation, including every nested number and array item. */
export function isPerformanceState(value: unknown): value is PerformanceState {
  if (!shape(value, ['valence', 'arousal', 'energyFast', 'energySlow', 'tension', 'arc', 'beat', 'rising', 'drop', 'breakdown', 'phraseCut', 'music', 'visual'])) return false
  if (!numberIn(value.valence, -1, 1) || !['arousal', 'energyFast', 'energySlow', 'tension'].every(key => numberIn(value[key], 0, 1))) return false
  if (!integer(value.beat) || !['intro', 'building', 'peak', 'falling', 'outro'].includes(value.arc as string)) return false
  if (!['rising', 'drop', 'breakdown', 'phraseCut'].every(key => typeof value[key] === 'boolean')) return false
  const music = value.music
  if (!shape(music, ['mode', 'chordBias', 'register', 'density', 'swing', 'dissonance', 'tempoBias'])) return false
  if (!label(music.mode) || !Array.isArray(music.chordBias) || music.chordBias.length < 1 || music.chordBias.length > 32 || ![...music.chordBias].every(label)) return false
  if (!integer(music.register, 2) || music.register > 6 || !numberIn(music.tempoBias, Number.MIN_VALUE)) return false
  if (!['density', 'swing', 'dissonance'].every(key => numberIn(music[key], 0, 1))) return false
  const visual = value.visual
  if (!shape(visual, ['look', 'palette', 'bloom', 'glitch', 'motion', 'particles'])) return false
  return label(visual.look) && Array.isArray(visual.palette) && visual.palette.length === 3 && [...visual.palette].every(label)
    && ['bloom', 'glitch', 'motion'].every(key => numberIn(visual[key], 0, 1)) && integer(visual.particles)
}

/** Validates data, not transport identity. Authenticate the sender in your host. */
export function isAffectFrame(value: unknown): value is AffectFrame {
  if (!shape(value, ['version', 'sourceId', 'sequence', 'state', 'events', 'clock'])) return false
  if (value.version !== 1 || !label(value.sourceId) || !integer(value.sequence) || !isPerformanceState(value.state)) return false
  const clock = value.clock
  if (!shape(clock, ['timeSeconds', 'bpm', 'beatPhase', 'track'])) return false
  if (!numberIn(clock.timeSeconds, 0, 1e9) || !numberIn(clock.bpm, 1, 400) || !numberIn(clock.beatPhase, 0, 1) || !integer(clock.track)) return false
  if (!Array.isArray(value.events) || value.events.length > 4096) return false
  let previous = 0
  for (const event of value.events) {
    if (!shape(event, ['type', 'timeSeconds', 'beat']) || !['beat', 'phrase', 'drop'].includes(event.type as string)) return false
    if (!numberIn(event.timeSeconds, previous, clock.timeSeconds + 1e-10) || !integer(event.beat, 1) || event.beat > value.state.beat) return false
    previous = event.timeSeconds
  }
  return true
}

function snapshot(frame: AffectFrame): AffectFrame {
  const state = frame.state
  return Object.freeze({
    version: 1 as const, sourceId: frame.sourceId, sequence: frame.sequence,
    state: Object.freeze({
      ...state,
      music: Object.freeze({ ...state.music, chordBias: Object.freeze([...state.music.chordBias]) }),
      visual: Object.freeze({ ...state.visual, palette: Object.freeze([...state.visual.palette]) as readonly [string, string, string] }),
    }),
    events: Object.freeze(frame.events.map(event => Object.freeze({ ...event }))),
    clock: Object.freeze({ ...frame.clock }),
  })
}

interface OwnerState {
  sourceId: string
  lastAt: number
  staleAfter: number
  lastFrame?: AffectFrame
}

/**
 * One explicit host clock, one external owner, many subscribers.
 * The local synth keeps advancing while an external frame owns the output.
 * Staleness is evaluated on advanceTo; no background work is scheduled.
 */
export class AffectBus {
  private readonly synth: AffectiveSynthV2
  private readonly sourceId: string
  private sequence = 0
  private local: AffectFrame
  private current: AffectFrame
  private owner?: OwnerState
  private readonly listeners = new Set<(frame: AffectFrame) => void>()
  private notifying = false

  constructor(options: AffectBusOptions = {}) {
    this.sourceId = options.sourceId ?? 'local'
    if (!label(this.sourceId)) throw new TypeError('sourceId must be a nonempty string of at most 128 characters')
    this.synth = new AffectiveSynthV2(options)
    this.local = this.frame(this.synth.advanceTo(options.startTimeSeconds ?? 0))
    this.current = this.local
  }

  getSnapshot(): AffectFrame { return this.current }

  /** No immediate replay; use getSnapshot for the initial render. */
  subscribe(listener: (frame: AffectFrame) => void): () => void {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function')
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  advanceTo(atSeconds: number, affect?: Affect): AffectFrame {
    this.assertWritable()
    const result = this.synth.advanceTo(atSeconds, affect)
    this.local = this.frame(result)
    if (this.owner && atSeconds - this.owner.lastAt >= this.owner.staleAfter) this.owner = undefined
    return this.publish(this.owner?.lastFrame ?? this.local)
  }

  /** Valid reset revokes external ownership. Invalid reset preserves everything. */
  resetTrack(atSeconds: number, options: Omit<AffectClockOptions, 'startTimeSeconds'> = {}): AffectFrame {
    this.assertWritable()
    const result = this.synth.resetTrack(atSeconds, options)
    this.owner = undefined
    this.local = this.frame(result)
    return this.publish(this.local)
  }

  claimExternal(sourceId: string, options: { atSeconds: number; staleAfterSeconds?: number }): ExternalAffectOwner {
    this.assertWritable()
    if (this.owner) throw new Error('An external owner already holds this bus; release or advance beyond its stale deadline first')
    if (!label(sourceId) || sourceId === this.sourceId) throw new TypeError('External sourceId must be valid and distinct from the local sourceId')
    const staleAfter = options.staleAfterSeconds ?? 1
    if (!numberIn(staleAfter, 0.001, 3600)) throw new RangeError('staleAfterSeconds must be finite in [0.001, 3600]')
    const result = this.synth.advanceTo(options.atSeconds)
    this.local = this.frame(result)
    const owner: OwnerState = { sourceId, lastAt: options.atSeconds, staleAfter }
    this.publish(this.local)
    this.owner = owner
    return {
      receive: (value, receivedAtSeconds) => {
        this.assertWritable()
        if (this.owner !== owner) throw new Error('External owner has been released')
        if (!isAffectFrame(value)) throw new TypeError('Invalid version 1 affect frame')
        if (value.sourceId !== owner.sourceId) throw new Error('Frame source does not match the external owner')
        const previous = owner.lastFrame
        if (previous && value.sequence <= previous.sequence) throw new RangeError('Frame sequence must increase within an owner lease')
        if (previous && (value.clock.track < previous.clock.track || (value.clock.track === previous.clock.track && (value.clock.timeSeconds < previous.clock.timeSeconds || value.state.beat < previous.state.beat))))
          throw new RangeError('Frame clock must not move backwards within its track')
        if (receivedAtSeconds - owner.lastAt >= owner.staleAfter) throw new Error('External owner is stale; advance the host clock or release before reacquiring')
        const accepted = snapshot(value)
        const local = this.synth.advanceTo(receivedAtSeconds)
        this.local = this.frame(local)
        owner.lastAt = receivedAtSeconds
        owner.lastFrame = accepted
        return this.publish(accepted)
      },
      release: () => {
        this.assertWritable()
        if (this.owner !== owner) return
        this.owner = undefined
        // Hidden local events are not replayed at handoff.
        this.local = this.frame(this.synth.advanceTo(this.local.clock.timeSeconds))
        this.publish(this.local)
      },
    }
  }

  private frame(result: AffectClockResult): AffectFrame {
    return snapshot({ version: 1, sourceId: this.sourceId, sequence: this.sequence++, ...result })
  }

  private assertWritable(): void {
    if (this.notifying) throw new Error('AffectBus cannot be advanced from a subscriber; schedule host updates outside notification')
  }

  private publish(frame: AffectFrame): AffectFrame {
    if (this.current === frame) return frame
    this.current = frame
    this.notifying = true
    const errors: unknown[] = []
    try {
      for (const listener of [...this.listeners]) {
        if (!this.listeners.has(listener)) continue
        try { listener(frame) } catch (error) { errors.push(error) }
      }
    } finally { this.notifying = false }
    if (errors.length) throw new AggregateError(errors, 'AffectBus subscriber failed; the frame was committed and other subscribers were notified')
    return frame
  }
}
