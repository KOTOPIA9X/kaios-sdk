/**
 * KAIOS Affective Synthesis — the shared heart.
 *
 * KAIOS's core is not music OR visuals; it is AFFECT, expressed as both. She perceives/feels
 * and generates emotion as sound AND image. Today that logic is re-invented three times: MNEME's
 * `apTick` autopilot (energy envelopes → drop/breakdown/phrase decisions, for visuals), the
 * arrangement engine's energy/tension curves (for music), and the letter-piano affect→harmony
 * map. This unifies them into ONE performance state derived from a single affect bus — so the
 * music backends (jazz / piano / synth) and the visual backends (MNEME shaders / canvas) move
 * together, off the same feeling.
 *
 * Pure + framework-free + deterministic. Feed it emotion (valence/arousal) and/or a live energy
 * signal (audio RMS, a beat); `tick()` returns the unified state every backend reads.
 */

export interface Affect {
  /** -1 (dark) .. 1 (bright) */ valence: number
  /** 0 (still) .. 1 (intense) */ arousal: number
  /** 0..1 live energy sample (audio RMS / activity); defaults to arousal */ energy?: number
}
export type ArcPhase = 'intro' | 'building' | 'peak' | 'falling' | 'outro'

export interface MusicParams {
  mode: string            // a SCALES key — what to blow over / harmonize in
  chordBias: string[]     // CHORDS keys the harmony should lean toward
  register: number        // octave center (2..6)
  density: number         // 0..1 notes-per-beat / activity
  swing: number           // 0..1 feel
  dissonance: number      // 0..1 tension → altered/blue/outside
  tempoBias: number       // multiplier around the base tempo
}
export interface VisualParams {
  look: string                       // a MNEME LOOK
  palette: [string, string, string]  // primary / accent / ground
  bloom: number                      // 0..1 glow
  glitch: number                     // 0..1 datamosh/chroma-shift
  motion: number                     // 0..1 flow speed
  particles: number                  // point-field density
}
export interface PerformanceState {
  valence: number; arousal: number
  energyFast: number; energySlow: number
  tension: number; arc: ArcPhase; beat: number
  rising: boolean; drop: boolean; breakdown: boolean; phraseCut: boolean
  music: MusicParams; visual: VisualParams
}

/** The 7 MNEME LOOKS (visuals.asgardstud.io). */
export const LOOKS = ['ETHEREAL', 'GLITCHCORE', 'SHATTER', 'PIN-ART', 'CONSTELLATION', 'RAINBOW ROAD', 'VOID DRIFT'] as const

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

export class AffectiveSynth {
  private es = 0          // fast energy envelope
  private el = 0          // slow energy envelope (the song's shape)
  private tension = 0
  private beat = 0
  private phrase: number
  private arc: ArcPhase = 'intro'
  private arcLocked = false
  private valence = 0
  private arousal = 0.4

  constructor(opts: { phrase?: number; valence?: number; arousal?: number } = {}) {
    this.phrase = opts.phrase ?? 16
    if (opts.valence != null) this.valence = clamp(opts.valence, -1, 1)
    if (opts.arousal != null) this.arousal = clamp(opts.arousal, 0, 1)
  }

  setAffect(a: Affect): void {
    this.valence = clamp(a.valence, -1, 1)
    this.arousal = clamp(a.arousal, 0, 1)
  }
  setValence(v: number): void { this.valence = clamp(v, -1, 1) }
  setArousal(a: number): void { this.arousal = clamp(a, 0, 1) }
  /** Pin the arc phase (e.g. the prose/narrative says "the drop"); pass null to resume auto. */
  setArc(p: ArcPhase | null): void { if (p) { this.arc = p; this.arcLocked = true } else this.arcLocked = false }

