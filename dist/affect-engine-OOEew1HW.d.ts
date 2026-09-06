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
interface Affect {
    /** -1 (dark) .. 1 (bright) */ valence: number;
    /** 0 (still) .. 1 (intense) */ arousal: number;
    /** 0..1 live energy sample (audio RMS / activity); defaults to arousal */ energy?: number;
}
type ArcPhase = 'intro' | 'building' | 'peak' | 'falling' | 'outro';
interface MusicParams {
    mode: string;
    chordBias: string[];
    register: number;
    density: number;
    swing: number;
    dissonance: number;
    tempoBias: number;
}
interface VisualParams {
    look: string;
    palette: [string, string, string];
    bloom: number;
    glitch: number;
    motion: number;
    particles: number;
}
interface PerformanceState {
    valence: number;
    arousal: number;
    energyFast: number;
    energySlow: number;
    tension: number;
    arc: ArcPhase;
    beat: number;
    rising: boolean;
    drop: boolean;
    breakdown: boolean;
    phraseCut: boolean;
    music: MusicParams;
    visual: VisualParams;
}
/** The 7 MNEME LOOKS (visuals.asgardstud.io). */
declare const LOOKS: readonly ["ETHEREAL", "GLITCHCORE", "SHATTER", "PIN-ART", "CONSTELLATION", "RAINBOW ROAD", "VOID DRIFT"];
declare class AffectiveSynth {
    private es;
    private el;
    private tension;
    private beat;
    private phrase;
    private arc;
    private arcLocked;
    private valence;
    private arousal;
    constructor(opts?: {
        phrase?: number;
        valence?: number;
        arousal?: number;
    });
    setAffect(a: Affect): void;
    setValence(v: number): void;
    setArousal(a: number): void;
    /** Pin the arc phase (e.g. the prose/narrative says "the drop"); pass null to resume auto. */
    setArc(p: ArcPhase | null): void;
    /** Advance one beat with a live energy sample (audio RMS / activity). Returns the unified state. */
    tick(energy?: number): PerformanceState;
    private advanceArc;
    /** valence → mode/quality, arousal → density/register/tempo, tension → dissonance. */
    private music;
    /** drop/breakdown/tension/valence → LOOK + palette + glitch/bloom/motion. (folds MNEME apTick) */
    private visual;
}
/** Convenience factory. */
declare function createAffectiveSynth(opts?: {
    phrase?: number;
    valence?: number;
    arousal?: number;
}): AffectiveSynth;
declare const AffectEngine: {
    AffectiveSynth: typeof AffectiveSynth;
    createAffectiveSynth: typeof createAffectiveSynth;
    LOOKS: readonly ["ETHEREAL", "GLITCHCORE", "SHATTER", "PIN-ART", "CONSTELLATION", "RAINBOW ROAD", "VOID DRIFT"];
};

export { type Affect as A, LOOKS as L, type MusicParams as M, type PerformanceState as P, type VisualParams as V, type ArcPhase as a, AffectEngine as b, AffectiveSynth as c, createAffectiveSynth as d };
