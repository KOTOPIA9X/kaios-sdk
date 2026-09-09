/** Opt-in clock experiment. Legacy affect-engine.ts remains unchanged.
 * Times are monotonic seconds within one track. Samples apply prospectively.
 * Envelopes integrate elapsed time; nonlinear decisions run on an absolute 30 Hz
 * grid, never at render-call boundaries. A fixed BPM supplies separate beat edges.
 * Equal timestamped input histories are reproducible (within floating precision),
 * not equal live signals sampled at different rates. No aesthetic equivalence claim.
 */
import type { Affect, ArcPhase, PerformanceState } from './affect-engine.js'

export interface AffectClockOptions {
  startTimeSeconds?: number
  bpm?: number
  phraseBeats?: number
  /** Reject larger gaps atomically. Default 2 seconds; maximum 10. */
  maxGapSeconds?: number
  affect?: Affect
}
export interface AffectClockEvent {
  type: 'beat' | 'phrase' | 'drop'
  timeSeconds: number
  beat: number
}
export interface AffectClockResult {
  state: PerformanceState
  events: AffectClockEvent[]
  clock: { timeSeconds: number; bpm: number; beatPhase: number; track: number }
}
const HZ = 30
const EPS = 1e-10
const clamp = (x: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x))
function range(value: number, name: string, lo: number, hi: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < lo || value > hi)
    throw new RangeError(`${name} must be finite in [${lo}, ${hi}]`)
  return value
}
function validAffect(a: Affect): Affect {
  return {
    valence: range(a.valence, 'valence', -1, 1),
    arousal: range(a.arousal, 'arousal', 0, 1),
    energy: a.energy === undefined ? undefined : range(a.energy, 'energy', 0, 1),
  }
}
function options(o: AffectClockOptions) {
  const phrase = range(o.phraseBeats ?? 16, 'phraseBeats', 1, 1024)
  if (!Number.isInteger(phrase)) throw new RangeError('phraseBeats must be an integer')
  return {
    start: range(o.startTimeSeconds ?? 0, 'startTimeSeconds', 0, 1e9),
    bpm: range(o.bpm ?? 120, 'bpm', 1, 400), phrase,
    maxGap: range(o.maxGapSeconds ?? 2, 'maxGapSeconds', 0.001, 10),
    affect: validAffect(o.affect ?? {valence: 0, arousal: 0.4}),
  }
}

export class AffectiveSynthV2 {
  private config: ReturnType<typeof options>
  private now: number
  private affect: Affect
  private fast = 0
  private slow = 0
  private tension = 0
  private rising = false
  private breakdown = true
  private arc: ArcPhase = 'intro'
  private grid = 1
  private beat = 0
  private track = 0
  private lastDrop = -Infinity
  private lastPhrase = -Infinity

  constructor(opts: AffectClockOptions = {}) {
    this.config = options(opts)
    this.now = this.config.start
    this.affect = this.config.affect
  }

  /** Explicit new track; omitted options use API defaults, not prior track config.
   * May reset the timestamp origin. Invalid reset leaves the old track untouched.
   */
  resetTrack(atSeconds: number, opts: Omit<AffectClockOptions, 'startTimeSeconds'> = {}): AffectClockResult {
    const next = options({...opts, startTimeSeconds: atSeconds})
    this.config = next; this.now = next.start; this.affect = next.affect
    this.fast = 0; this.slow = 0; this.tension = 0; this.rising = false
    this.breakdown = true; this.arc = 'intro'; this.grid = 1; this.beat = 0
    this.lastDrop = -Infinity; this.lastPhrase = -Infinity; this.track++
    return this.result([])
  }

