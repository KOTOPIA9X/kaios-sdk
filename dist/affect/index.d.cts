import { A as AffectClockOptions, a as AffectClockResult } from '../affect-clock-v2-Cdw7D_GD.cjs';
export { b as AffectClockEvent, c as AffectiveSynthV2 } from '../affect-clock-v2-Cdw7D_GD.cjs';
import { P as PerformanceState, A as Affect } from '../affect-engine-OOEew1HW.cjs';
export { a as ArcPhase, M as MusicParams, V as VisualParams } from '../affect-engine-OOEew1HW.cjs';

/** Portable, opt-in affect contracts. No timers, audio devices, or transport. */

type DeepReadonly<T> = T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;
/** Version 1 frames are full snapshots. Sequence numbers belong to sourceId. */
interface AffectFrame {
    readonly version: 1;
    readonly sourceId: string;
    readonly sequence: number;
    readonly state: DeepReadonly<PerformanceState>;
    readonly events: DeepReadonly<AffectClockResult['events']>;
    readonly clock: DeepReadonly<AffectClockResult['clock']>;
}
interface AffectBusOptions extends AffectClockOptions {
    sourceId?: string;
}
interface ExternalAffectOwner {
    /** Host-clock arrival time; remote clock values remain in the supplied frame. */
    receive(frame: unknown, receivedAtSeconds: number): AffectFrame;
    /** Idempotent. An old lease can never release a newer owner. */
    release(): void;
}
/** Strict v1 receiver validation, including every nested number and array item. */
declare function isPerformanceState(value: unknown): value is PerformanceState;
/** Validates data, not transport identity. Authenticate the sender in your host. */
declare function isAffectFrame(value: unknown): value is AffectFrame;
/**
 * One explicit host clock, one external owner, many subscribers.
 * The local synth keeps advancing while an external frame owns the output.
 * Staleness is evaluated on advanceTo; no background work is scheduled.
 */
declare class AffectBus {
    private readonly synth;
    private readonly sourceId;
    private sequence;
    private local;
    private current;
    private owner?;
    private readonly listeners;
    private notifying;
    constructor(options?: AffectBusOptions);
    getSnapshot(): AffectFrame;
    /** No immediate replay; use getSnapshot for the initial render. */
    subscribe(listener: (frame: AffectFrame) => void): () => void;
    advanceTo(atSeconds: number, affect?: Affect): AffectFrame;
    /** Valid reset revokes external ownership. Invalid reset preserves everything. */
    resetTrack(atSeconds: number, options?: Omit<AffectClockOptions, 'startTimeSeconds'>): AffectFrame;
    claimExternal(sourceId: string, options: {
        atSeconds: number;
        staleAfterSeconds?: number;
    }): ExternalAffectOwner;
    private frame;
    private assertWritable;
    private publish;
}

export { Affect, AffectBus, type AffectBusOptions, AffectClockOptions, AffectClockResult, type AffectFrame, type DeepReadonly, type ExternalAffectOwner, PerformanceState, isAffectFrame, isPerformanceState };
