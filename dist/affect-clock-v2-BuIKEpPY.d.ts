import { A as Affect, P as PerformanceState } from './affect-engine-OOEew1HW.js';

/** Opt-in clock experiment. Legacy affect-engine.ts remains unchanged.
 * Times are monotonic seconds within one track. Samples apply prospectively.
 * Envelopes integrate elapsed time; nonlinear decisions run on an absolute 30 Hz
 * grid, never at render-call boundaries. A fixed BPM supplies separate beat edges.
 * Equal timestamped input histories are reproducible (within floating precision),
 * not equal live signals sampled at different rates. No aesthetic equivalence claim.
 */

interface AffectClockOptions {
    startTimeSeconds?: number;
    bpm?: number;
    phraseBeats?: number;
    /** Reject larger gaps atomically. Default 2 seconds; maximum 10. */
    maxGapSeconds?: number;
    affect?: Affect;
}
interface AffectClockEvent {
    type: 'beat' | 'phrase' | 'drop';
    timeSeconds: number;
    beat: number;
}
interface AffectClockResult {
    state: PerformanceState;
    events: AffectClockEvent[];
    clock: {
        timeSeconds: number;
        bpm: number;
        beatPhase: number;
        track: number;
    };
}
declare class AffectiveSynthV2 {
    private config;
    private now;
    private affect;
    private fast;
    private slow;
    private tension;
    private rising;
    private breakdown;
    private arc;
    private grid;
    private beat;
    private track;
    private lastDrop;
    private lastPhrase;
    constructor(opts?: AffectClockOptions);
    /** Explicit new track; omitted options use API defaults, not prior track config.
     * May reset the timestamp origin. Invalid reset leaves the old track untouched.
     */
    resetTrack(atSeconds: number, opts?: Omit<AffectClockOptions, 'startTimeSeconds'>): AffectClockResult;
    /** Advance held input to t, then install a sample for [t, next sample).
     * Same-time polls emit no duplicate events. All arguments validate before mutation.
     * Large gaps throw: replay bounded intervals or explicitly reset the track.
     */
    advanceTo(atSeconds: number, nextAffect?: Affect): AffectClockResult;
    private integrate;
    private advanceArc;
    private result;
}

export { type AffectClockOptions as A, type AffectClockResult as a, type AffectClockEvent as b, AffectiveSynthV2 as c };