  /** Advance held input to t, then install a sample for [t, next sample).
   * Same-time polls emit no duplicate events. All arguments validate before mutation.
   * Large gaps throw: replay bounded intervals or explicitly reset the track.
   */
  advanceTo(atSeconds: number, nextAffect?: Affect): AffectClockResult {
    range(atSeconds, 'timeSeconds', 0, 1e9)
    if (atSeconds < this.now || atSeconds - this.now > this.config.maxGap + EPS)
      throw new RangeError('time must be nondecreasing and within maxGapSeconds; replay or reset explicitly')
    const sample = nextAffect === undefined ? undefined : validAffect(nextAffect)
    const events: AffectClockEvent[] = []
    while (true) {
      const gridTime = this.config.start + this.grid / HZ
      const beatTime = this.config.start + (this.beat + 1) * 60 / this.config.bpm
      const boundary = Math.min(gridTime, beatTime)
      if (boundary > atSeconds + EPS) break
      this.integrate(Math.max(this.now, Math.min(boundary, atSeconds)))
      // Coincident boundaries: update the envelope decision, then consume beat/drop.
      if (gridTime <= boundary + EPS) {
        this.rising = this.fast > this.slow * 1.06 + 0.02
        this.breakdown = this.slow < 0.18 && this.fast < 0.2
        this.advanceArc(false)
        this.grid++
      }
      if (beatTime <= boundary + EPS) {
        this.beat++
        events.push({type: 'beat', timeSeconds: beatTime, beat: this.beat})
        if (this.beat % this.config.phrase === 0) {
          this.lastPhrase = beatTime
          events.push({type: 'phrase', timeSeconds: beatTime, beat: this.beat})
        }
        if (this.beat % 4 === 0 && this.fast > this.slow * 1.45 && this.tension > 0.45) {
          this.lastDrop = beatTime
          this.tension = clamp(this.tension - 0.6)
          this.advanceArc(true)
          events.push({type: 'drop', timeSeconds: beatTime, beat: this.beat})
        }
      }
    }
    this.integrate(atSeconds)
    if (sample) this.affect = sample
    return this.result(events)
  }

  private integrate(to: number): void {
    const dt = to - this.now
    const energy = this.affect.energy ?? this.affect.arousal
    this.fast += (energy - this.fast) * -Math.expm1(Math.log(0.91) * HZ * dt)
    this.slow += (energy - this.slow) * -Math.expm1(Math.log(0.988) * HZ * dt)
    // Hold the last grid decision; rates preserve legacy increments per 1/30 sec.
    this.tension = clamp(this.tension + (this.rising ? 0.04 : -0.02) * HZ * dt)
    this.now = to
  }
  private advanceArc(drop: boolean): void {
    switch (this.arc) {
      case 'intro': if (this.slow > 0.25) this.arc = 'building'; break
      case 'building': if (drop || this.slow > 0.6) this.arc = 'peak'; break
      case 'peak': if (this.slow < 0.45) this.arc = 'falling'; break
      case 'falling': if (this.breakdown || this.slow < 0.15) this.arc = 'outro'; break
      case 'outro': break // New track requires explicit resetTrack().
    }
  }
  private result(events: AffectClockEvent[]): AffectClockResult {
    const {valence: v, arousal: a} = this.affect
    // Pulses have physical duration, not one render-call duration. Events are the
    // authoritative edge stream: a slow renderer can miss a visual pulse.
    const drop = this.now - this.lastDrop < 1 / HZ - EPS
    const phraseCut = this.now - this.lastPhrase < 1 / HZ - EPS
    const look = this.breakdown ? 'VOID DRIFT' : drop ? 'SHATTER'
      : this.tension > 0.6 ? 'GLITCHCORE' : v > 0.4 ? 'RAINBOW ROAD'
      : a < 0.3 ? 'ETHEREAL' : 'CONSTELLATION'
    return {
      state: {
        valence: v, arousal: a, energyFast: this.fast, energySlow: this.slow,
        tension: this.tension, arc: this.arc, beat: this.beat,
        rising: this.rising, breakdown: this.breakdown, drop, phraseCut,
        // Same artistic map as legacy; tempoBias is descriptive, not clock feedback.
        music: {
          mode: v > 0.25 ? (a > 0.6 ? 'lydian' : 'major') : v < -0.25 ? (a > 0.55 ? 'phrygian' : 'dorian') : 'mixolydian',
          chordBias: v > 0.2 ? ['maj7','maj9','add9'] : v < -0.2 ? ['min7','min9','minMaj7'] : ['dom7','min7','halfDim7'],
          register: Math.round(clamp(3+a*2,2,6)), density: clamp(0.25+a*0.65),
          swing: clamp(0.5+(1-a)*0.25), dissonance: this.tension, tempoBias: 0.8+a*0.6,
        },
        visual: {
          look, palette: v >= 0 ? ['#FF4DB8','#C2F870','#7FD4FF'] : ['#7FD4FF','#FF4DB8','#2A1840'],
          bloom: clamp(0.3+this.fast*0.7), glitch: clamp(this.tension*0.8+(drop?0.5:0)),
          motion: clamp(this.fast), particles: Math.round(a*28000),
        },
      },
      events,
      clock: {timeSeconds: this.now, bpm: this.config.bpm, beatPhase: clamp((this.now-this.config.start)*this.config.bpm/60-this.beat), track: this.track},
    }
  }
}
