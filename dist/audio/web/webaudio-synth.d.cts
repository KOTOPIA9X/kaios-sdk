interface WebAudioSynthOptions {
    /** master output level after fade-in (default 0.22) */
    masterGain?: number;
    /** reverb tail length, seconds (default 4.2) */
    reverbSeconds?: number;
    /** reverb decay shaping (default 2.4) */
    reverbDecay?: number;
    /** master lowpass cutoff Hz — felt, never harsh (default 6200) */
    lowpassHz?: number;
}
declare class WebAudioSynth {
    private ctx;
    private dry;
    private verb;
    private airGain;
    private readonly opt;
    constructor(opts?: WebAudioSynthOptions);
    /** Whether Web Audio is available (browser). */
    static get available(): boolean;
    /** Resume/start the audio context — call from a user gesture (browsers gate audio start). */
    resume(): Promise<void>;
    private makeReverbIR;
    private build;
    /** Strike a frequency — the FM-Rhodes voice. `bright` 0..1 scales the tine attack. */
    strike(freq: number, dur?: number, vel?: number, bright?: number): void;
    /** Drop-in for PianoEngine.setPlayNoteCallback — (note, duration, velocity). Arrow-bound. */
    play: (note: string, duration?: number, velocity?: number) => Promise<void>;
    /** Release resources. */
    dispose(): void;
}
declare function createWebAudioSynth(opts?: WebAudioSynthOptions): WebAudioSynth;

export { WebAudioSynth, type WebAudioSynthOptions, createWebAudioSynth };