  /** Advance one beat with a live energy sample (audio RMS / activity). Returns the unified state. */
  tick(energy?: number): PerformanceState {
    const e = clamp(energy ?? this.arousal, 0, 1)
    this.es += (e - this.es) * 0.09     // fast: follows the moment
    this.el += (e - this.el) * 0.012    // slow: the shape of the song
    this.beat++

    const rising = this.es > this.el * 1.06 + 0.02
    const edge = this.beat % 4 === 0
    const drop = edge && this.es > this.el * 1.45 && this.tension > 0.45
    const breakdown = this.el < 0.18 && this.es < 0.2
    const phraseCut = this.beat % this.phrase === 0

    this.tension = clamp(this.tension + (rising ? 0.04 : -0.02) - (drop ? 0.6 : 0), 0, 1)
    if (!this.arcLocked) this.advanceArc(drop, breakdown)

    return {
      valence: this.valence, arousal: this.arousal,
      energyFast: this.es, energySlow: this.el,
      tension: this.tension, arc: this.arc, beat: this.beat,
      rising, drop, breakdown, phraseCut,
      music: this.music(), visual: this.visual(drop, breakdown),
    }
  }

  private advanceArc(drop: boolean, breakdown: boolean): void {
    switch (this.arc) {
      case 'intro': if (this.el > 0.25) this.arc = 'building'; break
      case 'building': if (drop || this.el > 0.6) this.arc = 'peak'; break
      case 'peak': if (this.el < 0.45) this.arc = 'falling'; break
      case 'falling': if (breakdown || this.el < 0.15) this.arc = 'outro'; break
      case 'outro': break
    }
  }

  /** valence → mode/quality, arousal → density/register/tempo, tension → dissonance. */
  private music(): MusicParams {
    const mode = this.valence > 0.25 ? (this.arousal > 0.6 ? 'lydian' : 'major')
      : this.valence < -0.25 ? (this.arousal > 0.55 ? 'phrygian' : 'dorian')
      : 'mixolydian'
    const chordBias = this.valence > 0.2 ? ['maj7', 'maj9', 'add9']
      : this.valence < -0.2 ? ['min7', 'min9', 'minMaj7']
      : ['dom7', 'min7', 'halfDim7']
    return {
      mode, chordBias,
      register: Math.round(clamp(3 + this.arousal * 2, 2, 6)),
      density: clamp(0.25 + this.arousal * 0.65, 0, 1),
      swing: clamp(0.5 + (1 - this.arousal) * 0.25, 0, 1),
      dissonance: this.tension,
      tempoBias: 0.8 + this.arousal * 0.6,
    }
  }

  /** drop/breakdown/tension/valence → LOOK + palette + glitch/bloom/motion. (folds MNEME apTick) */
  private visual(drop: boolean, breakdown: boolean): VisualParams {
    const look = breakdown ? 'VOID DRIFT'
      : drop ? 'SHATTER'
      : this.tension > 0.6 ? 'GLITCHCORE'
      : this.valence > 0.4 ? 'RAINBOW ROAD'
      : this.arousal < 0.3 ? 'ETHEREAL'
      : 'CONSTELLATION'
    // hyperpop anchors (MNEME): hot-pink / lime / sky over dark plum; darken when valence is low
    const palette: [string, string, string] = this.valence >= 0
      ? ['#FF4DB8', '#C2F870', '#7FD4FF']
      : ['#7FD4FF', '#FF4DB8', '#2A1840']
    return {
      look, palette,
      bloom: clamp(0.3 + this.es * 0.7, 0, 1),
      glitch: clamp(this.tension * 0.8 + (drop ? 0.5 : 0), 0, 1),
      motion: clamp(this.es, 0, 1),
      particles: Math.round(clamp(this.arousal, 0, 1) * 28000),
    }
  }
}

/** Convenience factory. */
export function createAffectiveSynth(opts?: { phrase?: number; valence?: number; arousal?: number }): AffectiveSynth {
  return new AffectiveSynth(opts)
}

export const AffectEngine = { AffectiveSynth, createAffectiveSynth, LOOKS }
