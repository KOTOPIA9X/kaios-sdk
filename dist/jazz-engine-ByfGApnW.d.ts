type JazzRole = 'root' | 'chord-tone' | 'guide' | 'approach' | 'enclosure' | 'passing' | 'blue' | 'rest';
interface JazzNote {
    note: string;
    dur: number;
    velocity: number;
    role: JazzRole;
}
interface Change {
    root: string;
    quality: string;
    bars?: number;
}
interface SoloOptions {
    octave?: number;
    swing?: number;
    density?: number;
    bluesiness?: number;
    seed?: number;
    beatsPerBar?: number;
}
/** Chord quality → the scale to improvise with (chord-scale theory). */
declare const CHORD_SCALE: Record<string, string>;
/** The guide tones — the 3rd and 7th — the notes that carry the harmony through changes. */
declare function guideTones(change: Change, octave?: number): string[];
/** Bebop enclosure of a target: diatonic-above, chromatic-below, target. The bop signature. */
declare function enclosure(targetMidi: number): number[];
/**
 * Walking bass over the changes — quarter notes: root on 1, chord/scale tones on 2 & 3,
 * a chromatic/diatonic approach into the NEXT chord's root on 4.
 */
declare function walkingBass(changes: Change[], octave?: number, seed?: number): JazzNote[];
/**
 * Comping rhythm — syncopated voicings (Charleston-ish: the "and of 1" + beat 2-and),
 * voiced with guide tones so it stays out of the soloist's way. Returns onset (in beats
 * from the bar start) + the rootless guide-tone voicing for that chord.
 */
declare function comp(changes: Change[], octave?: number): Array<{
    at: number;
    bar: number;
    voicing: string[];
    velocity: number;
}>;
/**
 * Solo over changes — the heart. For each bar: target a guide tone of the chord on a strong
 * beat, approach it by enclosure/chromatic from the previous note, connect with chord-scale
 * tones (stepwise voice-leading + the occasional leap), sprinkle blue notes, and breathe
 * (rests = call & response). Eighth-note grid with swing.
 */
declare function soloOverChanges(changes: Change[], opts?: SoloOptions): JazzNote[];
/** The canonical ii–V–I in a key, as a bebop line + its changes. */
declare function iiVI(key?: string, opts?: SoloOptions): {
    changes: Change[];
    line: JazzNote[];
};
/**
 * Trading fours — call & response. Splits the changes into 4-bar chunks and alternates
 * soloists, each with its own seed/character (KAIOS vs a partner / another KAIOS variation).
 */
declare function tradeFours(changes: Change[], voices?: string[], baseSeed?: number): Array<{
    voice: string;
    bars: Change[];
    line: JazzNote[];
}>;
declare const JazzEngine: {
    CHORD_SCALE: Record<string, string>;
    guideTones: typeof guideTones;
    enclosure: typeof enclosure;
    walkingBass: typeof walkingBass;
    comp: typeof comp;
    soloOverChanges: typeof soloOverChanges;
    iiVI: typeof iiVI;
    tradeFours: typeof tradeFours;
};

export { CHORD_SCALE as C, JazzEngine as J, type SoloOptions as S, type Change as a, type JazzNote as b, type JazzRole as c, comp as d, enclosure as e, guideTones as g, iiVI as i, soloOverChanges as s, tradeFours as t, walkingBass as w };
